
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api-client';

const businessAddressSchema = z.object({
  businessPlotNo: z.string().optional(),
  businessBuildingName: z.string().optional(),
  businessStreet: z.string().optional(),
  businessLandmark: z.string().optional(),
  businessArea: z.string().optional(),
  businessPincode: z.string().min(6, "Pincode must be 6 digits.").max(6, "Pincode must be 6 digits."),
  businessCity: z.string().min(1, "City is required."),
  businessState: z.string().min(1, "State is required."),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

const personalAddressSchema = z.object({
  personalPlotNo: z.string().optional(),
  personalBuildingName: z.string().optional(),
  personalStreet: z.string().optional(),
  personalLandmark: z.string().optional(),
  personalArea: z.string().optional(),
  personalPincode: z.string().min(6, "Pincode must be 6 digits.").max(6, "Pincode must be 6 digits."),
  personalCity: z.string().min(1, "City is required."),
  personalState: z.string().min(1, "State is required."),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});


export type AddressFormState = {
  errors?: {
    [key: string]: string[] | undefined;
    server?: string[];
  };
  message?: string | null;
  success?: boolean;
};


export async function getBusinessAddress(businessId: string, token: string) {
    if (!businessId || !token) {
        return { data: null, error: 'Business ID and token are required.' };
    }

    try {
        const result = await apiFetch(`/api/vendor/profile/business/${businessId}`, token, { cache: 'no-store' });
        
        if (result.success && result.data && result.data.business) {
            const businessData = result.data.business;
            const address = businessData.address || {};
            const location = businessData.location || {}; 
            // Default to Mumbai if coordinates are missing or invalid
            const coordinates = location.coordinates && location.coordinates.length === 2 ? location.coordinates : [72.8777, 19.0760];

            const mappedData = {
                businessPlotNo: address.plotNo || '',
                businessBuildingName: address.buildingName || '',
                businessStreet: address.street || '',
                businessLandmark: address.landmark || '',
                businessArea: address.area || '',
                businessPincode: address.pincode || '',
                businessState: address.state || '',
                businessCity: address.city || '',
                // API provides [longitude, latitude]
                latitude: coordinates[1],
                longitude: coordinates[0],
            };
            return { data: mappedData, error: null };
        }
        
        return { data: null, error: result.message || 'Business profile not found.' };

    } catch (e: any) {
        if (e.message.includes('404')) {
            return { data: null, error: 'Business profile not found.' };
        }
        console.error("Error fetching business address:", e.message);
        return { data: null, error: e.message };
    }
}


export async function updateBusinessAddress(prevState: AddressFormState, formData: FormData): Promise<AddressFormState> {
  const businessId = formData.get('businessId') as string;
  const token = formData.get('token') as string;
  const userType = formData.get('userType') as 'individual' | 'vendor';

  if (!token) {
    return {
      errors: { server: ['Authentication token missing.'] },
      message: 'You must be logged in to update the address.',
    };
  }

  const rawData = Object.fromEntries(formData.entries());
  
  if (userType === 'individual') {
    const validatedFields = personalAddressSchema.safeParse(rawData);
    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Please correct the errors and try again.',
        };
    }
    const { personalPlotNo, personalBuildingName, personalStreet, personalLandmark, personalArea, personalPincode, personalCity, personalState, latitude, longitude } = validatedFields.data;
    const fullAddress = [personalPlotNo, personalBuildingName, personalStreet, personalLandmark, personalArea, personalCity, personalState, personalPincode].filter(Boolean).join(', ');
    
    const payload = { 
        personalAddress: {
            plotNo: personalPlotNo, 
            buildingName: personalBuildingName, 
            street: personalStreet, 
            landmark: personalLandmark, 
            area: personalArea, 
            pincode: personalPincode, 
            city: personalCity, 
            state: personalState,
            fullAddress: fullAddress
        },
        location: {
          type: "Point",
          coordinates: [longitude, latitude]
        }
    };
    
    try {
        const result = await apiFetch(`/api/kyc/personaladdress/${businessId}`, token, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
         if (!result.success) throw new Error(result.message || 'Failed to update personal address.');
        revalidatePath(`/business-dashboard/edit-business-address?id=${businessId}`);
        return { success: true, message: 'Personal address updated successfully!' };
    } catch (error) {
        const errorMessage = (error as Error).message;
        return { errors: { server: [errorMessage] }, message: `Failed to update address: ${errorMessage}` };
    }

  } else { // 'vendor'
    const validatedFields = businessAddressSchema.safeParse(rawData);
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Please correct the errors and try again.',
      };
    }
    const { businessPlotNo, businessBuildingName, businessStreet, businessLandmark, businessArea, businessPincode, businessCity, businessState, latitude, longitude } = validatedFields.data;
    const fullAddress = [businessPlotNo, businessBuildingName, businessStreet, businessLandmark, businessArea, businessCity, businessState, businessPincode].filter(Boolean).join(', ');
    
    const payload = { 
        businessPlotNo, 
        businessBuildingName, 
        businessStreet, 
        businessLandmark, 
        businessArea, 
        businessPincode, 
        businessCity, 
        businessState, 
        businessAddress: fullAddress, 
        longitude, 
        latitude 
    };

    try {
      await apiFetch(`/api/kyc/businessaddress/${businessId}`, token, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      revalidatePath(`/business-dashboard/edit-business-address?id=${businessId}`);
      
      return { 
          success: true, 
          message: 'Business address updated successfully!' 
      };

    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("Error updating business address:", errorMessage);
      return {
        errors: { server: [errorMessage] },
        message: `Failed to update address: ${errorMessage}`,
      };
    }
  }
}
