
'use server';

import { apiFetch } from '@/lib/api-client';
import { revalidatePath } from 'next/cache';
import type { AdminReview } from '@/lib/types';

export async function getAllReviews(token: string): Promise<{ data: AdminReview[] | null; error: string | null; }> {
    if (!token) {
        return { data: null, error: 'Authentication is required.' };
    }
    try {
        const result = await apiFetch('/api/review/allreviews', token, { cache: 'no-store' });
        // The API response has 'id', we map it to '_id' for consistency if needed, but we'll adapt our type
        const reviews = result.data.map((review: any) => ({ ...review, id: review._id }));
        return { data: reviews || [], error: null };
    } catch (e: any) {
        console.error('Error fetching all reviews:', e.message);
        return { data: null, error: e.message };
    }
}

export async function updateReviewStatus(
    reviewId: string, 
    status: 'approved' | 'rejected',
    token: string
): Promise<{ success: boolean; message: string }> {
    if (!reviewId || !status || !token) {
        return { success: false, message: 'Missing required parameters.' };
    }
    
    const endpoint = status === 'approved' 
        ? `/api/review/approve/${reviewId}` 
        : `/api/review/reject/${reviewId}`;

    try {
        const result = await apiFetch(endpoint, token, { method: 'PUT' });
        if (!result.success) {
            // Even if the API returns success:false, if the HTTP status is 2xx, apiFetch considers it a success.
            // Some API routes might return success:false for logical errors (like "already approved").
            // We'll pass the message along.
            if(result.message && result.message.includes("already approved")) {
                 return { success: true, message: result.message };
            }
            throw new Error(result.message || 'Failed to update review status.');
        }
        revalidatePath('/super-admin/reviews');
        return { success: true, message: result.message || `Review successfully ${status}.` };
    } catch (e: any) {
        // apiFetch throws for non-2xx responses.
        return { success: false, message: e.message };
    }
}

export async function deleteReview(reviewId: string, token: string): Promise<{ success: boolean; message: string }> {
    if (!reviewId || !token) {
        return { success: false, message: 'Missing required parameters.' };
    }

    try {
        const result = await apiFetch(`/api/review/delete/${reviewId}`, token, { method: 'DELETE' });
        if (!result.success) {
            throw new Error(result.message || 'Failed to delete review.');
        }
        revalidatePath('/super-admin/reviews');
        return { success: true, message: result.message || 'Review deleted successfully.' };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}
