'use client';

import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { FloatingButtons } from "@/components/justdial/FloatingButtons";
import { FilterSidebar } from "@/components/restaurants/list/FilterSidebar";
import { RestaurantList } from "@/components/restaurants/list/RestaurantList";
import { SearchBar } from "@/components/restaurants/list/SearchBar";
import { motion } from 'framer-motion';
import { pageTransition, fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import { ShoppingBag, Sparkles, Clock, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function OrderFoodPage() {
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
              <ShoppingBag className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient-animated">
                Order Food Online
              </h1>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <MapPin className="h-5 w-5" />
              <p className="text-lg">Get your favorite food delivered to your doorstep</p>
            </div>
          </motion.div>
          
          {/* Quick Stats */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          >
            <motion.div variants={staggerItem}>
              <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover-lift">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Fast Delivery</p>
                    <p className="text-lg font-bold">30-45 mins</p>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            <motion.div variants={staggerItem}>
              <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover-lift">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-8 w-8 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Quality Food</p>
                    <p className="text-lg font-bold">100+ Options</p>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            <motion.div variants={staggerItem}>
              <Card className="p-4 bg-gradient-to-br from-chart-2/10 to-chart-2/5 border-chart-2/20 hover-lift">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-8 w-8 text-chart-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">Easy Ordering</p>
                    <p className="text-lg font-bold">3 Simple Steps</p>
                  </div>
                </div>
              </Card>
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
