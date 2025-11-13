'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, PlusCircle, Trash2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

type Customer = {
    id: number;
    name: string;
    mobile: string;
};

export default function GetRatingsPage() {
    const [customers, setCustomers] = useState<Customer[]>([
        { id: 1, name: '', mobile: '' }
    ]);

    const addCustomer = () => {
        setCustomers([...customers, { id: Date.now(), name: '', mobile: '' }]);
    };

    const removeCustomer = (id: number) => {
        setCustomers(customers.filter(customer => customer.id !== id));
    };

    const handleInputChange = (id: number, field: keyof Omit<Customer, 'id'>, value: string) => {
        setCustomers(customers.map(customer => customer.id === id ? { ...customer, [field]: value } : customer));
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

            <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-20 border-b border-gray-100">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/business-dashboard">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="icon">
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                        </motion.div>
                    </Link>
                    <div>
                        <h1 className="font-bold text-lg">Xncoder</h1>
                        <p className="text-sm text-gray-500">Kamal Chowk</p>
                    </div>
                </div>
                <div className="container mx-auto px-4 py-2 border-t border-gray-100">
                    <h2 className="font-semibold text-primary">Get Ratings</h2>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-6 relative z-10">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500">
                            <CardContent className="p-8 flex flex-col items-center text-center">
                                <Image 
                                    src={findImage('get-ratings-illustration')}
                                    alt="Easiest way to get rated"
                                    width={200}
                                    height={150}
                                    className="mb-4"
                                    data-ai-hint="man holding phone"
                                />
                                <h3 className="text-xl font-bold">Easiest Way to Get Rated</h3>
                                <p className="text-sm opacity-90 mb-4">Collect feedback instantly</p>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button asChild variant="secondary" className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500">
                                        <Link href="/business-dashboard/ratings-qr">Share Your Rating QR</Link>
                                    </Button>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Request ratings from other customers</h3>
                                <form className="space-y-4">
                                    {customers.map((customer, index) => (
                                        <motion.div
                                            key={customer.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="space-y-3"
                                        >
                                            <div className="relative">
                                                <Label htmlFor={`customer-name-${customer.id}`} className="sr-only">Customer Name</Label>
                                                <Input 
                                                    id={`customer-name-${customer.id}`}
                                                    placeholder="Customer Name*"
                                                    value={customer.name}
                                                    onChange={e => handleInputChange(customer.id, 'name', e.target.value)}
                                                />
                                                {customers.length > 1 && (
                                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="absolute right-1 top-1/2 -translate-y-1/2">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8 text-gray-400 hover:text-destructive"
                                                            onClick={() => removeCustomer(customer.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </motion.div>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor={`customer-mobile-${customer.id}`} className="sr-only">Customer Mobile Number</Label>
                                                <Input 
                                                    id={`customer-mobile-${customer.id}`}
                                                    placeholder="Customer Mobile Number*"
                                                    type="tel"
                                                    value={customer.mobile}
                                                    onChange={e => handleInputChange(customer.id, 'mobile', e.target.value)}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                    
                                    <motion.div whileHover={{ scale: 1.02 }}>
                                        <Button variant="link" size="sm" className="p-0 h-auto text-primary" onClick={addCustomer}>
                                            <PlusCircle className="h-4 w-4 mr-2" />
                                            Add Another Customer Contact
                                        </Button>
                                    </motion.div>

                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button type="submit" className="w-full bg-gray-400 hover:bg-gray-500 text-white" disabled>
                                            Send Request
                                        </Button>
                                    </motion.div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </motion.div>
    );
}