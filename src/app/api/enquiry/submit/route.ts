
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { apiFetch } from '@/lib/api-client';

export async function POST(request: Request) {
  const headersList = headers();
  const authorization = headersList.get('authorization');
  
  if (!authorization) {
    return NextResponse.json({ error: 'Authorization header is required.' }, { status: 401 });
  }
  
  const token = authorization.split(' ')[1];

  try {
    const body = await request.json();
    
    // Validate required fields from the original request
    if (!body.searchKeyword || !body.description || !body.location?.latitude || !body.location?.longitude) {
        return NextResponse.json({ error: 'Missing required fields: searchKeyword, description, or location coordinates.' }, { status: 400 });
    }

    // Construct the payload exactly as the backend expects it
    const payload = {
      searchKeyword: body.searchKeyword,
      description: body.description,
      location: {
        longitude: body.location.longitude,
        latitude: body.location.latitude,
        address: body.location.address || "Not provided",
        city: body.location.city || "Unknown",
        state: body.location.state || "Unknown",
        pincode: body.location.pincode || "000000"
      },
      radius: body.radius || 15000
    };

    const data = await apiFetch('/api/lead/submit', token, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    
    return NextResponse.json(data);

  } catch (error) {
    console.error('Enquiry proxy error:', error);
    const errorMessage = (error as Error).message;
    
    // Determine the status code based on the error message
    let statusCode = 500;
    if (errorMessage.includes('token') || errorMessage.includes('Authentication')) {
        statusCode = 401;
    } else if (errorMessage.includes('not found')) {
        statusCode = 404;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
