
'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Sparkles, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

const discountOptions = [
    {
        label: '30%',
        value: 30,
        points: [
            'Enhanced visibility in search results.',
            'Access to basic lead management tools.',
            'Standard customer support.'
        ],
        targetImageIndex: 0
    },
    {
        label: '50%',
        value: 50,
        points: [
            'Prime placement in search results.',
            'Advanced lead management and analytics.',
            'Priority customer support.',
            'Verified business badge.'
        ],
        targetImageIndex: 1
    },
    {
        label: '80%',
        value: 80,
        points: [
            'Guaranteed top-ranking placement.',
            'Full suite of analytics and competitor insights.',
            'Dedicated account manager.',
            'Premium trust seals and badges.'
        ],
        targetImageIndex: 2
    },
];

const screenshots = [
    { id: 'plan-screenshot-1', hint: 'dashboard analytics' },
    { id: 'plan-screenshot-2', hint: 'user interface' },
    { id: 'plan-screenshot-3', hint: 'mobile app screen' },
];

export function Plans() {
    const [selectedDiscount, setSelectedDiscount] = React.useState<number | null>(50);

    return (
        <section className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold mb-3 text-gradient-animated">Simple, Transparent Pricing</h2>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">Choose a plan that works for you. Get more features and save more with higher discounts.</p>
                </motion.div>

                {/* Discount Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex justify-center items-center gap-4 md:gap-8 mb-12"
                >
                    {discountOptions.map((option) => (
                        <motion.div 
                            key={option.value}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                onClick={() => setSelectedDiscount(option.value)}
                                className={cn(
                                    "rounded-full h-20 w-20 md:h-24 md:w-24 flex flex-col text-lg font-bold transition-all duration-300 border-4 shadow-lg",
                                    selectedDiscount === option.value
                                        ? 'bg-gradient-to-br from-primary to-accent text-white border-white/50 animate-pulse-scale'
                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-primary/10 hover:border-primary/50'
                                )}
                            >
                                {option.label}
                                <span className="text-xs font-normal">Discount</span>
                            </Button>
                        </motion.div>
                    ))}
                </motion.div>

                <AnimatePresence>
                {selectedDiscount !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: 20, height: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-8 border-t">
                            {/* Left Side: Stacked Screenshots */}
                            <div className="flex flex-col items-center justify-center space-y-4">
                                {screenshots.map((screenshot, index) => {
                                    const isSelected = discountOptions.find(d => d.value === selectedDiscount)?.targetImageIndex === index;
                                    return (
                                        <motion.div
                                            key={screenshot.id}
                                            className={cn(
                                                "relative aspect-[16/9] w-72 rounded-xl shadow-lg border-2 transition-all duration-300",
                                                isSelected ? 'scale-110 shadow-primary/50 shadow-2xl border-primary' : 'border-transparent'
                                            )}
                                            animate={isSelected ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                                        >
                                            <Image
                                                src={findImage(screenshot.id)!}
                                                alt={`Plan screenshot ${index + 1}`}
                                                fill
                                                className="object-cover rounded-lg"
                                                data-ai-hint={screenshot.hint}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Right Side: Discount Info */}
                            <motion.div 
                                key={selectedDiscount} // Re-trigger animation on change
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Card className="bg-gradient-to-br from-gray-50 to-white/50 border-0 shadow-xl">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-bold mb-4 text-gradient-animated">
                                            {selectedDiscount}% Discount Plan Includes:
                                        </h3>
                                        <ul className="space-y-3">
                                            {discountOptions.find(d => d.value === selectedDiscount)?.points.map((point, i) => (
                                                <motion.li 
                                                    key={i} 
                                                    className="flex items-start gap-3"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.3 + i * 0.1 }}
                                                >
                                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-600">{point}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                         <motion.div 
                           className="text-center mt-12"
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.5, delay: 0.4 }}
                         >
                            <Button size="lg" className="w-full max-w-md bg-gradient-to-r from-primary to-accent text-white hover:shadow-xl h-14 text-lg">
                                <Sparkles className="mr-2 h-5 w-5" />
                                Get Started with {selectedDiscount}% Discount
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </section>
    );
}
