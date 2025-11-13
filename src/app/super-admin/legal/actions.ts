
'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api-client';

export type LegalFormState = {
  errors?: {
    content?: string[];
    server?: string[];
  };
  message?: string | null;
  success?: boolean;
};

// ===================================
// GET CONTENT
// ===================================

export async function getLegalContent() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    let terms_conditions = { _id: null, content: '', updatedAt: new Date().toISOString() };
    let privacy_policy = { _id: null, content: 'Failed to load policy.', updatedAt: new Date().toISOString() };

    try {
        const termsResponse = await fetch(`${apiBaseUrl}/api/terms-condition/viewtermscondition`, { cache: 'no-store' });
        if (termsResponse.ok) {
            const termsResult = await termsResponse.json();
            if (termsResult.success && termsResult.data) {
                terms_conditions = {
                    _id: termsResult.data._id,
                    content: termsResult.data.content || '',
                    updatedAt: termsResult.data.updatedAt || new Date().toISOString()
                };
            }
        }
    } catch (error) {
        console.error("Error fetching terms & conditions:", error);
    }

    try {
        const policyResponse = await fetch(`${apiBaseUrl}/api/privacy-policy/viewprivacypolicy`, { cache: 'no-store' });
         if (policyResponse.ok) {
            const policyResult = await policyResponse.json();
            if (policyResult.success && policyResult.data) {
                privacy_policy = {
                    _id: policyResult.data._id,
                    content: policyResult.data.content || '',
                    updatedAt: policyResult.data.updatedAt || new Date().toISOString()
                };
            }
        }
    } catch (error) {
        console.error("Error fetching privacy policy:", error);
    }
    
    return { terms_conditions, privacy_policy };
}


// ===================================
// TERMS & CONDITIONS
// ===================================

export async function updateTerms(prevState: LegalFormState, formData: FormData): Promise<LegalFormState> {
  const token = formData.get('token') as string;
  const content = formData.get('content') as string;
  const contentId = formData.get('id') as string;

  if (!token) {
    return {
      errors: { server: ['Authentication required.'] },
      message: 'You must be logged in.',
    };
  }

  if (!content || content.trim().length < 10) {
      return {
          errors: { content: ['Content must be at least 10 characters long.'] },
          message: 'Content is too short.',
      }
  }

  try {
    // If there's no ID, it means we need to create it first.
    if (!contentId || contentId === 'terms-and-conditions') {
        await apiFetch(`/api/terms-condition/createtermscondition`, token, {
            method: 'POST',
            body: JSON.stringify({ heading: "Terms & Conditions", content }),
        });
    } else {
         await apiFetch(`/api/terms-condition/updatetermscondition`, token, {
            method: 'PUT',
            body: JSON.stringify({ content }),
        });
    }

    revalidatePath('/super-admin/legal');
    
    return { 
        success: true, 
        message: 'Terms & Conditions updated successfully!' 
    };

  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Error updating terms:", errorMessage);
    return {
      errors: { server: [errorMessage] },
      message: `Failed to update Terms & Conditions: ${errorMessage}`,
    };
  }
}

export async function deleteTerms(token: string): Promise<{ success: boolean; message: string }> {
    if (!token) {
        return { success: false, message: 'Authentication required.' };
    }

    try {
        const result = await apiFetch(`/api/terms-condition/deletetermscondition`, token, {
            method: 'DELETE',
        });
        revalidatePath('/super-admin/legal');
        return { success: true, message: result.message || 'Terms & Conditions deleted successfully.' };
    } catch (e: any) {
        return { success: false, message: `Failed to delete Terms & Conditions: ${e.message}` };
    }
}


// ===================================
// PRIVACY POLICY
// ===================================

export async function updatePrivacyPolicy(prevState: LegalFormState, formData: FormData): Promise<LegalFormState> {
  const token = formData.get('token') as string;
  const content = formData.get('content') as string;
  const contentId = formData.get('id') as string;

  if (!token) {
    return { errors: { server: ['Authentication required.'] }, message: 'You must be logged in.' };
  }

  if (!content || content.trim().length < 10) {
    return { errors: { content: ['Content must be at least 10 characters long.'] }, message: 'Content is too short.' };
  }

  try {
    // If there's no ID, create it. Otherwise, update.
    if (!contentId || contentId === 'privacy-policy') {
      await apiFetch(`/api/privacy-policy/createprivacypolicy`, token, {
        method: 'POST',
        body: JSON.stringify({ heading: "Privacy Policy", content }),
      });
    } else {
      await apiFetch(`/api/privacy-policy/updateprivacypolicy`, token, {
        method: 'PUT',
        body: JSON.stringify({ content }),
      });
    }
    revalidatePath('/super-admin/legal');
    return { success: true, message: 'Privacy Policy updated successfully!' };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return { errors: { server: [errorMessage] }, message: `Failed to update Privacy Policy: ${errorMessage}` };
  }
}

export async function deletePrivacyPolicy(token: string): Promise<{ success: boolean; message: string }> {
    if (!token) {
        return { success: false, message: 'Authentication required.' };
    }

    try {
        const result = await apiFetch(`/api/privacy-policy/deleteprivacypolicy`, token, {
            method: 'DELETE',
        });
        revalidatePath('/super-admin/legal');
        return { success: true, message: result.message || 'Privacy Policy deleted successfully.' };
    } catch (e: any) {
        return { success: false, message: `Failed to delete Privacy Policy: ${e.message}` };
    }
}
