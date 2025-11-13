'use client';
import { JustdialHeader } from '@/components/justdial/JustdialHeader';
import { JustdialFooter } from '@/components/justdial/JustdialFooter';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations';
import { Search, MapPin, Dumbbell, Users, Clock, Award, Star, TrendingUp, Heart } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

const fitnessCategories = [
  { name: 'Gym', icon: Dumbbell, color: 'from-red-500 to-orange-500' },
  { name: 'Yoga', icon: Users, color: 'from-purple-500 to-pink-500' },
  { name: 'CrossFit', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
  { name: 'Zumba', icon: Heart, color: 'from-green-500 to-teal-500' },
  { name: 'Boxing', icon: Award, color: 'from-yellow-500 to-orange-500' },
  { name: 'Pilates', icon: Users, color: 'from-indigo-500 to-purple-500' },
];

const popularGyms = [
  { name: 'Gold\'s Gym', location: 'Andheri West', rating: 4.8, members: '2000+', image: findImage('jd-trending-1') },
  { name: 'Fitness First', location: 'Bandra', rating: 4.7, members: '1500+', image: findImage('jd-trending-2') },
  { name: 'Cult.fit', location: 'Powai', rating: 4.9, members: '3000+', image: findImage('jd-trending-3') },
  { name: 'Talwalkars', location: 'Goregaon', rating: 4.6, members: '1800+', image: findImage('jd-trending-4') },
];

const membershipPlans = [
  { name: 'Basic', price: '₹999', duration: '/month', features: ['Access to gym floor', 'Locker facility', 'Basic equipment'] },
  { name: 'Premium', price: '₹1,999', duration: '/month', features: ['All Basic features', 'Group classes', 'Personal trainer (2 sessions)'], popular: true },
  { name: 'Elite', price: '₹3,999', duration: '/month', features: ['All Premium features', 'Unlimited PT sessions', 'Nutrition consultation', 'Spa access'] },
];

export default function GymPage() {
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
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background pt-28 pb-16 overflow-hidden">
        {/* Animated background blobs */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 border border-red-500/20"
            >
              <Dumbbell className="h-4 w-4 text-red-600 animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Find Your Perfect Fitness Center</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="block"
              >
                Transform Your
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-600 to-red-600"
              >
                Fitness Journey
              </motion.span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-gray-600 mb-8"
            >
              Discover top-rated gyms and fitness centers near you
            </motion.p>

            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex gap-4 flex-col sm:flex-row">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Enter location"
                    className="pl-12 h-14 text-lg border-2 border-gray-200 rounded-2xl focus:border-red-500"
                    data-testid="gym-location-input"
                  />
                </div>
                <Button
                  className="h-14 px-8 bg-gradient-to-r from-red-600 to-orange-600 hover:shadow-2xl transition-all duration-300 rounded-2xl"
                  data-testid="gym-search-button"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Wave divider */}
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

      <main className="container mx-auto px-4 py-12">
        {/* Fitness Categories */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Fitness Categories</h2>
            <p className="text-gray-600">Choose your preferred workout style</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {fitnessCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.name}
                  variants={staggerItem}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="group cursor-pointer"
                >
                  <Card className="text-center hover:shadow-2xl transition-all duration-300 border-0 bg-white overflow-hidden">
                    <CardContent className="p-6">
                      <motion.div
                        className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-orange-600 transition-all">
                        {category.name}
                      </h3>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Popular Gyms */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Gyms Near You</h2>
              <p className="text-gray-600">Top-rated fitness centers in your area</p>
            </div>
            <Button variant="outline" className="hidden md:flex">
              View All →
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularGyms.map((gym, index) => (
              <motion.div
                key={gym.name}
                variants={staggerItem}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={gym.image}
                      alt={gym.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">{gym.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{gym.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {gym.location}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {gym.members} members
                      </span>
                      <Button size="sm" className="bg-gradient-to-r from-red-600 to-orange-600">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Membership Plans */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Membership Plans</h2>
            <p className="text-gray-600">Choose the plan that fits your goals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {membershipPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                variants={staggerItem}
                whileHover={{ y: -12, scale: 1.02 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg z-10">
                    Most Popular
                  </div>
                )}
                <Card className={`h-full hover:shadow-2xl transition-all duration-300 ${
                  plan.popular ? 'border-2 border-red-500 shadow-xl' : 'border-0'
                }`}>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                        {plan.price}
                      </span>
                      <span className="text-gray-600">{plan.duration}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-green-600 text-xs">✓</span>
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? 'bg-gradient-to-r from-red-600 to-orange-600'
                          : 'bg-gray-900'
                      }`}
                      data-testid={`plan-${plan.name.toLowerCase()}-button`}
                    >
                      Get Started
                    </Button>
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
