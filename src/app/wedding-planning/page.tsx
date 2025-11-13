'use client';

import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem, fadeInUp } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Utensils, Music, Palette, Sparkles, Heart, MapPin, Calendar, Users, Gift, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const weddingCategories = [
  { name: 'Wedding Venues', icon: <MapPin className="h-8 w-8" />, color: 'from-purple-400 to-purple-600', count: '500+ Venues' },
  { name: 'Photographers', icon: <Camera className="h-8 w-8" />, color: 'from-blue-400 to-blue-600', count: '300+ Experts' },
  { name: 'Caterers', icon: <Utensils className="h-8 w-8" />, color: 'from-orange-400 to-orange-600', count: '200+ Services' },
  { name: 'Decorators', icon: <Palette className="h-8 w-8" />, color: 'from-pink-400 to-pink-600', count: '150+ Artists' },
  { name: 'Music & DJ', icon: <Music className="h-8 w-8" />, color: 'from-red-400 to-red-600', count: '100+ Bands' },
  { name: 'Makeup Artists', icon: <Sparkles className="h-8 w-8" />, color: 'from-yellow-400 to-yellow-600', count: '250+ Stylists' },
];

const planningSteps = [
  { title: '12 Months Before', tasks: ['Set wedding date', 'Create budget', 'Book venue', 'Hire wedding planner'] },
  { title: '6 Months Before', tasks: ['Send invitations', 'Book caterer', 'Choose decorator', 'Book photographer'] },
  { title: '3 Months Before', tasks: ['Finalize menu', 'Book makeup artist', 'Plan honeymoon', 'Arrange transportation'] },
  { title: '1 Month Before', tasks: ['Final guest count', 'Confirm all vendors', 'Wedding rehearsal', 'Pack for honeymoon'] },
];

const featuredServices = [
  { name: 'Premium Wedding Package', price: '₹5,00,000+', features: ['Venue', 'Catering', 'Decoration', 'Photography'] },
  { name: 'Destination Wedding', price: '₹10,00,000+', features: ['Travel', 'Stay', 'Complete Planning', 'Coordination'] },
  { name: 'Budget Wedding', price: '₹2,00,000+', features: ['Basic Venue', 'Simple Catering', 'Minimal Decor', 'Photography'] },
];

export default function WeddingPlanningPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen"
      data-testid="wedding-planning-page"
    >
      <JustdialHeader />
      
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-28 pb-16 overflow-hidden">
        {/* Animated background blobs */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl"
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
              className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 border border-pink-200"
            >
              <Heart className="h-5 w-5 text-pink-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Your Dream Wedding Starts Here</span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-gray-900">Plan Your Perfect </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient">Wedding</span>
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Connect with the best wedding vendors and make your special day unforgettable
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-xl text-white h-14 px-8 rounded-full text-lg" data-testid="get-started-button">
                  <Calendar className="mr-2 h-5 w-5" />
                  Start Planning
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg border-2 hover:bg-white" data-testid="browse-vendors-button">
                  <Users className="mr-2 h-5 w-5" />
                  Browse Vendors
                </Button>
              </motion.div>
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

      <main className="container mx-auto px-4 -mt-16 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-16 pb-16"
        >
          {/* Wedding Categories */}
          <motion.section variants={staggerItem}>
            <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold mb-3 text-gray-900">Wedding Services</h2>
                  <p className="text-gray-600">Find the best vendors for every aspect of your wedding</p>
                </div>
                <motion.div
                  variants={staggerContainer}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
                >
                  {weddingCategories.map((category, index) => (
                    <motion.div
                      key={index}
                      variants={staggerItem}
                      whileHover={{ scale: 1.08, y: -10 }}
                      whileTap={{ scale: 0.95 }}
                      data-testid={`category-${index}`}
                    >
                      <Link href={`/search?category=${category.name}`}>
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20 group">
                          <motion.div
                            className={`h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            {category.icon}
                          </motion.div>
                          <h3 className="text-sm font-semibold text-center mb-2 text-gray-800 group-hover:text-primary transition-colors">{category.name}</h3>
                          <p className="text-xs text-center text-gray-500">{category.count}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Planning Timeline */}
          <motion.section variants={staggerItem}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 text-gray-900">Wedding Planning Timeline</h2>
              <p className="text-gray-600">Stay organized with our step-by-step guide</p>
            </div>
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {planningSteps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ y: -8 }}
                  data-testid={`planning-step-${index}`}
                >
                  <Card className="bg-white hover:shadow-xl transition-all duration-300 border-t-4 border-primary h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {step.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Featured Packages */}
          <motion.section variants={staggerItem}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 text-gray-900">Wedding Packages</h2>
              <p className="text-gray-600">Choose the perfect package for your budget</p>
            </div>
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {featuredServices.map((service, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ scale: 1.05, y: -10 }}
                  data-testid={`package-${index}`}
                >
                  <Card className="bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden h-full">
                    <div className="h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />
                    <CardContent className="p-8">
                      <Gift className="h-12 w-12 text-primary mb-4" />
                      <h3 className="text-2xl font-bold mb-2 text-gray-900">{service.name}</h3>
                      <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-6">{service.price}</p>
                      <ul className="space-y-3 mb-6">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2 text-gray-600">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg" size="lg">
                          Get Quote
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* CTA Section */}
          <motion.section variants={staggerItem}>
            <Card className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-12 text-center text-white relative">
                <motion.div
                  className="absolute inset-0 opacity-10"
                  animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                  transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                  style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}
                />
                <div className="relative z-10">
                  <Heart className="h-16 w-16 mx-auto mb-6 animate-pulse" />
                  <h2 className="text-4xl font-bold mb-4">Ready to Plan Your Dream Wedding?</h2>
                  <p className="text-xl mb-8 text-white/90">Connect with verified vendors and make your special day perfect</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 h-14 px-10 rounded-full text-lg font-semibold shadow-xl" data-testid="start-now-button">
                      Start Planning Now
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
