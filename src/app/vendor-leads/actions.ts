
'use server';

import type { Lead } from '@/lib/types';
import { apiFetch } from '@/lib/api-client';

type ApiResponse = {
    success: boolean;
    data: {
        leads: any[]; // Use any[] to handle the complex nested structure
        pagination: {
            total: number;
            page: number;
            pages: number;
        }
    };
    error?: string;
    message?: string;
}

export async function getVendorLeads(token: string): Promise<{ data: { leads: Lead[], pagination: ApiResponse['data']['pagination'] } | null; error: string | null; }> {
    if (!token) {
        return { data: null, error: 'Authentication token is required.' };
    }

    try {
        const result: ApiResponse = await apiFetch('/api/lead/vendor/leads', token, { cache: 'no-store' });
        
        // Adapt the new nested structure to the expected Lead type
        const adaptedLeads: Lead[] = result.data.leads.map(item => {
            const userDetails = {
                name: item.leadId.userId.name,
                ...(item.status === 'accepted' && { 
                    email: item.leadId.userId.email,
                    phone: item.leadId.userId.phone 
                })
            };
            
            return {
                _id: item.leadId._id,
                leadResponseId: item._id, // This is the ID of the lead response document
                searchKeyword: item.leadId.searchKeyword,
                description: item.leadId.description,
                status: item.status, // Status comes from the parent object
                createdAt: item.createdAt, // Use the timestamp of the lead response
                userLocation: {
                    city: item.leadId.userLocation.city,
                    address: item.leadId.userLocation.address,
                },
                user: userDetails,
                totalVendorsNotified: item.leadId.totalVendorsNotified,
                totalAccepted: item.leadId.totalAccepted,
            }
        });

        return { 
            data: {
                leads: adaptedLeads,
                pagination: result.data.pagination,
            }, 
            error: null 
        };
    } catch (e) {
        console.error('Server action getVendorLeads failed:', e);
        return { data: null, error: (e as Error).message };
    }
}


export async function createLeadPaymentOrder(
    leadResponseId: string,
    token: string
): Promise<{ order: any | null, error: string | null }> {
    if (!token) {
        return { order: null, error: 'Authentication token is required.' };
    }
    
    try {
        const result = await apiFetch(`/api/payment/create-order/${leadResponseId}`, token, {
            method: 'POST',
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

export async function verifyLeadPayment(
    leadResponseId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    token: string
): Promise<{ success: boolean; message: string }> {
    if (!token) {
        return { success: false, message: 'Authentication is required to verify payment.' };
    }

    try {
        const result = await apiFetch(`/api/payment/verify-and-accept/${leadResponseId}`, token, {
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
