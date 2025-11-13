
'use server';

import { z } from 'zod';
import { sendEmail } from '@/lib/email';
import { createSupabaseServerClient } from '@/lib/supabase/client';
import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export type ForgotPasswordState = {
  errors?: {
    email?: string[];
    server?: string[];
  };
  message?: string | null;
};

export async function forgotPassword(prevState: ForgotPasswordState, formData: FormData): Promise<ForgotPasswordState> {
  const validatedFields = forgotPasswordSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid email address.',
    };
  }

  const { email } = validatedFields.data;
  const supabase = createSupabaseServerClient();

  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name')
      .eq('email', email)
      .single();

    if (userError || !user) {
      // Return a generic message to prevent user enumeration attacks
      return {
        message: 'If an account with this email exists, a password reset link has been sent.',
      };
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    const { error: tokenInsertError } = await supabase
        .from('password_reset_tokens')
        .insert({
            id: uuidv4(),
            email: email,
            token: resetToken,
            expiresAt: resetTokenExpiry.toISOString(),
        });
    
    if (tokenInsertError) {
        throw tokenInsertError;
    }


    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: email,
      subject: 'Your Password Reset Link for Gnetdial',
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    return {
      message: 'If an account with this email exists, a password reset link has been sent.',
    };

  } catch (error) {
    console.error("Forgot password error:", error);
    const errorMessage = (error as Error).message;
    return {
      errors: { server: [errorMessage] },
      message: `Failed to process password reset request: ${errorMessage}`,
    };
  }
}
