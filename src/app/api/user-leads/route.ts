
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { apiFetch } from '@/lib/api-client';

export async function GET(request: Request) {
  const headersList = headers();
  const authorization = headersList.get('authorization');
  
  if (!authorization) {
    return NextResponse.json({ success: false, error: 'Authorization header is required.' }, { status: 401 });
  }
  
  const token = authorization.split(' ')[1];

  try {
    const result = await apiFetch('/api/lead/my-leads', token, { cache: 'no-store' });
    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('User leads proxy error:', error);
    const errorMessage = (error as Error).message;
    
    if (errorMessage.includes('token')) {
        return NextResponse.json({ success: false, error: errorMessage }, { status: 401 });
    }

    return NextResponse.json({ success: false, error: 'An internal server error occurred.' }, { status: 500 });
  }
}
