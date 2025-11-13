
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api-client';

// Schema for validating social media links
const socialLinksSchema = z.object({
  facebook: z.string().url("Invalid URL").or(z.literal('')).optional(),
  twitter: z.string().url("Invalid URL").or(z.literal('')).optional(),
  linkedin: z.string().url("Invalid URL").or(z.literal('')).optional(),
  youtube: z.string().url("Invalid URL").or(z.literal('')).optional(),
  instagram: z.string().url("Invalid URL").or(z.literal('')).optional(),
});

export type SocialMediaState = {
  errors?: {
    [key: string]: string[] | undefined;
    server?: string[];
  };
  message?: string | null;
  success?: boolean;
};

// Action to get existing social media links for a vendor
export async function getSocialMediaLinks(businessId: string, token: string): Promise<{ data: Record<string, string> | null; error: string | null }> {
    if (!businessId || !token) {
        return { data: null, error: 'Business ID and token are required.' };
    }

    try {
        const result = await apiFetch(`/api/vendor/profile/getsocial-links/${businessId}`, token, { cache: 'no-store' });
        
        if (result.success && result.data.socialMediaLinks) {
            return { data: result.data.socialMediaLinks, error: null };
        }
        
        // If the API call is successful but no links are returned, send back an empty object.
        return { data: {}, error: null };

    } catch (e: any) {
        // If the error is a 404 Not Found, it means the user hasn't set any links yet.
        // Treat this as a success case with no data, rather than an error.
        if (e.message.includes('404')) {
            return { data: {}, error: null };
        }
        console.error("Error fetching social media links:", e.message);
        return { data: null, error: e.message };
    }
}

// Action to update social media links for a vendor
export async function updateSocialMediaLinks(prevState: SocialMediaState, formData: FormData): Promise<SocialMediaState> {
  const businessId = formData.get('businessId') as string;
  const token = formData.get('token') as string;

  if (!token) {
    return {
      errors: { server: ['Authentication required.'] },
      message: 'You must be logged in to update social media links.',
    };
  }

  if (!businessId) {
    return {
      errors: { server: ['Business ID is missing.'] },
      message: 'Could not identify the business to update.',
    };
  }
  
  const rawData = {
    facebook: formData.get('Facebook'),
    twitter: formData.get('X'),
    linkedin: formData.get('LinkedIn'),
    youtube: formData.get('YouTube'),
    instagram: formData.get('Instagram'),
  };

  const validatedFields = socialLinksSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please enter valid URLs.',
    };
  }

  // Filter out empty strings so we don't send them to the API
  const linksToUpdate = Object.fromEntries(
    Object.entries(validatedFields.data).filter(([_, value]) => value !== '' && value !== undefined)
  );

  try {
    // 1. Fetch the business profile to get the correct vendor/user ID
    const profileResult = await apiFetch(`/api/vendor/profile/business/${businessId}`, token, { cache: 'no-store' });
    const vendorId = profileResult.data?.business?.userId;
    
    if (!vendorId) {
        throw new Error("Could not retrieve vendor ID for this business.");
    }
    
    // 2. Use the fetched vendorId to update social links
    await apiFetch(`/api/vendor/profile/updatesocial-links/${vendorId}`, token, {
        method: 'PUT',
        body: JSON.stringify(linksToUpdate),
    });

    revalidatePath(`/business-dashboard/social-media?id=${businessId}`);
    
    return { 
        success: true, 
        message: 'Social media links updated successfully!' 
    };

  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Error updating social media links:", errorMessage);
    return {
      errors: { server: [errorMessage] },
      message: `Failed to update links: ${errorMessage}`,
    };
  }
}

// Action to delete all social media links for a vendor
export async function deleteSocialMediaLinks(businessId: string, token: string): Promise<{ success: boolean; message: string }> {
  if (!businessId || !token) {
    return { success: false, message: 'Missing required parameters.' };
  }

  try {
    const profileResult = await apiFetch(`/api/vendor/profile/business/${businessId}`, token, { cache: 'no-store' });
    const vendorId = profileResult.data?.business?.userId;

    if (!vendorId) {
      throw new Error("Could not retrieve vendor ID for this business to perform deletion.");
    }
    
    const result = await apiFetch(`/api/vendor/profile/deletesocial-links/${vendorId}`, token, {
      method: 'DELETE',
    });

    if (!result.success) {
      throw new Error(result.message || 'Failed to delete social media links.');
    }

    revalidatePath(`/business-dashboard/social-media?id=${businessId}`);
    return { success: true, message: result.message || 'All social media links deleted successfully!' };
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error('Error deleting social media links:', errorMessage);
    return { success: false, message: `Failed to delete links: ${errorMessage}` };
  }
}
