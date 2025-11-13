'use client';
import { popularBeautyServices } from "@/lib/beauty-spa-data";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { motion } from 'framer-motion';

export function PopularBeautyServices() {
    return (
        <section className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-purple-50/50 opacity-50" />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative z-10"
            >
                <h2 className="text-4xl font-bold text-center mb-3">
                    <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent">
                        Popular Beauty Services
                    </span>
                </h2>
                <p className="text-center text-gray-600 mb-8">Explore our wide range of beauty and wellness services</p>
            </motion.div>
            
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-6 relative z-10">
                {popularBeautyServices.map((service, index) => (
                    <motion.a 
                        key={service.name} 
                        href="#" 
                        className="flex flex-col items-center text-center group"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                        whileHover={{ y: -5 }}
                    >
                        <motion.div 
                            className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-3 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                            <div className="relative w-14 h-14">
                                <Image
                                    src={service.icon}
                                    alt={service.name}
                                    fill
                                    className="object-contain group-hover:scale-110 transition-transform duration-300"
                                    data-ai-hint={service.hint}
                                />
                            </div>
                        </motion.div>
                        <p className="text-sm font-semibold group-hover:text-pink-500 transition-colors">{service.name}</p>
                        <p className="text-xs text-gray-500">{service.description}</p>
                    </motion.a>
                ))}
            </div>
        </section>
    );
}
