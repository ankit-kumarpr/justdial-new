
'use server';

import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/client';
import bcrypt from 'bcryptjs';

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
  token: z.string().min(1, { message: 'Reset token is missing.' }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ['confirmPassword'], // Set the error on the confirmation field
});

export type ResetPasswordState = {
  token?: string;
  errors?: {
    password?: string[];
    confirmPassword?: string[];
    server?: string[];
  };
  message?: string | null;
};

export async function resetPassword(prevState: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> {
  const validatedFields = resetPasswordSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
    };
  }

  const { password, token } = validatedFields.data;
  const supabase = createSupabaseServerClient();

  try {
    const { data: tokenData, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('email, expiresAt')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      return {
        errors: { server: ['Invalid or expired password reset link.'] },
        message: 'This password reset link is not valid. Please request a new one.',
      };
    }
    
    if (new Date(tokenData.expiresAt) < new Date()) {
       return {
        errors: { server: ['The password reset link has expired.'] },
        message: 'This password reset link has expired. Please request a new one.',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('email', tokenData.email);

    if (updateError) {
      throw updateError;
    }

    // Delete the token so it can't be used again
    await supabase.from('password_reset_tokens').delete().eq('token', token);
    
    return {
      message: 'Your password has been successfully reset! You can now log in.',
    };

  } catch (error) {
    console.error('Reset password error:', error);
    const errorMessage = (error as Error).message;
    return {
      errors: { server: [errorMessage] },
      message: `Failed to reset password: ${errorMessage}`,
    };
  }
}
