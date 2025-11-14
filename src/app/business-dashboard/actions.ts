
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/client';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api-client';

const fileSchema = z.instanceof(File).refine(file => file.size > 0, "File is required.").optional();

const resubmitKycSchema = z.object({
  kycId: z.string().min(1, "KYC ID is required."),
  vendorId: z.string().min(1, "Vendor ID is required."),
  aadharUpload: fileSchema,
  videoUpload: fileSchema,
}).refine(data => data.aadharUpload || data.videoUpload, {
    message: "At least one document (Aadhar or Video) must be uploaded.",
    path: ["aadharUpload"], // Assign error to one field for display
});


export async function resubmitKyc(prevState: { success: boolean; message: string; errors?: any }, formData: FormData): Promise<{ success: boolean; message: string; errors?: any }> {
    const rawData = {
        kycId: formData.get('kycId'),
        vendorId: formData.get('vendorId'),
        aadharUpload: formData.get('aadharUpload'),
        videoUpload: formData.get('videoUpload'),
    };
    
    const validatedFields = resubmitKycSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Please correct the errors and try again.',
        };
    }
    
    const { kycId, vendorId, aadharUpload, videoUpload } = validatedFields.data;
    const supabase = createSupabaseServerClient();
    const updatePayload: { status: 'pending', aadhar_url?: string, video_kyc_url?: string, rejection_reason?: string | null, updated_at: string } = {
        status: 'pending',
        rejection_reason: null, // Clear old rejection reason
        updated_at: new Date().toISOString(),
    };

    try {
        const timestamp = Date.now();

        if (aadharUpload && aadharUpload.size > 0) {
            const aadharPath = `public/${vendorId}/aadhar-${timestamp}-${aadharUpload.name}`;
            const { error } = await supabase.storage.from('kycs').upload(aadharPath, aadharUpload);
            if (error) throw new Error(`Aadhar upload failed: ${error.message}`);
            const { data: { publicUrl } } = supabase.storage.from('kycs').getPublicUrl(aadharPath);
            updatePayload.aadhar_url = publicUrl;
        }

        if (videoUpload && videoUpload.size > 0) {
            const videoPath = `public/${vendorId}/video-${timestamp}-${videoUpload.name}`;
            const { error } = await supabase.storage.from('kycs').upload(videoPath, videoUpload);
            if (error) throw new Error(`Video KYC upload failed: ${error.message}`);
            const { data: { publicUrl } } = supabase.storage.from('kycs').getPublicUrl(videoPath);
            updatePayload.video_kyc_url = publicUrl;
        }
        
        const { error: updateError } = await supabase
            .from('vendor_kyc')
            .update(updatePayload)
            .eq('id', kycId);

        if (updateError) throw updateError;
        
        revalidatePath(`/business-dashboard?id=${vendorId}`);
        revalidatePath('/super-admin/kyc');
        revalidatePath('/admin/kyc');

        return { success: true, message: 'KYC documents re-submitted successfully. They are now pending for review.' };

    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error re-submitting KYC:', errorMessage);
        return {
            success: false,
            message: `Submission failed: ${errorMessage}`,
            errors: { server: [errorMessage] }
        };
    }
}


export async function getKycStatusForVendor(vendorId: string, token: string): Promise<{ data: any, error: string | null }> {
  try {
    const result = await apiFetch('/api/kyc/my-kyc', token);
    const vendorKyc = result.data.find((v: any) => v._id === vendorId);
    
    if (!vendorKyc) {
        return { data: null, error: null };
    }
    
    const kycData = {
        id: vendorKyc._id,
        status: vendorKyc.status,
        rejection_reason: vendorKyc.rejectionReason,
    };
    
    return { data: kycData, error: null };
  } catch (e: any) {
    console.error(`Error fetching KYC status for vendor ${vendorId}:`, e.message);
    return { data: null, error: e.message };
  }
}

export async function getBusinessHeaderInfo(businessId: string, token: string): Promise<{ name: string | null; city: string | null; error: string | null; }> {
    if (!businessId || !token) {
        return { name: null, city: null, error: 'Business ID and token are required.' };
    }
    
    try {
        const result = await apiFetch(`/api/vendor/profile/business/${businessId}`, token, { cache: 'no-store' });
        const business = result.data?.business;
        if (!business) {
            return { name: null, city: null, error: 'Business not found.' };
        }
        return { name: business.businessName, city: business.address?.city, error: null };
    } catch (e: any) {
        console.error("Error fetching business header info from API:", e.message);
        return { name: null, city: null, error: e.message };
    }
}

const locationSchema = z.object({
  businessId: z.string().min(1, "Business ID is required."),
  lat: z.number(),
  lng: z.number(),
});

export async function getLocation(businessId: string, token: string): Promise<{ data: { latitude: number; longitude: number } | null, error: string | null}> {
    if (!businessId || !token) {
        return { data: null, error: "Business ID and token are required." };
    }
    
    try {
        const result = await apiFetch(`/api/vendor/profile/business/${businessId}`, token);
        const location = result.data?.business?.location;

        if (location && location.coordinates && location.coordinates.length === 2) {
            return { data: { latitude: location.coordinates[1], longitude: location.coordinates[0] }, error: null };
        }
        return { data: null, error: "Location coordinates not found." };
    } catch(e: any) {
        if (e.message.includes('404')) {
             return { data: null, error: null };
        }
        console.error("Error fetching location:", e.message);
        return { data: null, error: e.message };
    }
}

export async function updateLocation(businessId: string, token: string, lat: number, lng: number): Promise<{ success: boolean; message: string }> {
  
  const validatedFields = locationSchema.safeParse({ businessId, lat, lng });

  if (!validatedFields.success) {
    const errorMessages = Object.values(validatedFields.error.flatten().fieldErrors).flat().join(' ');
    return {
      success: false,
      message: `Validation failed: ${errorMessages || 'Invalid location data.'}`,
    };
  }

  try {
     await apiFetch(`/api/kyc/businessaddress/${businessId}`, token, {
      method: 'PUT',
      body: JSON.stringify({ latitude: lat, longitude: lng }),
    });

    revalidatePath(`/business-dashboard?id=${businessId}`);
    
    return { 
        success: true, 
        message: 'Location updated successfully!' 
    };

  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Error updating location:", errorMessage);
    return {
      success: false,
      message: `Failed to update location: ${errorMessage}`,
    };
  }
}
