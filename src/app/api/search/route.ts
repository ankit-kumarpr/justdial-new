
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Hardcoded static values for testing
  const keyword = "Best It firm";
  const latitude = "19.0760";
  const longitude = "72.8777";
  const radius = '15000';
  const page = '1';
  const limit = '20';

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    return NextResponse.json({ error: 'Backend API URL is not configured.' }, { status: 500 });
  }
  
  const searchUrl = `${apiBaseUrl}/api/lead/search-vendors?keyword=${keyword}&latitude=${latitude}&longitude=${longitude}&radius=${radius}&page=${page}&limit=${limit}`;

  try {
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch search results and could not parse error.' }));
        console.error('Backend search error:', errorData);
        return NextResponse.json({ error: errorData.message || 'Failed to fetch search results.' }, { status: response.status });
    }

    const data = await response.json();

    // Even if no vendors are found, the API might return success=true.
    // The response should be returned as is to the client.
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Search proxy error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
