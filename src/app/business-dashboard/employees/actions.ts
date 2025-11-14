
'use server';

import { apiFetch } from '@/lib/api-client';
import { revalidatePath } from 'next/cache';

// Search for individual users to add as employees
export async function searchUsers(query: string, token: string): Promise<{ data: any[] | null; error: string | null; }> {
    if (!token) {
        return { data: null, error: 'Authentication required.' };
    }
    if (!query || query.length < 2) {
        return { data: [], error: null };
    }

    try {
        const result = await apiFetch(`/api/vendor/employee/search?search=${query}`, token, { cache: 'no-store' });
        // Adapt to the new response structure
        return { data: result.data.individuals || [], error: null };
    } catch (e: any) {
        return { data: null, error: `Search failed: ${e.message}` };
    }
}

// Get the list of current employees for a business
export async function getEmployees(token: string): Promise<{ data: any[] | null; error: string | null; }> {
    if (!token) {
        return { data: null, error: 'Authentication is required.' };
    }
    try {
        const result = await apiFetch(`/api/vendor/employee/my-employees`, token, { cache: 'no-store' });
        return { data: result.data.employees || [], error: null };
    } catch (e: any) {
        return { data: null, error: e.message };
    }
}

// Add a user as an employee to a business
export async function addEmployee(individualId: string, token: string, businessIdForRevalidation?: string): Promise<{ success: boolean; message: string; }> {
    if (!token || !individualId) {
        return { success: false, message: 'Missing required parameters.' };
    }
    try {
        const result = await apiFetch(`/api/vendor/employee/add`, token, {
            method: 'POST',
            body: JSON.stringify({ individualId }),
        });
        if (businessIdForRevalidation) {
            revalidatePath(`/business-dashboard/employees?id=${businessIdForRevalidation}`);
        }
        return { success: true, message: result.message || 'Employee added successfully.' };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}


// Remove an employee from a business
export async function removeEmployee(businessId: string, userId: string, token: string): Promise<{ success: boolean; message: string; }> {
    if (!token || !businessId || !userId) {
        return { success: false, message: 'Missing required parameters.' };
    }
    try {
        const result = await apiFetch(`/api/vendor/employees/remove/${businessId}`, token, {
            method: 'DELETE',
            body: JSON.stringify({ userId }),
        });
        revalidatePath(`/business-dashboard/employees?id=${businessId}`);
        return { success: true, message: result.message || 'Employee removed successfully.' };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}

// Get profile of a single employee
export async function getEmployeeProfile(individualId: string, token: string): Promise<{ data: any | null; error: string | null; }> {
    if (!individualId || !token) {
        return { data: null, error: 'Individual ID and token are required.' };
    }

    try {
        const result = await apiFetch(`/api/vendor/employee/profile/${individualId}`, token, { cache: 'no-store' });
        return { data: result.data, error: null };
    } catch (e: any) {
        console.error(`Error fetching employee profile ${individualId}:`, e.message);
        return { data: null, error: e.message };
    }
}
