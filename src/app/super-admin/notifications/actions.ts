
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api-client';

const MAX_FILES = 5;

const notificationSchema = z.object({
  subject: z.string().min(1, 'Subject is required.'),
  content: z.string().min(1, 'Content is required.'),
  type: z.enum(['service', 'report', 'normal'], {
    errorMap: () => ({ message: 'Please select a valid notification type.' }),
  }),
  recipientType: z.enum(['single_vendor', 'all_vendors', 'single_user', 'all_users'], {
    errorMap: () => ({ message: 'Please select a recipient type.' }),
  }),
  recipientIds: z.string().optional(),
  attachments: z.array(z.instanceof(File)).optional(),
});


export type NotificationFormState = {
  errors?: {
    subject?: string[];
    content?: string[];
    type?: string[];
    recipientType?: string[];
    recipientIds?: string[];
    attachments?: string[];
    server?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function sendNotification(prevState: NotificationFormState, formData: FormData): Promise<NotificationFormState> {
  const token = formData.get('token') as string;
  if (!token) {
    return { success: false, message: 'Authentication required.' };
  }

  const recipientType = formData.get('recipientType') as string;
  
  const rawData = {
    subject: formData.get('subject'),
    content: formData.get('content'),
    type: formData.get('type'),
    recipientType: recipientType,
    recipientIds: formData.get('recipientIds') as string || '',
    attachments: (formData.getAll('attachments') as File[]).filter(file => file.size > 0),
  };

  const validatedFields = notificationSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors and try again.',
    };
  }

  // Conditionally validate recipientIds only when needed
  if (['single_user', 'single_vendor'].includes(recipientType) && (!rawData.recipientIds || rawData.recipientIds.trim() === '')) {
      return {
          errors: { recipientIds: ['Recipient ID is required for this selection.'] },
          message: 'Please enter a Recipient ID.'
      };
  }

  const apiFormData = new FormData();
  Object.entries(validatedFields.data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'attachments') {
          apiFormData.append(key, value as string);
      }
  });

  validatedFields.data.attachments?.forEach(file => {
      apiFormData.append('attachments', file);
  });
  
  try {
    const result = await apiFetch('/api/notification/sendnotification', token, {
        method: 'POST',
        body: apiFormData,
    }, true);
    
    revalidatePath('/super-admin/notifications');
    return { success: true, message: result.message || 'Notification sent successfully!' };

  } catch (e: any) {
    return { success: false, message: e.message, errors: { server: [e.message] } };
  }
}

export async function updateNotification(notificationId: string, prevState: NotificationFormState, formData: FormData): Promise<NotificationFormState> {
    const token = formData.get('token') as string;
    if (!token) {
        return { success: false, message: 'Authentication required.' };
    }
    
    const content = formData.get('content') as string;

    if (!content || content.trim().length < 1) {
        return { errors: { content: ['Content cannot be empty.'] }, message: 'Please provide content for the notification.' };
    }

    try {
        const result = await apiFetch(`/api/notification/updatenotification/${notificationId}`, token, {
            method: 'PUT',
            body: JSON.stringify({ content }),
        });
        
        revalidatePath('/super-admin/notifications');
        return { success: true, message: result.message || 'Notification updated successfully!' };
    } catch (e: any) {
        return { success: false, message: e.message, errors: { server: [e.message] } };
    }
}


export async function getAllNotifications(token: string): Promise<{ data: any[] | null; error: string | null; }> {
    if (!token) {
        return { data: null, error: 'Authentication is required.' };
    }
    try {
        const result = await apiFetch('/api/notification/getallnotification/', token, { cache: 'no-store' });
        return { data: result.data || [], error: null };
    } catch (e: any) {
        console.error('Error fetching notifications:', e.message);
        return { data: null, error: e.message };
    }
}

export async function getSingleNotification(notificationId: string, token: string): Promise<{ data: any | null; error: string | null; }> {
    if (!notificationId || !token) {
        return { data: null, error: 'Notification ID and token are required.' };
    }
    try {
        const result = await apiFetch(`/api/notification/singlenotification/${notificationId}`, token, { cache: 'no-store' });
        return { data: result.data, error: null };
    } catch (e: any) {
        console.error(`Error fetching single notification ${notificationId}:`, e.message);
        return { data: null, error: e.message };
    }
}


export async function deleteNotification(notificationId: string, token: string): Promise<{ success: boolean; message: string; }> {
    if (!notificationId || !token) {
        return { success: false, message: 'Notification ID and token are required.' };
    }
    try {
        const result = await apiFetch(`/api/notification/deletenotification/${notificationId}`, token, {
            method: 'DELETE',
        });
        if (!result.success) {
            throw new Error(result.message || 'Failed to delete notification.');
        }
        revalidatePath('/super-admin/notifications');
        return { success: true, message: result.message || 'Notification deleted successfully.' };
    } catch (e: any) {
        console.error('Error deleting notification:', e.message);
        return { success: false, message: (e as Error).message };
    }
}
