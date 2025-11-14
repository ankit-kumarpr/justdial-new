'use client';
import { JustdialHeader } from '@/components/justdial/JustdialHeader';
import { JustdialFooter } from '@/components/justdial/JustdialFooter';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';
import { findBusinessById } from '@/lib/data-synthesis';
import { BusinessDetails } from '@/components/business/restaurant/RestaurantDetails';
import { notFound, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

function BusinessPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  // In a real application, you would fetch business data from an API using the ID.
  // For now, we'll use the static data synthesis function.
  const business = id ? findBusinessById(id) : null;

  if (!business) {
    notFound();
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <JustdialHeader />
      <FloatingButtons />
      <main className="container mx-auto px-4 py-6 relative z-10 pt-24">
        <BusinessDetails business={business} />
      </main>
      <JustdialFooter />
    </div>
  );
}


export default function BusinessPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-12 w-12 animate-spin"/></div>}>
        <BusinessPageContent />
    </Suspense>
  )
}
