'use client';

import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Users, Wifi, Utensils, Droplet, Zap, MapPin, IndianRupee, Clock, Star, Shield, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const pgTypes = [
  { name: 'Boys PG', icon: <Users className="h-8 w-8" />, color: 'from-blue-400 to-blue-600', count: '800+' },
  { name: 'Girls PG', icon: <Users className="h-8 w-8" />, color: 'from-pink-400 to-pink-600', count: '750+' },
  { name: 'Co-living', icon: <Home className="h-8 w-8" />, color: 'from-purple-400 to-purple-600', count: '350+' },
  { name: 'Hostels', icon: <Home className="h-8 w-8" />, color: 'from-green-400 to-green-600', count: '400+' },
];

const amenities = [
  { name: 'Wi-Fi', icon: <Wifi className="h-6 w-6" />, color: 'from-cyan-400 to-cyan-600' },
  { name: 'Food Included', icon: <Utensils className="h-6 w-6" />, color: 'from-orange-400 to-orange-600' },
  { name: 'AC Rooms', icon: <Zap className="h-6 w-6" />, color: 'from-blue-400 to-blue-600' },
  { name: 'Hot Water', icon: <Droplet className="h-6 w-6" />, color: 'from-red-400 to-red-600' },
  { name: 'Security', icon: <Shield className="h-6 w-6" />, color: 'from-green-400 to-green-600' },
  { name: 'Housekeeping', icon: <Home className="h-6 w-6" />, color: 'from-purple-400 to-purple-600' },
];

const featuredPGs = [
  { name: 'Sunrise PG', location: 'Koramangala', price: '8,000', rating: 4.5, type: 'Co-living', features: ['Wi-Fi', 'Food', 'AC'] },
  { name: 'Urban Nest Hostel', location: 'HSR Layout', price: '6,500', rating: 4.7, type: 'Boys PG', features: ['Wi-Fi', 'Gym', 'Parking'] },
  { name: 'Green Valley PG', location: 'Whitefield', price: '7,200', rating: 4.3, type: 'Girls PG', features: ['Food', 'Security', 'Wi-Fi'] },
  { name: 'Smart Living', location: 'Indiranagar', price: '9,000', rating: 4.6, type: 'Co-living', features: ['AC', 'Wi-Fi', 'Food'] },
];

export default function PgHostelsPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen"
      data-testid="pg-hostels-page"
    >
      <JustdialHeader />
      
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 pt-28 pb-16 overflow-hidden">
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
          className="absolute bottom-20 right-10 w-96 h-96 bg-green-300/30 rounded-full blur-3xl"
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
              className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 via-green-100 to-purple-100 border border-blue-200"
            >
              <Home className="h-5 w-5 text-blue-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Your Home Away From Home</span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-gray-900">PG & </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 animate-gradient">Hostels</span>
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Find comfortable accommodation for students and professionals
            </motion.p>

            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Location"
                      className="w-full h-12 pl-10 pr-4 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      data-testid="location-input"
                    />
                  </div>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Budget"
                      className="w-full h-12 pl-10 pr-4 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      data-testid="budget-input"
                    />
                  </div>
                  <Button
                    className="h-12 bg-gradient-to-r from-blue-500 to-green-600 hover:shadow-lg"
                    data-testid="search-button"
                  >
                    Search PG
                  </Button>
                </div>
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
          {/* PG Types */}
          <motion.section variants={staggerItem}>
            <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold mb-3 text-gray-900">Browse by Type</h2>
                  <p className="text-gray-600">Choose accommodation that suits your needs</p>
                </div>
                <motion.div
                  variants={staggerContainer}
                  className="grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                  {pgTypes.map((type, index) => (
                    <motion.div
                      key={index}
                      variants={staggerItem}
                      whileHover={{ scale: 1.05, y: -10 }}
                      whileTap={{ scale: 0.95 }}
                      data-testid={`pg-type-${index}`}
                    >
                      <Link href={`/search?type=${type.name}`}>
                        <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20">
                          <CardContent className="p-6 text-center">
                            <motion.div
                              className={`h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center text-white shadow-lg`}
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              {type.icon}
                            </motion.div>
                            <h3 className="font-bold text-gray-900 mb-2">{type.name}</h3>
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">{type.count} Available</span>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Amenities */}
          <motion.section variants={staggerItem}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 text-gray-900">Popular Amenities</h2>
              <p className="text-gray-600">Essential facilities you can expect</p>
            </div>
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-3 md:grid-cols-6 gap-4"
            >
              {amenities.map((amenity, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ scale: 1.08, y: -8 }}
                  data-testid={`amenity-${index}`}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20">
                    <CardContent className="p-6 text-center">
                      <motion.div
                        className={`h-12 w-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${amenity.color} flex items-center justify-center text-white shadow-lg`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {amenity.icon}
                      </motion.div>
                      <p className="text-xs font-semibold text-gray-700">{amenity.name}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Featured PGs */}
          <motion.section variants={staggerItem}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 text-gray-900">Featured Listings</h2>
              <p className="text-gray-600">Top-rated PGs and hostels in your area</p>
            </div>
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featuredPGs.map((pg, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ y: -8, scale: 1.02 }}
                  data-testid={`featured-pg-${index}`}
                >
                  <Card className="bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden h-full">
                    <div className="h-2 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500" />
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{pg.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />
                            <span>{pg.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold text-sm">{pg.rating}</span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">{pg.type}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {pg.features.map((feature, idx) => (
                          <span key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {feature}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">₹{pg.price}
                          </span>
                          <span className="text-sm text-gray-500">/month</span>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button size="sm" className="bg-gradient-to-r from-primary to-accent">View</Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* CTA Section */}
          <motion.section variants={staggerItem}>
            <Card className="bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 border-0 shadow-2xl overflow-hidden">
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
                    <Home className="h-16 w-16 mx-auto mb-6" />
                  </motion.div>
                  <h2 className="text-4xl font-bold mb-4">List Your PG/Hostel</h2>
                  <p className="text-xl mb-8 text-white/90">Reach thousands of students and professionals looking for accommodation</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 h-14 px-10 rounded-full text-lg font-semibold shadow-xl" data-testid="list-property-button">
                      List Your Property
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
