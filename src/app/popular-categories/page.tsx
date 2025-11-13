'use client';

import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Utensils, Hotel, Heart, Dumbbell, GraduationCap, Home, Car, Scissors, 
  Stethoscope, ShoppingBag, Wrench, Coffee, Shirt, PawPrint, Plane, Camera,
  Building2, Briefcase, TrendingUp, Sparkles
} from 'lucide-react';
import Link from 'next/link';

const categories = [
  { name: 'Restaurants', icon: <Utensils className="h-8 w-8" />, color: 'from-red-400 to-red-600', count: '5000+', trending: true },
  { name: 'Hotels', icon: <Hotel className="h-8 w-8" />, color: 'from-blue-400 to-blue-600', count: '3500+', trending: true },
  { name: 'Beauty & Spa', icon: <Heart className="h-8 w-8" />, color: 'from-pink-400 to-pink-600', count: '2800+', trending: true },
  { name: 'Gym & Fitness', icon: <Dumbbell className="h-8 w-8" />, color: 'from-orange-400 to-orange-600', count: '1200+', trending: false },
  { name: 'Education', icon: <GraduationCap className="h-8 w-8" />, color: 'from-purple-400 to-purple-600', count: '4200+', trending: false },
  { name: 'Real Estate', icon: <Home className="h-8 w-8" />, color: 'from-green-400 to-green-600', count: '3000+', trending: true },
  { name: 'Automobile', icon: <Car className="h-8 w-8" />, color: 'from-cyan-400 to-cyan-600', count: '2500+', trending: false },
  { name: 'Salons', icon: <Scissors className="h-8 w-8" />, color: 'from-yellow-400 to-yellow-600', count: '1800+', trending: false },
  { name: 'Hospitals', icon: <Stethoscope className="h-8 w-8" />, color: 'from-teal-400 to-teal-600', count: '1500+', trending: false },
  { name: 'Shopping', icon: <ShoppingBag className="h-8 w-8" />, color: 'from-indigo-400 to-indigo-600', count: '6000+', trending: true },
  { name: 'Home Services', icon: <Wrench className="h-8 w-8" />, color: 'from-gray-400 to-gray-600', count: '3200+', trending: false },
  { name: 'Cafes', icon: <Coffee className="h-8 w-8" />, color: 'from-amber-400 to-amber-600', count: '2000+', trending: true },
  { name: 'Fashion', icon: <Shirt className="h-8 w-8" />, color: 'from-rose-400 to-rose-600', count: '4500+', trending: false },
  { name: 'Pet Services', icon: <PawPrint className="h-8 w-8" />, color: 'from-lime-400 to-lime-600', count: '800+', trending: false },
  { name: 'Travel', icon: <Plane className="h-8 w-8" />, color: 'from-sky-400 to-sky-600', count: '1600+', trending: true },
  { name: 'Photography', icon: <Camera className="h-8 w-8" />, color: 'from-fuchsia-400 to-fuchsia-600', count: '1100+', trending: false },
  { name: 'Contractors', icon: <Building2 className="h-8 w-8" />, color: 'from-slate-400 to-slate-600', count: '2200+', trending: false },
  { name: 'Business Services', icon: <Briefcase className="h-8 w-8" />, color: 'from-violet-400 to-violet-600', count: '1900+', trending: false },
];

const trendingCategories = categories.filter(cat => cat.trending);

export default function PopularCategoriesPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen"
      data-testid="popular-categories-page"
    >
      <JustdialHeader />
      
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background pt-28 pb-16 overflow-hidden">
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20"
            >
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Explore All Services</span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-gray-900">Popular </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient">Categories</span>
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Discover thousands of verified businesses across all categories
            </motion.p>
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

      <main className="container mx-auto px-4 -mt-16 relative z-10 pb-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          {/* Trending Categories */}
          <motion.section variants={staggerItem}>
            <Card className="bg-gradient-to-br from-white to-primary/5 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-2 text-gray-900 flex items-center gap-3">
                      <TrendingUp className="h-8 w-8 text-primary" />
                      Trending Now
                    </h2>
                    <p className="text-gray-600">Most searched categories this week</p>
                  </div>
                </div>
                <motion.div
                  variants={staggerContainer}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
                >
                  {trendingCategories.map((category, index) => (
                    <motion.div
                      key={index}
                      variants={staggerItem}
                      whileHover={{ scale: 1.08, y: -10 }}
                      whileTap={{ scale: 0.95 }}
                      data-testid={`trending-${index}`}
                    >
                      <Link href={`/${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}>
                        <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/30 bg-white relative overflow-hidden">
                          <div className="absolute top-2 right-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold rounded-full">
                              <TrendingUp className="h-3 w-3" />
                              HOT
                            </span>
                          </div>
                          <CardContent className="p-6 text-center">
                            <motion.div
                              className={`h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg`}
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              {category.icon}
                            </motion.div>
                            <h3 className="font-bold text-gray-900 mb-2">{category.name}</h3>
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">{category.count}</span>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.section>

          {/* All Categories */}
          <motion.section variants={staggerItem}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 text-gray-900">All Categories</h2>
              <p className="text-gray-600">Browse through our complete directory</p>
            </div>
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            >
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ scale: 1.05, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid={`category-${index}`}
                >
                  <Link href={`/${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20 bg-white">
                      <CardContent className="p-6 text-center">
                        <motion.div
                          className={`h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          {category.icon}
                        </motion.div>
                        <h3 className="font-bold text-gray-900 mb-2 text-sm">{category.name}</h3>
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">{category.count}</span>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* CTA Section */}
          <motion.section variants={staggerItem}>
            <Card className="bg-gradient-to-r from-primary via-accent to-primary border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-12 text-center text-white relative">
                <motion.div
                  className="absolute inset-0 opacity-10"
                  animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                  transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                  style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}
                />
                <div className="relative z-10">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Building2 className="h-16 w-16 mx-auto mb-6" />
                  </motion.div>
                  <h2 className="text-4xl font-bold mb-4">Can't Find Your Category?</h2>
                  <p className="text-xl mb-8 text-white/90">Contact us to add your business category to our directory</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/contact">
                      <button className="bg-white text-primary hover:bg-gray-100 h-14 px-10 rounded-full text-lg font-semibold shadow-xl transition-all" data-testid="contact-button">
                        Contact Us
                      </button>
                    </Link>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </motion.div>
      </main>
      
      <JustdialFooter />
    </motion.div>
  );
}
