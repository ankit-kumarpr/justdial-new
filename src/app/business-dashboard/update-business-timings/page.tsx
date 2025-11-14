
'use client';

import { useState, Suspense, useEffect, useActionState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronLeft, Info, Trash2, PlusCircle, ChevronRight, Loader2, AlertCircle as AlertCircleIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { updateBusinessTimings, getBusinessTimings, type UpdateTimingsState } from './actions';
import { DashboardHeader } from '@/components/justdial/your-dashboard/DashboardHeader';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
        options.push(`${i.toString().padStart(2, '0')}:00`);
        options.push(`${i.toString().padStart(2, '0')}:30`);
    }
    return options;
};

const timeOptions = generateTimeOptions();

function TimeSlot({ isFirst, index, timings, setTimings, error }: { isFirst: boolean, index: number, timings: any, setTimings: any, error?: string }) {
    const [isClosed, setIsClosed] = useState(!isFirst);

    const handleDayToggle = (day: string) => {
        setTimings((prev: any) => {
            const currentDays = prev.workingDays || [];
            const newDays = currentDays.includes(day)
                ? currentDays.filter((d: string) => d !== day)
                : [...currentDays, day];
            return { ...prev, workingDays: newDays };
        });
    };

    const handleSelectAll = (checked: boolean) => {
        setTimings((prev: any) => ({ ...prev, workingDays: checked ? daysOfWeek : [] }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
        >
            <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-6 relative z-10">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Select Days of the Week</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {daysOfWeek.map(day => {
                            const isChecked = (timings.workingDays || []).includes(day);
                            return (
                                <div key={day} onClick={() => handleDayToggle(day)} className="cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="workingDays"
                                        value={day}
                                        checked={isChecked}
                                        readOnly
                                        className="hidden"
                                    />
                                    <div className={`px-3 py-1.5 border rounded-md text-sm transition-all ${
                                        isChecked
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white border-gray-300'
                                    }`}>
                                        {day}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex items-center space-x-2 mb-6">
                        <Checkbox id={`select-all-${index}`} onCheckedChange={(checked) => handleSelectAll(!!checked)} checked={(timings.workingDays || []).length === daysOfWeek.length}/>
                        <Label htmlFor={`select-all-${index}`}>Select All Days</Label>
                    </div>
                    {error && <p className="text-xs text-red-500 mt-2 mb-2">{error}</p>}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Opens at</Label>
                            <Select name="openTime" value={timings.openTime} onValueChange={(value) => setTimings((prev: any) => ({ ...prev, openTime: value }))}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>{timeOptions.map(time => <SelectItem key={`open-${time}`} value={time}>{time}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Closes at</Label>
                            <Select name="closingTime" value={timings.closingTime} onValueChange={(value) => setTimings((prev: any) => ({ ...prev, closingTime: value }))}>
                               <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                               <SelectContent>
                                    {timeOptions.map(time => <SelectItem key={`close-${time}`} value={time}>{time}</SelectItem>)}
                               </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

function UpdateTimingsForm() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id');
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [timings, setTimings] = useState<any>({ workingDays: [], openTime: '09:00', closingTime: '18:00' });
    
    const initialState: UpdateTimingsState = {};
    const [state, formAction, isPending] = useActionState(updateBusinessTimings, initialState);

    const fetchTimingsData = useCallback(async () => {
         if (!businessId) {
            setIsLoading(false);
            return;
        }
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        const { data, error } = await getBusinessTimings(businessId, token);
        
        if (error) {
            toast({ title: "Error", description: "Failed to load timings.", variant: "destructive" });
        } else if (data) {
            setTimings({
                workingDays: data.workingDays || [],
                openTime: data.openTime || '09:00',
                closingTime: data.closingTime || '18:00',
            });
        }
        setIsLoading(false);
    }, [businessId, toast]);

    useEffect(() => {
        fetchTimingsData();
    }, [fetchTimingsData]);

    useEffect(() => {
        if (state?.message) {
            if (state.success) {
                toast({ title: "Success!", description: state.message });
                fetchTimingsData(); // Re-fetch on success
            } else {
                 toast({
                    title: "Error",
                    description: state.message,
                    variant: "destructive"
                });
            }
        }
    }, [state, toast, fetchTimingsData]);

    if (isLoading) return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

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
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    return (
        <form action={formAction}>
            <input type="hidden" name="businessId" value={businessId} />
            <input type="hidden" name="token" value={token || ''} />
            <input type="hidden" name="workingDays" value={JSON.stringify(timings.workingDays)} />
             <div className="max-w-4xl mx-auto space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Alert className="bg-primary/5 border-primary/20 text-primary rounded-3xl shadow-lg">
                        <Info className="h-5 w-5" />
                        <AlertDescription>
                            Let your customers know when to reach you.
                        </AlertDescription>
                    </Alert>
                </motion.div>

                <div className="space-y-4">
                    <TimeSlot isFirst={true} index={0} timings={timings} setTimings={setTimings} error={state?.errors?.workingDays?.[0]} />
                </div>
                
                 {state?.errors?.closingTime && <p className="text-xs text-red-500 mt-1">{state.errors.closingTime[0]}</p>}
                
            </div>
             <footer className="bg-white/80 backdrop-blur-md py-4 border-t border-gray-100 sticky bottom-0 z-20 shadow-lg mt-6">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                         <Button type="submit" className="w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300" disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isPending ? 'Saving...' : 'Save and Continue'}
                        </Button>
                    </motion.div>
                </div>
            </footer>
        </form>
    );
}

function UpdateBusinessTimingsPage() {
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
            <DashboardHeader title="Update Business Timings" />
            <main className="flex-grow container mx-auto px-4 py-6 relative z-10">
               <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                    <UpdateTimingsForm />
                </Suspense>
            </main>
        </motion.div>
    );
}
    
export default function Page() {
  return (
    <Suspense>
      <UpdateBusinessTimingsPage />
    </Suspense>
  )
}
