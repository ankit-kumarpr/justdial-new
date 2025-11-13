'use client';

import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Home, Camera, Music, Briefcase, Truck, PartyPopper, Bike, Search, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const rentCategories = [
  { name: 'Cars & Vehicles', icon: <Car className="h-8 w-8" />, color: 'from-blue-400 to-blue-600', count: '500+', description: 'Cars, bikes, trucks for rent' },
  { name: 'Properties', icon: <Home className="h-8 w-8" />, color: 'from-green-400 to-green-600', count: '1200+', description: 'Apartments, offices, shops' },
  { name: 'Equipment', icon: <Briefcase className="h-8 w-8" />, color: 'from-purple-400 to-purple-600', count: '300+', description: 'Tools, machinery, gadgets' },
  { name: 'Photography', icon: <Camera className="h-8 w-8" />, color: 'from-pink-400 to-pink-600', count: '150+', description: 'Cameras, lighting, studios' },
  { name: 'Party Supplies', icon: <PartyPopper className="h-8 w-8" />, color: 'from-orange-400 to-orange-600', count: '200+', description: 'Decorations, furniture, tents' },
  { name: 'Sound Systems', icon: <Music className="h-8 w-8" />, color: 'from-red-400 to-red-600', count: '180+', description: 'Speakers, DJ equipment, mics' },
  { name: 'Transport', icon: <Truck className="h-8 w-8" />, color: 'from-yellow-400 to-yellow-600', count: '250+', description: 'Movers, packers, trucks' },
  { name: 'Two Wheelers', icon: <Bike className="h-8 w-8" />, color: 'from-cyan-400 to-cyan-600', count: '400+', description: 'Bikes, scooters, cycles' },
];

const popularRentals = [
  { title: 'Luxury Cars', price: '₹3,000/day', rating: 4.8, bookings: '1.2K' },
  { title: '2BHK Apartment', price: '₹15,000/month', rating: 4.6, bookings: '850' },
  { title: 'Professional Camera', price: '₹500/day', rating: 4.9, bookings: '650' },
  { title: 'Party Tent', price: '₹2,000/day', rating: 4.7, bookings: '420' },
];

export default function RentAndHirePage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen"
      data-testid="rent-hire-page"
    >
      <JustdialHeader />
      
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-28 pb-16 overflow-hidden">
        {/* Animated background blobs */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 60, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            x: [0, -60, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 11,
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
              className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 border border-blue-200"
            >
              <TrendingUp className="h-5 w-5 text-blue-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Smart Rental Solutions</span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-gray-900">Rent & Hire </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient">Anything</span>
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Find services and items available for rent in your area
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for cars, properties, equipment..."
                  className="w-full h-16 px-6 pr-16 rounded-full border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-lg"
                  data-testid="rent-search-input"
                />
                <Button
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                  data-testid="rent-search-button"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
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
          {/* Categories Grid */}
          <motion.section variants={staggerItem}>
            <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold mb-3 text-gray-900">Browse Categories</h2>
                  <p className="text-gray-600">Find exactly what you need to rent</p>
                </div>
                <motion.div
                  variants={staggerContainer}
                  className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6"
                >
                  {rentCategories.map((category, index) => (
                    <motion.div
                      key={index}
                      variants={staggerItem}
                      whileHover={{ scale: 1.05, y: -10 }}
                      whileTap={{ scale: 0.95 }}
                      data-testid={`category-${index}`}
                    >
                      <Link href={`/search?category=${category.name}`}>
                        <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20">
                          <CardContent className="p-6 text-center">
                            <motion.div
                              className={`h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg`}
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              {category.icon}
                            </motion.div>
                            <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>
                            <p className="text-xs text-gray-500 mb-2">{category.description}</p>
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">{category.count} Listings</span>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Popular Rentals */}
          <motion.section variants={staggerItem}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 text-gray-900">Popular Rentals</h2>
              <p className="text-gray-600">Most booked items this month</p>
            </div>
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {popularRentals.map((rental, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ y: -8, scale: 1.02 }}
                  data-testid={`rental-${index}`}
                >
                  <Card className="bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{rental.title}</h3>
                      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-4">{rental.price}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="font-semibold">{rental.rating}</span>
                        </div>
                        <span className="text-gray-500">{rental.bookings} bookings</span>
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-4">
                        <Button className="w-full bg-gradient-to-r from-primary to-accent">View Details</Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* CTA Section */}
          <motion.section variants={staggerItem}>
            <Card className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 border-0 shadow-2xl overflow-hidden">
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
                    <Briefcase className="h-16 w-16 mx-auto mb-6" />
                  </motion.div>
                  <h2 className="text-4xl font-bold mb-4">List Your Items for Rent</h2>
                  <p className="text-xl mb-8 text-white/90">Start earning by renting out your items today</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 h-14 px-10 rounded-full text-lg font-semibold shadow-xl" data-testid="list-item-button">
                      List Your Item
                    </Button>
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
