
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/client';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

const contactNumberSchema = z.object({
  id: z.string(),
  contact_number: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit number.").or(z.literal('')),
});

const updateContactDetailsSchema = z.object({
  contactPersonTitle: z.string().optional(),
  contactPersonName: z.string().min(2, "Contact person name is required."),
  primaryMobileNumber: z.string().regex(/^\d{10}$/, "Primary mobile number is required and must be 10 digits."),
  primaryWhatsappNumber: z.string().regex(/^\d{10}$/, "Primary WhatsApp number is required and must be 10 digits.").optional().or(z.literal('')),
  additionalMobileNumbers: z.array(contactNumberSchema),
  additionalWhatsappNumbers: z.array(contactNumberSchema),
});

export type ContactState = {
  errors?: {
    contactPersonName?: string[];
    primaryMobileNumber?: string[];
    server?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function getContactDetails(businessId: string) {
    if (!businessId) return { data: null, error: 'Business ID is required.' };
    const supabase = createSupabaseServerClient();
    try {
        const { data: vendorData, error: vendorError } = await supabase
            .from('vendors')
            .select('contactPersonTitle, contactPersonName, primaryMobileNumber, primaryWhatsappNumber')
            .eq('id', businessId)
            .single();

        if (vendorError) throw vendorError;

        const { data: contactsData, error: contactsError } = await supabase
            .from('vendor_contacts')
            .select('id, contact_type, contact_number')
            .eq('vendor_id', businessId);

        if (contactsError) throw contactsError;

        const data = {
            contactPersonTitle: vendorData?.contactPersonTitle,
            contactPersonName: vendorData?.contactPersonName,
            primaryMobileNumber: vendorData?.primaryMobileNumber,
            primaryWhatsappNumber: vendorData?.primaryWhatsappNumber,
            additionalMobileNumbers: contactsData?.filter(c => c.contact_type === 'mobile') || [],
            additionalWhatsappNumbers: contactsData?.filter(c => c.contact_type === 'whatsapp') || [],
        };
        
        return { data, error: null };

    } catch (e: any) {
        return { data: null, error: e.message };
    }
}

export async function updateContactDetails(prevState: ContactState, formData: FormData): Promise<ContactState> {
  const businessId = formData.get('businessId') as string;
  const rawData = JSON.parse(formData.get('contactDetails') as string);
  
  if (!businessId) {
      return { success: false, message: 'Business ID is missing.' };
  }
  
  const validatedFields = updateContactDetailsSchema.safeParse(rawData);
  
  if (!validatedFields.success) {
      return {
          errors: validatedFields.error.flatten().fieldErrors,
          success: false,
          message: `Validation failed: Please check your inputs.`,
      };
  }

  const { contactPersonTitle, contactPersonName, primaryMobileNumber, primaryWhatsappNumber, additionalMobileNumbers, additionalWhatsappNumbers } = validatedFields.data;
  
  const supabase = createSupabaseServerClient();
  
  try {
    // 1. Update the main vendors table with primary info
    const { error: vendorUpdateError } = await supabase
      .from('vendors')
      .update({ 
        contactPersonTitle, 
        contactPersonName,
        primaryMobileNumber,
        primaryWhatsappNumber: primaryWhatsappNumber || null,
       })
      .eq('id', businessId);
      
    if (vendorUpdateError) throw vendorUpdateError;

    // 2. Prepare all additional contacts for upsert
    const mobileContactsToUpsert = additionalMobileNumbers
        .filter(c => c.contact_number)
        .map(c => ({ id: c.id.includes('-') ? uuidv4() : c.id, vendor_id: businessId, contact_type: 'mobile', contact_number: c.contact_number }));

    const whatsappContactsToUpsert = additionalWhatsappNumbers
        .filter(c => c.contact_number)
        .map(c => ({ id: c.id.includes('-') ? uuidv4() : c.id, vendor_id: businessId, contact_type: 'whatsapp', contact_number: c.contact_number }));

    const allContactsToUpsert = [...mobileContactsToUpsert, ...whatsappContactsToUpsert];

    if (allContactsToUpsert.length > 0) {
        const { error: upsertError } = await supabase.from('vendor_contacts').upsert(allContactsToUpsert, { onConflict: 'id' });
        if (upsertError) throw upsertError;
    }
    
    // 3. Handle deletions
    const currentIdsInForm = new Set(allContactsToUpsert.map(c => c.id));
    const { data: existingContacts, error: fetchError } = await supabase
      .from('vendor_contacts')
      .select('id')
      .eq('vendor_id', businessId);

    if (fetchError) throw fetchError;
    
    const idsToDelete = existingContacts.filter(c => !currentIdsInForm.has(c.id)).map(c => c.id);

    if(idsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('vendor_contacts')
        .delete()
        .in('id', idsToDelete);
      if (deleteError) throw deleteError;
    }
    
    revalidatePath(`/business-dashboard?id=${businessId}`);
    
    return { 
        success: true, 
        message: 'Contact details updated successfully!' 
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
