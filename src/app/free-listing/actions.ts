
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Vendor } from '@/lib/types';
import { apiFetch } from '@/lib/api-client';

const fileSchema = z.instanceof(File).refine(file => file.size > 0, "File is required.").optional();

const baseFormSchema = z.object({
    userId: z.string().optional(),
    businessName: z.string().min(2, "Business name is required."),
    gstNumber: z.string().min(15, "Valid GST number is required."),
    plotNo: z.string().optional(),
    buildingName: z.string().optional(),
    street: z.string().optional(),
    landmark: z.string().optional(),
    area: z.string().optional(),
    pincode: z.string().length(6, "Pincode must be 6 digits."),
    city: z.string().min(1, "City is required."),
    state: z.string().min(1, "State is required."),
    contactPersonTitle: z.string().optional(),
    contactPersonName: z.string().min(2, "Contact person name is required."),
    primaryMobileNumber: z.string().regex(/^\d{10}$/, "A 10-digit mobile number is required."),
    whatsappNumber: z.string().regex(/^\d{10}$/, "A 10-digit WhatsApp number is required.").optional().or(z.literal('')),
    email: z.string().email("Invalid email address."),
    workingDays: z.array(z.string()).min(1, "Select at least one working day."),
    openTime: z.string().min(1, "Opening time is required."),
    closingTime: z.string().min(1, "Closing time is required."),
});

const createFormSchema = baseFormSchema.extend({
    aadharNumber: z.string().length(12, "Aadhar number must be 12 digits."),
    aadharImage: fileSchema,
    videoKyc: fileSchema,
});

const updateFormSchema = baseFormSchema.extend({
  id: z.string(),
});


export type RegisterState = {
  errors?: z.ZodError<any>['formErrors']['fieldErrors'];
  message?: string | null;
};

