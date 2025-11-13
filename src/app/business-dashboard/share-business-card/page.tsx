
'use client';

import { Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Download, Share2, Globe, Phone, Mail } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { DashboardHeader } from '@/components/justdial/your-dashboard/DashboardHeader';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

function ShareBusinessCardPageComponent() {
    const { toast } = useToast();

    const shareBusinessCard = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Xncoder Business Card',
                text: 'Here is the business card for Xncoder.',
                url: window.location.href,
            })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
        } else {
             toast({
                title: "Share Not Supported",
                description: "Your browser does not support the Web Share API.",
                variant: "destructive"
            });
        }
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

            <DashboardHeader title="Share Business Card" showClose />
            
            <main className="flex-grow container mx-auto px-4 py-6 flex items-center justify-center relative z-10">
                <div className="w-full max-w-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <Card className="rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 text-white border-none">
                            <CardContent className="p-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-4 mb-6"
                                >
                                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                                        <Image
                                            src={findImage('business-profile-image')}
                                            alt="Xncoder Logo"
                                            width={64}
                                            height={64}
                                            className="rounded-full border-2 border-gray-500 shadow-lg"
                                        />
                                    </motion.div>
                                    <div>
                                        <h2 className="font-bold text-2xl">Xncoder</h2>
                                        <p className="text-sm text-gray-300">IT Solution Providers</p>
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-3 text-sm"
                                >
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="flex items-center gap-3"
                                    >
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <span>+91 83298 63637</span>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="flex items-center gap-3"
                                    >
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span>contact@xncoder.com</span>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="flex items-center gap-3"
                                    >
                                        <Globe className="h-4 w-4 text-gray-400" />
                                        <span>www.xncoder.com</span>
                                    </motion.div>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="grid grid-cols-2 gap-4 mt-6"
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" className="w-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button className="w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300" onClick={shareBusinessCard}>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </main>
        </motion.div>
    );
}

export default function ShareBusinessCardPage() {
    return (
        <Suspense>
            <ShareBusinessCardPageComponent />
        </Suspense>
    )
}
