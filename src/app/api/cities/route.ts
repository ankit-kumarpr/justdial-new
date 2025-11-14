
import { NextResponse } from 'next/server';

const CITIES_API_URL = 'https://countriesnow.space/api/v0.1/countries/cities';

// Cache the cities list to avoid fetching on every request.
let citiesCache: string[] | null = null;
let lastFetchTime: number | null = null;
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

async function fetchCities() {
    console.log("Fetching cities from external API...");
    try {
        const response = await fetch(CITIES_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: 'India' }),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch cities: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.msg || 'API returned an error.');
        }

        citiesCache = data.data;
        lastFetchTime = Date.now();
        console.log(`Successfully fetched and cached ${citiesCache?.length} cities.`);
        return citiesCache;

    } catch (error) {
        console.error('Error fetching cities:', error);
        // In case of an error, don't update the cache, just return null
        return null;
    }
}


export async function GET() {
  const now = Date.now();
  // If cache is empty or stale, re-fetch
  if (!citiesCache || !lastFetchTime || (now - lastFetchTime > CACHE_DURATION)) {
    await fetchCities();
  }

  if (citiesCache) {
      return NextResponse.json({ cities: citiesCache });
  } else {
      return NextResponse.json({ error: 'Could not retrieve city data.' }, { status: 500 });
  }
}
