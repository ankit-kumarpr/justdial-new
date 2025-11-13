'use client';

import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PawPrint, Heart, Scissors, Stethoscope, ShoppingBag, UtensilsCrossed, Bone, Dog, Cat, Fish, Bird, Star, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

const petServices = [
  { name: 'Pet Grooming', icon: <Scissors className="h-8 w-8" />, color: 'from-pink-400 to-pink-600', count: '150+' },
  { name: 'Veterinary', icon: <Stethoscope className="h-8 w-8" />, color: 'from-green-400 to-green-600', count: '200+' },
  { name: 'Pet Store', icon: <ShoppingBag className="h-8 w-8" />, color: 'from-blue-400 to-blue-600', count: '300+' },
  { name: 'Pet Food', icon: <UtensilsCrossed className="h-8 w-8" />, color: 'from-orange-400 to-orange-600', count: '250+' },
  { name: 'Pet Training', icon: <Bone className="h-8 w-8" />, color: 'from-purple-400 to-purple-600', count: '80+' },
  { name: 'Pet Boarding', icon: <Heart className="h-8 w-8" />, color: 'from-red-400 to-red-600', count: '120+' },
];

const petTypes = [
  { name: 'Dogs', icon: <Dog className="h-8 w-8" />, color: 'from-amber-400 to-amber-600', count: '500+' },
  { name: 'Cats', icon: <Cat className="h-8 w-8" />, color: 'from-cyan-400 to-cyan-600', count: '300+' },
  { name: 'Birds', icon: <Bird className="h-8 w-8" />, color: 'from-green-400 to-green-600', count: '150+' },
  { name: 'Fish', icon: <Fish className="h-8 w-8" />, color: 'from-blue-400 to-blue-600', count: '200+' },
];

const featuredShops = [
  { name: 'Pawfect Pet Store', location: 'Jubilee Hills', rating: 4.8, services: ['Grooming', 'Food', 'Toys'], reviews: 256 },
  { name: 'Pet Paradise', location: 'Banjara Hills', rating: 4.6, services: ['Veterinary', 'Grooming', 'Boarding'], reviews: 189 },
  { name: 'Furry Friends', location: 'Hitech City', rating: 4.9, services: ['Training', 'Food', 'Accessories'], reviews: 342 },
  { name: 'Pet Care Central', location: 'Gachibowli', rating: 4.7, services: ['Grooming', 'Spa', 'Food'], reviews: 201 },
];

export default function PetShopsPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen"
      data-testid="pet-shops-page"
    >
      <JustdialHeader />
      
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 pt-28 pb-16 overflow-hidden">
        {/* Animated background blobs */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-orange-300/30 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl"
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
              className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 border border-orange-200"
            >
              <Heart className="h-5 w-5 text-pink-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Everything Your Pet Needs</span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-gray-900">Pet Shops & </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 animate-gradient">Services</span>
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Complete care for your furry, feathered, and finned friends
            </motion.p>

            {/* Animated Paw Prints */}
            <motion.div
              className="flex justify-center gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  <PawPrint className="h-8 w-8 text-orange-400" />
                </motion.div>
              ))}
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
          {/* Pet Services */}
          <motion.section variants={staggerItem}>
            <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold mb-3 text-gray-900">Pet Services</h2>
                  <p className="text-gray-600">Comprehensive care for your beloved pets</p>
                </div>
                <motion.div
                  variants={staggerContainer}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
                >
                  {petServices.map((service, index) => (
                    <motion.div
                      key={index}
                      variants={staggerItem}
                      whileHover={{ scale: 1.05, y: -10 }}
                      whileTap={{ scale: 0.95 }}
                      data-testid={`service-${index}`}
                    >
                      <Link href={`/search?service=${service.name}`}>
                        <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20">
                          <CardContent className="p-6 text-center">
                            <motion.div
                              className={`h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-lg`}
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              {service.icon}
                            </motion.div>
                            <h3 className="font-bold text-gray-900 mb-2 text-sm">{service.name}</h3>
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">{service.count}</span>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Pet Types */}
          <motion.section variants={staggerItem}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 text-gray-900">Shop by Pet Type</h2>
              <p className="text-gray-600">Find products and services for your pet</p>
            </div>
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {petTypes.map((pet, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid={`pet-type-${index}`}
                >
                  <Link href={`/search?pet=${pet.name}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20 bg-gradient-to-br from-white to-gray-50">
                      <CardContent className="p-8 text-center">
                        <motion.div
                          className={`h-20 w-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${pet.color} flex items-center justify-center text-white shadow-lg`}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          {pet.icon}
                        </motion.div>
                        <h3 className="font-bold text-gray-900 mb-2 text-lg">{pet.name}</h3>
                        <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full">{pet.count} Products</span>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Featured Pet Shops */}
          <motion.section variants={staggerItem}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 text-gray-900">Featured Pet Shops</h2>
              <p className="text-gray-600">Top-rated shops in your area</p>
            </div>
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featuredShops.map((shop, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ y: -8, scale: 1.02 }}
                  data-testid={`featured-shop-${index}`}
                >
                  <Card className="bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden h-full">
                    <div className="h-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{shop.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />
                            <span>{shop.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold text-sm">{shop.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {shop.services.map((service, idx) => (
                          <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                            {service}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{shop.reviews} reviews</span>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button size="sm" className="bg-gradient-to-r from-orange-500 to-pink-600">
                            <Phone className="h-3 w-3 mr-1" />
                            Contact
                          </Button>
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
            <Card className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 border-0 shadow-2xl overflow-hidden">
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
                    <PawPrint className="h-16 w-16 mx-auto mb-6" />
                  </motion.div>
                  <h2 className="text-4xl font-bold mb-4">List Your Pet Shop</h2>
                  <p className="text-xl mb-8 text-white/90">Join our network and reach pet lovers in your area</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 h-14 px-10 rounded-full text-lg font-semibold shadow-xl" data-testid="list-shop-button">
                      List Your Shop
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
