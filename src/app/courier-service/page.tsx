'use client';

import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Truck, Clock, Shield, MapPin, Phone, Star, Zap } from 'lucide-react';

const services = [
  { name: 'Same Day Delivery', icon: Zap, color: 'text-yellow-500' },
  { name: 'Express Shipping', icon: Truck, color: 'text-blue-500' },
  { name: '24/7 Tracking', icon: Clock, color: 'text-green-500' },
  { name: 'Secure Packaging', icon: Shield, color: 'text-purple-500' },
];

const topCouriers = [
  {
    name: 'Swift Courier Services',
    location: 'Andheri, Mumbai',
    rating: 4.8,
    price: 'Starting ₹50',
    deliveryTime: '2-4 hours',
  },
  {
    name: 'Express Logistics',
    location: 'Bandra, Mumbai',
    rating: 4.7,
    price: 'Starting ₹45',
    deliveryTime: '3-5 hours',
  },
  {
    name: 'QuickShip Couriers',
    location: 'Malad, Mumbai',
    rating: 4.6,
    price: 'Starting ₹40',
    deliveryTime: '4-6 hours',
  },
];

export default function CourierServicePage() {
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

      {/* Animated background blobs */}
      <motion.div
        className="fixed top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
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
        className="fixed bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background pt-28 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package className="h-12 w-12 text-primary" />
              <h1 className="text-5xl font-bold text-gray-800">Courier Services</h1>
            </div>
            <p className="text-xl text-gray-600 mb-8">Fast and reliable courier services for all your delivery needs</p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Search for courier services near you..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8" size="lg">
                      Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 relative z-10">
        {/* Services Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Our Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              >
                <Card className="hover-lift cursor-pointer bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-3">
                      <div className="h-16 w-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
                        <service.icon className={`h-8 w-8 ${service.color}`} />
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-800">{service.name}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Top Courier Services */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Top Courier Services</h2>
          <div className="space-y-4">
            {topCouriers.map((courier, index) => (
              <motion.div
                key={courier.name}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
              >
                <Card className="hover-lift bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{courier.name}</h3>
                          <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                            <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
                            <span className="text-sm font-semibold text-yellow-700">{courier.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{courier.location}</span>
                          </div>
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{courier.deliveryTime}</span>
                        </div>
                        <div className="text-2xl font-bold text-primary">{courier.price}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        <Button variant="outline" size="sm">
                          Get Quote
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <JustdialFooter />
    </motion.div>
  );
}
