
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');
  const radius = searchParams.get('radius') || '15000'; // Default to 15km
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '20';

  if (!keyword || !latitude || !longitude) {
    return NextResponse.json({ error: 'Missing required parameters: keyword, latitude, longitude' }, { status: 400 });
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    return NextResponse.json({ error: 'Backend API URL is not configured.' }, { status: 500 });
  }
  
  const searchUrl = `${apiBaseUrl}/api/lead/search-vendors?keyword=${encodeURIComponent(keyword)}&latitude=${latitude}&longitude=${longitude}&radius=${radius}&page=${page}&limit=${limit}`;

  try {
    const response = await fetch(searchUrl, { cache: 'no-store' }); // Disable caching for dynamic search
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch search results and could not parse error.' }));
        console.error('Backend search error:', errorData);
        return NextResponse.json({ error: errorData.message || 'Failed to fetch search results.' }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Search proxy error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
