
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Vendor } from '@/lib/types';
import { apiFetch } from '@/lib/api-client';

const fileSchema = z.instanceof(File).optional();

const contactAndTimingsSchema = {
    contactPersonTitle: z.string().optional(),
    contactPersonName: z.string().min(2, "Contact person name is required."),
    primaryMobileNumber: z.string().regex(/^\d{10}$/, "A 10-digit mobile number is required."),
    whatsappNumber: z.string().regex(/^\d{10}$/, "A 10-digit WhatsApp number is required.").optional().or(z.literal('')),
    email: z.string().email("Invalid email address."),
    aadharNumber: z.string().length(12, "Aadhar number must be 12 digits."),
    aadharImage: fileSchema,
    videoKyc: fileSchema,
    workingDays: z.array(z.string()).min(1, "Select at least one working day."),
    openTime: z.string().min(1, "Opening time is required."),
    closingTime: z.string().min(1, "Closing time is required."),
};

const vendorSchema = z.object({
    userType: z.literal('vendor'),
    businessName: z.string().min(2, "Business name is required."),
    gstNumber: z.string().min(15, "Valid GST number is required.").optional().or(z.literal('')),
    businessPlotNo: z.string().optional(),
    businessBuildingName: z.string().optional(),
    businessStreet: z.string().optional(),
    businessLandmark: z.string().optional(),
    businessArea: z.string().optional(),
    businessPincode: z.string().length(6, "Pincode must be 6 digits."),
    businessCity: z.string().min(1, "City is required."),
    businessState: z.string().min(1, "State is required."),
    ...contactAndTimingsSchema
}).refine(data => data.openTime < data.closingTime, {
  message: "Closing time must be after opening time.",
  path: ["closingTime"],
});

const individualSchema = z.object({
    userType: z.literal('individual'),
    personalPlotNo: z.string().optional(),
    personalBuildingName: z.string().optional(),
    personalStreet: z.string().optional(),
    personalLandmark: z.string().optional(),
    personalArea: z.string().optional(),
    personalPincode: z.string().length(6, "Pincode must be 6 digits."),
    personalCity: z.string().min(1, "City is required."),
    personalState: z.string().min(1, "State is required."),
    ...contactAndTimingsSchema
}).refine(data => data.openTime < data.closingTime, {
    message: "Closing time must be after opening time.",
    path: ["closingTime"],
});

const formSchema = z.discriminatedUnion("userType", [vendorSchema, individualSchema]);

const locationSchema = z.object({
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
});


export type RegisterState = {
  errors?: z.ZodError<any>['formErrors']['fieldErrors'];
  message?: string | null;
};

export async function register(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const token = formData.get('token') as string;
  if (!token) {
    return { message: 'Authentication required.', errors: { server: ['You must be logged in.'] } };
  }

  const rawData: any = {};
  for (const [key, value] of formData.entries()) {
      if (key === 'workingDays') {
          rawData[key] = JSON.parse(value as string || '[]');
      } else if (key !== 'aadharImage' && key !== 'videoKyc') {
          rawData[key] = value;
      }
  }
  
  const validatedFields = formSchema.safeParse(rawData);
  const validatedLocation = locationSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    console.error("Form validation errors:", validatedFields.error.flatten());
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors.',
    };
  }
  
  if (!validatedLocation.success) {
    console.error("Location validation errors:", validatedLocation.error.flatten());
    return {
        errors: validatedLocation.error.flatten().fieldErrors,
        message: 'Invalid location data. Please select a location on the map.'
    };
  }

  const apiFormData = new FormData();
  
  // Common fields for both vendor and individual
  const data = validatedFields.data;
  apiFormData.append('title', data.contactPersonTitle || 'Mr');
  apiFormData.append('contactPerson', data.contactPersonName);
  apiFormData.append('mobileNumber', data.primaryMobileNumber);
  apiFormData.append('email', data.email);
  apiFormData.append('workingDays', JSON.stringify(data.workingDays));
  apiFormData.append('businessHoursOpen', data.openTime);
  apiFormData.append('businessHoursClose', data.closingTime);
  apiFormData.append('aadharNumber', data.aadharNumber);
  if (data.whatsappNumber) {
    apiFormData.append('whatsappNumber', data.whatsappNumber);
  }

  // Location fields (Mandatory)
  apiFormData.append('latitude', validatedLocation.data.latitude.toString());
  apiFormData.append('longitude', validatedLocation.data.longitude.toString());
  
  // Type-specific fields
  if (data.userType === 'vendor') {
    apiFormData.append('businessName', data.businessName);
    apiFormData.append('gstNumber', data.gstNumber || '');
    apiFormData.append('businessPlotNo', data.businessPlotNo || '');
    apiFormData.append('businessBuildingName', data.businessBuildingName || '');
    apiFormData.append('businessStreet', data.businessStreet || '');
    apiFormData.append('businessLandmark', data.businessLandmark || '');
    apiFormData.append('businessArea', data.businessArea || '');
    apiFormData.append('businessPincode', data.businessPincode);
    apiFormData.append('businessCity', data.businessCity);
    apiFormData.append('businessState', data.businessState);
    const businessAddress = [data.businessPlotNo, data.businessBuildingName, data.businessStreet, data.businessLandmark, data.businessArea, data.businessCity, data.businessState, data.businessPincode].filter(Boolean).join(', ');
    apiFormData.append('businessAddress', businessAddress);

  } else { // individual
    apiFormData.append('businessName', data.contactPersonName); // Using contact name as business name
    apiFormData.append('gstNumber', ''); // GST is not for individuals
    apiFormData.append('personalPlotNo', data.personalPlotNo || '');
    apiFormData.append('personalBuildingName', data.personalBuildingName || '');
    apiFormData.append('personalStreet', data.personalStreet || '');
    apiFormData.append('personalLandmark', data.personalLandmark || '');
    apiFormData.append('personalArea', data.personalArea || '');
    apiFormData.append('personalPincode', data.personalPincode);
    apiFormData.append('personalCity', data.personalCity);
    apiFormData.append('personalState', data.personalState);
    const personalAddress = [data.personalPlotNo, data.personalBuildingName, data.personalStreet, data.personalLandmark, data.personalArea, data.personalCity, data.personalState, data.personalPincode].filter(Boolean).join(', ');
    apiFormData.append('personalAddress', personalAddress);
  }
  
  // File fields
  const aadharImageFile = formData.get('aadharImage') as File;
  if (aadharImageFile && aadharImageFile.size > 0) {
      apiFormData.append('aadharImage', aadharImageFile);
  }

  const videoKycFile = formData.get('videoKyc') as File;
  if (videoKycFile && videoKycFile.size > 0) {
      apiFormData.append('videoKyc', videoKycFile);
  }

  try {
    await apiFetch('/api/kyc/submit', token, {
        method: 'POST',
        body: apiFormData,
    }, true);
    
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
        latitude: vendorData.location?.coordinates[1] || null,
        longitude: vendorData.location?.coordinates[0] || null,
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
