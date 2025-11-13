
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api-client';

const fileSchema = z.instanceof(File).optional();

// This schema is now for documentation/reference, as validation is complex with FormData.
// The actual FormData construction is now more manual on the client.
const serviceSchema = z.object({
  vendorId: z.string().min(1, "Vendor ID is required."),
  serviceName: z.string().min(1, "Service name is required."),
  description: z.string().optional(),
  priceType: z.enum(['single', 'range', 'qty_based']),
  actualPrice: z.string().optional(),
  discountPrice: z.string().optional(),
  unit: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  qtyRanges: z.array(z.object({
    from: z.string(),
    to: z.string(),
    price: z.string(),
  })).optional(),
  serviceImage: fileSchema,
  attachments: z.array(z.instanceof(File)).optional(),
  token: z.string().min(1, "Authentication token is required."),
});

export type FormState = {
  message?: string;
  errors?: {
    serviceName?: string[];
    server?: string[];
    [key: string]: any;
  };
};

export async function createOrUpdateService(serviceId: string | null, prevState: FormState, formData: FormData): Promise<FormState> {
  const token = formData.get('token') as string;
  if (!token) {
    return { message: "Authentication token is missing." };
  }

  const isEditing = !!serviceId;
  const vendorId = formData.get('vendorId') as string;
  const endpoint = isEditing
    ? `/api/service/update-service/${serviceId}`
    : `/api/service/serviceadd/${vendorId}`;
  const method = isEditing ? 'PUT' : 'POST';

  try {
    const result = await apiFetch(endpoint, token, {
        method,
        body: formData,
    }, true); // isFormData = true
    
    if (!result.success) {
        throw new Error(result.message || 'Failed to process service.');
    }

    revalidatePath(`/business-dashboard/catalogue`);
    return { message: result.message || `Service ${isEditing ? 'updated' : 'created'} successfully!` };

  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(`Error ${isEditing ? 'updating' : 'creating'} service:`, errorMessage);
    
    let displayMessage = `Failed to ${isEditing ? 'update' : 'create'} service: ${errorMessage}`;
    if (errorMessage.includes('own catalog')) {
      displayMessage = `Failed to create service: You can only add services to your own catalog. (Attempted with Vendor ID: ${vendorId})`;
    }
    
    return {
      message: displayMessage,
      errors: { server: [errorMessage] },
    };
  }
}

export async function addPhotoToExistingService(serviceId: string, photo: File, businessId: string): Promise<{ success: boolean; message: string }> {
   console.warn("addPhotoToExistingService is not implemented for the external API.");
   return { success: false, message: "This feature is not supported by the current API." };
}

export async function getSingleService(serviceId: string): Promise<{ data: any | null, error: string | null }> {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBaseUrl) {
        return { data: null, error: 'API base URL not configured.' };
    }
    if (!serviceId) {
        return { data: null, error: 'Service ID is required.' };
    }
    try {
        const response = await fetch(`${apiBaseUrl}/api/service/singleservice/${serviceId}`, { cache: 'no-store' });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch service details.');
        }
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'API returned success as false.');
        }
        return { data: result.data, error: null };
    } catch(e) {
        return { data: null, error: (e as Error).message };
    }
}

export async function deleteService(serviceId: string, token: string): Promise<{ success: boolean; message: string }> {
  if (!token) {
    return { success: false, message: 'Authentication is required.' };
  }
  if (!serviceId) {
    return { success: false, message: 'Service ID is required.' };
  }

  try {
    const result = await apiFetch(`/api/service/delete-service/${serviceId}`, token, {
      method: 'DELETE',
    });

    if (!result.success) {
      throw new Error(result.message || 'Failed to delete service.');
    }

    revalidatePath(`/business-dashboard/catalogue`);
    return { success: true, message: result.message || 'Service deleted successfully!' };
  } catch (e: any) {
    return { success: false, message: (e as Error).message };
  }
}
