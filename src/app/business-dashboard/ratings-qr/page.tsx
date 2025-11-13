
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Star, Link as LinkIcon, Download, Share2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { DashboardHeader } from "@/components/justdial/your-dashboard/DashboardHeader";
import { Suspense } from 'react';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

function RatingsQrPageComponent() {
    const { toast } = useToast();

    const copyLink = () => {
        navigator.clipboard.writeText("https://example.com/rate/xncoder");
        toast({
            title: "Link Copied!",
            description: "The rating link has been copied to your clipboard.",
        });
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
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

            <DashboardHeader title="Rate My Business" showClose />
            
            <main className="flex-grow container mx-auto px-4 py-6 flex items-center justify-center relative z-10">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <Card className="rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 text-white border-none">
                            <CardContent className="p-8 text-center flex flex-col items-center">
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-gray-300 mb-2"
                                >
                                    Please help us do better
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex items-center gap-1 mb-4"
                                >
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 + i * 0.1 }}
                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                        >
                                            <Star className="h-8 w-8 text-orange-400 fill-orange-400" />
                                        </motion.div>
                                    ))}
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="p-6 border-2 border-primary/20 rounded-2xl bg-white mb-4 shadow-lg"
                                >
                                    <Image
                                        src={findImage('rating-qr-code')}
                                        alt="Rating QR Code"
                                        width={160}
                                        height={160}
                                    />
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="font-bold text-lg text-white"
                                >
                                    Xncoder
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="text-sm text-gray-400 mb-4"
                                >
                                    Kamal Chowk, Nagpur
                                </motion.p>
                                <div className="border-t border-dashed w-1/4 mx-auto mb-4 border-gray-600"></div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button variant="link" className="text-orange-400 font-medium hover:text-orange-300" onClick={copyLink}>
                                        <LinkIcon className="h-4 w-4 mr-2" />
                                        Copy Link
                                    </Button>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="grid grid-cols-2 gap-4 mt-6"
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" className="w-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                                <Download className="h-4 w-4 mr-2" />
                                Download QR Code
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button className="w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300">
                                <Share2 className="h-4 w-4 mr-2" />
                                Share QR Code
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </main>
        </motion.div>
    );
}

export default function RatingsQrPage() {
    return (
        <Suspense>
            <RatingsQrPageComponent />
        </Suspense>
    )
}
