
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/client';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

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

export async function getBusinessName(businessId: string) {
    if (!businessId) return { name: null, error: 'Business ID is required.' };
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('vendors')
        .select('businessName')
        .eq('id', businessId)
        .single();
    if (error) return { name: null, error: error.message };
    return { name: data?.businessName, error: null };
}

export async function updateBusinessName(prevState: EditBusinessNameState, formData: FormData): Promise<EditBusinessNameState> {
  const validatedFields = editBusinessNameSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors and try again.',
    };
  }

  const { businessId, businessName } = validatedFields.data;
  const supabase = createSupabaseServerClient();

  try {
    const { error } = await supabase
      .from('vendors')
      .update({ businessName: businessName })
      .eq('id', businessId);

    if (error) {
      throw error;
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
