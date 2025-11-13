
'use server';

import { apiFetch } from '@/lib/api-client';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getHomePageData() {
  if (!apiBaseUrl) {
    console.error('Home page data fetch failed: Backend API URL is not configured.');
    return { data: null, error: 'Backend API URL is not configured.' };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/home`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch home page data and could not parse error.' }));
      console.error('Backend home page error:', errorData);
      throw new Error(errorData.message || 'Failed to fetch home page data.');
    }

    const result = await response.json();
    return { data: result.data, error: null };
  } catch (e) {
    console.error('Home page data fetch exception:', e);
    return { data: null, error: (e as Error).message };
  }
}
