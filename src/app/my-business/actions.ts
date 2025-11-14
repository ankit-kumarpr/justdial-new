
'use server';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { apiFetch } from '@/lib/api-client';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || null;

export async function getVendorsForUser(token: string) {
    if (!token) {
        return { data: [], error: 'Authentication token is required.' };
    }

    try {
        const result = await apiFetch('/api/kyc/my-kyc', token, { cache: 'no-store' });
        
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const vendorsWithImages = (result.data || []).map((vendor: any) => {
            const imagePath = vendor.business?.photos?.[0];
            const profileImage = imagePath 
                ? (imagePath.startsWith('http') ? imagePath : `${apiBaseUrl}${imagePath}`)
                : findImage('business-profile-image');

            return { ...vendor, id: vendor._id, profileImage };
        });

        return { data: vendorsWithImages, error: null };

    } catch (e: any) {
        console.error('Server action getVendorsForUser failed:', e);
        return { data: [], error: (e as Error).message };
    }
}


export async function getVendorStatus(token: string): Promise<{ isVendor: boolean; businessCount: number; singleBusinessId: string | null; error: string | null }> {
    if (!token) {
        return { isVendor: false, businessCount: 0, singleBusinessId: null, error: 'Authentication token is required.' };
    }
    
    try {
        const result = await apiFetch('/api/kyc/my-kyc', token, { cache: 'no-store' });
        const businesses = result.data || [];
        const businessCount = businesses.length;
        const isVendor = businessCount > 0;
        const singleBusinessId = businessCount === 1 ? businesses[0]._id : null;
        
        return { isVendor, businessCount, singleBusinessId, error: null };
    } catch (e) {
        console.error('Exception in getVendorStatus check:', e);
        return { isVendor: false, businessCount: 0, singleBusinessId: null, error: (e as Error).message };
    }
}