'use server';

import { createSupabaseServerClient } from '@/lib/supabase/client';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const establishmentYearSchema = z.object({
  businessId: z.string().min(1, "Business ID is required."),
  month: z.string().min(1, "Please select a month."),
  year: z.string().min(4, "Please select a valid year."),
});

export type EstablishmentYearState = {
  errors?: {
    month?: string[];
    year?: string[];
    server?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function getEstablishmentYear(businessId: string) {
    if (!businessId) return { data: null, error: 'Business ID is required.' };
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('vendors')
        .select('yearOfEstablishment')
        .eq('id', businessId)
        .single();
    if (error) return { data: null, error: error.message };
    return { data, error: null };
}

export async function updateEstablishmentYear(prevState: EstablishmentYearState, formData: FormData): Promise<EstablishmentYearState> {
  const businessId = formData.get('businessId') as string;
  const validatedFields = establishmentYearSchema.safeParse({
    businessId,
    month: formData.get('month'),
    year: formData.get('year'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors and try again.',
    };
  }
  
  const { month, year } = validatedFields.data;
  const combinedDate = `${month} ${year}`;

  const supabase = createSupabaseServerClient();
  
  try {
    const { error } = await supabase
      .from('vendors')
      .update({ yearOfEstablishment: combinedDate })
      .eq('id', businessId);

    if (error) throw error;

    revalidatePath(`/business-dashboard?id=${businessId}`);
    revalidatePath(`/business-dashboard/year-of-establishment?id=${businessId}`);
    
    return { 
        success: true, 
        message: 'Year of establishment updated successfully!' 
    };

  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Error updating establishment year:", errorMessage);
    return {
      errors: { server: [errorMessage] },
      message: `Failed to update year: ${errorMessage}`,
    };
  }
}
