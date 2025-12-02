'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { scaleIn } from '@/lib/animations';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ArrowRight } from 'lucide-react';
import type { Banner } from '@/lib/types';
import Link from 'next/link';

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const { ref, isVisible } = useScrollAnimation();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <motion.div
      ref={ref as any}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={scaleIn}
      className="w-full relative"
    >
      <Carousel
        plugins={[
          Autoplay({
            delay: 4000,
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
            const imageUrl =
              item.image && !item.image.startsWith('http')
                ? `${apiBaseUrl}${item.image}`
                : item.image;

            return (
              <CarouselItem key={item._id || index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="p-1"
                >
                  {/* ---- NORMAL, NON-TRANSPARENT CARD ---- */}
                  <Card className="border shadow-lg overflow-hidden rounded-3xl bg-white">
                    <CardContent className="relative h-80 p-0 overflow-hidden">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="h-full w-full"
                      >
                        {imageUrl && (
                          <Image
                            src={imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                          />
                        )}
                      </motion.div>

                      {/* ---- TEXT WITHOUT DARK GRADIENT ---- */}
                      <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-none p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {item.title}
                        </h3>

                        <Link
                          href={item.link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold shadow"
                          >
                            <span>Explore Now</span>
                            <ArrowRight className="h-5 w-5" />
                          </motion.button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* BUTTONS NORMAL (NO BLUR, NO TRANSPARENT) */}
        <CarouselPrevious className="-left-4 bg-white hover:bg-gray-100 shadow border rounded-full" />
        <CarouselNext className="-right-4 bg-white hover:bg-gray-100 shadow border rounded-full" />
      </Carousel>
    </motion.div>
  );
}
