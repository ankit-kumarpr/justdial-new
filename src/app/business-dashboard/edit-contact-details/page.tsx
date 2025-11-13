
'use client';

import { useState, useEffect, useActionState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronLeft, Info, Loader2, AlertCircle as AlertCircleIcon, PlusCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { Card, CardContent } from '@/components/ui/card';
import { updateContactDetails, getContactDetails, type ContactState } from './actions';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

type ContactNumber = {
  id: string;
  contact_number: string;
};

type ContactDetailsData = {
    contactPersonTitle: string;
    contactPersonName: string;
    primaryMobileNumber: string;
    primaryWhatsappNumber: string;
    additionalMobileNumbers: ContactNumber[];
    additionalWhatsappNumbers: ContactNumber[];
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
        additionalMobileNumbers: [],
        additionalWhatsappNumbers: [],
    });

    const initialState: ContactState = {};
    const [state, formAction, isPending] = useActionState(updateContactDetails, initialState);

    useEffect(() => {
        if (businessId) {
            const fetchContactDetails = async () => {
                setIsLoading(true);
                const { data, error } = await getContactDetails(businessId);
                
                if (error) {
                    toast({ title: "Error", description: "Failed to load contact details.", variant: 'destructive'});
                } else if (data) {
                    setFormData({
                        contactPersonTitle: data.contactPersonTitle || 'Mr',
                        contactPersonName: data.contactPersonName || '',
                        primaryMobileNumber: data.primaryMobileNumber || '',
                        primaryWhatsappNumber: data.primaryWhatsappNumber || '',
                        additionalMobileNumbers: data.additionalMobileNumbers || [],
                        additionalWhatsappNumbers: data.additionalWhatsappNumbers || [],
                    });
                }
                setIsLoading(false);
            };
            fetchContactDetails();
        } else {
            setIsLoading(false);
        }
    }, [businessId, toast]);

     useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? "Success!" : "Error",
                description: state.message,
                variant: state.success ? 'default' : 'destructive'
            });
        }
    }, [state, toast]);

    const handleInputChange = (field: keyof Omit<ContactDetailsData, 'additionalMobileNumbers' | 'additionalWhatsappNumbers'>, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAdditionalNumberChange = (type: 'additionalMobileNumbers' | 'additionalWhatsappNumbers', id: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].map(n => n.id === id ? { ...n, contact_number: value } : n)
        }));
    };
    
    const addNumber = (type: 'additionalMobileNumbers' | 'additionalWhatsappNumbers') => {
        setFormData(prev => ({
            ...prev,
            [type]: [...prev[type], { id: uuidv4(), contact_number: '' }]
        }));
    };

    const removeNumber = (type: 'additionalMobileNumbers' | 'additionalWhatsappNumbers', id: string) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].filter(n => n.id !== id)
        }));
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
            <input type="hidden" name="contactDetails" value={JSON.stringify(formData)} />

            <div className="max-w-3xl mx-auto space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Alert className="bg-primary/5 border-primary/20 text-primary rounded-3xl shadow-lg">
                        <Info className="h-5 w-5" />
                        <AlertDescription>
                            Update your contact details to stay in touch with your customers in real time
                        </AlertDescription>
                    </Alert>
                </motion.div>

                {/* Contact Persons */}
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
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Mobile Numbers */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                    <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6 space-y-4">
                            <Label className="font-semibold">Mobile Numbers</Label>
                             <div className="space-y-1">
                                <Label htmlFor="primaryMobile" className="text-xs text-gray-500">Primary Mobile Number</Label>
                                <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                                    <div className="flex items-center gap-2 border rounded-md p-2 bg-gray-50">
                                        <Image src="https://flagcdn.com/in.svg" alt="India flag" width={20} height={15} />
                                        <span>+91</span>
                                    </div>
                                    <Input id="primaryMobile" type="tel" name="primaryMobileNumber" value={formData.primaryMobileNumber} onChange={(e) => handleInputChange('primaryMobileNumber', e.target.value)} />
                                </div>
                                {state?.errors?.primaryMobileNumber && <p className="text-xs text-red-500">{state.errors.primaryMobileNumber[0]}</p>}
                            </div>
                            {formData.additionalMobileNumbers.map((num, index) => (
                                <div key={num.id} className="space-y-1">
                                    <Label htmlFor={`mobile-${num.id}`} className="text-xs text-gray-500">Additional Number</Label>
                                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                                        <div className="flex items-center gap-2 border rounded-md p-2 bg-gray-50">
                                            <Image src="https://flagcdn.com/in.svg" alt="India flag" width={20} height={15} />
                                            <span>+91</span>
                                        </div>
                                        <Input id={`mobile-${num.id}`} type="tel" value={num.contact_number} onChange={(e) => handleAdditionalNumberChange('additionalMobileNumbers', num.id, e.target.value)} />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeNumber('additionalMobileNumbers', num.id)} className="hover:bg-destructive group">
                                            <Trash2 className="h-4 w-4 text-destructive group-hover:text-white" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button type="button" variant="link" className="p-0 h-auto text-primary" onClick={() => addNumber('additionalMobileNumbers')}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add another number
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* WhatsApp Numbers */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                    <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6 space-y-4">
                             <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800 rounded-2xl">
                                <AlertDescription>
                                    Add a WhatsApp Number to Enable Chat Option on Your Business Profile Listing Page
                                </AlertDescription>
                            </Alert>
                             <Label className="font-semibold">WhatsApp Numbers</Label>
                             <div className="space-y-1">
                                <Label htmlFor="primaryWhatsapp" className="text-xs text-gray-500">Primary WhatsApp Number</Label>
                                <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                                    <div className="flex items-center gap-2 border rounded-md p-2 bg-gray-50">
                                        <Image src="https://flagcdn.com/in.svg" alt="India flag" width={20} height={15} />
                                        <span>+91</span>
                                    </div>
                                    <Input id="primaryWhatsapp" type="tel" name="primaryWhatsappNumber" value={formData.primaryWhatsappNumber} onChange={(e) => handleInputChange('primaryWhatsappNumber', e.target.value)} />
                                </div>
                            </div>
                            {formData.additionalWhatsappNumbers.map((num, index) => (
                                <div key={num.id} className="space-y-1">
                                    <Label htmlFor={`whatsapp-${num.id}`} className="text-xs text-gray-500">Additional Number</Label>
                                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                                        <div className="flex items-center gap-2 border rounded-md p-2 bg-gray-50">
                                            <Image src="https://flagcdn.com/in.svg" alt="India flag" width={20} height={15} />
                                            <span>+91</span>
                                        </div>
                                        <Input id={`whatsapp-${num.id}`} type="tel" value={num.contact_number} onChange={(e) => handleAdditionalNumberChange('additionalWhatsappNumbers', num.id, e.target.value)} />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeNumber('additionalWhatsappNumbers', num.id)} className="hover:bg-destructive group">
                                            <Trash2 className="h-4 w-4 text-destructive group-hover:text-white" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button type="button" variant="link" className="p-0 h-auto text-primary" onClick={() => addNumber('additionalWhatsappNumbers')}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add another number
                            </Button>
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
            <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-20 border-b border-gray-100">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href={`/business-dashboard?id=${businessId}`}>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="icon">
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                        </motion.div>
                    </Link>
                    <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Contact Details</h1>
                </div>
            </header>

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
