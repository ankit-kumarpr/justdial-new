'use server';

import { apiFetch } from '@/lib/api-client';

export type UserNotification = {
  _id: string;
  subject: string;
  content: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  [key: string]: any;
};

export async function getMyNotifications(token: string): Promise<{ data: UserNotification[] | null; error: string | null; }> {
  if (!token) {
    return { data: null, error: 'Authentication is required.' };
  }
  try {
    const result = await apiFetch('/api/notification/getallnotification', token, { cache: 'no-store' });
    return { data: result.data || [], error: null };
  } catch (e: any) {
    console.error('Error fetching my notifications:', e.message);
    return { data: null, error: e.message };
  }
}
