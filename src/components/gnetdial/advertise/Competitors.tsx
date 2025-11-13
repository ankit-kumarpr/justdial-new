
'use client';

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { competitors } from "@/lib/gnetdial-data"
import Image from "next/image"
import { motion } from 'framer-motion';

export function Competitors() {
  return (
    <section className="mt-16 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 p-10 rounded-3xl shadow-xl relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ backgroundSize: '200% 200%' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gradient-animated">Your Competitors</h2>
        <p className="text-center text-gray-600 mb-8">See how businesses like yours are growing</p>
      </motion.div>

      <div className="relative z-10">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {competitors.map((competitor, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                <motion.div 
                  className="p-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div whileHover={{ scale: 1.05, y: -5 }}>
                    <Card className="border-2 border-transparent hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-xl bg-white">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <motion.div 
                          className="relative w-full h-20 mb-4"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Image
                            src={competitor.logo}
                            alt={competitor.name}
                            layout="fill"
                            objectFit="contain"
                          />
                        </motion.div>
                        <h3 className="font-semibold text-lg">{competitor.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">{competitor.location}</p>
                        <motion.a 
                          href="#" 
                          className="text-sm text-primary font-medium hover:text-accent transition-colors"
                          whileHover={{ scale: 1.05 }}
                        >
                          View This Business →
                        </motion.a>
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
      </div>
    </section>
  )
}
