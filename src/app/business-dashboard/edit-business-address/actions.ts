
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/client';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const editAddressSchema = z.object({
  businessId: z.string().min(1, "Business ID is required."),
  area: z.string().optional(),
  pincode: z.string().min(1, "Pincode is required."),
  plotnumber: z.string().optional(),
  buildingname: z.string().optional(),
  streetname: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State is required."),
});

export type EditAddressState = {
  errors?: {
    pincode?: string[];
    city?: string[];
    state?: string[];
    server?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function getBusinessAddress(businessId: string) {
    if (!businessId) return { data: null, error: 'Business ID is required.' };
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('vendors')
        .select('businessName, plotnumber, buildingname, streetname, landmark, area, city, state, pincode, address')
        .eq('id', businessId)
        .single();
    if (error) return { data: null, error: error.message };
    return { data, error: null };
}

export async function updateBusinessAddress(prevState: EditAddressState, formData: FormData): Promise<EditAddressState> {
  const businessId = formData.get('businessId') as string;
  const validatedFields = editAddressSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors and try again.',
    };
  }
  
  const { area, pincode, plotnumber, buildingname, streetname, landmark, city, state } = validatedFields.data;
  
  const addressParts = [plotnumber, buildingname, streetname, area, city, state, pincode].filter(Boolean);
  const fullAddress = addressParts.join(', ');

  const supabase = createSupabaseServerClient();
  
  try {
    const { error } = await supabase
      .from('vendors')
      .update({ 
        area,
        pincode,
        plotnumber,
        buildingname,
        streetname,
        landmark,
        city,
        state,
        address: fullAddress,
        updated_at: new Date().toISOString()
      })
      .eq('id', businessId);

    if (error) throw error;

    revalidatePath(`/business-dashboard?id=${businessId}`);
    
    return { 
        success: true, 
        message: 'Business address updated successfully!' 
    };

  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Error updating business address:", errorMessage);
    return {
      errors: { server: [errorMessage] },
      message: `Failed to update address: ${errorMessage}`,
    };
  }
}
