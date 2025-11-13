
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api-client';

const fileSchema = z.instanceof(File).optional();

const categorySchema = z.object({
  categoryName: z.string().min(1, 'Category name is required.'),
  categoryImage: fileSchema,
  current_icon_url: z.string().optional(),
});

export type FormState = {
  message?: string;
  errors?: {
    categoryName?: string[];
    categoryImage?: string[];
    server?: string[];
  };
};

const createSlug = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

export async function createCategory(prevState: FormState, formData: FormData): Promise<FormState> {
  const token = formData.get('token') as string;
  if (!token) {
    return { message: 'Authentication token is missing.', errors: { server: ['Authentication token is missing.'] } };
  }
  
  const validatedFields = categorySchema.safeParse({
      categoryName: formData.get('categoryName'),
      categoryImage: formData.get('categoryImage')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors and try again.',
    };
  }

  try {
    const result = await apiFetch('/api/category/createcatgeory', token, {
        method: 'POST',
        body: formData,
    }, true);
    
    revalidatePath('/super-admin/categories');
    return { message: result.message || 'Category created successfully!' };

  } catch (e: any) {
    return { message: `Failed to create category: ${e.message}`, errors: { server: [e.message] } };
  }
}

export async function updateCategory(id: string, prevState: FormState, formData: FormData): Promise<FormState> {
  const token = formData.get('token') as string;
  if (!token) {
    return { message: 'Authentication token is missing.', errors: { server: ['Authentication token is missing.'] } };
  }

  const validatedFields = categorySchema.safeParse({
    categoryName: formData.get('categoryName'),
    categoryImage: formData.get('categoryImage') as File,
  });
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors and try again.',
    };
  }
  
  try {
    const result = await apiFetch(`/api/category/updatecategory/${id}`, token, {
      method: 'PUT',
      body: formData,
    }, true);
    
    revalidatePath('/super-admin/categories');
    return { message: result.message || 'Category updated successfully!' };

  } catch (e: any) {
    return { message: `Failed to update category: ${e.message}`, errors: { server: [e.message] } };
  }
}

export async function deleteCategory(id: string, token: string): Promise<{ success: boolean, message: string }> {
    if (!token) {
        return { success: false, message: 'Authentication token is required.' };
    }

    try {
        await apiFetch(`/api/category/deletecategory/${id}`, token, { method: 'DELETE' });
        revalidatePath('/super-admin/categories');
        return { success: true, message: 'Category deleted successfully.' };
    } catch (e: any) {
        return { success: false, message: `Failed to delete category: ${e.message}` };
    }
}

export async function getCategories() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
        const response = await fetch(`${apiBaseUrl}/api/category/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch categories.');
        }

        const result = await response.json();

        const categories = result.data.map((cat: any) => ({
            id: cat._id,
            name: cat.categoryName,
            slug: createSlug(cat.categoryName),
            icon_url: cat.categoryImage ? `${apiBaseUrl}${cat.categoryImage}` : null,
        }));
        
        return { data: categories, error: null };
    } catch (e: any) {
        console.error('Error fetching categories from API:', e.message);
        return { data: [], error: e.message };
    }
}
