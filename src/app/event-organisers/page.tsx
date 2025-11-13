'use client';
import { JustdialHeader } from '@/components/justdial/JustdialHeader';
import { JustdialFooter } from '@/components/justdial/JustdialFooter';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations';
import { Search, MapPin, PartyPopper, Music, Users, Camera, Star, Calendar, Award } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

const eventTypes = [
  { name: 'Wedding', icon: PartyPopper, color: 'from-pink-500 to-rose-500', events: '500+' },
  { name: 'Corporate', icon: Award, color: 'from-blue-500 to-indigo-500', events: '320+' },
  { name: 'Birthday', icon: PartyPopper, color: 'from-purple-500 to-pink-500', events: '450+' },
  { name: 'Concert', icon: Music, color: 'from-green-500 to-teal-500', events: '180+' },
  { name: 'Conference', icon: Users, color: 'from-orange-500 to-red-500', events: '250+' },
  { name: 'Photography', icon: Camera, color: 'from-cyan-500 to-blue-500', events: '380+' },
];

const featuredOrganizers = [
  {
    name: 'Elite Events',
    specialization: 'Wedding & Corporate',
    rating: 4.9,
    eventsCompleted: '500+',
    image: findImage('jd-popular-5'),
    price: '₹50,000+'
  },
  {
    name: 'Dream Makers',
    specialization: 'Birthday & Celebrations',
    rating: 4.8,
    eventsCompleted: '450+',
    image: findImage('jd-popular-6'),
    price: '₹30,000+'
  },
  {
    name: 'Grand Celebrations',
    specialization: 'Corporate Events',
    rating: 4.7,
    eventsCompleted: '320+',
    image: findImage('jd-hero-1'),
    price: '₹75,000+'
  },
  {
    name: 'Perfect Moments',
    specialization: 'Photography & Videography',
    rating: 4.9,
    eventsCompleted: '600+',
    image: findImage('jd-hero-2'),
    price: '₹20,000+'
  },
];

const eventPackages = [
  {
    name: 'Basic',
    price: '₹25,000',
    features: [
      'Venue decoration',
      'Basic catering (50 guests)',
      'Photography (2 hours)',
      'Music system'
    ]
  },
  {
    name: 'Premium',
    price: '₹75,000',
    features: [
      'Premium venue decoration',
      'Buffet catering (100 guests)',
      'Photography & Videography',
      'DJ & Entertainment',
      'Event coordination'
    ],
    popular: true
  },
  {
    name: 'Luxury',
    price: '₹1,50,000',
    features: [
      'Luxury venue & decoration',
      'Premium catering (200+ guests)',
      'Professional photo/video',
      'Live band & entertainment',
      'Complete event management',
      'Guest accommodation'
    ]
  },
];

const recentEvents = [
  { title: 'Corporate Gala 2024', organizer: 'Elite Events', image: findImage('jd-hero-3'), attendees: '500+' },
  { title: 'Dream Wedding', organizer: 'Perfect Moments', image: findImage('jd-hero-4'), attendees: '300+' },
  { title: 'Birthday Bash', organizer: 'Dream Makers', image: findImage('jd-trending-1'), attendees: '150+' },
  { title: 'Tech Conference', organizer: 'Grand Celebrations', image: findImage('jd-trending-2'), attendees: '800+' },
];

export default function EventOrganisersPage() {
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
          className="absolute top-20 left-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
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
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border border-pink-500/20"
            >
              <PartyPopper className="h-4 w-4 text-pink-600 animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Make Your Event Unforgettable</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="block"
              >
                Plan Your Perfect
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600"
              >
                Celebration
              </motion.span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-gray-600 mb-8"
            >
              Connect with professional event organizers for weddings, birthdays, corporate events & more
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
                    className="pl-12 h-14 text-lg border-2 border-gray-200 rounded-2xl focus:border-pink-500"
                    data-testid="event-location-input"
                  />
                </div>
                <Button
                  className="h-14 px-8 bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-2xl transition-all duration-300 rounded-2xl"
                  data-testid="event-search-button"
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
        {/* Event Types */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Event Types</h2>
            <p className="text-gray-600">Choose the perfect event category</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {eventTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.name}
                  variants={staggerItem}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="group cursor-pointer"
                >
                  <Card className="text-center hover:shadow-2xl transition-all duration-300 border-0 bg-white overflow-hidden">
                    <CardContent className="p-6">
                      <motion.div
                        className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center shadow-lg`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 transition-all">
                        {type.name}
                      </h3>
                      <p className="text-xs text-gray-500">{type.events}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Featured Organizers */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Organizers</h2>
              <p className="text-gray-600">Top-rated event management professionals</p>
            </div>
            <Button variant="outline" className="hidden md:flex">
              View All →
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredOrganizers.map((organizer, index) => (
              <motion.div
                key={organizer.name}
                variants={staggerItem}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={organizer.image}
                      alt={organizer.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">{organizer.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{organizer.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{organizer.specialization}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {organizer.eventsCompleted}
                      </span>
                      <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                        {organizer.price}
                      </span>
                    </div>
                    <Button size="sm" className="w-full bg-gradient-to-r from-pink-600 to-purple-600">
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Event Packages */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Event Packages</h2>
            <p className="text-gray-600">Choose a package that fits your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {eventPackages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                variants={staggerItem}
                whileHover={{ y: -12, scale: 1.02 }}
                className="relative"
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg z-10">
                    Most Popular
                  </div>
                )}
                <Card className={`h-full hover:shadow-2xl transition-all duration-300 ${
                  pkg.popular ? 'border-2 border-pink-500 shadow-xl' : 'border-0'
                }`}>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                        {pkg.price}
                      </span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, idx) => (
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
                        pkg.popular
                          ? 'bg-gradient-to-r from-pink-600 to-purple-600'
                          : 'bg-gray-900'
                      }`}
                      data-testid={`package-${pkg.name.toLowerCase()}-button`}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Recent Events */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Events</h2>
            <p className="text-gray-600">Success stories from our organizers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentEvents.map((event, index) => (
              <motion.div
                key={event.title}
                variants={staggerItem}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0">
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">By {event.organizer}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="h-4 w-4" />
                      {event.attendees} attendees
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
