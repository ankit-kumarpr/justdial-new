
'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, CreditCard, Wallet, Banknote, CheckCircle2 } from 'lucide-react';
import { CashIcon, UpiIcon, NetbankingIcon, SodexoIcon, ChequeIcon, EmiIcon } from '@/components/justdial/your-dashboard/PaymentGatewayIcons';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { DashboardHeader } from '@/components/justdial/your-dashboard/DashboardHeader';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

const paymentOptions = [
    {
        id: 'cash',
        label: 'Cash',
        icon: <CashIcon />,
    },
    {
        id: 'upi',
        label: 'UPI',
        description: 'Jd Pay, PhonePe, Google Pay, Paytm, Amazon Pay, etc',
        icon: <UpiIcon />,
    },
];

const cardOptions = [
     {
        id: 'visa-mastercard-rupay',
        label: 'Visa / Master Card / Rupay',
        logo: findImage('visa-mastercard-rupay'),
        width: 100,
        height: 20
    },
    {
        id: 'amex',
        label: 'American Express',
        logo: findImage('amex-logo'),
        width: 80,
        height: 20
    },
    {
        id: 'diners',
        label: 'Diners Club',
        logo: findImage('diners-club-logo'),
        width: 80,
        height: 20
    }
];

const walletOptions = [
    { id: 'jiomoney', label: 'JioMoney', logo: findImage('jiomoney-logo'), width: 80, height: 20 },
    { id: 'paytm', label: 'Paytm', logo: findImage('paytm-logo'), width: 80, height: 20 },
    { id: 'phonepe', label: 'PhonePe', logo: findImage('phonepe-logo'), width: 24, height: 24 },
    { id: 'amazonpay', label: 'Amazon Pay', logo: findImage('amazon-pay-logo'), width: 60, height: 20 },
    { id: 'mobikwik', label: 'MobiKwik', logo: findImage('mobikwik-logo'), width: 80, height: 20 },
];

const otherOptions = [
    {
        id: 'netbanking',
        label: 'Net Banking',
        description: 'RTGS, NEFT and IMPS',
        icon: <NetbankingIcon />,
    },
    {
        id: 'sodexo',
        label: 'Sodexo / Pluxee Card',
        icon: <SodexoIcon />,
    },
    { id: 'cheque', label: 'Cheque / Demand Draft', icon: <ChequeIcon /> },
    { id: 'emi', label: 'EMI Financing', icon: <EmiIcon /> },
]

