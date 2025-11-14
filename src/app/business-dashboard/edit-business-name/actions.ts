
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api-client';

const editBusinessNameSchema = z.object({
  businessId: z.string().min(1, "Business ID is required."),
  businessName: z.string().min(2, "Business name must be at least 2 characters."),
});

export type EditBusinessNameState = {
  errors?: {
    businessName?: string[];
    server?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function getBusinessName(businessId: string, token: string): Promise<{ name: string | null, error: string | null }> {
    if (!businessId) return { name: null, error: 'Business ID is required.' };
    if (!token) return { name: null, error: 'Authentication token is required.' };
    
    try {
        // This endpoint seems suitable for fetching public business profile info, including the name.
        const result = await apiFetch(`/api/vendor/profile/business/${businessId}`, token, { cache: 'no-store' });
        const businessName = result.data?.business?.businessName;
        if (!businessName) {
            return { name: null, error: 'Business name not found.' };
        }
        return { name: businessName, error: null };
    } catch (e: any) {
        console.error("Error fetching business name from API:", e.message);
        return { name: null, error: e.message };
    }
}

export async function updateBusinessName(prevState: EditBusinessNameState, formData: FormData): Promise<EditBusinessNameState> {
  const token = formData.get('token') as string;
  if (!token) {
    return {
      errors: { server: ['Authentication token missing.'] },
      message: 'You must be logged in to update the business name.',
    };
  }
  
  const validatedFields = editBusinessNameSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors and try again.',
    };
  }

  const { businessId, businessName } = validatedFields.data;
  
  try {
    const result = await apiFetch(`/api/kyc/businessname/${businessId}`, token, {
        method: 'PUT',
        body: JSON.stringify({ businessName }),
    });

    if (!result.success) {
        throw new Error(result.message || 'Failed to update business name.');
    }

    revalidatePath('/my-business');
    revalidatePath(`/business-dashboard/edit-business-name?id=${businessId}`);
    
    return { 
        success: true, 
        message: 'Business name updated successfully! It may take a moment to reflect.' 
    };

  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Error updating business name:", errorMessage);
    return {
      errors: { server: [errorMessage] },
      message: `Failed to update business name: ${errorMessage}`,
    };
  }
}
