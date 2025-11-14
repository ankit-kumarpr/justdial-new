
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
import { cn } from '@/lib/utils';
import { Sparkles, Tag } from 'lucide-react';

export function OfferBannerCarousel({ banners, isLoading }: { banners: Banner[]; isLoading: boolean }) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="w-full">
            <Skeleton className="h-[240px] w-full rounded-2xl" />
        </div>
      </section>
    )
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  // Find the highest discount to display statically on the tag
  const highestDiscount = banners.reduce((max, banner) => {
    const currentDiscount = parseInt(String(banner.discount || banner.title?.match(/(\d+)%/)?.[1] || '80'), 10);
    return currentDiscount > max ? currentDiscount : max;
  }, 0);

  return (
    <motion.section 
      variants={staggerItem} 
      className="mb-12 mt-20 relative offer-banner-wrapper"
    >
        <div className="running-border rounded-3xl relative" style={{ overflow: 'visible' }}>
          {/* Discount Tag - Moved outside of the Carousel */}
          <motion.div 
            className="discount-tag"
            initial={{ scale: 0, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: -5 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.3 
            }}
            style={{ zIndex: 100 }}
          >
            <div className="flex flex-col items-center justify-center gap-2 relative z-50">
              <div className="discount-text text-5xl md:text-6xl font-black leading-none">
                {highestDiscount}%
              </div>
              <div className="discount-text text-sm md:text-base font-black uppercase tracking-widest">
                OFF
              </div>
            </div>
          </motion.div>

          <Carousel
              plugins={[
              Autoplay({
                  delay: 5000,
              }),
              ]}
              className="w-full overflow-hidden rounded-3xl" // Changed to overflow-hidden
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
                      className="p-0"
                  >
                      <Link href={item.link || '#'} target="_blank" rel="noopener noreferrer">
                          <div className="group relative overflow-hidden rounded-3xl" style={{ zIndex: 10 }}>
                              <Card className="border-0 shadow-2xl overflow-hidden group relative rounded-3xl transition-all duration-500 hover:shadow-3xl" style={{ zIndex: 5 }}>
                                  <CardContent className="relative h-[240px] p-0 overflow-hidden">
                                      {/* Image with enhanced effects */}
                                      <div className="h-full w-full relative">
                                        {imageUrl && (
                                          <>
                                            <Image
                                                src={imageUrl}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            {/* Gradient overlay for better text readability */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                                            {/* Animated shimmer effect on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                          </>
                                        )}
                                      </div>
                                      
                                      {/* Content overlay */}
                                      <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 text-white">
                                          <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="max-w-2xl"
                                          >
                                            <div className="flex items-center gap-2 mb-2">
                                              <Tag className="w-4 h-4" />
                                              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                                Limited Offer
                                              </span>
                                            </div>
                                            <h3 className="font-black text-2xl md:text-3xl lg:text-4xl drop-shadow-2xl mb-3 leading-tight">
                                              {item.title}
                                            </h3>
                                            <p className="text-sm md:text-base text-white/90 drop-shadow-lg mb-4 line-clamp-2">
                                              {item.description || "Don't miss out on this amazing deal!"}
                                            </p>
                                            <Button 
                                              size="lg" 
                                              className="mt-2 w-fit bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 border-0 group/btn"
                                            >
                                              <span className="flex items-center gap-2">
                                                Grab Offer Now
                                                <motion.span
                                                  animate={{ x: [0, 5, 0] }}
                                                  transition={{ repeat: Infinity, duration: 1.5 }}
                                                >
                                                  →
                                                </motion.span>
                                              </span>
                                            </Button>
                                          </motion.div>
                                      </div>
                                  </CardContent>
                              </Card>
                          </div>
                      </Link>
                  </motion.div>
                  </CarouselItem>
              )})}
              </CarouselContent>
          </Carousel>
        </div>
    </motion.section>
  );
}
