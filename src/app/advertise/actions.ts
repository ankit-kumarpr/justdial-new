
'use server';

import type { OfferBannerPrice } from '@/lib/types';
import { apiFetch } from '@/lib/api-client';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getOfferBannerPrices(): Promise<{ data: OfferBannerPrice[] | null, error: string | null }> {
    if (!apiBaseUrl) {
        return { data: null, error: 'Backend API URL is not configured.' };
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


export async function calculateOfferBannerPrice(
    place: 'top' | 'middle' | 'bottom', 
    duration: number,
    token: string
): Promise<{ price: number | null, error: string | null }> {
    if (!apiBaseUrl) {
        return { price: null, error: 'Backend API URL is not configured.' };
    }
    
    if(!place || !duration) {
        return { price: null, error: 'Placement and duration are required.' };
    }

    if (!token) {
        return { price: null, error: 'Authentication token is required.' };
    }

    try {
        const response = await apiFetch('/api/offer-banner/calculate-price', token, {
            method: 'POST',
            body: JSON.stringify({ place, duration }),
        });

        if (!response.success) {
            throw new Error(response.message || 'Failed to calculate price.');
        }
        return { price: response.data.priceInRupees, error: null };
    } catch (e: any) {
        return { price: null, error: (e as Error).message };
    }
}


export async function createOfferBannerOrder(
    place: 'top' | 'middle' | 'bottom', 
    duration: number,
    token: string
): Promise<{ order: any | null, error: string | null }> {
    if (!token) {
        return { order: null, error: 'Authentication token is required.' };
    }
    
    try {
        const result = await apiFetch('/api/offer-banner/purchase-place', token, {
            method: 'POST',
            body: JSON.stringify({
                place,
                duration,
                startDate: new Date().toISOString()
            })
        });

        if (!result.success) {
            throw new Error(result.message || 'Failed to create payment order.');
        }
        
        return { order: result.data, error: null };

    } catch (e) {
        const errorMessage = (e as Error).message;
        console.error('Create order error:', errorMessage);
        return { order: null, error: errorMessage };
    }
}

export async function verifyOfferBannerPayment(
    bannerId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    token: string
): Promise<{ success: boolean; message: string }> {
    if (!token) {
        return { success: false, message: 'Authentication is required to verify payment.' };
    }

    try {
        const result = await apiFetch(`/api/offer-banner/verify-payment/${bannerId}`, token, {
            method: 'POST',
            body: JSON.stringify({
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature,
            }),
        });

        if (!result.success) {
            throw new Error(result.message || 'Payment verification failed.');
        }

        return { success: true, message: result.message || 'Payment verified successfully!' };

    } catch (e) {
        const errorMessage = (e as Error).message;
        console.error('Payment verification error:', errorMessage);
        return { success: false, message: errorMessage };
    }
}
