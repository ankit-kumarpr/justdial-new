
'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Download, Calendar, CreditCard, Sparkles } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { DashboardHeader } from '@/components/justdial/your-dashboard/DashboardHeader';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

const financialYears = ['2024-2025', '2023-2024', '2022-2023'];

function InvoicesPageComponent() {
    const [year, setYear] = useState(financialYears[0]);

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
                className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    x: [0, -50, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <DashboardHeader title="Invoices" />

            <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-3xl hover-lift overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50" />
                            
                            <CardContent className="p-8 relative z-10">
                                {/* Year Selector */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-8"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        <label className="font-semibold text-gray-700">Select Financial Year</label>
                                    </div>
                                    <Select value={year} onValueChange={setYear}>
                                        <SelectTrigger className="w-full md:w-80 h-12 border-2 border-gray-200 hover:border-primary transition-colors">
                                            <SelectValue placeholder="Select Financial Year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {financialYears.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </motion.div>

                                {/* Tabs */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Tabs defaultValue="one-time" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl h-auto">
                                            <TabsTrigger 
                                                value="one-time" 
                                                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 py-3 font-semibold"
                                            >
                                                <CreditCard className="h-4 w-4 mr-2" />
                                                ONE TIME PAYMENTS
                                            </TabsTrigger>
                                            <TabsTrigger 
                                                value="monthly" 
                                                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 py-3"
                                            >
                                                <div className="flex flex-col text-center">
                                                    <span className="font-semibold">ECS / CCSI</span>
                                                    <span className="text-xs font-normal">MONTHLY PAYMENTS</span>
                                                </div>
                                            </TabsTrigger>
                                        </TabsList>
                                        
                                        <TabsContent value="one-time" className="pt-12">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5 }}
                                                className="text-center py-12"
                                            >
                                                <motion.div
                                                    animate={{
                                                        y: [0, -10, 0],
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                    }}
                                                    className="relative"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl" />
                                                    <Image 
                                                        src={findImage('no-invoices-illustration')} 
                                                        alt="No Invoices Found"
                                                        width={200}
                                                        height={200}
                                                        className="mx-auto relative z-10"
                                                        data-ai-hint="document search"
                                                    />
                                                </motion.div>
                                                <h3 className="mt-6 text-2xl font-bold text-gray-800">No Invoices Found</h3>
                                                <p className="mt-2 text-gray-600">You don't have any one-time payment invoices for {year}</p>
                                                <Button
                                                    className="mt-6 bg-gradient-to-r from-primary to-accent hover:shadow-xl transition-all duration-300 hover:scale-105"
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Download Statement
                                                </Button>
                                            </motion.div>
                                        </TabsContent>
                                        
                                        <TabsContent value="monthly" className="pt-12">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5 }}
                                                className="text-center py-12"
                                            >
                                                <motion.div
                                                    animate={{
                                                        y: [0, -10, 0],
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                    }}
                                                    className="relative"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl" />
                                                    <Image 
                                                        src={findImage('no-invoices-illustration')} 
                                                        alt="No Invoices Found"
                                                        width={200}
                                                        height={200}
                                                        className="mx-auto relative z-10"
                                                        data-ai-hint="document search"
                                                    />
                                                </motion.div>
                                                <h3 className="mt-6 text-2xl font-bold text-gray-800">No Monthly Invoices Found</h3>
                                                <p className="mt-2 text-gray-600">You don't have any monthly payment invoices for {year}</p>
                                                <Button
                                                    className="mt-6 bg-gradient-to-r from-primary to-accent hover:shadow-xl transition-all duration-300 hover:scale-105"
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Download Statement
                                                </Button>
                                            </motion.div>
                                        </TabsContent>
                                    </Tabs>
                                </motion.div>

                                {/* Info Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-8"
                                >
                                    <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-0 shadow-md">
                                        <CardContent className="p-4 flex items-start gap-3">
                                            <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-gray-800 mb-1">Need Help?</h4>
                                                <p className="text-sm text-gray-700">Contact our support team for invoice-related queries or download your annual statement.</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </motion.div>
    );
}

export default function InvoicesPage() {
    return (
        <Suspense>
            <InvoicesPageComponent />
        </Suspense>
    )
}
