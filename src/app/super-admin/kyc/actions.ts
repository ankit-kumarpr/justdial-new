
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/client';
import { revalidatePath } from 'next/cache';
import type { KycStatus, KycSubmission } from '@/lib/types';
import { apiFetch } from '@/lib/api-client';

export async function updateKycStatus(
    kycId: string, 
    status: KycStatus,
    token: string,
    rejectionReason?: string
): Promise<{ success: boolean; message: string }> {

  if (!kycId || !status) {
    return { success: false, message: 'Missing KYC ID or status.' };
  }
  
  if (!token) {
    return { success: false, message: 'Authentication token is required.' };
  }

  try {
    let result;
    if (status === 'approved') {
      result = await apiFetch(`/api/kyc/approve/${kycId}`, token, { method: 'PUT' });
    } else if (status === 'rejected') {
      result = await apiFetch(`/api/kyc/reject/${kycId}`, token, {
        method: 'PUT',
        body: JSON.stringify({ rejectionReason }),
      });
    } else {
        return { success: false, message: `Unsupported status: ${status}` };
    }
    
    revalidatePath('/super-admin/kyc');
    revalidatePath('/admin/kyc'); 
    
    // This part might need adjustment if vendor_id is not in the direct KYC object
    // For now, we assume it might not be available after status update.
    
    return { 
        success: true, 
        message: result.message || `KYC submission has been ${status}.`
    };

  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Error updating KYC status:", errorMessage);
    return {
      success: false,
      message: `Failed to update KYC status: ${errorMessage}`,
    };
  }
}

export async function getKycSubmissions(token: string): Promise<{ data: KycSubmission[] | null; error: string | null; }> {
    if (!token) {
      return { data: null, error: 'Authentication token not found.' };
    }

    try {
        const result = await apiFetch('/api/kyc/allkyc', token);
        const submissions = result.data;
        const adaptedData = submissions.map((item: any) => ({
            _id: item._id, 
            status: item.status,
            createdAt: item.createdAt,
            rejectionReason: item.rejectionReason,
            aadharImage: item.aadharImage,
            videoKyc: item.videoKyc,
            aadharNumber: item.aadharNumber,
            businessName: item.businessName || item.contactPerson,
            contactPerson: item.contactPerson,
            email: item.email,
            gstNumber: item.gstNumber,
            plotNo: item.plotNo,
            buildingName: item.buildingName,
            street: item.street,
            landmark: item.landmark,
            area: item.area,
            pincode: item.pincode,
            city: item.city,
            state: item.state,
            address: item.address,
            contactPersonTitle: item.title,
            mobileNumber: item.mobileNumber,
            whatsappNumber: item.whatsappNumber,
            workingDays: item.workingDays,
            businessHoursOpen: item.businessHoursOpen,
            businessHoursClose: item.businessHoursClose,
            userId: item.userId,
            updatedAt: item.updatedAt
        }));

        return { data: adaptedData as KycSubmission[], error: null };

    } catch (e: any) {
        console.error("Error fetching KYC submissions from API:", e.message);
        return { data: null, error: e.message };
    }
}
