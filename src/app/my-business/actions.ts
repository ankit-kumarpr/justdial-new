
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/client';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { apiFetch } from '@/lib/api-client';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || null;

export async function getVendorsForUser(token: string) {
    if (!token) {
        return { data: [], error: 'Authentication token is required.' };
    }

    try {
        const result = await apiFetch('/api/kyc/my-kyc', token, { cache: 'no-store' });
        
        const supabase = createSupabaseServerClient();
        const vendorsWithImages = await Promise.all(
            result.data.map(async (vendor: any) => {
                const { data: galleryData, error: galleryError } = await supabase
                    .from('vendor_gallery')
                    .select('media_url')
                    .eq('vendor_id', vendor._id)
                    .eq('media_type', 'image')
                    .order('created_at', { ascending: true })
                    .limit(1);

                if (galleryError) {
                    console.error(`Error fetching gallery for vendor ${vendor._id}:`, galleryError);
                }
                
                const profileImage = galleryData && galleryData.length > 0 ? galleryData[0].media_url : findImage('business-profile-image');
                return { ...vendor, id: vendor._id, profileImage };
            })
        );

        return { data: vendorsWithImages, error: null };

    } catch (e: any) {
        console.error('Server action getVendorsForUser failed:', e);
        return { data: [], error: (e as Error).message };
    }
}


export async function isVendor(token: string): Promise<boolean> {
    if (!token) {
        return false;
    }
    
    try {
        const result = await apiFetch('/api/kyc/my-kyc', token);
        return result.success && result.count > 0;
    } catch (e) {
        console.error('Exception in isVendor check:', e);
        return false;
    }
}
