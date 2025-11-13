
'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { staggerItem } from '@/lib/animations';
import type { Banner } from '@/lib/types';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';

export function OfferBannerCarousel({ banners, isLoading }: { banners: Banner[]; isLoading: boolean }) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="w-full">
            <Skeleton className="h-[200px] w-full rounded-2xl" />
        </div>
      </section>
    )
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <motion.section variants={staggerItem} className="mb-8">
      <Carousel
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full"
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {banners.map((item, index) => {
            const imageUrl = item.image && !item.image.startsWith('http') ? `${apiBaseUrl}${item.image}` : item.image;
            return (
            <CarouselItem key={item._id || index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="p-1"
              >
                <Link href={item.link || '#'} target="_blank" rel="noopener noreferrer">
                  <Card className="border-0 shadow-lg overflow-hidden rounded-2xl group relative hover-lift">
                    <CardContent className="relative h-[200px] p-0 overflow-hidden">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="h-full w-full"
                      >
                        {imageUrl && <Image
                          src={imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />}
                      </motion.div>
                       <div className="absolute inset-0 bg-black/30 flex flex-col justify-center p-6 text-white">
                            <h3 className="font-bold text-xl drop-shadow-md">{item.title}</h3>
                            {/* You can add a description field to your banner data if needed */}
                            {/* <p className="text-sm max-w-sm text-white/90 drop-shadow">A short description here.</p> */}
                            <Button size="sm" className="mt-3 w-fit bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30">
                              Learn More &gt;
                            </Button>
                        </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            </CarouselItem>
          )})}
        </CarouselContent>
      </Carousel>
    </motion.section>
  );
}
