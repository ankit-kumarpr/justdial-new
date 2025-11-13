
'use client';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { topSalonsAndSpas } from "@/lib/beauty-spa-data";
import Image from "next/image";
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Star } from 'lucide-react';

export function TopSalonsAndSpas() {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent">
            Top Salons and Spas
          </span>
        </h2>
        <p className="text-gray-600">Premium beauty destinations near you</p>
      </motion.div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {topSalonsAndSpas.map((item, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <motion.div 
              className="p-1"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div whileHover={{ y: -5 }}>
                <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-pink-200 bg-white">
                  <CardContent className="p-0">
                    <div className="flex items-center p-6 gap-6">
                      <motion.div 
                        className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg flex-shrink-0"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          data-ai-hint={item.hint}
                        />
                      </motion.div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1 text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          {item.location}
                        </p>
                        
                        <div className="flex gap-3">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 h-9 shadow-md">
                              <Phone className="w-4 h-4 mr-2" />
                              Call Now
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="sm" variant="outline" className="h-9 border-2 hover:border-pink-300 hover:bg-pink-50">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              WhatsApp
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-[-1rem]"/>
        <CarouselNext className="right-[-1rem]"/>
      </Carousel>
      <motion.div 
        className="text-center mt-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-6 text-lg shadow-xl">
            View All Salons & Spas
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
