'use client';
import { JustdialHeader } from '@/components/justdial/JustdialHeader';
import { JustdialFooter } from '@/components/justdial/JustdialFooter';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';

export default function BusinessPage() {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <JustdialHeader />
      <FloatingButtons />
      <main className="container mx-auto px-4 py-6 relative z-10">
        <div className="text-center py-20">
            <h1 className="text-2xl font-bold">Business Directory</h1>
            <p className="text-gray-600">Please select a business to view details.</p>
        </div>
      </main>
      <JustdialFooter />
    </div>
  );
}
