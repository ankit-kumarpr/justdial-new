
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api-client';

const websiteSchema = z.object({
  website: z.string().url("Please enter a valid URL (e.g., https://example.com)."),
});

export type WebsiteFormState = {
  errors?: {
    website?: string[];
    server?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function getBusinessWebsite(businessId: string, token: string): Promise<{ data: { website: string | null } | null; error: string | null }> {
    if (!businessId || !token) {
        return { data: null, error: 'Business ID and token are required.' };
    }

    try {
        // First, get the business profile to find the owner's ID (vendorId)
        const profileResult = await apiFetch(`/api/vendor/profile/business/${businessId}`, token, { cache: 'no-store' });
        const vendorId = profileResult.data?.business?.userId;

        if (!vendorId) {
            // This can happen if the business has no owner, return null gracefully.
            return { data: { website: null }, error: null };
        }

        // Now use the correct vendorId to get the website
        const websiteResult = await apiFetch(`/api/vendor/profile/viewwebsite/${vendorId}`, token, { cache: 'no-store' });

        if (websiteResult.success && websiteResult.data) {
            return { data: { website: websiteResult.data.website || null }, error: null };
        }
        
        return { data: { website: null }, error: null };

    } catch (e: any) {
        // If the viewwebsite endpoint fails (e.g., 404 if no website is set), treat it as no website found.
        if (e.message.includes('404')) {
            return { data: { website: null }, error: null };
        }
        console.error("Error fetching business website:", e.message);
        return { data: null, error: e.message };
    }
}

export async function updateBusinessWebsite(prevState: WebsiteFormState, formData: FormData): Promise<WebsiteFormState> {
  const businessId = formData.get('businessId') as string;
  const token = formData.get('token') as string;
  const website = formData.get('website') as string;

  if (!token) {
    return {
      errors: { server: ['Authentication required.'] },
      message: 'You must be logged in to update the website link.',
    };
  }
  
  if (!businessId) {
    return {
      errors: { server: ['Business ID is missing.'] },
      message: 'Could not identify the business to update.',
    };
  }

  const validatedFields = websiteSchema.safeParse({ website });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please enter a valid URL.',
    };
  }

  try {
    const profileResult = await apiFetch(`/api/vendor/profile/business/${businessId}`, token, { cache: 'no-store' });
    const vendorId = profileResult.data?.business?.userId;
    
    if (!vendorId) {
        throw new Error("Could not retrieve vendor ID for this business.");
    }
    
    await apiFetch(`/api/vendor/profile/updatewebsite/${vendorId}`, token, {
        method: 'PUT',
        body: JSON.stringify({ website: validatedFields.data.website }),
    });

    revalidatePath(`/business-dashboard/update-business-website?id=${businessId}`);
    
    return { 
        success: true, 
        message: 'Business website updated successfully!' 
    };

  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Error updating business website:", errorMessage);
    return {
      errors: { server: [errorMessage] },
      message: `Failed to update website: ${errorMessage}`,
    };
  }
}

export async function deleteBusinessWebsite(businessId: string, token: string): Promise<{ success: boolean; message: string }> {
  if (!businessId || !token) {
    return { success: false, message: 'Missing required parameters.' };
  }

  try {
    const profileResult = await apiFetch(`/api/vendor/profile/business/${businessId}`, token, { cache: 'no-store' });
    const vendorId = profileResult.data?.business?.userId;

    if (!vendorId) {
      throw new Error("Could not retrieve vendor ID for this business to perform deletion.");
    }
    
    const result = await apiFetch(`/api/vendor/profile/deletewebsite/${vendorId}`, token, {
      method: 'DELETE',
    });

    if (!result.success) {
      throw new Error(result.message || 'Failed to delete website link.');
    }

    revalidatePath(`/business-dashboard/update-business-website?id=${businessId}`);
    return { success: true, message: result.message || 'Website link deleted successfully!' };
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error('Error deleting website link:', errorMessage);
    return { success: false, message: `Failed to delete link: ${errorMessage}` };
  }
}
