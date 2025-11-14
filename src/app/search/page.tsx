
import { Suspense } from 'react';
import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { FloatingButtons } from "@/components/justdial/FloatingButtons";
import { Loader2 } from "lucide-react";
import { SearchResultsPageClient } from '@/components/search/SearchResultsPageClient';
import { headers } from 'next/headers';
import type { Business } from '@/lib/types';

// This is now a Server Component that fetches data

async function getSearchResults(searchParams: { [key: string]: string | string[] | undefined }) {
  const query = searchParams.q || "";
  // For server-side rendering, we'll have to rely on a default or previously known location.
  // The client-side context can still refine location for subsequent client-side actions.
  const latitude = searchParams.latitude || '19.0760'; // Default to Mumbai
  const longitude = searchParams.longitude || '72.8777';

  if (!query) {
    return { results: [], error: null, query: '', city: 'your area' };
  }

  // To build the full URL for server-side fetch, we need the host.
  const host = headers().get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  try {
    const response = await fetch(`${baseUrl}/api/search?keyword=${encodeURIComponent(query as string)}&latitude=${latitude}&longitude=${longitude}`, { cache: 'no-store' });
    
    // The response body can only be consumed once, so we do it here.
    const result = await response.json();

    if (!response.ok) {
      // Handle network errors (e.g., 500, 404 from the Next.js route handler itself)
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }
    
    if (result.success === false) {
      // Handle application-level errors from the backend API
      throw new Error(result.message || result.error || 'API returned an error but did not provide a message.');
    }

    return { 
      results: (result.data?.vendors || []) as Business[], 
      error: null, 
      query: query as string, 
      city: result.data?.userLocation?.city || 'your area' 
    };
  } catch (e) {
    console.error("Server-side search fetch error:", e);
    return { results: [], error: (e as Error).message, query: query as string, city: 'your area' };
  }
}

async function SearchPageComponent({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const { results, error, query, city } = await getSearchResults(searchParams);
  
  return (
    <>
      <SearchResultsPageClient 
        initialResults={results} 
        initialError={error} 
        query={query}
        city={city}
      />
    </>
  );
}

// The main export is still a default function that wraps the Server Component in Suspense
export default function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <JustdialHeader />
      <FloatingButtons />
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center text-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Loading search results...</p>
        </div>
      }>
        <SearchPageComponent searchParams={searchParams} />
      </Suspense>
      <JustdialFooter />
    </div>
  )
}
