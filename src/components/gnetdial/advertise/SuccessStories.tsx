
'use client';

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { successStories } from "@/lib/gnetdial-data"
import Image from "next/image"
import { PlayCircle, Quote } from "lucide-react"
import { motion } from 'framer-motion';
import Link from 'next/link';

export function SuccessStories() {
  return (
    <section className="mt-16">
      <motion.div 
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="inline-block bg-gradient-to-br from-primary/20 to-accent/20 p-6 rounded-full mb-4"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Quote className="text-5xl w-12 h-12 text-primary" />
        </motion.div>
        <h2 className="text-4xl font-bold mt-4 mb-2 text-gradient-animated">Success Stories</h2>
        <motion.p 
          className="text-gray-600 text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Join <span className="font-bold text-primary">6.1 Lakh+</span> successful advertisers
        </motion.p>
      </motion.div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {successStories.map((story, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <motion.div 
                    className="p-1"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Link href="#">
                        <motion.div whileHover={{ scale: 1.03, y: -5 }}>
                        <Card className={`overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 ${story.bgColor}`}>
                            <CardContent className="p-0">
                            <div className="relative group">
                                <Image
                                src={story.image}
                                alt={story.name}
                                width={400}
                                height={225}
                                className="w-full"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center group-hover:bg-black/40 transition-all duration-300">
                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <PlayCircle className="w-16 h-16 text-white opacity-90 drop-shadow-lg cursor-pointer" />
                                </motion.div>
                                </div>
                            </div>
                            <div className="p-6 bg-white">
                                <h3 className="font-bold text-lg mb-1">{story.name}</h3>
                                <p className="text-sm text-gray-600 mb-3">{story.company}</p>
                                <motion.div
                                className="text-sm text-primary font-medium inline-flex items-center hover:text-accent transition-colors"
                                whileHover={{ x: 5 }}
                                >
                                Watch their success stories →
                                </motion.div>
                            </div>
                            </CardContent>
                        </Card>
                        </motion.div>
                    </Link>
                </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-[-1rem]"/>
        <CarouselNext className="right-[-1rem]"/>
      </Carousel>
    </section>
  )
}
