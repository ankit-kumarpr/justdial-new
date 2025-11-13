
'use server';

import type { User } from '@/lib/types';
import { apiFetch } from '@/lib/api-client';

type UserApiResponse = {
    success: boolean;
    data: {
        users: User[];
        pagination: {
            total: number;
            page: number;
            pages: number;
            limit: number;
        }
    };
    error?: string;
    message?: string;
}

type VendorApiResponse = {
    success: boolean;
    data: {
        vendors: User[];
        pagination: {
            total: number;
            page: number;
            pages: number;
            limit: number;
        }
    };
    error?: string;
    message?: string;
}

export async function getAllUsers(token: string): Promise<{ data: User[] | null; error: string | null; }> {
    if (!token) {
        return { data: null, error: 'Authentication token is required.' };
    }

    try {
        const result: UserApiResponse = await apiFetch('/api/admin/users', token, { cache: 'no-store' });
        return { data: result.data.users, error: null };
    } catch (e) {
        console.error('Server action getAllUsers failed:', e);
        return { data: null, error: (e as Error).message };
    }
}

export async function getAllVendors(token: string): Promise<{ data: User[] | null; error: string | null; }> {
    if (!token) {
        return { data: null, error: 'Authentication token is required.' };
    }

    try {
        const result: VendorApiResponse = await apiFetch('/api/admin/vendors', token, { cache: 'no-store' });
        return { data: result.data.vendors, error: null };
    } catch (e) {
        console.error('Server action getAllVendors failed:', e);
        return { data: null, error: (e as Error).message };
    }
}
