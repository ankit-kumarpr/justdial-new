
import { NextResponse } from 'next/server';

// This API route acts as a proxy to your backend.
// It takes a business ID, finds the vendor associated with it, and returns the full vendor profile.
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params; // This is the Business ID

  if (!id) {
    return NextResponse.json({ success: false, error: 'Business ID is required' }, { status: 400 });
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    return NextResponse.json({ success: false, error: 'Backend API URL is not configured.' }, { status: 500 });
  }
  
  // The API to get the full profile requires the VENDOR's ID, not the business ID.
  // So, first we fetch the business to find its owner's ID (userId).
  const businessDetailsUrl = `${apiBaseUrl}/api/vendor/business/${id}`;

  try {
    const businessResponse = await fetch(businessDetailsUrl, { cache: 'no-store' });
    if (!businessResponse.ok) {
        const errorData = await businessResponse.json().catch(() => null);
        console.error('Failed to fetch business to get vendor ID:', errorData);
        // If the business itself is not found, we return a 404
        if (businessResponse.status === 404) {
             return NextResponse.json({ success: false, error: 'Business not found.' }, { status: 404 });
        }
        return NextResponse.json({ success: false, error: 'Failed to find business owner.' }, { status: businessResponse.status });
    }

    const businessResult = await businessResponse.json();
    const vendorId = businessResult.data?.business?.userId;
    
    if (!vendorId) {
        return NextResponse.json({ success: false, error: 'Could not find a vendor associated with this business.' }, { status: 404 });
    }
    
    // Now that we have the vendorId, we can fetch the full profile.
    const fullProfileUrl = `${apiBaseUrl}/api/vendor/profile/getvendorprofile/${vendorId}`;
    const profileResponse = await fetch(fullProfileUrl, { cache: 'no-store' });
    
    if (!profileResponse.ok) {
      const errorData = await profileResponse.json().catch(() => ({ message: 'Failed to fetch full vendor profile.' }));
      console.error('Backend full profile fetch error:', errorData);
      return NextResponse.json({ success: false, error: errorData.message || 'Failed to fetch vendor profile.' }, { status: profileResponse.status });
    }

    const data = await profileResponse.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Business profile fetch proxy error:', error);
    return NextResponse.json({ success: false, error: 'An internal server error occurred.' }, { status: 500 });
  }
}
