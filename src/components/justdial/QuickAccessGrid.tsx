
'use client';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import type { JDCategory } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const sparkleGif = PlaceHolderImages.find(img => img.id === 'sparkle-gif')?.imageUrl || '';

export function QuickAccessGrid({ categories }: { categories: JDCategory[] }) {
  const { ref, isVisible } = useScrollAnimation();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!categories) {
    return (
      <div className="grid grid-cols-5 md:grid-cols-10 gap-6">
        {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-24 w-20" />)}
      </div>
    );
  }

  return (
    <motion.section
      ref={ref as any}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={staggerContainer}
      className="relative bg-white rounded-3xl shadow-2xl p-8 overflow-hidden hover-lift"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,250,255,0.95) 100%)',
      }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quick Access</h2>
            <p className="text-gray-600">Explore popular categories</p>
          </div>
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
            className="text-4xl"
          >
            🚀
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-5 md:grid-cols-10 gap-6 text-center">
          {categories.slice(0, 10).map((category, index) => {
            const href = `/search?q=${category.categoryName}`;
            const iconUrl = category.categoryImage.startsWith('http') ? category.categoryImage : `${apiBaseUrl}${category.categoryImage}`;

            return (
              <motion.div 
                key={category.categoryName} 
                variants={staggerItem}
                className="group"
              >
                <Link href={href} className="flex flex-col items-center gap-3 relative block">
                  <motion.div
                    whileHover={{ 
                      y: -12, 
                      scale: 1.1,
                      rotate: [0, -5, 5, 0],
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <Card className="w-20 h-20 flex items-center justify-center p-2 rounded-2xl border-0 shadow-md group-hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-gray-50 to-white group-hover:from-primary/5 group-hover:via-accent/5 group-hover:to-primary/5 relative overflow-hidden">
                      <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100" />
                      
                      <div className="relative w-14 h-14 z-10">
                        <motion.div
                          className="absolute inset-0"
                          whileHover={{ scale: 1.15 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Image 
                            src={iconUrl}
                            alt={category.categoryName} 
                            width={56} 
                            height={56} 
                            className="object-cover rounded-lg"
                            unoptimized={category.categoryImage.endsWith('.gif')}
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="absolute -top-2 -left-2"
                        >
                          {sparkleGif && <Image 
                            src={sparkleGif} 
                            alt="Sparkle" 
                            width={80} 
                            height={80} 
                            className="object-cover rounded-lg"
                            unoptimized
                          />}
                        </motion.div>
                      </div>
                    </Card>
                  </motion.div>
                  
                  <motion.p
                    className="text-xs font-semibold text-gray-700 leading-tight text-center transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent"
                    whileHover={{ scale: 1.05 }}
                  >
                    {category.categoryName}
                  </motion.p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
