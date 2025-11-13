
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { apiFetch } from '@/lib/api-client';

const updateKeywordsSchema = z.object({
  businessId: z.string().min(1, "Business ID is required."),
  keywords: z.array(z.string()).optional(),
});

export type KeywordsState = {
  errors?: {
    server?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function getKeywords(businessId: string, token: string): Promise<{ data: string[] | null, error: string | null }> {
    if (!businessId) return { data: null, error: 'Business ID is required.' };
    if (!token) return { data: null, error: 'Authentication token is required.' };

    try {
        const result = await apiFetch('/api/keyword/my-keywords', token, { cache: 'no-store' });
        
        const businessData = result.data.businesses.find((b: any) => b.business && b.business.id === businessId);
        
        if (!businessData || !businessData.keywords) {
            return { data: [], error: null };
        }

        const keywords = businessData.keywords.map((kw: any) => kw.keyword);
        return { data: keywords, error: null };

    } catch (e: any) {
        console.error("Error fetching keywords from API:", e.message);
        return { data: null, error: e.message };
    }
}

export async function updateKeywords(prevState: KeywordsState, formData: FormData): Promise<KeywordsState> {
  const businessId = formData.get('businessId') as string;
  const keywordsJson = formData.get('keywords') as string;
  const token = formData.get('token') as string;

  if (!token) {
    return {
      errors: { server: ['Authentication token missing.'] },
      message: 'You must be logged in to update keywords.',
    };
  }

  const rawData = {
    businessId,
    keywords: keywordsJson ? JSON.parse(keywordsJson) : []
  };

  const validatedFields = updateKeywordsSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: { server: ['Invalid data format.'] },
      message: 'There was a problem with the data submitted.',
    };
  }
  
  try {
    await apiFetch(`/api/keyword/add/${businessId}`, token, {
        method: 'POST',
        body: JSON.stringify({ keywords: validatedFields.data.keywords }),
    });

    revalidatePath(`/business-dashboard?id=${businessId}`);
    
    return { 
        success: true, 
        message: 'Keywords updated successfully!' 
    };

  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Error updating keywords:", errorMessage);
    return {
      errors: { server: [errorMessage] },
      message: `Failed to update keywords: ${errorMessage}`,
    };
  }
}

export async function removeKeyword(businessId: string, keyword: string, token: string): Promise<{ success: boolean; message: string }> {
  if (!businessId || !keyword || !token) {
    return { success: false, message: 'Missing required parameters.' };
  }

  try {
    await apiFetch(`/api/keyword/remove/${businessId}`, token, {
      method: 'POST',
      body: JSON.stringify({ keywords: [keyword] }),
    });

    revalidatePath(`/business-dashboard/keywords?id=${businessId}`);
    return { success: true, message: 'Keyword removed successfully!' };
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error('Error removing keyword:', errorMessage);
    return { success: false, message: `Failed to remove keyword: ${errorMessage}` };
  }
}
