'use client';

import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { FloatingButtons } from "@/components/justdial/FloatingButtons";
import { FilterSidebar } from "@/components/restaurants/list/FilterSidebar";
import { RestaurantList } from "@/components/restaurants/list/RestaurantList";
import { SearchBar } from "@/components/restaurants/list/SearchBar";
import { motion } from 'framer-motion';
import { pageTransition, fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import { TrendingUp, Flame, Star, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TrendingRestaurantListPage() {
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
      
      {/* Enhanced Hero Section with Animated Background */}
      <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background pt-28 pb-12 overflow-hidden">
        {/* Animated background blobs */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
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
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="h-10 w-10 text-destructive fill-destructive" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient-animated">
                Trending Restaurants
              </h1>
              <Badge className="bg-destructive text-destructive-foreground px-3 py-1 text-sm font-bold">
                HOT
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              Discover what&apos;s hot and popular in your area right now
            </p>
          </motion.div>
          
          {/* Trending Stats */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          >
            <motion.div 
              variants={staggerItem}
              className="bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20 rounded-xl p-4 backdrop-blur-sm hover-lift"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">Trending Now</p>
                  <p className="text-lg font-bold">Top Picks</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={staggerItem}
              className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 backdrop-blur-sm hover-lift"
            >
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-primary fill-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Highly Rated</p>
                  <p className="text-lg font-bold">4.5+ Stars</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={staggerItem}
              className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-4 backdrop-blur-sm hover-lift"
            >
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Popular Choice</p>
                  <p className="text-lg font-bold">Most Visited</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SearchBar />
          </motion.div>
        </div>

        {/* Decorative wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#ffffff"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row gap-6 -mt-8"
        >
          <motion.div 
            variants={fadeInUp}
            className="w-full md:w-1/4"
          >
            <FilterSidebar />
          </motion.div>
          <motion.div 
            variants={fadeInUp}
            className="w-full md:w-3/4"
          >
            <RestaurantList />
          </motion.div>
        </motion.div>
      </main>
      
      <JustdialFooter />
    </motion.div>
  );
}
