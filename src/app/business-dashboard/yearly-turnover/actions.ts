
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/client';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const yearlyTurnoverSchema = z.object({
  businessId: z.string().min(1, "Business ID is required."),
  yearlyTurnover: z.string().min(1, "Please select a turnover range."),
});

export type YearlyTurnoverState = {
  errors?: {
    yearlyTurnover?: string[];
    server?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function updateYearlyTurnover(prevState: YearlyTurnoverState, formData: FormData): Promise<YearlyTurnoverState> {
  const businessId = formData.get('businessId') as string;
  const validatedFields = yearlyTurnoverSchema.safeParse({
    businessId,
    yearlyTurnover: formData.get('turnover'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please select a turnover range.',
    };
  }
  
  const supabase = createSupabaseServerClient();
  
  try {
    const { error } = await supabase
      .from('vendors')
      .update({ yearlyTurnover: validatedFields.data.yearlyTurnover })
      .eq('id', businessId);

    if (error) throw error;

    revalidatePath(`/business-dashboard?id=${businessId}`);
    
    return { 
        success: true, 
        message: 'Yearly turnover updated successfully!' 
    };

  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Error updating yearly turnover:", errorMessage);
    return {
      errors: { server: [errorMessage] },
      message: `Failed to update turnover: ${errorMessage}`,
    };
  }
}
