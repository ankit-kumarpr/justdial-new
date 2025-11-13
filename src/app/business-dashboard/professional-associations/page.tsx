
'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Award, Building2, CheckCircle2, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { DashboardHeader } from '@/components/justdial/your-dashboard/DashboardHeader';
import { useSearchParams } from 'next/navigation';

const examples = [
    'SME India',
    'National Bank for Agriculture & Rural Development (NABARD)',
    'Association Of Medical Consultant Of Mumbai',
    'Maharashtra Motor Parts Association',
    'India Trade Promotion Organisation (ITPO)',
];

function ProfessionalAssociationsPageComponent() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id');

    const [associations, setAssociations] = useState('');

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
                className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
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
                className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
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

            <DashboardHeader title="Professional Associations" />

            <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
                <div className="max-w-4xl mx-auto space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Alert className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
                            <Info className="h-5 w-5 text-amber-600" />
                            <AlertDescription className="text-gray-700">
                                Please note that any changes to the details below can go for verification and take upto 2 working days to go live.
                            </AlertDescription>
                        </Alert>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <Card className="shadow-2xl border-0 rounded-3xl hover-lift overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent opacity-50" />
                            
                            <CardContent className="p-8 relative z-10">
                                {/* Main Input Section */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-4 mb-8"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <Building2 className="h-5 w-5 text-primary" />
                                        <Label htmlFor="professional-associations" className="text-lg font-bold text-gray-800">
                                            Professional Associations
                                        </Label>
                                    </div>
                                    <Input 
                                        id="professional-associations" 
                                        placeholder="E.g: Chartered Accountants Society" 
                                        value={associations}
                                        onChange={(e) => setAssociations(e.target.value)}
                                        className="h-14 text-lg border-2 border-gray-200 hover:border-primary focus:border-primary transition-colors"
                                        data-testid="associations-input"
                                    />
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        Add memberships to build credibility with customers
                                    </p>
                                </motion.div>

                                {/* Divider */}
                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-white px-4 text-sm text-gray-500 font-medium">Examples</span>
                                    </div>
                                </div>

                                {/* Examples Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <Lightbulb className="h-5 w-5 text-amber-500" />
                                        <h3 className="text-sm font-bold text-gray-800">Some examples of professional associations:</h3>
                                    </div>
                                    <div className="grid gap-3">
                                        {examples.map((example, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + index * 0.1 }}
                                                whileHover={{ x: 4, scale: 1.01 }}
                                                className="group cursor-pointer"
                                                onClick={() => setAssociations(example)}
                                            >
                                                <Card className="border-0 bg-gradient-to-r from-gray-50 to-white hover:from-primary/5 hover:to-accent/5 transition-all duration-300 shadow-sm hover:shadow-md">
                                                    <CardContent className="p-4 flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                            <Award className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <p className="text-sm text-gray-700 font-medium group-hover:text-primary transition-colors">{example}</p>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Info Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 }}
                                    className="mt-8"
                                >
                                    <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-0 shadow-md">
                                        <CardContent className="p-4 flex items-start gap-3">
                                            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-gray-800 mb-1">Why add professional associations?</h4>
                                                <p className="text-sm text-gray-700">Professional memberships enhance your business credibility and help customers trust your services. They demonstrate your commitment to industry standards.</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>

            <footer className="bg-white/80 backdrop-blur-md py-4 border-t shadow-2xl sticky bottom-0 z-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Button 
                        className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!associations.trim()}
                        data-testid="save-associations-button"
                    >
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Save & Submit for Verification
                    </Button>
                </div>
            </footer>
        </motion.div>
    );
}

export default function ProfessionalAssociationsPage() {
    return (
        <Suspense>
            <ProfessionalAssociationsPageComponent />
        </Suspense>
    )
}
