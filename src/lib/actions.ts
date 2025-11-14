
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { apiFetch } from './api-client';

const reviewSchema = z.object({
  businessId: z.string(),
  rating: z.coerce.number().min(1, { message: "Please select a rating." }),
  comment: z.string().min(10, { message: "Review must be at least 10 characters." }),
  token: z.string().min(1, { message: "Authentication required." }),
});

export type State = {
    errors?: {
        rating?: string[];
        comment?: string[];
        server?: string[];
    };
    message?: string | null;
    resetKey?: string;
    success?: boolean;
}

export async function submitReview(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = reviewSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
    };
  }
  
  const { businessId, rating, comment, token } = validatedFields.data;

  try {
    const result = await apiFetch(`/api/review/vendor/${businessId}`, token, {
        method: 'POST',
        body: JSON.stringify({ rating, comment }),
    });

    if (!result.success) {
      // Handle the specific error for already submitted reviews
      if (result.message && result.message.includes("already submitted")) {
        return {
          errors: { server: [result.message] },
          message: "You've already reviewed this vendor. You can edit your existing review.",
          success: false,
        };
      }
      throw new Error(result.message || 'Failed to submit review.');
    }

    revalidatePath(`/business/${businessId}`);
    revalidatePath(`/business-profile?id=${businessId}`);
    return {
      message: result.message || 'Thank you for your review!',
      resetKey: Date.now().toString(),
      success: true,
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return {
      errors: { server: [errorMessage] },
      message: `Failed to submit review: ${errorMessage}`,
      success: false,
    };
  }
}
