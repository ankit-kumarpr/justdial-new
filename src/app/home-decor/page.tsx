'use client';

import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Paintbrush, Sparkles, TrendingUp } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

const decorCategories = [
  { name: 'Interior Designers', image: findImage('jd-trending-1'), hint: 'modern living room' },
  { name: 'Furniture Shops', image: findImage('jd-trending-2'), hint: 'furniture showroom' },
  { name: 'Modular Kitchen Dealers', image: 'https://picsum.photos/seed/kitchen-dealers/300/200', hint: 'modular kitchen' },
  { name: 'Wallpaper Dealers', image: findImage('jd-trending-6'), hint: 'wallpaper patterns' },
  { name: 'Painters', image: 'https://picsum.photos/seed/painters/300/200', hint: 'person painting wall' },
  { name: 'Flooring Contractors', image: 'https://picsum.photos/seed/flooring/300/200', hint: 'wooden flooring' },
];

const trendingStyles = [
  { name: 'Modern Minimalist', trend: '+45%' },
  { name: 'Scandinavian', trend: '+38%' },
  { name: 'Bohemian', trend: '+32%' },
  { name: 'Industrial', trend: '+28%' },
];

export default function HomeDecorPage() {
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
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-10 w-10 text-accent" />
              <h1 className="text-5xl font-bold text-gray-800">Home Decor</h1>
            </div>
            <p className="text-xl text-gray-600">Transform your space with the best home decor services</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-purple-500 via-pink-500 to-accent shadow-2xl hover:shadow-3xl transition-shadow border-0">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-white">
                  <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Paintbrush className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Grand Decor Festival!</h3>
                    <p className="text-white/90">Get up to 40% OFF on interior designing services.</p>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg px-8 py-6 text-lg font-semibold"
                  size="lg"
                >
                  Explore Offers
                </Button>
              </CardContent>
            </Card>
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
        {/* Trending Styles */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-800">Trending Design Styles</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingStyles.map((style, index) => (
              <motion.div
                key={style.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              >
                <Card className="hover-lift cursor-pointer bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{style.trend}</div>
                    <h3 className="font-semibold text-gray-800">{style.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">Popular this month</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Popular Services */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Popular Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {decorCategories.map((category, index) => (
              <motion.a
                key={category.name}
                href="#"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                className="group"
              >
                <Card className="overflow-hidden hover-lift bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all">
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      data-ai-hint={category.hint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-center text-sm text-gray-800 group-hover:text-primary transition-colors">{category.name}</h3>
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* Why Choose Us Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Why Choose Our Services?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Expert Designers</h3>
                  <p className="text-sm text-gray-600">Work with certified professionals</p>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Paintbrush className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Quality Materials</h3>
                  <p className="text-sm text-gray-600">Premium quality guaranteed</p>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Best Prices</h3>
                  <p className="text-sm text-gray-600">Competitive rates in the market</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>

      <JustdialFooter />
    </motion.div>
  );
}
