
'use client';

import { Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { bizBoostersData } from "@/lib/biz-boosters-data";
import { cn } from "@/lib/utils";
import { Lock, TrendingUp } from "lucide-react";
import Image from "next/image";
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { DashboardHeader } from '@/components/justdial/your-dashboard/DashboardHeader';

function BizBoostersPageComponent() {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen relative overflow-hidden"
        >
            {/* Animated background blobs */}
            <motion.div
                className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
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
                className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
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

            <DashboardHeader title="Biz Boosters" />
            <main className="container mx-auto px-4 py-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bizBoostersData.map((booster, index) => (
                        <motion.div
                            key={booster.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.03, y: -5 }}
                            className={cn(
                                "rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 relative overflow-hidden flex flex-col justify-between border-none backdrop-blur-sm",
                                booster.bgColor,
                                booster.borderColor
                            )}
                        >
                            {booster.badge && (
                                <div className={cn("absolute top-0 left-4 text-xs font-semibold text-white px-3 py-1 rounded-b-md shadow-md", booster.badgeColor)}>
                                    {booster.badge}
                                </div>
                            )}

                            <div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="font-bold text-lg">{booster.title}</h2>
                                        {booster.originalPrice && (
                                            <div className="flex items-center gap-2 text-sm mt-1">
                                                <span className="line-through text-gray-500">₹{booster.originalPrice}/{booster.priceType}</span>
                                                <span className="font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">{booster.discount}</span>
                                                {booster.trending && (
                                                    <div className="flex items-center text-red-500 bg-red-100 px-2 py-0.5 rounded text-xs font-semibold">
                                                        <TrendingUp className="h-4 w-4 mr-1" />
                                                        Trending
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <motion.div
                                        whileHover={{ rotate: 5, scale: 1.1 }}
                                        className="w-24 h-24 relative flex-shrink-0 -mt-2 -mr-2"
                                    >
                                        <Image src={booster.image} alt={booster.title} layout="fill" objectFit="contain" />
                                    </motion.div>
                                </div>

                                <div className="mt-4">
                                    <p className="text-sm">{booster.priceLabel}</p>
                                    <p className="text-4xl font-bold">
                                        ₹{booster.price}
                                        {booster.priceType === 'day' && <span className="text-base font-normal">/day</span>}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center gap-4">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                                    <Button className="bg-black text-white hover:bg-gray-800 shadow-lg w-full">
                                        {booster.buttonText}
                                        {booster.buttonIcon === 'lock' ? <Lock className="ml-2 h-4 w-4" /> : ' >'}
                                    </Button>
                                </motion.div>
                                {booster.explore && <a href="#" className="text-sm font-medium text-primary hover:underline">Explore</a>}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center text-xs text-gray-500 mt-12"
                >
                    #To activate the Gd Trust/Verified badge, the business needs to have its KYC verified and has to be rated at an average of 3.8+ Star.
                </motion.p>
            </main>
        </motion.div>
    );
}

export default function BizBoostersPage() {
    return (
        <Suspense>
            <BizBoostersPageComponent />
        </Suspense>
    )
}
