'use client';

import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Shield, Award, Clock, MapPin, Phone, Star } from 'lucide-react';

const features = [
  { name: 'Certified Instructors', icon: Award, color: 'text-yellow-500' },
  { name: 'Flexible Timings', icon: Clock, color: 'text-blue-500' },
  { name: 'Safety First', icon: Shield, color: 'text-green-500' },
  { name: 'Modern Vehicles', icon: Car, color: 'text-purple-500' },
];

const topSchools = [
  {
    name: 'Maruti Suzuki Driving School',
    location: 'Andheri West, Mumbai',
    rating: 4.8,
    price: '₹8,000',
    experience: '15 years',
  },
  {
    name: 'Honda Driving Academy',
    location: 'Bandra East, Mumbai',
    rating: 4.7,
    price: '₹7,500',
    experience: '12 years',
  },
  {
    name: 'Professional Driving School',
    location: 'Powai, Mumbai',
    rating: 4.6,
    price: '₹6,500',
    experience: '10 years',
  },
];

export default function DrivingSchoolsPage() {
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
              <Car className="h-12 w-12 text-primary" />
              <h1 className="text-5xl font-bold text-gray-800">Driving Schools</h1>
            </div>
            <p className="text-xl text-gray-600 mb-8">Learn to drive with the best instructors</p>

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
                      placeholder="Search for driving schools near you..."
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
        {/* Features */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Why Choose Us</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              >
                <Card className="hover-lift cursor-pointer bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-3">
                      <div className="h-16 w-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
                        <feature.icon className={`h-8 w-8 ${feature.color}`} />
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-800">{feature.name}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Top Schools */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Top Driving Schools</h2>
          <div className="space-y-4">
            {topSchools.map((school, index) => (
              <motion.div
                key={school.name}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
              >
                <Card className="hover-lift bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{school.name}</h3>
                          <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                            <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
                            <span className="text-sm font-semibold text-yellow-700">{school.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{school.location}</span>
                          </div>
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{school.experience} experience</span>
                        </div>
                        <div className="text-2xl font-bold text-primary">{school.price}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
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
