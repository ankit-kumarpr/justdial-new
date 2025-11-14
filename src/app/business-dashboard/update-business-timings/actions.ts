
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api-client';

const timingsSchema = z.object({
  businessId: z.string().min(1, "Business ID is required."),
  workingDays: z.array(z.string()).min(1, "Please select at least one working day."),
  openTime: z.string().min(1, "Opening time is required."),
  closingTime: z.string().min(1, "Closing time is required."),
}).refine(data => data.openTime < data.closingTime, {
  message: "Closing time must be after opening time.",
  path: ["closingTime"],
});

export type UpdateTimingsState = {
  errors?: {
    workingDays?: string[];
    openTime?: string[];
    closingTime?: string[];
    server?: string[];
  };
  message?: string | null;
  success?: boolean;
};


export async function getBusinessTimings(businessId: string, token: string) {
    if (!businessId || !token) return { data: null, error: 'Business ID and token are required.' };
    
    try {
        const result = await apiFetch(`/api/vendor/profile/business/${businessId}`, token, { cache: 'no-store' });
        if (result.success && result.data.business) {
            const business = result.data.business;
            return {
                data: {
                    workingDays: business.workingDays,
                    openTime: business.businessHoursOpen,
                    closingTime: business.businessHoursClose,
                },
                error: null
            };
        }
        return { data: null, error: 'Business timings not found.' };

    } catch(e) {
        return { data: null, error: (e as Error).message };
    }
}


export async function updateBusinessTimings(prevState: UpdateTimingsState, formData: FormData): Promise<UpdateTimingsState> {
  const businessId = formData.get('businessId') as string;
  const token = formData.get('token') as string;
  if (!token) {
    return { success: false, message: "Authentication is required." };
  }

  const rawData = {
    businessId,
    workingDays: JSON.parse(formData.get('workingDays') as string || '[]'),
    openTime: formData.get('openTime'),
    closingTime: formData.get('closingTime'),
  };
  
  const validatedFields = timingsSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors and try again.',
    };
  }
  
  const payload = {
    workingDays: validatedFields.data.workingDays,
    businessHoursOpen: validatedFields.data.openTime,
    businessHoursClose: validatedFields.data.closingTime,
  };
  
  try {
    const result = await apiFetch(`/api/kyc/businesstimings/${businessId}`, token, {
        method: 'PUT',
        body: JSON.stringify(payload),
    });

    if (!result.success) {
        throw new Error(result.message || 'Failed to update business timings.');
    }

    revalidatePath(`/business-dashboard?id=${businessId}`);
    
    return { 
        success: true, 
        message: 'Business timings updated successfully!' 
    };

  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Error updating business timings:", errorMessage);
    return {
      errors: { server: [errorMessage] },
      message: `Failed to update timings: ${errorMessage}`,
    };
  }
}
