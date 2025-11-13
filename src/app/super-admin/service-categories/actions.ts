
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/client';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const fileSchema = z.instanceof(File).optional();

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required.'),
  icon_image: fileSchema,
  current_icon_url: z.string().optional(),
});

export type FormState = {
  message?: string;
  errors?: {
    name?: string[];
    icon_image?: string[];
    server?: string[];
  };
};

const createSlug = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

async function uploadIcon(iconFile: File): Promise<string> {
    const supabase = createSupabaseServerClient();
    const fileName = `${Date.now()}-${iconFile.name}`;
    const { data, error } = await supabase.storage
        .from('category-icons')
        .upload(fileName, iconFile);

    if (error) {
        throw new Error(`Failed to upload icon: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage.from('category-icons').getPublicUrl(fileName);
    return publicUrl;
}

export async function createServiceCategory(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = categorySchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors and try again.',
    };
  }

  const { name, icon_image } = validatedFields.data;
  const slug = createSlug(name);
  const supabase = createSupabaseServerClient();
  let iconUrl: string | undefined = undefined;

  try {
    if (icon_image && icon_image.size > 0) {
        iconUrl = await uploadIcon(icon_image);
    }
    
    const { error } = await supabase.from('service_categories').insert({ name, slug, icon_url: iconUrl });
    if (error) throw error;

    revalidatePath('/super-admin/service-categories');
    return { message: 'Service category created successfully!' };
  } catch (e: any) {
    return { message: `Failed to create service category: ${e.message}`, errors: { server: [e.message] } };
  }
}

export async function updateServiceCategory(id: string, prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = categorySchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors and try again.',
    };
  }
  
  const { name, icon_image, current_icon_url } = validatedFields.data;
  const slug = createSlug(name);
  const supabase = createSupabaseServerClient();
  let iconUrl = current_icon_url;

  try {
    if (icon_image && icon_image.size > 0) {
        iconUrl = await uploadIcon(icon_image);
        // Optional: Delete old image from storage if current_icon_url exists
    }

    const { error } = await supabase.from('service_categories').update({ name, slug, icon_url: iconUrl }).eq('id', id);
    if (error) throw error;
    
    revalidatePath('/super-admin/service-categories');
    return { message: 'Service category updated successfully!' };
  } catch (e: any) {
    return { message: `Failed to update service category: ${e.message}`, errors: { server: [e.message] } };
  }
}

export async function deleteServiceCategory(id: string): Promise<{ success: boolean, message: string }> {
    const supabase = createSupabaseServerClient();
    try {
        const { error } = await supabase.from('service_categories').delete().eq('id', id);
        if (error) throw error;
        revalidatePath('/super-admin/service-categories');
        return { success: true, message: 'Service category deleted successfully.' };
    } catch (e: any) {
        return { success: false, message: `Failed to delete service category: ${e.message}` };
    }
}
