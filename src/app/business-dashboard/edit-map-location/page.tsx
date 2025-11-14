
'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// This component uses the hook and will be wrapped in Suspense
function DeprecatedMapPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const businessId = searchParams.get('id');

  useEffect(() => {
    // Redirect to the new unified address editing page, preserving the business ID.
    if (businessId) {
      router.replace(`/business-dashboard/edit-business-address?id=${businessId}`);
    } else {
      // Fallback to the main dashboard if no ID is present
      router.replace('/business-dashboard');
    }
  }, [router, businessId]);
  
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Redirecting to address editor...</p>
    </div>
  );
}

// This page is now deprecated and redirects to the new unified address page.
export default function DeprecatedMapPage() {
    return (
        <Suspense fallback={
            <div className="h-screen w-full flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Loading...</p>
            </div>
        }>
            <DeprecatedMapPageComponent />
        </Suspense>
    )
}
