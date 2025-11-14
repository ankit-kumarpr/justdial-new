
'use client';

import { useState, Suspense, useEffect, useActionState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronLeft, Info, Loader2, AlertCircle as AlertCircleIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { Card, CardContent } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { updateYearlyTurnover, type YearlyTurnoverState } from './actions';
import { DashboardHeader } from '@/components/justdial/your-dashboard/DashboardHeader';

const turnoverOptions = [ '5 Lakh or Less', '5 - 10 Lakhs', '11 - 25 Lakhs', '26 - 50 Lakhs', '51 Lakh - 1 Crore', '1 - 5 Crores', '6 - 10 Crores', '11 - 25 Crores', '26 - 50 Crores' ];

function YearlyTurnoverForm() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id');
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTurnover, setSelectedTurnover] = useState<string | undefined>();
    
    const initialState: YearlyTurnoverState = {};
    const [state, formAction, isPending] = useActionState(updateYearlyTurnover, initialState);

    useEffect(() => {
        if (businessId) {
            const fetchTurnover = async () => {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('vendors')
                    .select('yearlyTurnover')
                    .eq('id', businessId)
                    .single();
                if (data && data.yearlyTurnover) {
                    setSelectedTurnover(data.yearlyTurnover);
                }
                setIsLoading(false);
            };
            fetchTurnover();
        } else {
            setIsLoading(false);
        }
    }, [businessId]);

    useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? "Success!" : "Error",
                description: state.message,
                variant: state.success ? 'default' : 'destructive'
            });
        }
    }, [state, toast]);

    if (isLoading) return <div>Loading...</div>;

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
            <div className="max-w-xl mx-auto space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Alert className="bg-primary/5 border-primary/20 text-primary rounded-3xl shadow-lg">
                        <Info className="h-5 w-5" />
                        <AlertDescription>
                            Please select your annual business turnover
                        </AlertDescription>
                    </Alert>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <RadioGroup name="turnover" value={selectedTurnover} onValueChange={setSelectedTurnover} className="space-y-4">
                                {turnoverOptions.map((option, index) => (
                                    <motion.div
                                        key={option}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                                        className="flex items-center space-x-3"
                                    >
                                        <RadioGroupItem value={option} id={option} />
                                        <Label htmlFor={option} className="font-normal text-base cursor-pointer">{option}</Label>
                                    </motion.div>
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
             <footer className="bg-white/80 backdrop-blur-md py-4 border-t border-gray-100 sticky bottom-0 z-20 shadow-lg mt-6">
                <div className="container mx-auto px-4 max-w-xl">
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


function YearlyTurnoverPage() {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
        >
            <DashboardHeader title="Turnover" />

            <main className="flex-grow container mx-auto px-4 py-6 relative z-10">
                <Suspense fallback={<div>Loading form...</div>}>
                    <YearlyTurnoverForm />
                </Suspense>
            </main>
        </motion.div>
    );
}

export default function Page() {
  return (
    <Suspense>
      <YearlyTurnoverPage />
    </Suspense>
  )
}
