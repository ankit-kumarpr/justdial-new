
'use server';

import type { Lead, VendorResponse } from '@/lib/types';
import { apiFetch } from '@/lib/api-client';

type ApiResponse = {
    success: boolean;
    data: {
        leads: any[]; 
        pagination: {
            total: number;
            page: number;
            pages: number;
        }
    };
    error?: string;
    message?: string;
}

export async function getMyLeads(
    token: string, 
    page: number = 1,
    statusFilter: string = 'all'
): Promise<{ data: { leads: Lead[], pagination: ApiResponse['data']['pagination'] } | null; error: string | null; }> {
    if (!token) {
        return { data: null, error: 'Authentication is required.' };
    }

    let statusQuery = '';
    if (statusFilter && statusFilter !== 'all') {
        statusQuery = `&status=${statusFilter}`;
    }

    try {
        const result: ApiResponse = await apiFetch(`/api/lead/my-leads?page=${page}${statusQuery}`, token, { cache: 'no-store' });
        
        const adaptedLeads: Lead[] = result.data.leads.map((lead: any) => ({
            _id: lead._id,
            searchKeyword: lead.searchKeyword,
            description: lead.description,
            status: lead.status,
            createdAt: lead.createdAt,
            userLocation: lead.userLocation,
            user: {
              name: lead.userId.name
            },
            totalVendorsNotified: lead.totalVendorsNotified,
            totalAccepted: lead.totalAccepted,
            responses: lead.responses || [],
        }));

        return { 
            data: {
                leads: adaptedLeads,
                pagination: result.data.pagination,
            }, 
            error: null 
        };
    } catch (e) {
        console.error('Server action getMyLeads failed:', e);
        return { data: null, error: (e as Error).message };
    }
}
