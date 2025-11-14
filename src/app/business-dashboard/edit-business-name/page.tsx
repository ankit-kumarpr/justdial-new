
'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription as AlertDescriptionComponent } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useActionState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getBusinessName, updateBusinessName, type EditBusinessNameState } from './actions';
import { DashboardHeader } from '@/components/justdial/your-dashboard/DashboardHeader';

function EditBusinessNameForm() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id');
    const { toast } = useToast();

    const [currentName, setCurrentName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);

    const initialState: EditBusinessNameState = {};
    const [state, formAction, isPending] = useActionState(updateBusinessName, initialState);

    const fetchName = useCallback(async (userToken: string) => {
        if (businessId && userToken) {
            setIsLoading(true);
            const { name, error } = await getBusinessName(businessId, userToken);
            if (error) {
                toast({ title: 'Error', description: `Could not load business name: ${error}`, variant: 'destructive'});
            } else if (name) {
                setCurrentName(name);
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [businessId, toast]);

     useEffect(() => {
        const userToken = localStorage.getItem('accessToken');
        if (userToken) {
            setToken(userToken);
            fetchName(userToken);
        } else {
            setIsLoading(false);
        }
    }, [fetchName]);
    
    useEffect(() => {
        if(state?.message) {
            if(state.success) {
                toast({ title: "Success!", description: state.message });
                if (token) fetchName(token);
                // Trigger a storage event to notify other components like the header
                window.dispatchEvent(new Event("storage"));
            } else {
                toast({ title: "Error", description: state.message, variant: 'destructive' });
            }
        }
    }, [state, toast, fetchName, token]);

    if(isLoading) {
        return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    if (!businessId) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescriptionComponent>
                    No business ID provided. Please access this page from your business dashboard.
                </AlertDescriptionComponent>
            </Alert>
        );
    }
    
    return (
        <form action={formAction}>
            <input type="hidden" name="businessId" value={businessId} />
            <input type="hidden" name="token" value={token || ''} />
            <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative z-10">
                    <CardTitle className="text-xl font-bold">Business Name</CardTitle>
                    <CardDescription className="text-gray-600">
                        Update the name of your business as it appears on your Gnetdial profile.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <Label htmlFor="businessName">Company Name</Label>
                        <Input id="businessName" name="businessName" defaultValue={currentName} className="mt-1" />
                        {state?.errors?.businessName && <p className="text-xs text-red-500">{state.errors.businessName[0]}</p>}
                    </div>

                    <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800 rounded-2xl">
                        <AlertCircle className="h-5 w-5 !text-yellow-500" />
                        <AlertTitle className="font-semibold">Important Note</AlertTitle>
                        <AlertDescriptionComponent>
                            Any changes to your business name will go through a verification process and may take up to 2 working days to reflect on your listing.
                        </AlertDescriptionComponent>
                    </Alert>

                    <div className="flex justify-end">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button type="submit" className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300" disabled={isPending}>
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </motion.div>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}

function EditBusinessNamePageComponent() {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
        >
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

            <DashboardHeader title="Edit Business Name" />

            <main className="flex-grow container mx-auto px-4 py-6 relative z-10">
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                       <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                          <EditBusinessNameForm />
                       </Suspense>
                    </motion.div>
                </div>
            </main>
        </motion.div>
    );
}

function Page() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin" /></div>}>
            <EditBusinessNamePageComponent />
        </Suspense>
    )
}

export default Page;
