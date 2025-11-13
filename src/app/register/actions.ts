
'use server';

import { z } from 'zod';
import { welcomeForUserTemplate, sendEmail } from '@/lib/email';
import { createSupabaseServerClient } from '@/lib/supabase/client';
import bcrypt from 'bcryptjs';
import { apiFetch } from '@/lib/api-client';

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
  cpassword: z.string().min(6, { message: "Password must be at least 6 characters long." }),
}).refine(data => data.password === data.cpassword, {
  message: "Passwords do not match",
  path: ["cpassword"],
});


const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits." }),
  email: z.string().email(),
  // The following fields are no longer needed for the API call but are kept for context if needed
  name: z.string(),
  phone: z.string(),
  hashedPassword: z.string(),
  generatedOtp: z.string(),
  userId: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  streetAddress: z.string().optional(),
  pincode: z.string().optional(),
});

export type UserData = {
    name: string;
    email: string;
    phone: string;
    hashedPassword: string;
    generatedOtp: string;
    userId?: string;
}
export type RegisterState = {
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    password?: string[];
    cpassword?: string[];
    server?: string[];
  };
  message?: string | null;
  requiresOtp?: boolean;
  userData?: UserData;
};

export type OtpState = {
  errors?: {
    otp?: string[];
    server?: string[];
  };
  message?: string | null;
}

export async function register(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    password: formData.get('password'),
    cpassword: formData.get('confirmPassword'),
  };
  const validatedFields = registerSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
    };
  }
  
  const { name, email, phone, password, cpassword } = validatedFields.data;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password, cpassword }),
    });

    const result = await response.json();

    if (!response.ok) {
        // Use the message from the API response if available, otherwise a generic error
        throw new Error(result.message || 'An unknown error occurred during registration.');
    }
    
    // The backend now sends the OTP. We'll pass the necessary data to the next step.
    const hashedPassword = await bcrypt.hash(password, 10);
    return { 
        message: result.message,
        requiresOtp: true,
        userData: { 
          name, 
          email, 
          phone, 
          hashedPassword, 
          generatedOtp: '', // OTP is sent by backend, not generated here
          userId: result.userId 
        }
    };

  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = (error as Error).message;
    return {
      errors: { server: [errorMessage] },
      message: `Registration failed: ${errorMessage}`,
    };
  }
}

export async function verifyOtpAndCreateUser(prevState: OtpState, formData: FormData): Promise<OtpState> {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const rawData = {
        otp: formData.get('otp'),
        email: formData.get('email'),
        latitude: formData.get('latitude'),
        longitude: formData.get('longitude'),
        city: formData.get('city'),
        streetAddress: formData.get('streetAddress'),
        pincode: formData.get('pincode'),
        state: formData.get('state'),
    };
    
    const verifySchema = z.object({
        otp: z.string().length(6, { message: "OTP must be 6 digits." }),
        email: z.string().email(),
        latitude: z.coerce.number(),
        longitude: z.coerce.number(),
        city: z.string().optional(),
        streetAddress: z.string().optional(),
        pincode: z.string().optional(),
        state: z.string().optional(),
    });

    const validatedFields = verifySchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid OTP or location submission.',
        };
    }

    const { email, otp, latitude, longitude, city, streetAddress, pincode, state } = validatedFields.data;

    try {
        const verifyResponse = await fetch(`${apiBaseUrl}/api/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
        });

        const verifyResult = await verifyResponse.json();

        if (!verifyResponse.ok || !verifyResult.success) {
            throw new Error(verifyResult.message || 'OTP verification failed.');
        }

        const accessToken = verifyResult.data.accessToken;

        // If OTP is correct, add location
        if (latitude && longitude && accessToken) {
             try {
                await apiFetch('/api/auth/add-location', accessToken, {
                    method: 'POST',
                    body: JSON.stringify({ latitude, longitude, city, streetAddress, pincode, state }),
                });
                console.log("User location saved successfully after registration.");
            } catch (locationError) {
                console.error("Failed to save user location after registration:", locationError);
                // We don't fail the whole registration for this, just log it.
            }
        }

        return { message: verifyResult.message || 'Registration successful! You can now log in.' };

    } catch (error) {
        console.error('OTP verification/location add error:', error);
        const errorMessage = (error as Error).message;
        return {
            errors: { server: [errorMessage] },
            message: `Could not complete registration: ${errorMessage}`,
        };
    }
}
