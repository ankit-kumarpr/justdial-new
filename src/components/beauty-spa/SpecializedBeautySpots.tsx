'use client';
import { Card, CardContent } from "@/components/ui/card";
import { specializedBeautySpots } from "@/lib/beauty-spa-data";
import Image from "next/image";
import { motion } from 'framer-motion';

export function SpecializedBeautySpots() {
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
                        Specialized Beauty Spots
                    </span>
                </h2>
                <p className="text-gray-600">Expert treatments for specific beauty needs</p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {specializedBeautySpots.map((spot, index) => (
                    <motion.a 
                        key={spot.name} 
                        href="#" 
                        className="group"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <motion.div whileHover={{ y: -10, scale: 1.02 }}>
                            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-pink-200 relative">
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                                
                                <motion.div 
                                    className="relative h-48"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Image
                                        src={spot.image}
                                        alt={spot.name}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={spot.hint}
                                    />
                                </motion.div>
                                
                                <CardContent className="p-4 bg-white relative z-20">
                                    <h3 className="font-bold text-center text-lg group-hover:text-pink-500 transition-colors">
                                        {spot.name}
                                    </h3>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.a>
                ))}
            </div>
        </section>
    )
}
