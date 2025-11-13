
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api-client';
import type { Banner } from '@/lib/types';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getMyOfferBanners(token: string): Promise<{ data: Banner[] | null; error: string | null }> {
    if (!token) {
        return { data: null, error: 'Authentication is required.' };
    }
    try {
        const result = await apiFetch('/api/offer-banner/my-banners', token, { cache: 'no-store' });
        const bannersWithFullUrl = result.data.banners.map((banner: any) => ({
            ...banner,
            image: banner.image && !banner.image.startsWith('http') ? `${apiBaseUrl}${banner.image}` : banner.image
        }));
        return { data: bannersWithFullUrl, error: null };
    } catch (e: any) {
        return { data: null, error: e.message };
    }
}


export async function updateOfferBanner(bannerId: string, prevState: any, formData: FormData): Promise<{ success: boolean; message: string; errors?: any; }> {
    const token = formData.get('token') as string;
    if (!token) {
        return { success: false, message: 'Authentication token is missing.', errors: { server: 'Auth failed' } };
    }
    
    try {
        // Reconstruct FormData to only include fields the API expects.
        const apiFormData = new FormData();
        const title = formData.get('title') as string;
        const link = formData.get('link') as string;
        const image = formData.get('image') as File | null;
        
        if (title) apiFormData.append('title', title);
        if (link) apiFormData.append('link', link);
        if (image && image.size > 0) {
            apiFormData.append('image', image);
        }

        const result = await apiFetch(`/api/offer-banner/editbanner/${bannerId}`, token, {
            method: 'PUT',
            body: apiFormData,
        }, true); // isFormData = true

        revalidatePath('/business-dashboard/offers');
        return { success: true, message: result.message || 'Banner updated successfully!' };
    } catch (e: any) {
        return { success: false, message: e.message || 'Failed to update banner.', errors: { server: e.message } };
    }
}

export async function deleteOfferBanner(bannerId: string, token: string): Promise<{ success: boolean; message: string }> {
    if (!token) {
        return { success: false, message: 'Authentication is required.' };
    }
    if (!bannerId) {
        return { success: false, message: 'Banner ID is required.' };
    }

    try {
        const result = await apiFetch(`/api/offer-banner/deletebanner/${bannerId}`, token, {
            method: 'DELETE',
        });

        if (!result.success) {
            throw new Error(result.message || 'Failed to delete banner.');
        }

        revalidatePath('/business-dashboard/offers');
        return { success: true, message: result.message || 'Banner deleted successfully!' };
    } catch (e: any) {
        return { success: false, message: (e as Error).message };
    }
}

export async function uploadBannerImage(bannerId: string, prevState: any, formData: FormData): Promise<{ success: boolean; message: string; }> {
    const token = formData.get('token') as string;
    if (!token) {
        return { success: false, message: 'Authentication token is missing.' };
    }

    const image = formData.get('image') as File | null;
    if (!image || image.size === 0) {
        return { success: false, message: 'Image file is required.' };
    }

    const title = formData.get('title') as string;
    const link = formData.get('link') as string;
    
    const uploadFormData = new FormData();
    uploadFormData.append('image', image);
    if (title) uploadFormData.append('title', title);
    if (link) uploadFormData.append('link', link);
    
    try {
        const result = await apiFetch(`/api/offer-banner/upload-banner/${bannerId}`, token, {
            method: 'POST',
            body: uploadFormData,
        }, true);

        revalidatePath('/business-dashboard/offers');

        return { success: true, message: result.message || 'Banner uploaded successfully!' };
    } catch (e: any) {
        return { success: false, message: e.message || 'Failed to upload banner.' };
    }
}

