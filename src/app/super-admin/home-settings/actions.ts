
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Banner, OfferBannerPrice } from '@/lib/types';
import { apiFetch } from '@/lib/api-client';

const fileSchema = z.instanceof(File);

const bannerSchema = z.object({
    title: z.string().min(1, 'Title is required.'),
    link: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
    image: fileSchema.refine(file => file.size > 0, "An image is required."),
    startDate: z.string().min(1, 'Start date is required.'),
    endDate: z.string().min(1, 'End date is required.'),
});

const updateBannerSchema = bannerSchema.extend({
  image: fileSchema.optional(), // Make image optional for updates
});


export type BannerFormState = {
    errors?: {
        title?: string[];
        link?: string[];
        image?: string[];
        startDate?: string[];
        endDate?: string[];
        server?: string[];
    };
    message?: string;
};

const pricingSchema = z.object({
  place: z.enum(['top', 'middle', 'bottom']),
  price7Days: z.coerce.number().min(0, "Price must be a positive number."),
  price14Days: z.coerce.number().min(0, "Price must be a positive number."),
  price21Days: z.coerce.number().min(0, "Price must be a positive number."),
  price30Days: z.coerce.number().min(0, "Price must be a positive number."),
});

export type PricingFormState = {
    errors?: {
        price7Days?: string[];
        price14Days?: string[];
        price21Days?: string[];
        price30Days?: string[];
        server?: string[];
    };
    message?: string;
};


const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function addBanner(prevState: BannerFormState, formData: FormData): Promise<BannerFormState> {
    const token = formData.get('token') as string;
    if (!token) {
        return { message: 'Authentication required.', errors: { server: ['You must be logged in.'] } };
    }

    const validatedFields = bannerSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Please correct the errors.',
        };
    }

    try {
        const result = await apiFetch('/api/banner/addbanner', token, {
            method: 'POST',
            body: formData,
        }, true);

        revalidatePath('/super-admin/home-settings');
        return { message: result.message || 'Banner added successfully!' };

    } catch (e: any) {
        return { message: `Failed to add banner: ${e.message}`, errors: { server: [e.message] } };
    }
}

export async function updateBanner(id: string, prevState: BannerFormState, formData: FormData): Promise<BannerFormState> {
    const token = formData.get('token') as string;
    if (!token) {
        return { message: 'Authentication required.', errors: { server: ['You must be logged in.'] } };
    }

    const validatedFields = updateBannerSchema.safeParse({
      title: formData.get('title'),
      link: formData.get('link'),
      image: formData.get('image'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
    });

    if (!validatedFields.success) {
      return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Please correct the validation errors.',
      };
    }

    const imageFile = formData.get('image') as File | null;
    const hasImage = imageFile && imageFile.size > 0;

    const apiBody = new FormData();
    Object.entries(validatedFields.data).forEach(([key, value]) => {
      if (key !== 'image' && value !== undefined) {
        apiBody.append(key, value as string);
      }
    });

    if (hasImage) {
      apiBody.append('image', imageFile);
    }
    
    try {
        const result = await apiFetch(`/api/banner/editbanner/${id}`, token, {
            method: 'PUT',
            body: apiBody,
        }, true);

        revalidatePath('/super-admin/home-settings');
        return { message: result.message || 'Banner updated successfully!' };

    } catch (e: any) {
        console.error("Update Banner Action Error:", e);
        return { message: `Failed to update banner: ${e.message}`, errors: { server: [e.message] } };
    }
}


export async function getHeroBanners(token: string): Promise<{ data: Banner[] | null, error: string | null }> {
    if (!token) {
        return { data: null, error: 'Authentication token is required.' };
    }
    try {
        const result = await apiFetch('/api/banner/getallbanners', token, { cache: 'no-store' });
        
        const bannersWithFullUrl = result.data.banners.map((banner: any) => ({
            ...banner,
            image: banner.image && !banner.image.startsWith('http') ? `${apiBaseUrl}${banner.image}` : banner.image
        }));

        return { data: bannersWithFullUrl, error: null };
    } catch (e: any) {
        return { data: null, error: (e as Error).message };
    }
}

export async function deleteBanner(id: string, token: string): Promise<{ success: boolean, message: string }> {
     if (!token) {
        return { success: false, message: 'Authentication required.' };
    }
    try {
        const result = await apiFetch(`/api/banner/deletebanner/${id}`, token, {
            method: 'DELETE',
        });
        revalidatePath('/super-admin/home-settings');
        return { success: true, message: result.message || 'Banner deleted successfully.' };
    } catch (e: any) {
        return { success: false, message: (e as Error).message };
    }
}

