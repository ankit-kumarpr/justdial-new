'use client';

import { notFound } from 'next/navigation';
import { JustdialHeader } from '@/components/justdial/JustdialHeader';
import { JustdialFooter } from '@/components/justdial/JustdialFooter';
import { RestaurantDetails } from '@/components/business/restaurant/RestaurantDetails';
import { HotelDetails } from '@/components/business/hotel/HotelDetails';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import type { Business, Hotel } from '@/lib/types';

export default function BusinessClientPage({
  business,
  hotel,
}: {
  business: Business | undefined;
  hotel: Hotel | undefined;
}) {
  if (!business && !hotel) {
    notFound();
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen"
    >
      <JustdialHeader />
      <FloatingButtons />

      {/* Animated background blobs */}
      <motion.div
        className="fixed top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="fixed bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <main className="container mx-auto px-4 py-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {business && business.category === 'restaurants' && <RestaurantDetails business={business} />}
          {hotel && <HotelDetails hotel={hotel} />}
        </motion.div>
      </main>

      <JustdialFooter />
    </motion.div>
  );
}
