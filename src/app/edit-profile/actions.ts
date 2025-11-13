'use server';

import { z } from 'zod';
import { apiFetch } from '@/lib/api-client';

export type ProfileFormState = {
  errors?: {
    name?: string[];
    phone?: string[];
    server?: string[];
  };
  message?: string | null;
  success?: boolean;
  updatedUser?: any;
};

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number."),
});

export async function updateProfile(prevState: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const token = formData.get('token') as string;
  if (!token) {
    return { success: false, message: 'Authentication required.', errors: { server: ['You must be logged in.'] } };
  }

  const validatedFields = profileSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors and try again.',
    };
  }

  try {
    const result = await apiFetch('/api/profile/update', token, {
      method: 'PUT',
      body: JSON.stringify(validatedFields.data),
    });

    if (!result.success) {
      throw new Error(result.message || 'Failed to update profile.');
    }

    return {
      success: true,
      message: result.message,
      updatedUser: result.data,
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error('Update profile error:', errorMessage);
    return {
      success: false,
      errors: { server: [errorMessage] },
      message: `Failed to update profile: ${errorMessage}`,
    };
  }
}
