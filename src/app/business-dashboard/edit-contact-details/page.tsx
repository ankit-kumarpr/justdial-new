
'use client';

import { useState, useEffect, useActionState, Suspense, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronLeft, Info, Loader2, AlertCircle as AlertCircleIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { Card, CardContent } from '@/components/ui/card';
import { updateContactDetails, getContactDetails, type ContactState } from './actions';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { DashboardHeader } from '@/components/justdial/your-dashboard/DashboardHeader';

type ContactDetailsData = {
    contactPersonTitle: string;
    contactPersonName: string;
    primaryMobileNumber: string;
    primaryWhatsappNumber: string;
    email: string;
};

function EditContactDetailsForm() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id');
    const { toast } = useToast();
    
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState<ContactDetailsData>({
        contactPersonTitle: 'Mr',
        contactPersonName: '',
        primaryMobileNumber: '',
        primaryWhatsappNumber: '',
        email: '',
    });

    const initialState: ContactState = {};
    const [state, formAction, isPending] = useActionState(updateContactDetails, initialState);

    const fetchDetails = useCallback(async (id: string, token: string) => {
        setIsLoading(true);
        const { data, error } = await getContactDetails(id, token);
        
        if (error) {
            toast({ title: "Error", description: "Failed to load contact details.", variant: 'destructive'});
        } else if (data) {
            setFormData({
                contactPersonTitle: data.title || 'Mr',
                contactPersonName: data.contactPerson || '',
                primaryMobileNumber: data.mobileNumber || '',
                primaryWhatsappNumber: data.whatsappNumber || '',
                email: data.email || '',
            });
        }
        setIsLoading(false);
    }, [toast]);

    useEffect(() => {
        if (businessId) {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                 toast({ title: "Error", description: "Authentication required.", variant: "destructive"});
                 setIsLoading(false);
                 return;
            }
            fetchDetails(businessId, token);
        } else {
            setIsLoading(false);
        }
    }, [businessId, toast, fetchDetails]);

     useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? "Success!" : "Error",
                description: state.message,
                variant: state.success ? 'default' : 'destructive'
            });
        }
    }, [state, toast]);

    const handleInputChange = (field: keyof ContactDetailsData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    
    if (isLoading) {
        return <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>;
    }

    if (!businessId) {
        return (
            <Alert variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    No business ID provided. Please access this page from your business dashboard.
                </AlertDescription>
            </Alert>
        );
    }
    
    return (
        <form action={formAction}>
            <input type="hidden" name="businessId" value={businessId} />
             <input type="hidden" name="token" value={typeof window !== 'undefined' ? localStorage.getItem('accessToken') || '' : ''} />

            <div className="max-w-3xl mx-auto space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Alert className="bg-primary/5 border-primary/20 text-primary rounded-3xl shadow-lg">
                        <Info className="h-5 w-5" />
                        <AlertDescription>
                            Update your contact details to stay in touch with your customers in real time
                        </AlertDescription>
                    </Alert>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="contactPersonTitle">Title</Label>
                                    <Select name="contactPersonTitle" value={formData.contactPersonTitle} onValueChange={(value) => handleInputChange('contactPersonTitle', value)}>
                                        <SelectTrigger id="contactPersonTitle" className="mt-1"><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="Mr">Mr</SelectItem><SelectItem value="Mrs">Mrs</SelectItem><SelectItem value="Ms">Ms</SelectItem></SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1 relative">
                                    <Label htmlFor="contactPersonName">Contact Person Name</Label>
                                    <Input id="contactPersonName" name="contactPersonName" value={formData.contactPersonName} onChange={(e) => handleInputChange('contactPersonName', e.target.value)} className="mt-1" />
                                    {state?.errors?.contactPersonName && <p className="text-xs text-red-500">{state.errors.contactPersonName[0]}</p>}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="primaryMobileNumber" className="text-gray-700">Primary Mobile Number</Label>
                                <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                                    <div className="flex items-center gap-2 border rounded-md p-2 bg-gray-50 h-10">
                                        <Image src="https://flagcdn.com/in.svg" alt="India flag" width={20} height={15} />
                                        <span>+91</span>
                                    </div>
                                    <Input id="primaryMobileNumber" type="tel" name="primaryMobileNumber" value={formData.primaryMobileNumber} onChange={(e) => handleInputChange('primaryMobileNumber', e.target.value)} />
                                </div>
                                {state?.errors?.primaryMobileNumber && <p className="text-xs text-red-500">{state.errors.primaryMobileNumber[0]}</p>}
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor="primaryWhatsappNumber" className="text-gray-700">Primary WhatsApp Number</Label>
                                <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                                    <div className="flex items-center gap-2 border rounded-md p-2 bg-gray-50 h-10">
                                        <Image src="https://flagcdn.com/in.svg" alt="India flag" width={20} height={15} />
                                        <span>+91</span>
                                    </div>
                                    <Input id="primaryWhatsappNumber" type="tel" name="primaryWhatsappNumber" value={formData.primaryWhatsappNumber} onChange={(e) => handleInputChange('primaryWhatsappNumber', e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                                <Input id="email" type="email" name="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
                                {state?.errors?.email && <p className="text-xs text-red-500">{state.errors.email[0]}</p>}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
             <footer className="bg-white/80 backdrop-blur-md py-4 border-t border-gray-100 sticky bottom-0 z-20 shadow-lg mt-6">
                <div className="container mx-auto px-4 max-w-3xl">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                         <Button type="submit" className="w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300" disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isPending ? 'Saving...' : 'Save'}
                        </Button>
                    </motion.div>
                </div>
            </footer>
        </form>
    );
}

function EditContactDetailsPageComponent() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id') || '';
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
        >
             <Suspense>
                <DashboardHeader title="Contact Details" />
            </Suspense>

            <main className="flex-grow container mx-auto px-4 py-6 relative z-10">
                <Suspense fallback={<div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>}>
                    <EditContactDetailsForm />
                </Suspense>
            </main>
        </motion.div>
    )
}

export default function EditContactDetailsPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin" /></div>}>
            <EditContactDetailsPageComponent />
        </Suspense>
    );
}
