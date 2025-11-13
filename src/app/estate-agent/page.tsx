'use client';
import { JustdialHeader } from '@/components/justdial/JustdialHeader';
import { JustdialFooter } from '@/components/justdial/JustdialFooter';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations';
import { Search, MapPin, Home, Building2, Key, TrendingUp, Star, Bed, Bath, Square } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

const propertyTypes = [
  { name: 'Apartments', icon: Building2, count: '1200+', color: 'from-blue-500 to-cyan-500' },
  { name: 'Villas', icon: Home, count: '350+', color: 'from-purple-500 to-pink-500' },
  { name: 'Commercial', icon: TrendingUp, count: '580+', color: 'from-green-500 to-teal-500' },
  { name: 'Land', icon: Square, count: '420+', color: 'from-orange-500 to-red-500' },
];

const featuredProperties = [
  {
    title: 'Luxury Villa in Juhu',
    location: 'Juhu, Mumbai',
    price: '₹8.5 Cr',
    beds: 4,
    baths: 3,
    area: '3200 sq.ft',
    image: findImage('jd-hero-1'),
    rating: 4.8,
    type: 'Villa'
  },
  {
    title: 'Modern Apartment',
    location: 'Bandra West',
    price: '₹2.8 Cr',
    beds: 3,
    baths: 2,
    area: '1800 sq.ft',
    image: findImage('jd-hero-2'),
    rating: 4.6,
    type: 'Apartment'
  },
  {
    title: 'Commercial Space',
    location: 'Andheri East',
    price: '₹1.2 Cr',
    beds: null,
    baths: 2,
    area: '2500 sq.ft',
    image: findImage('jd-hero-3'),
    rating: 4.7,
    type: 'Commercial'
  },
  {
    title: 'Penthouse Suite',
    location: 'Worli',
    price: '₹12 Cr',
    beds: 5,
    baths: 4,
    area: '4500 sq.ft',
    image: findImage('jd-hero-4'),
    rating: 4.9,
    type: 'Penthouse'
  },
];

const topAgents = [
  { name: 'Priya Real Estate', deals: '500+ deals', rating: 4.9, image: findImage('jd-trending-1') },
  { name: 'Mumbai Properties', deals: '350+ deals', rating: 4.7, image: findImage('jd-trending-2') },
  { name: 'Elite Homes', deals: '420+ deals', rating: 4.8, image: findImage('jd-trending-3') },
  { name: 'Luxury Living', deals: '280+ deals', rating: 4.6, image: findImage('jd-trending-4') },
];

export default function EstateAgentPage() {
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
          className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
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
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 border border-blue-500/20"
            >
              <Key className="h-4 w-4 text-blue-600 animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Find Your Dream Property</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="block"
              >
                Discover Premium
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"
              >
                Properties
              </motion.span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-gray-600 mb-8"
            >
              Connect with trusted estate agents for buying, selling, or renting
            </motion.p>

            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-3xl mx-auto"
            >
              <div className="flex gap-4 flex-col sm:flex-row items-stretch">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Enter location"
                    className="pl-12 h-14 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500"
                    data-testid="estate-location-input"
                  />
                </div>
                <Select>
                  <SelectTrigger className="h-14 w-full sm:w-48 border-2 border-gray-200 rounded-2xl">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-2xl transition-all duration-300 rounded-2xl"
                  data-testid="estate-search-button"
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
        {/* Property Types */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Property Types</h2>
            <p className="text-gray-600">Browse properties by category</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {propertyTypes.map((type, index) => {
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
                        className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center shadow-lg`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="h-10 w-10 text-white" />
                      </motion.div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                        {type.name}
                      </h3>
                      <p className="text-sm text-gray-500">{type.count} listings</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Featured Properties */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Properties</h2>
              <p className="text-gray-600">Premium properties handpicked for you</p>
            </div>
            <Button variant="outline" className="hidden md:flex">
              View All →
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.title}
                variants={staggerItem}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0">
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {property.type}
                    </div>
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">{property.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{property.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {property.location}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      {property.beds && (
                        <span className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          {property.beds}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        {property.baths}
                      </span>
                      <span className="flex items-center gap-1">
                        <Square className="h-4 w-4" />
                        {property.area}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        {property.price}
                      </span>
                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Top Agents */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Top Estate Agents</h2>
            <p className="text-gray-600">Connect with verified professionals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topAgents.map((agent, index) => (
              <motion.div
                key={agent.name}
                variants={staggerItem}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <Card className="text-center hover:shadow-2xl transition-all duration-300 border-0">
                  <CardContent className="p-6">
                    <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-100 group-hover:border-blue-500 transition-colors">
                      <Image
                        src={agent.image}
                        alt={agent.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{agent.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{agent.deals}</p>
                    <div className="flex items-center justify-center gap-1 mb-4">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">{agent.rating}</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white group-hover:border-0">
                      Contact Agent
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
