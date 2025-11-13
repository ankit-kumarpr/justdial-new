
'use client';

import { Suspense, useState, useEffect, useActionState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronLeft, Info, Loader2, AlertCircle as AlertCircleIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { Card, CardContent } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { updateEstablishmentYear, getEstablishmentYear, type EstablishmentYearState } from './actions';

const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

function YearOfEstablishmentForm() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id');
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [establishmentMonth, setEstablishmentMonth] = useState<string>('');
    const [establishmentYear, setEstablishmentYear] = useState<string>('');
    
    const initialState: EstablishmentYearState = {};
    const [state, formAction, isPending] = useActionState(updateEstablishmentYear, initialState);
    
    useEffect(() => {
        if (businessId) {
            const fetchYear = async () => {
                setIsLoading(true);
                const { data, error } = await getEstablishmentYear(businessId);
                if (error) {
                     toast({ title: 'Error', description: 'Could not load establishment year.', variant: 'destructive'});
                } else if (data && data.yearOfEstablishment) {
                    const parts = data.yearOfEstablishment.split(' ');
                    if (parts.length === 2 && months.includes(parts[0]) && years.includes(parts[1])) {
                        setEstablishmentMonth(parts[0]);
                        setEstablishmentYear(parts[1]);
                    } else if (years.includes(data.yearOfEstablishment)) {
                        setEstablishmentYear(data.yearOfEstablishment);
                        setEstablishmentMonth('');
                    }
                }
                setIsLoading(false);
            };
            fetchYear();
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

    if (isLoading) return <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>;

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
            <div className="max-w-3xl mx-auto space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Alert className="bg-primary/5 border-primary/20 text-primary rounded-3xl shadow-lg">
                        <Info className="h-5 w-5" />
                        <AlertDescription>
                            Please note that any changes to the details below can go for verification and take upto 2 working days to go live.
                        </AlertDescription>
                    </Alert>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <CardContent className="p-6 space-y-4 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Select name="month" value={establishmentMonth} onValueChange={setEstablishmentMonth}>
                                        <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                                        <SelectContent>{months.map(month => <SelectItem key={month} value={month}>{month}</SelectItem>)}</SelectContent>
                                    </Select>
                                     {state?.errors?.month && <p className="text-xs text-red-500 mt-1">{state.errors.month[0]}</p>}
                                </div>
                                <div>
                                    <Select name="year" value={establishmentYear} onValueChange={setEstablishmentYear}>
                                        <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                                        <SelectContent>{years.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent>
                                    </Select>
                                     {state?.errors?.year && <p className="text-xs text-red-500 mt-1">{state.errors.year[0]}</p>}
                                </div>
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

function YearOfEstablishmentPage() {
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
                    <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Year of Establishment</h1>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-6 relative z-10">
                <Suspense fallback={<div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>}>
                    <YearOfEstablishmentForm />
                </Suspense>
            </main>
        </motion.div>
    );
}

export default function Page() {
  return (
    <Suspense>
      <YearOfEstablishmentPage />
    </Suspense>
  )
}
