
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/client';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const employeesSchema = z.object({
  businessId: z.string().min(1, "Business ID is required."),
  numberOfEmployees: z.string().min(1, "Please select the number of employees."),
});

export type EmployeesState = {
  errors?: {
    numberOfEmployees?: string[];
    server?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function updateEmployeeCount(prevState: EmployeesState, formData: FormData): Promise<EmployeesState> {
  const businessId = formData.get('businessId') as string;
  const validatedFields = employeesSchema.safeParse({
    businessId,
    numberOfEmployees: formData.get('employees'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please select an option.',
    };
  }
  
  const supabase = createSupabaseServerClient();
  
  try {
    const { error } = await supabase
      .from('vendors')
      .update({ numberOfEmployees: validatedFields.data.numberOfEmployees })
      .eq('id', businessId);

    if (error) throw error;

    revalidatePath(`/business-dashboard?id=${businessId}`);
    
    return { 
        success: true, 
        message: 'Number of employees updated successfully!' 
    };

  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Error updating employee count:", errorMessage);
    return {
      errors: { server: [errorMessage] },
      message: `Failed to update employee count: ${errorMessage}`,
    };
  }
}
