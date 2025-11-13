
'use server';

import type { Lead } from '@/lib/leads-data';
import { apiFetch } from '@/lib/api-client';

type ApiResponse = {
    success: boolean;
    data: {
        leads: Lead[];
        pagination: {
            total: number;
            page: number;
            pages: number;
        }
    };
    error?: string;
    message?: string;
}

export async function getVendorLeads(token: string): Promise<{ data: ApiResponse['data'] | null; error: string | null; }> {
    if (!token) {
        return { data: null, error: 'Authentication token is required.' };
    }

    try {
        const result: ApiResponse = await apiFetch('/api/lead/vendor/leads', token, { cache: 'no-store' });
        return { data: result.data, error: null };
    } catch (e) {
        console.error('Server action getVendorLeads failed:', e);
        return { data: null, error: (e as Error).message };
    }
}
