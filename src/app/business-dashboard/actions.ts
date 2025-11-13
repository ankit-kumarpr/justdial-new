
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

export async function getBusinessHeaderInfo(businessId: string): Promise<{ name: string; city: string } | null> {
    if (!businessId) return null;
    
    // Server-side actions can't directly read from localStorage.
    // The token would need to be passed in from the component if this were a generic server action.
    // However, since this is called from a server component context where we can't get the token,
    // this approach won't work for authenticated endpoints. 
    // We'll revert to Supabase for now, assuming it's the intended way for server components to fetch this.
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('vendors')
        .select('businessName, city')
        .eq('id', businessId)
        .single();

    if (error || !data) {
        console.error('Error fetching business header info from Supabase:', error?.message);
        return null;
    }
    return { name: data.businessName, city: data.city };
}

const locationSchema = z.object({
  businessId: z.string().min(1, "Business ID is required."),
  lat: z.number(),
  lng: z.number(),
});

export async function getLocation(businessId: string): Promise<{ data: { latitude: number; longitude: number } | null, error: string | null}> {
    if (!businessId) {
        return { data: null, error: "Business ID is required." };
    }
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('vendor_locations')
        .select('latitude, longitude')
        .eq('vendor_id', businessId)
        .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116: "No rows found"
        return { data: null, error: error.message };
    }
    return { data, error: null };
}

export async function updateLocation(businessId: string, lat: number, lng: number): Promise<{ success: boolean; message: string }> {
  
  const validatedFields = locationSchema.safeParse({ businessId, lat, lng });

  if (!validatedFields.success) {
    const errorMessages = Object.values(validatedFields.error.flatten().fieldErrors).flat().join(' ');
    return {
      success: false,
      message: `Validation failed: ${errorMessages || 'Invalid location data.'}`,
    };
  }

  const supabase = createSupabaseServerClient();
  
  try {
    const { error } = await supabase
      .from('vendor_locations')
      .upsert({ 
        vendor_id: businessId,
        latitude: lat,
        longitude: lng,
        updated_at: new Date().toISOString()
      }, { onConflict: 'vendor_id' });

    if (error) throw error;
    
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
