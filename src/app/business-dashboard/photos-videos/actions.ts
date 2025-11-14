
'use server';

import { revalidatePath } from 'next/cache';
import type { GalleryItem } from '@/lib/types';
import { apiFetch } from '@/lib/api-client';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getGallery(businessId: string, token: string): Promise<{ data: GalleryItem[], error: string | null }> {
    if (!businessId || !token) {
        return { data: [], error: 'Business ID and token are required.' };
    }

    try {
        // Step 1: Fetch the business profile to get the owner's userId
        const profileResult = await apiFetch(`/api/vendor/profile/business/${businessId}`, token, { cache: 'no-store' });
        const businessData = profileResult.data?.business;
        
        if (!businessData) {
            return { data: [], error: 'Could not find the business profile.' };
        }
        
        const userId = businessData.userId;
        if (!userId) {
            return { data: [], error: 'Could not find a user associated with this business.' };
        }

        // Step 2: Fetch photos using the userId
        let photos: GalleryItem[] = [];
        try {
            const photosResult = await apiFetch(`/api/vendor/profile/photos/${userId}`, token, { cache: 'no-store' });
            if (photosResult.success && Array.isArray(photosResult.data.photos)) {
                photos = photosResult.data.photos.map((photoUrl: string, index: number) => ({
                    id: `${businessId}-photo-${index}`,
                    vendor_id: businessId,
                    media_url: photoUrl.startsWith('http') ? photoUrl : `${apiBaseUrl}${photoUrl}`,
                    media_type: 'image' as 'image',
                    caption: null,
                    created_at: new Date().toISOString(),
                }));
            }
        } catch (photoError: any) {
            // If the photo endpoint fails (e.g., 404), continue without photos.
            if (!photoError.message.includes('404')) {
                console.warn("Could not fetch photos, but continuing with video:", photoError.message);
            }
        }
        
        // Step 3: Fetch the single video using the userId
        let video: GalleryItem[] = [];
        try {
            const videoResult = await apiFetch(`/api/vendor/profile/video/${userId}`, token, { cache: 'no-store' });
            if (videoResult.success && videoResult.data?.hasVideo) {
                video.push({
                    id: `${businessId}-video-main`,
                    vendor_id: businessId,
                    media_url: videoResult.data.videoUrl.startsWith('http') ? videoResult.data.videoUrl : `${apiBaseUrl}${videoResult.data.video}`,
                    media_type: 'video' as 'video',
                    caption: 'Business Video',
                    created_at: new Date().toISOString(),
                });
            }
        } catch (videoError: any) {
            // If the video endpoint returns 404, it just means no video exists. Don't treat it as a fatal error.
            if (!videoError.message.includes('404')) {
                console.warn("Could not fetch video, but continuing with photos:", videoError.message);
            }
        }
        
        return { data: [...photos, ...video], error: null };

    } catch (e: any) {
        console.error("Error fetching gallery from API:", e.message);
        if (e.message.includes('404')) {
             return { data: [], error: null };
        }
        return { data: [], error: e.message };
    }
}


export async function uploadMedia(formData: FormData): Promise<{ success: boolean; message: string }> {
  const businessId = formData.get('businessId') as string;
  const files = formData.getAll('photos') as File[];
  const token = formData.get('token') as string;

  if (!token) {
    return { success: false, message: 'Authentication required.' };
  }
  
  if (!files || files.length === 0) {
    return { success: false, message: 'No files to upload.' };
  }

  const apiFormData = new FormData();
  files.forEach(file => {
      apiFormData.append('photos', file);
  });

  try {
    const result = await apiFetch('/api/vendor/profile/photos/upload', token, {
        method: 'POST',
        body: apiFormData,
    }, true);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to upload photos.');
    }
    
    revalidatePath(`/business-dashboard/photos-videos?id=${businessId}`);
    return { success: true, message: result.message || `${files.length} file(s) uploaded successfully.` };

  } catch (error) {
    console.error('Error uploading media:', error);
    return { success: false, message: (error as Error).message };
  }
}

export async function uploadVideo(formData: FormData): Promise<{ success: boolean; message: string }> {
  const businessId = formData.get('businessId') as string;
  const file = formData.get('video') as File | null;
  const token = formData.get('token') as string;

  if (!token) {
    return { success: false, message: 'Authentication required.' };
  }
  
  if (!file || file.size === 0) {
    return { success: false, message: 'No video file to upload.' };
  }

  const apiFormData = new FormData();
  apiFormData.append('video', file);

  try {
    const result = await apiFetch('/api/vendor/profile/video/upload', token, {
        method: 'POST',
        body: apiFormData,
    }, true);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to upload video.');
    }
    
    revalidatePath(`/business-dashboard/photos-videos?id=${businessId}`);
    return { success: true, message: result.message || `Video uploaded successfully.` };

  } catch (error) {
    console.error('Error uploading video:', error);
    return { success: false, message: (error as Error).message };
  }
}


export async function deleteMedia(photoPath: string, token: string): Promise<{ success: boolean, message: string }> {
    if (!token) {
        return { success: false, message: 'Authentication required.' };
    }
    if (!photoPath) {
        return { success: false, message: 'Photo path is required for deletion.' };
    }

    try {
        // The API expects a relative path, so we extract it.
        const relativePath = new URL(photoPath).pathname;

        const result = await apiFetch(`/api/vendor/profile/photos/delete`, token, {
            method: 'DELETE',
            body: JSON.stringify({ photoPath: relativePath }),
        });
        
        if (!result.success) {
            throw new Error(result.message || 'Failed to delete photo.');
        }

        revalidatePath(`/business-dashboard/photos-videos`);
        return { success: true, message: 'Media deleted successfully.' };
    } catch(e) {
        console.error('Error deleting media:', e);
        return { success: false, message: (e as Error).message };
    }
}

export async function deleteVideo(token: string): Promise<{ success: boolean, message: string }> {
    if (!token) {
        return { success: false, message: 'Authentication required.' };
    }

    try {
        const result = await apiFetch(`/api/vendor/profile/deletebusinessvideo`, token, {
            method: 'DELETE',
        });
        
        if (!result.success) {
            throw new Error(result.message || 'Failed to delete video.');
        }

        revalidatePath(`/business-dashboard/photos-videos`);
        return { success: true, message: 'Video deleted successfully.' };
    } catch(e) {
        console.error('Error deleting video:', e);
        return { success: false, message: (e as Error).message };
    }
}