export async function register(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  
  const validatedFields = createFormSchema.safeParse({
    userId: formData.get('userId'),
    businessName: formData.get('businessName'),
    gstNumber: formData.get('gstNumber'),
    plotNo: formData.get('plotNo'),
    buildingName: formData.get('buildingName'),
    street: formData.get('street'),
    landmark: formData.get('landmark'),
    area: formData.get('area'),
    pincode: formData.get('pincode'),
    city: formData.get('city'),
    state: formData.get('state'),
    contactPersonTitle: formData.get('contactPersonTitle'),
    contactPersonName: formData.get('contactPersonName'),
    primaryMobileNumber: formData.get('primaryMobileNumber'),
    whatsappNumber: formData.get('whatsappNumber'),
    email: formData.get('email'),
    workingDays: JSON.parse(formData.get('workingDays') as string || '[]'),
    openTime: formData.get('openTime'),
    closingTime: formData.get('closingTime'),
    aadharNumber: formData.get('aadharNumber'),
    aadharImage: formData.get('aadharImage'),
    videoKyc: formData.get('videoKyc'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors.',
    };
  }

  const token = formData.get('token') as string;

  if (!token) {
    return { message: 'Authentication required.', errors: { server: ['You must be logged in.'] } };
  }

  const apiFormData = new FormData();
    apiFormData.append('businessName', validatedFields.data.businessName);
    apiFormData.append('pincode', validatedFields.data.pincode);
    apiFormData.append('state', validatedFields.data.state);
    apiFormData.append('city', validatedFields.data.city);
    apiFormData.append('title', validatedFields.data.contactPersonTitle || 'Mr');
    apiFormData.append('contactPerson', validatedFields.data.contactPersonName);
    apiFormData.append('mobileNumber', validatedFields.data.primaryMobileNumber);
    apiFormData.append('email', validatedFields.data.email);
    apiFormData.append('workingDays', JSON.stringify(validatedFields.data.workingDays));
    apiFormData.append('businessHoursOpen', validatedFields.data.openTime);
    apiFormData.append('businessHoursClose', validatedFields.data.closingTime);
    apiFormData.append('aadharNumber', validatedFields.data.aadharNumber);
    apiFormData.append('gstNumber', validatedFields.data.gstNumber);
    apiFormData.append('plotNo', validatedFields.data.plotNo || '');
    apiFormData.append('buildingName', validatedFields.data.buildingName || '');
    apiFormData.append('street', validatedFields.data.street || '');
    apiFormData.append('landmark', validatedFields.data.landmark || '');
    apiFormData.append('area', validatedFields.data.area || '');
    apiFormData.append('whatsappNumber', validatedFields.data.whatsappNumber || '');
    if (validatedFields.data.aadharImage) {
        apiFormData.append('aadharImage', validatedFields.data.aadharImage);
    }
    if (validatedFields.data.videoKyc) {
        apiFormData.append('videoKyc', validatedFields.data.videoKyc);
    }

  try {
    await apiFetch('/api/kyc/submit', token, {
        method: 'POST',
        body: apiFormData,
        isFormData: true,
    });
    
    revalidatePath('/my-business');
    return { message: 'Business listing submitted successfully!' };

  } catch (error) {
    const errorMessage = (error as Error).message;
    return {
      errors: { server: [errorMessage] },
      message: `Submission failed: ${errorMessage}`,
    };
  }
}


export async function updateKyc(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const vendorId = formData.get('id');

  const validatedFields = updateFormSchema.safeParse({
    id: formData.get('id'),
    userId: formData.get('userId'),
    businessName: formData.get('businessName'),
    gstNumber: formData.get('gstNumber'),
    plotNo: formData.get('plotNo'),
    buildingName: formData.get('buildingName'),
    street: formData.get('street'),
    landmark: formData.get('landmark'),
    area: formData.get('area'),
    pincode: formData.get('pincode'),
    city: formData.get('city'),
    state: formData.get('state'),
    contactPersonTitle: formData.get('contactPersonTitle'),
    contactPersonName: formData.get('contactPersonName'),
    primaryMobileNumber: formData.get('primaryMobileNumber'),
    whatsappNumber: formData.get('whatsappNumber'),
    email: formData.get('email'),
    workingDays: JSON.parse(formData.get('workingDays') as string || '[]'),
    openTime: formData.get('openTime'),
    closingTime: formData.get('closingTime'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors.',
    };
  }
  
  const token = formData.get('token') as string;

  if (!token) {
    return { message: 'Authentication required.', errors: { server: ['You must be logged in.'] } };
  }

   try {
    await apiFetch(`/api/kyc/update/${vendorId}`, token, {
        method: 'PUT',
        body: JSON.stringify(validatedFields.data),
    });

    revalidatePath('/my-business');
    revalidatePath(`/business-dashboard?id=${vendorId}`);
    return { message: 'Business details updated successfully!' };

  } catch (error) {
    const errorMessage = (error as Error).message;
    return {
      errors: { server: [errorMessage] },
      message: `Update failed: ${errorMessage}`,
    };
  }
}

export async function getVendorDetails(vendorId: string | null, token: string | null) {
  if (!vendorId || !token) {
    return { data: null, error: 'Vendor ID or token is missing.' };
  }

  try {
    const result = await apiFetch('/api/kyc/my-kyc', token, { cache: 'no-store' });
    const vendorData = result.data.find((v: any) => v._id === vendorId);
    
    if (!vendorData) {
        return { data: null, error: 'Vendor not found in your list.' };
    }
    
    const mappedData = {
        id: vendorData._id,
        businessName: vendorData.businessName,
        gstNumber: vendorData.gstNumber,
        plotNo: vendorData.plotNo,
        buildingName: vendorData.buildingName,
        street: vendorData.street,
        landmark: vendorData.landmark,
        area: vendorData.area,
        pincode: vendorData.pincode,
        city: vendorData.city,
        state: vendorData.state,
        contactPersonTitle: vendorData.title,
        contactPersonName: vendorData.contactPerson,
        primaryMobileNumber: vendorData.mobileNumber,
        whatsappNumber: vendorData.whatsappNumber,
        email: vendorData.email,
        workingDays: vendorData.workingDays,
        openTime: vendorData.businessHoursOpen,
        closingTime: vendorData.businessHoursClose,
        aadharNumber: vendorData.aadharNumber,
    };

    return { data: mappedData, error: null };
  } catch (e: any) {
    console.error("Error fetching vendor details:", e.message);
    return { data: null, error: e.message };
  }
}
