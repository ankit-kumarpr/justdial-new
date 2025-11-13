
'use client';

import { useState, Suspense, useEffect, useActionState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronLeft, Info, PlusCircle, Loader2, AlertCircle as AlertCircleIcon, Trash2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { Card, CardContent } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getBusinessWebsite, updateBusinessWebsite, deleteBusinessWebsite, type WebsiteFormState } from './actions';
import { DashboardHeader } from '@/components/justdial/your-dashboard/DashboardHeader';
import { Label } from '@/components/ui/label';
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
} from "@/components/ui/alert-dialog";

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';


function UpdateWebsiteForm() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id');
    const { toast } = useToast();
    
    const [website, setWebsite] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    const initialState: WebsiteFormState = {};
    const [state, formAction, isPending] = useActionState(updateBusinessWebsite, initialState);

    useEffect(() => {
        const userToken = localStorage.getItem('accessToken');
        if (userToken) setToken(userToken);

        if (businessId && userToken) {
            const fetchWebsite = async () => {
                setIsLoading(true);
                const { data, error } = await getBusinessWebsite(businessId, userToken);
                if (error) {
                    toast({ title: "Error", description: 'Failed to load existing website.', variant: 'destructive'});
                } else if (data?.website) {
                    setWebsite(data.website);
                }
                setIsLoading(false);
            };
            fetchWebsite();
        } else {
            setIsLoading(false);
        }
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

    const handleDelete = async () => {
        if (!businessId || !token) {
            toast({ title: 'Error', description: 'Cannot delete. Missing business ID or token.', variant: 'destructive' });
            return;
        }
        setIsDeleting(true);
        const result = await deleteBusinessWebsite(businessId, token);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setWebsite('');
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
        setIsDeleting(false);
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
            <input type="hidden" name="token" value={token || ''} />
            <div className="max-w-3xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Alert className="bg-primary/5 border-primary/20 text-primary rounded-3xl shadow-lg">
                        <Info className="h-5 w-5" />
                        <AlertDescription>
                            Please provide the URL of your business website so customers can reach you.
                        </AlertDescription>
                    </Alert>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <CardContent className="p-6 space-y-4 relative z-10">
                            <div className="space-y-2">
                                <Label htmlFor="website">Website URL</Label>
                                <Input 
                                    id="website"
                                    name="website"
                                    placeholder="https://example.com"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                />
                                {state?.errors?.website && <p className="text-xs text-red-500 mt-1">{state.errors.website[0]}</p>}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                >
                    <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 overflow-hidden group">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">Get a Professional Looking Website</h3>
                                <p className="text-gray-600">for Your Business Today</p>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-4">
                                    <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">GO DIGITAL NOW →</Button>
                                </motion.div>
                            </div>
                            <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                                <Image src={findImage('website-banner')} alt="Website banner" width={150} height={90} />
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <footer className="bg-white/80 backdrop-blur-md py-4 border-t border-gray-100 sticky bottom-0 z-20 shadow-lg mt-6">
                <div className="container mx-auto px-4 max-w-3xl flex gap-2">
                    {website && (
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                              <Button type="button" variant="destructive" className="w-auto" disabled={isDeleting}>
                                  {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                  Delete
                              </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                          <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                               This will permanently delete your website link from your profile.
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                    )}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isPending ? 'Saving...' : 'Save'}
                        </Button>
                    </motion.div>
                </div>
            </footer>
        </form>
    );
}

export default function UpdateBusinessWebsitePage() {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
        >
             <Suspense>
                <DashboardHeader title="Business Website" />
            </Suspense>

            <main className="flex-grow container mx-auto px-4 py-6 relative z-10">
                 <Suspense fallback={<div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>}>
                    <UpdateWebsiteForm />
                </Suspense>
            </main>

        </motion.div>
    );
}
