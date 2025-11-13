'use server';

import { createSupabaseServerClient } from '@/lib/supabase/client';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const timingsSchema = z.object({
  businessId: z.string().min(1, "Business ID is required."),
  workingDays: z.array(z.string()).min(1, "Select at least one working day."),
  openTime: z.string().min(1, "Opening time is required."),
  closingTime: z.string().min(1, "Closing time is required."),
  timingNotes: z.string().optional(),
}).refine(data => data.openTime < data.closingTime, {
  message: "Closing time must be after opening time.",
  path: ["closingTime"],
});

export type UpdateTimingsState = {
  errors?: {
    workingDays?: string[];
    openTime?: string[];
    closingTime?: string[];
    server?: string[];
  };
  message?: string | null;
  success?: boolean;
};


export async function getBusinessTimings(businessId: string) {
    if (!businessId) return { data: null, error: 'Business ID is required.' };
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('vendors')
        .select('workingDays, openTime, closingTime, timing_notes')
        .eq('id', businessId)
        .single();
        
    if (error) return { data: null, error: error.message };
    return { data, error: null };
}


export async function updateBusinessTimings(prevState: UpdateTimingsState, formData: FormData): Promise<UpdateTimingsState> {
  const businessId = formData.get('businessId') as string;
  const rawData = {
    businessId,
    workingDays: formData.getAll('workingDays'),
    openTime: formData.get('openTime'),
    closingTime: formData.get('closingTime'),
    timingNotes: formData.get('timingNotes'),
  };
  
  const validatedFields = timingsSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors and try again.',
    };
  }
  
  const supabase = createSupabaseServerClient();
  
  try {
    const { error } = await supabase
      .from('vendors')
      .update({ 
        workingDays: validatedFields.data.workingDays,
        openTime: validatedFields.data.openTime,
        closingTime: validatedFields.data.closingTime,
        timing_notes: validatedFields.data.timingNotes,
      })
      .eq('id', businessId);

    if (error) throw error;

    revalidatePath(`/business-dashboard?id=${businessId}`);
    
    return { 
        success: true, 
        message: 'Business timings updated successfully!' 
    };

  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Error updating business timings:", errorMessage);
    return {
      errors: { server: [errorMessage] },
      message: `Failed to update timings: ${errorMessage}`,
    };
  }
}
