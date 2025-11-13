
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
import { ArrowRight, Star } from 'lucide-react';
import type { Banner } from '@/lib/types';
import Link from 'next/link';

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const { ref, isVisible } = useScrollAnimation();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!banners || banners.length === 0) {
    return null; // Or a placeholder
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
            const imageUrl = item.image && !item.image.startsWith('http') ? `${apiBaseUrl}${item.image}` : item.image;
            return (
              <CarouselItem key={item._id || index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="p-1"
                >
                  <Card className="border-0 shadow-2xl overflow-hidden rounded-3xl group relative hover-lift">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                    
                    <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary animate-gradient" style={{ padding: '2px', borderRadius: '24px' }}>
                        <div className="w-full h-full bg-white rounded-3xl" />
                      </div>
                    </div>

                    <CardContent className="relative h-80 p-0 overflow-hidden">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full w-full"
                      >
                        {imageUrl && <Image
                          src={imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                          priority={index === 0}
                        />}
                      </motion.div>

                      <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                            {item.title}
                          </h3>
                          
                          <Link href={item.link || '#'} target="_blank" rel="noopener noreferrer">
                            <motion.button
                              whileHover={{ scale: 1.05, x: 5 }}
                              whileTap={{ scale: 0.95 }}
                              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group/btn w-fit"
                            >
                              <span>Explore Now</span>
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                              </motion.div>
                            </motion.button>
                          </Link>
                        </motion.div>
                      </div>

                      <div className="absolute top-4 right-4 w-20 h-20 border-4 border-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-4 left-4 w-16 h-16 border-4 border-white/30 rounded-lg rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <CarouselPrevious className="-left-4 bg-white/90 backdrop-blur-sm hover:bg-white shadow-xl border-0 hover:scale-110 transition-all" />
          <CarouselNext className="-right-4 bg-white/90 backdrop-blur-sm hover:bg-white shadow-xl border-0 hover:scale-110 transition-all" />
        </motion.div>
      </Carousel>
    </motion.div>
  );
}
