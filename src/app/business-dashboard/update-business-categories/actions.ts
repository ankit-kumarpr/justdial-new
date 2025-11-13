
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/client';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const updateCategoriesSchema = z.object({
  businessId: z.string().min(1, "Invalid Business ID."),
  categoryId: z.string().uuid("Please select a valid category."),
});

export type UpdateCategoriesState = {
  errors?: {
    categoryId?: string[];
    server?: string[];
  };
  message?: string | null;
  success?: boolean;
};


export async function getVendorCategories(businessId: string) {
    if (!businessId) return { data: [], error: 'Business ID is required.' };
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('vendor_categories')
        .select('category_id')
        .eq('vendor_id', businessId);
    if(error) return { data: [], error: error.message };
    return { data: data.map(vc => vc.category_id), error: null };
}

export async function getAllCategories() {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true });
    if (error) return { data: [], error: error.message };
    return { data, error: null };
}


export async function updateBusinessCategories(prevState: UpdateCategoriesState, formData: FormData): Promise<UpdateCategoriesState> {
  const businessId = formData.get('businessId') as string;
  const validatedFields = updateCategoriesSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please select a category.',
    };
  }
  
  const { categoryId } = validatedFields.data;
  const supabase = createSupabaseServerClient();
  
  try {
    // Delete existing categories for the vendor
    const { error: deleteError } = await supabase
        .from('vendor_categories')
        .delete()
        .eq('vendor_id', businessId);
    
    if (deleteError) throw deleteError;

    // Insert the new single category
    const { error: insertError } = await supabase
        .from('vendor_categories')
        .insert({
            vendor_id: businessId,
            category_id: categoryId,
        });
    
    if (insertError) throw insertError;

    revalidatePath(`/business-dashboard?id=${businessId}`);
    
    return { 
        success: true, 
        message: 'Business category updated successfully!' 
    };

  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Error updating business category:", errorMessage);
    return {
      errors: { server: [errorMessage] },
      message: `Failed to update category: ${errorMessage}`,
    };
  }
}