export async function getOfferBannerPrices(): Promise<{ data: OfferBannerPrice[] | null, error: string | null }> {
    if (!apiBaseUrl) {
      return { data: null, error: 'API base URL is not configured.' };
    }
    try {
        const response = await fetch(`${apiBaseUrl}/api/offer-banner/place-prices`, {
            cache: 'no-store'
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Failed to fetch banner prices.');
        }
        return { data: result.data.placePrices, error: null };
    } catch (e: any) {
        return { data: null, error: (e as Error).message };
    }
}


export async function setOfferBannerPrice(prevState: PricingFormState, formData: FormData): Promise<PricingFormState> {
    const token = formData.get('token') as string;
    if (!token) {
        return { message: 'Authentication required.', errors: { server: ['You must be logged in.'] } };
    }

    const rawData = {
        place: formData.get('place'),
        price7Days: formData.get('price7Days'),
        price14Days: formData.get('price14Days'),
        price21Days: formData.get('price21Days'),
        price30Days: formData.get('price30Days'),
    };
    
    const validatedFields = pricingSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Please correct the pricing errors.',
        };
    }

    try {
        await apiFetch('/api/offer-banner/admin/set-place-prices', token, {
            method: 'POST',
            body: JSON.stringify(validatedFields.data),
        });

        revalidatePath('/super-admin/home-settings');
        return { message: 'Pricing for ' + validatedFields.data.place + ' placement updated successfully!' };

    } catch (e: any) {
        return { message: `Failed to set pricing: ${e.message}`, errors: { server: [e.message] } };
    }
}

export async function getOfferBanners(token: string): Promise<{ data: any[] | null, error: string | null }> {
    if (!token) {
        return { data: null, error: 'Authentication token is required.' };
    }
    try {
        const result = await apiFetch('/api/offer-banner/admin/getallbanners', token, { cache: 'no-store' });
        
        const adaptedBanners = result.data.banners.map((banner: any) => ({
            ...banner,
            image: banner.image && !banner.image.startsWith('http') ? `${apiBaseUrl}${banner.image}` : banner.image,
            vendor: {
                businessName: banner.uploadedBy?.name || 'Unknown User'
            }
        }));
        
        return { data: adaptedBanners, error: null };
    } catch (e: any) {
        return { data: null, error: (e as Error).message };
    }
}


export async function updateOfferBannerByAdmin(id: string, prevState: BannerFormState, formData: FormData): Promise<BannerFormState> {
    const token = formData.get('token') as string;
    if (!token) {
        return { message: 'Authentication required.', errors: { server: ['You must be logged in.'] } };
    }

    const apiBody = new FormData();
    const title = formData.get('title') as string;
    const link = formData.get('link') as string;
    const imageFile = formData.get('image') as File | null;
    
    if (title) apiBody.append('title', title);
    if (link) apiBody.append('link', link);
    if (imageFile && imageFile.size > 0) {
      apiBody.append('image', imageFile);
    }
    
    try {
        const result = await apiFetch(`/api/offer-banner/admin/editbanner/${id}`, token, {
            method: 'PUT',
            body: apiBody,
        }, true);

        revalidatePath('/super-admin/home-settings');
        return { message: result.message || 'Offer Banner updated successfully!' };

    } catch (e: any) {
        console.error("Update Offer Banner Action Error:", e);
        return { message: `Failed to update offer banner: ${e.message}`, errors: { server: [e.message] } };
    }
}

export async function deleteOfferBannerByAdmin(id: string, token: string): Promise<{ success: boolean; message: string }> {
    if (!token) {
        return { success: false, message: 'Authentication required.' };
    }
    if (!id) {
        return { success: false, message: 'Banner ID is required.' };
    }

    try {
        const result = await apiFetch(`/api/offer-banner/admin/deletebanner/${id}`, token, {
            method: 'DELETE',
        });

        if (!result.success) {
            throw new Error(result.message || 'Failed to delete offer banner.');
        }

        revalidatePath('/super-admin/home-settings');
        return { success: true, message: result.message || 'Offer banner deleted successfully!' };
    } catch (e: any) {
        return { success: false, message: (e as Error).message };
    }
}
