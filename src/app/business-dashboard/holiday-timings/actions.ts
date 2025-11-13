
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/client';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { HolidayTiming } from './page';

const timeSlotSchema = z.object({
  id: z.string(),
  open: z.string(),
  close: z.string(),
});

const holidayTimingSchema = z.object({
  id: z.string(),
  date: z.date(),
  description: z.string(),
  is_closed: z.boolean(),
  slots: z.array(timeSlotSchema),
});

const updateHolidayTimingsSchema = z.object({
  businessId: z.string().min(1, "Business ID is required."),
  holidayTimings: z.string().transform((str, ctx) => {
    try {
      const parsed = JSON.parse(str);
      return z.array(holidayTimingSchema.extend({ date: z.string() })).parse(parsed); // Date is stringified
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON for holiday timings' });
      return z.NEVER;
    }
  }),
});


export type HolidayTimingsState = {
  errors?: {
    server?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function getHolidayTimings(businessId: string) {
    if (!businessId) return { data: [], error: 'Business ID is required.' };
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('vendor_holiday_timings')
        .select('*')
        .eq('vendor_id', businessId);
    
    if (error) return { data: [], error: error.message };
    return { data, error: null };
}

export async function updateHolidayTimings(prevState: HolidayTimingsState, formData: FormData): Promise<HolidayTimingsState> {
  const businessId = formData.get('businessId') as string;
  const validatedFields = updateHolidayTimingsSchema.safeParse({
    businessId,
    holidayTimings: formData.get('holidayTimings'),
  });

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten());
    return {
      errors: { server: ['Invalid data format.'] },
      message: 'There was a problem with the data submitted.',
    };
  }

  const { holidayTimings } = validatedFields.data;
  const supabase = createSupabaseServerClient();
  
  try {
    // Get all existing holiday IDs for this vendor from the database
    const { data: existingHolidays, error: fetchError } = await supabase
      .from('vendor_holiday_timings')
      .select('id')
      .eq('vendor_id', businessId);

    if (fetchError) throw fetchError;

    const existingIds = existingHolidays.map(h => h.id);
    const payloadIds = holidayTimings.map(h => h.id);
    
    // IDs to delete are those in the DB but not in the submitted payload
    const idsToDelete = existingIds.filter(id => !payloadIds.includes(id));

    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('vendor_holiday_timings')
        .delete()
        .in('id', idsToDelete);
      if (deleteError) throw deleteError;
    }

    // Prepare data for upsert
    const holidayTimingsToUpsert = holidayTimings.map(timing => ({
      id: timing.id,
      vendor_id: businessId,
      holiday_date: new Date(timing.date).toISOString().split('T')[0], // Format as YYYY-MM-DD
      description: timing.description,
      is_closed: timing.is_closed,
      time_slots: timing.is_closed ? [] : timing.slots,
    }));
    
    if (holidayTimingsToUpsert.length > 0) {
      const { error: upsertError } = await supabase
        .from('vendor_holiday_timings')
        .upsert(holidayTimingsToUpsert, { onConflict: 'id' });
      if (upsertError) throw upsertError;
    }
    
    revalidatePath(`/business-dashboard/update-business-timings?id=${businessId}`);
    
    return { 
        success: true, 
        message: 'Holiday timings updated successfully!' 
    };

  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Error updating holiday timings:", errorMessage);
    return {
      errors: { server: [errorMessage] },
      message: `Failed to update timings: ${errorMessage}`,
    };
  }
}

    
