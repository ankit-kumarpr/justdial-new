
'use client';

import { useState, Suspense, useEffect, useActionState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, PlusCircle, Facebook, Linkedin, Youtube, Instagram, Loader2, AlertCircle as AlertCircleIcon, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardHeader } from '@/components/justdial/your-dashboard/DashboardHeader';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getSocialMediaLinks, updateSocialMediaLinks, deleteSocialMediaLinks, type SocialMediaState } from './actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
    </svg>
);

const socialPlatforms = [
    { name: 'Facebook', icon: <Facebook className="h-6 w-6 text-blue-600" /> },
    { name: 'X', icon: <XIcon /> },
    { name: 'LinkedIn', icon: <Linkedin className="h-6 w-6 text-blue-700" /> },
    { name: 'YouTube', icon: <Youtube className="h-6 w-6 text-red-600" /> },
    { name: 'Instagram', icon: <Instagram className="h-6 w-6 text-pink-500" /> },
];

function SocialMediaPageComponent() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id');
    const { toast } = useToast();
    
    const [links, setLinks] = useState<{ [key: string]: string[] }>({
        Facebook: [''], X: [''], LinkedIn: [''], YouTube: [''], Instagram: [''],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    const initialState: SocialMediaState = {};
    const [state, formAction, isPending] = useActionState(updateSocialMediaLinks, initialState);

    useEffect(() => {
        if (!businessId) {
            setIsLoading(false);
            toast({ title: 'Error', description: 'Business ID is missing from URL.', variant: 'destructive'});
            return;
        }
        
        const token = localStorage.getItem('accessToken');
        if (!token) {
             setIsLoading(false);
             toast({ title: 'Error', description: 'Authentication required.', variant: 'destructive'});
             return;
        }

        const fetchLinks = async () => {
            setIsLoading(true);
            const { data, error } = await getSocialMediaLinks(businessId, token);
            if (error) {
                toast({ title: 'Error', description: error, variant: 'destructive'});
            } else if (data) {
                setLinks(prev => ({
                    ...prev,
                    Facebook: [data.facebook || ''],
                    Instagram: [data.instagram || ''],
                    X: [data.twitter || ''],
                    LinkedIn: [data.linkedin || ''],
                    YouTube: [data.youtube || ''],
                }));
            }
             setIsLoading(false);
        };
        fetchLinks();
    }, [businessId, toast]);
    
     useEffect(() => {
        if (state?.message) {
            if (state.success) {
                toast({ title: "Success!", description: state.message });
            } else {
                toast({ title: "Error", description: state.message, variant: 'destructive' });
            }
        }
    }, [state, toast]);

    const handleInputChange = (platform: string, index: number, value: string) => {
        setLinks(prev => {
            const newPlatformLinks = [...prev[platform]];
            newPlatformLinks[index] = value;
            return { ...prev, [platform]: newPlatformLinks };
        });
    };
    
    const handleDeleteAll = async () => {
        if (!businessId) {
            toast({ title: 'Error', description: 'Business ID is missing.', variant: 'destructive' });
            return;
        }
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({ title: 'Error', description: 'Authentication required.', variant: 'destructive' });
            return;
        }
        setIsDeleting(true);
        const result = await deleteSocialMediaLinks(businessId, token);
        if (result.success) {
            toast({ title: "Success", description: result.message });
            setLinks({ Facebook: [''], X: [''], LinkedIn: [''], YouTube: [''], Instagram: [''] });
        } else {
            toast({ title: "Error", description: result.message, variant: 'destructive' });
        }
        setIsDeleting(false);
    }

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    if (!businessId) {
        return (
            <Alert variant="destructive" className="m-4">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertDescription>
                    No business ID provided. Please access this page from your business dashboard.
                </AlertDescription>
            </Alert>
        );
    }
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    return (
        <form action={formAction}>
            <input type="hidden" name="businessId" value={businessId} />
            <input type="hidden" name="token" value={token || ''} />
            <main className="flex-grow container mx-auto px-4 py-6 relative z-10">
                <div className="max-w-3xl mx-auto space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Alert className="bg-primary/5 border-primary/20 text-primary rounded-3xl shadow-lg">
                            <Info className="h-5 w-5" />
                            <AlertDescription>
                                Add social media links in the business profile to maximize audience involvement.
                            </AlertDescription>
                        </Alert>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Card className="rounded-3xl shadow-xl border-none bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6 space-y-8">
                                {socialPlatforms.map((platform, idx) => (
                                    <motion.div
                                        key={platform.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                                    >
                                        {links[platform.name].map((link, index) => (
                                            <div key={index} className="flex items-center gap-3 mb-2">
                                                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}>
                                                    {platform.icon}
                                                </motion.div>
                                                <Input
                                                    name={platform.name}
                                                    placeholder={`${platform.name} Business Page Link`}
                                                    value={link}
                                                    onChange={(e) => handleInputChange(platform.name, index, e.target.value)}
                                                    className="flex-1"
                                                />
                                            </div>
                                        ))}
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
            <footer className="bg-white/80 backdrop-blur-md py-4 border-t border-gray-100 sticky bottom-0 z-20 shadow-lg">
                <div className="container mx-auto px-4 max-w-3xl flex gap-2">
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-auto" disabled={isDeleting}>
                                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                Delete All
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete all your social media links.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAll} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
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


export default function SocialMediaPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin" /></div>}>
             <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
                className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
            >
                <DashboardHeader title="Add Social Media Links" />
                <SocialMediaPageComponent />
            </motion.div>
        </Suspense>
    )
}
