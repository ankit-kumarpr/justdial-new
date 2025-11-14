
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api-client';

const updateContactDetailsSchema = z.object({
  contactPersonTitle: z.string().optional(),
  contactPersonName: z.string().min(2, "Contact person name is required."),
  primaryMobileNumber: z.string().regex(/^\d{10}$/, "Primary mobile number is required and must be 10 digits."),
  primaryWhatsappNumber: z.string().regex(/^\d{10}$/, "Primary WhatsApp number is required and must be 10 digits.").optional().or(z.literal('')),
  email: z.string().email("Invalid email address."),
});

export type ContactState = {
  errors?: {
    contactPersonName?: string[];
    primaryMobileNumber?: string[];
    email?: string[];
    server?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function getContactDetails(businessId: string, token: string) {
    if (!businessId || !token) {
        return { data: null, error: 'Business ID and token are required.' };
    }

    try {
        const result = await apiFetch(`/api/vendor/profile/business/${businessId}`, token, { cache: 'no-store' });
        
        if (result.success && result.data.business) {
            const businessData = result.data.business;
            const contactData = {
                title: businessData.title,
                contactPerson: businessData.contactPerson,
                mobileNumber: businessData.mobileNumber,
                whatsappNumber: businessData.whatsappNumber,
                email: businessData.email,
            };
            return { data: contactData, error: null };
        }
        
        return { data: null, error: 'Business profile not found.' };

    } catch (e: any) {
        console.error("Error fetching contact details from API:", e.message);
        return { data: null, error: e.message };
    }
}

export async function updateContactDetails(prevState: ContactState, formData: FormData): Promise<ContactState> {
  const businessId = formData.get('businessId') as string;
  const token = formData.get('token') as string;
  
  if (!businessId || !token) {
      return { success: false, message: 'Business ID or token is missing.' };
  }
  
  const rawData = {
    contactPersonTitle: formData.get('contactPersonTitle'),
    contactPersonName: formData.get('contactPersonName'),
    primaryMobileNumber: formData.get('primaryMobileNumber'),
    primaryWhatsappNumber: formData.get('primaryWhatsappNumber'),
    email: formData.get('email'),
  };
  
  const validatedFields = updateContactDetailsSchema.safeParse(rawData);
  
  if (!validatedFields.success) {
      return {
          errors: validatedFields.error.flatten().fieldErrors,
          success: false,
          message: `Validation failed: Please check your inputs.`,
      };
  }

  const { contactPersonTitle, contactPersonName, primaryMobileNumber, primaryWhatsappNumber, email } = validatedFields.data;
  
  const payload = {
    title: contactPersonTitle,
    contactPerson: contactPersonName,
    mobileNumber: primaryMobileNumber,
    whatsappNumber: primaryWhatsappNumber,
    email: email
  };
  
  try {
    const result = await apiFetch(`/api/kyc/business/${businessId}/contact`, token, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    if (!result.success) {
        throw new Error(result.message || 'Failed to update contact details.');
    }
    
    revalidatePath(`/business-dashboard?id=${businessId}`);
    
    return { 
        success: true, 
        message: result.message || 'Contact details updated successfully!' 
    };

  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Error updating contact details:", errorMessage);
    return {
      success: false,
      errors: { server: [errorMessage] },
      message: `Failed to update contact details: ${errorMessage}`,
    };
  }
}
