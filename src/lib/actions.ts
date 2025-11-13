'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const reviewSchema = z.object({
  businessId: z.string(),
  rating: z.coerce.number().min(1, { message: "Please select a rating." }),
  author: z.string().min(2, { message: "Name must be at least 2 characters." }),
  comment: z.string().min(10, { message: "Review must be at least 10 characters." }),
});

export type State = {
    errors?: {
        rating?: string[];
        author?: string[];
        comment?: string[];
    };
    message?: string | null;
    resetKey?: string;
}

export async function submitReview(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = reviewSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
    };
  }
  
  // In a real app, you would save this to a database
  console.log('New Review Submitted:', validatedFields.data);

  revalidatePath(`/business/${validatedFields.data.businessId}`);

  return {
    message: 'Thank you for your review!',
    resetKey: Date.now().toString(),
    errors: {}
  };
}