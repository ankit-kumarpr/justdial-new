
import { JustdialHeader } from '@/components/justdial/JustdialHeader';
import { JustdialFooter } from '@/components/justdial/JustdialFooter';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';
import { BusinessProfileDetails } from '@/components/business/BusinessProfileDetails';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import type { Business } from '@/lib/types';
import { headers } from 'next/headers';

async function getBusinessData(id: string): Promise<Business | null> {
  const host = headers().get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  if (!id) {
    console.error('Business ID is required.');
    return null;
  }
  
  const businessUrl = `${baseUrl}/api/business/${id}`;

  try {
    const response = await fetch(businessUrl, { 
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Failed to fetch business with status ${response.status}:`, await response.text());
      return null;
    }
    
    const result = await response.json();
    
    if (result.success && result.data && result.data.businesses) {
      // Find the specific business from the list of businesses returned for the vendor
      const businessData = result.data.businesses.find((b: any) => b._id === id);

      if (!businessData) {
        console.error(`Business with ID ${id} not found in the vendor's list of businesses.`);
        return null;
      }
      
      const vendorProfile = result.data.vendorProfile || {};
      const reviewsData = result.data.reviews || { latestReviews: [] };
      // The services array is at the root of the data object.
      const servicesData = result.data.services || [];

      // Combine data into a single Business object for the page
      const combinedData: Business = {
        ...businessData,
        id: businessData._id,
        name: businessData.businessName,
        businessPhotos: vendorProfile.businessPhotos || [],
        businessVideo: vendorProfile.businessVideo,
        socialMediaLinks: vendorProfile.socialMediaLinks,
        website: vendorProfile.website,
        services: servicesData,
        totalServices: result.data.totalServices,
        reviews: reviewsData.latestReviews,
        rating: reviewsData.averageRating,
        vendor: result.data.user,
      };

      return combinedData;
    } else {
        console.error("API call was not successful or data structure is wrong:", result);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching business data:', error);
    return null;
  }
}

async function BusinessProfilePageContent({ id }: { id: string }) {
  const business = await getBusinessData(id);

  if (!business) {
    notFound();
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <JustdialHeader />
      <FloatingButtons />
      <main className="container mx-auto px-4 py-6 relative z-10 pt-24">
        <BusinessProfileDetails business={business} />
      </main>
      <JustdialFooter />
    </div>
  );
}

export default function BusinessProfilePage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const id = searchParams.id;

  if (!id) {
    notFound();
  }

  return (
    <Suspense 
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      }
    >
      <BusinessProfilePageContent id={id} />
    </Suspense>
  );
}
