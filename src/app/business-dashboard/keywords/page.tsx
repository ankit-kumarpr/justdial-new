
'use client';

import { useState, Suspense, useEffect, useActionState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronLeft, Info, Loader2, AlertCircle as AlertCircleIcon, PlusCircle, Trash2, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { Card, CardContent } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getKeywords, updateKeywords, type KeywordsState, removeKeyword } from './actions';
import { v4 as uuidv4 } from 'uuid';

type Keyword = {
  id: string;
  value: string;
};

function AddKeywordsForm() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id');
    const { toast } = useToast();
    
    const [isLoading, setIsLoading] = useState(true);
    const [keywords, setKeywords] = useState<Keyword[]>([{ id: uuidv4(), value: '' }]);

    const initialState: KeywordsState = {};
    const [state, formAction, isPending] = useActionState(updateKeywords, initialState);

    const fetchKeywords = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (businessId && token) {
            setIsLoading(true);
            const { data, error } = await getKeywords(businessId, token);
            
            if (error) {
                toast({ title: "Error", description: "Failed to load keywords.", variant: 'destructive'});
            } else if (data && data.length > 0) {
                setKeywords(data.map((kw: string) => ({ id: uuidv4(), value: kw })));
            } else {
                setKeywords([{ id: uuidv4(), value: '' }]);
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
            if (!token) toast({ title: "Auth Error", description: "Please log in to manage keywords.", variant: "destructive" });
        }
    }, [businessId, toast]);

    useEffect(() => {
        fetchKeywords();
    }, [fetchKeywords]);

    useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? "Success!" : "Error",
                description: state.message,
                variant: state.success ? 'default' : 'destructive'
            });
            if (state.success) {
                fetchKeywords(); // Re-fetch to get the latest state
            }
        }
    }, [state, toast, fetchKeywords]);

    const handleKeywordChange = (id: string, value: string) => {
        setKeywords(prev => prev.map(kw => kw.id === id ? { ...kw, value } : kw));
    };
    
    const addKeywordField = () => {
        setKeywords(prev => [...prev, { id: uuidv4(), value: '' }]);
    };

    const removeKeywordField = async (id: string, value: string) => {
        // If the field is empty, just remove it from the UI
        if (!value.trim()) {
             if (keywords.length > 1) {
                setKeywords(prev => prev.filter(kw => kw.id !== id));
            } else {
                setKeywords([{ id: uuidv4(), value: '' }]);
            }
            return;
        }

        // If the field has a value, call the delete API
        const token = localStorage.getItem('accessToken');
        if (!businessId || !token) {
            toast({ title: 'Error', description: 'Cannot delete keyword. Missing business ID or token.', variant: 'destructive' });
            return;
        }

        const result = await removeKeyword(businessId, value, token);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setKeywords(prev => prev.filter(kw => kw.id !== id));
            if (keywords.length === 1) {
              setKeywords([{ id: uuidv4(), value: '' }]);
            }
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
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
    
    const token = localStorage.getItem('accessToken');

    return (
        <form action={formAction} className="flex flex-col flex-grow">
            <input type="hidden" name="businessId" value={businessId} />
            <input type="hidden" name="token" value={token || ''} />
            <input type="hidden" name="keywords" value={JSON.stringify(keywords.map(kw => kw.value).filter(Boolean))} />

            <div className="max-w-3xl mx-auto space-y-6 flex-grow w-full">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Alert className="bg-primary/5 border-primary/20 text-primary rounded-3xl shadow-lg">
                        <Info className="h-5 w-5" />
                        <AlertDescription>
                            Adding relevant keywords helps customers discover your business listing through search.
                        </AlertDescription>
                    </Alert>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6 space-y-4">
                            {keywords.map((kw, index) => (
                                <motion.div
                                    key={kw.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="flex items-center gap-2"
                                >
                                    <Key className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                    <Input 
                                        name={`keyword-${index}`}
                                        placeholder="e.g., 'best Italian food'"
                                        value={kw.value}
                                        onChange={(e) => handleKeywordChange(kw.id, e.target.value)}
                                        className="flex-1"
                                    />
                                     <Button type="button" variant="ghost" size="icon" onClick={() => removeKeywordField(kw.id, kw.value)} className="hover:bg-destructive/10 group">
                                        <Trash2 className="h-4 w-4 text-gray-500 group-hover:text-destructive" />
                                    </Button>
                                </motion.div>
                            ))}

                             <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                             >
                                <Button type="button" variant="link" className="p-0 h-auto text-primary" onClick={addKeywordField}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Another Keyword
                                </Button>
                             </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
                 {state?.errors?.server && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-lg text-sm">
                      <p>{state.errors.server[0]}</p>
                    </motion.div>
                )}
            </div>
             <footer className="bg-white/80 backdrop-blur-md py-4 border-t border-gray-100 sticky bottom-0 z-20 shadow-lg mt-6">
                <div className="container mx-auto px-4 max-w-3xl">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                         <Button type="submit" className="w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300" disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isPending ? 'Saving Keywords...' : 'Save Keywords'}
                        </Button>
                    </motion.div>
                </div>
            </footer>
        </form>
    );
}

function KeywordsPageComponent() {
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
                    <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Keywords</h1>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-6 relative z-10 flex flex-col">
                <Suspense fallback={<div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>}>
                    <AddKeywordsForm />
                </Suspense>
            </main>
        </motion.div>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin" /></div>}>
            <KeywordsPageComponent />
        </Suspense>
    );
}
