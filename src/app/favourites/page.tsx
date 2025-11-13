'use client';

import { JustdialHeader } from '@/components/justdial/JustdialHeader';
import { JustdialFooter } from '@/components/justdial/JustdialFooter';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations';
import { Heart, Search, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

const popularCategories = [
  { name: 'Restaurants', icon: '🍽️', link: '/restaurants' },
  { name: 'Hotels', icon: '🏨', link: '/hotels' },
  { name: 'Beauty Spa', icon: '💆', link: '/beauty-spa' },
  { name: 'Gyms', icon: '💪', link: '/gym' },
  { name: 'Events', icon: '🎉', link: '/event-organisers' },
  { name: 'Real Estate', icon: '🏠', link: '/estate-agent' },
];

export default function FavouritesPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      <JustdialHeader />
      <FloatingButtons />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background pt-28 pb-16 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 via-red-500/10 to-pink-500/10 border border-pink-500/20"
            >
              <Heart className="h-4 w-4 text-pink-600 animate-pulse fill-pink-600" />
              <span className="text-sm font-medium text-gray-700">Your Saved Favorites</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-600 to-pink-600"
              >
                My Favourites
              </motion.span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600"
            >
              Keep track of businesses you love
            </motion.p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-2xl mx-auto"
        >
          {/* Empty State Card */}
          <motion.div
            variants={staggerItem}
            className="text-center"
          >
            <Card className="border-0 shadow-2xl hover-lift overflow-hidden">
              <CardContent className="p-12">
                {/* Animated Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ 
                    scale: { duration: 0.5, type: "spring" },
                    rotate: { duration: 1, delay: 0.5 }
                  }}
                  className="mb-8"
                >
                  <div className="relative w-48 h-48 mx-auto">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full blur-2xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <Image 
                      src={findImage('no-favourites-illustration')}
                      alt="No Favourites"
                      width={192}
                      height={192}
                      className="relative z-10"
                      data-ai-hint="empty shopping cart"
                    />
                  </div>
                </motion.div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    No Favorites Yet!
                  </h2>
                  <p className="text-gray-600 mb-8 text-lg">
                    Start exploring and save your favorite businesses for quick access
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button
                    asChild
                    className="h-14 px-8 bg-gradient-to-r from-pink-600 to-red-600 hover:shadow-2xl transition-all duration-300 text-base"
                    data-testid="explore-button"
                  >
                    <Link href="/">
                      <Search className="h-5 w-5 mr-2" />
                      Explore Businesses
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-14 px-8 border-2 text-base"
                    data-testid="trending-button"
                  >
                    <Link href="/trends">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      View Trending
                    </Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Popular Categories Section */}
          <motion.div
            variants={staggerItem}
            className="mt-16"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-gray-700">Start Here</span>
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Explore Popular Categories</h2>
              <p className="text-gray-600">Discover amazing businesses near you</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {popularCategories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="group cursor-pointer"
                >
                  <Link href={category.link}>
                    <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden group-hover:bg-gradient-to-br group-hover:from-primary/5 group-hover:to-accent/5">
                      <CardContent className="p-6">
                        <motion.div
                          className="text-5xl mb-3"
                          whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          {category.icon}
                        </motion.div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all">
                          {category.name}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tips Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">💡 Pro Tip</h3>
                    <p className="text-gray-700">
                      Click the heart icon on any business listing to add it to your favorites. 
                      You'll be able to access them quickly from this page anytime!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      <JustdialFooter />
    </motion.div>
  );
}
