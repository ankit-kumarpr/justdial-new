'use server';

import { createSupabaseServerClient } from '@/lib/supabase/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { GalleryItem } from '@/lib/types';

const fileSchema = z.instanceof(File);
const uploadSchema = z.object({
  businessId: z.string().min(1, "Business ID is required."),
  files: z.array(fileSchema).min(1, "At least one file is required."),
});

export async function getGallery(businessId: string): Promise<{ data: GalleryItem[], error: string | null }> {
    if (!businessId) {
        return { data: [], error: 'Business ID is required.' };
    }
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('vendor_gallery')
        .select('*')
        .eq('vendor_id', businessId)
        .order('created_at', { ascending: false });

    if (error) {
        return { data: [], error: error.message };
    }
    return { data: data || [], error: null };
}


export async function uploadMedia(formData: FormData): Promise<{ success: boolean; message: string }> {
  const businessId = formData.get('businessId') as string;
  const files = formData.getAll('files') as File[];

  const validatedFields = uploadSchema.safeParse({ businessId, files });

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid data. Please upload at least one file.' };
  }

  const supabase = createSupabaseServerClient();
  const fileUploadPromises = files.map(async (file) => {
    const fileType = file.type.startsWith('video/') ? 'video' : 'image';
    const filePath = `public/${businessId}/gallery/${Date.now()}-${file.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from('kycs')
      .upload(filePath, file);
      
    if (uploadError) {
      throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage.from('kycs').getPublicUrl(filePath);

    return {
      vendor_id: businessId,
      media_url: publicUrl,
      media_type: fileType,
      caption: file.name,
    };
  });

  try {
    const galleryItems = await Promise.all(fileUploadPromises);
    const { error: insertError } = await supabase.from('vendor_gallery').insert(galleryItems);
    if (insertError) throw insertError;
    
    revalidatePath(`/business-dashboard/photos-videos?id=${businessId}`);
    return { success: true, message: `${files.length} file(s) uploaded successfully.` };
  } catch (error) {
    console.error('Error uploading media:', error);
    return { success: false, message: (error as Error).message };
  }
}

export async function deleteMedia(id: string, vendorId: string): Promise<{ success: boolean, message: string }> {
  const supabase = createSupabaseServerClient();
  
  const { error } = await supabase.from('vendor_gallery').delete().eq('id', id);

  if (error) {
    console.error('Error deleting media:', error);
    return { success: false, message: `Failed to delete media: ${error.message}` };
  }

  revalidatePath(`/business-dashboard/photos-videos?id=${vendorId}`);
  return { success: true, message: 'Media deleted successfully.' };
}