function PaymentGatewayPageComponent() {
    const [acceptedPayments, setAcceptedPayments] = useState<string[]>(['cash', 'upi', 'visa-mastercard-rupay']);

    const handlePaymentChange = (id: string, checked: boolean) => {
        if (checked) {
            setAcceptedPayments([...acceptedPayments, id]);
        } else {
            setAcceptedPayments(acceptedPayments.filter(p => p !== id));
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
                className="absolute top-20 left-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
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

            <DashboardHeader title="Accepted Payment Modes" />

            <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
                <div className="max-w-4xl mx-auto space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Alert className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                            <Info className="h-5 w-5 text-blue-600" />
                            <AlertDescription className="text-gray-700">
                                Update the payment modes accepted by your business for a smoother transaction with customers.
                            </AlertDescription>
                        </Alert>
                    </motion.div>

                    {/* Cash & UPI */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                    >
                        <Card className="shadow-xl border-0 rounded-2xl hover-lift overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Banknote className="h-5 w-5 text-primary" />
                                    <h3 className="font-bold text-lg text-gray-800">Basic Payment Methods</h3>
                                </div>
                                <div className="space-y-4">
                                    {paymentOptions.map((option, index) => (
                                        <motion.div
                                            key={option.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 + index * 0.1 }}
                                            whileHover={{ x: 4, backgroundColor: 'rgba(0,0,0,0.02)' }}
                                            className="flex justify-between items-center py-3 px-3 rounded-lg transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Checkbox 
                                                    id={option.id}
                                                    checked={acceptedPayments.includes(option.id)}
                                                    onCheckedChange={(checked) => handlePaymentChange(option.id, !!checked)}
                                                    className="border-2"
                                                />
                                                <div>
                                                    <label htmlFor={option.id} className="font-semibold cursor-pointer text-gray-800">{option.label}</label>
                                                    {option.description && <p className="text-xs text-gray-500">{option.description}</p>}
                                                </div>
                                            </div>
                                            {option.icon}
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Credit/Debit Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <Card className="shadow-xl border-0 rounded-2xl hover-lift overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <CreditCard className="h-5 w-5 text-primary" />
                                    <h3 className="font-bold text-lg text-gray-800">Credit / Debit Card</h3>
                                </div>
                                <div className="space-y-3">
                                    {cardOptions.map((option, index) => (
                                        <motion.div
                                            key={option.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            whileHover={{ x: 4, backgroundColor: 'rgba(0,0,0,0.02)' }}
                                            className="flex justify-between items-center py-3 px-3 rounded-lg transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Checkbox 
                                                    id={option.id}
                                                    checked={acceptedPayments.includes(option.id)}
                                                    onCheckedChange={(checked) => handlePaymentChange(option.id, !!checked)}
                                                    className="border-2"
                                                />
                                                <label htmlFor={option.id} className="font-medium cursor-pointer text-gray-700">{option.label}</label>
                                            </div>
                                            <Image src={option.logo!} alt={option.label} width={option.width} height={option.height} />
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Wallets */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <Card className="shadow-xl border-0 rounded-2xl hover-lift overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Wallet className="h-5 w-5 text-primary" />
                                    <h3 className="font-bold text-lg text-gray-800">Digital Wallets</h3>
                                </div>
                                <div className="space-y-3">
                                    {walletOptions.map((option, index) => (
                                        <motion.div
                                            key={option.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + index * 0.1 }}
                                            whileHover={{ x: 4, backgroundColor: 'rgba(0,0,0,0.02)' }}
                                            className="flex justify-between items-center py-3 px-3 rounded-lg transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Checkbox 
                                                    id={option.id}
                                                    checked={acceptedPayments.includes(option.id)}
                                                    onCheckedChange={(checked) => handlePaymentChange(option.id, !!checked)}
                                                    className="border-2"
                                                />
                                                <label htmlFor={option.id} className="font-medium cursor-pointer text-gray-700">{option.label}</label>
                                            </div>
                                            <Image src={option.logo!} alt={option.label} width={option.width} height={option.height} />
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Other Payment Modes */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <Card className="shadow-xl border-0 rounded-2xl hover-lift overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />
                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Banknote className="h-5 w-5 text-primary" />
                                    <h3 className="font-bold text-lg text-gray-800">Other Payment Modes</h3>
                                </div>
                                <div className="space-y-4">
                                    {otherOptions.map((option, index) => (
                                        <motion.div
                                            key={option.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + index * 0.1 }}
                                            whileHover={{ x: 4, backgroundColor: 'rgba(0,0,0,0.02)' }}
                                            className="flex justify-between items-center py-3 px-3 rounded-lg transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Checkbox 
                                                    id={option.id}
                                                    checked={acceptedPayments.includes(option.id)}
                                                    onCheckedChange={(checked) => handlePaymentChange(option.id, !!checked)}
                                                    className="border-2"
                                                />
                                                <div>
                                                    <label htmlFor={option.id} className="font-semibold cursor-pointer text-gray-800">{option.label}</label>
                                                    {option.description && <p className="text-xs text-gray-500">{option.description}</p>}
                                                </div>
                                            </div>
                                            {option.icon}
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-md">
                            <CardContent className="p-4 flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-1">{acceptedPayments.length} Payment Modes Selected</h4>
                                    <p className="text-sm text-gray-700">The more payment options you accept, the easier it is for customers to transact with you.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
            
            <footer className="bg-white/80 backdrop-blur-md py-4 border-t shadow-2xl sticky bottom-0 z-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Button 
                        className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg font-semibold"
                        data-testid="save-payment-modes-button"
                    >
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Save Payment Modes
                    </Button>
                </div>
            </footer>
        </motion.div>
    );
}

export default function PaymentGatewayPage() {
    return (
        <Suspense>
            <PaymentGatewayPageComponent />
        </Suspense>
    )
}
