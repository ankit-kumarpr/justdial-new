
'use server';

import { apiFetch } from '@/lib/api-client';
import type { Ticket } from '@/app/customer-service/actions';

export async function getAllTickets(token: string): Promise<{ data: Ticket[] | null; error: string | null; }> {
    if (!token) {
        return { data: null, error: 'Authentication is required.' };
    }
    try {
        const result = await apiFetch('/api/ticket/admin/all', token, { cache: 'no-store' });
        return { data: result.data.tickets || [], error: null };
    } catch (e: any) {
        console.error('Error fetching all tickets:', e.message);
        return { data: null, error: e.message };
    }
}
