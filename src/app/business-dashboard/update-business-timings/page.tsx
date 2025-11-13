
'use client';

import { useState, Suspense, useEffect, useActionState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronLeft, Info, Trash2, PlusCircle, ChevronRight, Loader2, AlertCircle as AlertCircleIcon, CalendarOff } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { updateBusinessTimings, getBusinessTimings, type UpdateTimingsState } from './actions';
import { Textarea } from '@/components/ui/textarea';

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

function TimeSlot({ isFirst, index, timings, setTimings }: { isFirst: boolean, index: number, timings: any, setTimings: any }) {
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
    
    const closedDays = daysOfWeek.filter(day => !(timings.workingDays || []).includes(day));

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
                        {!isFirst && (
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <Button type="button" variant="ghost" size="icon" className="text-gray-500 hover:text-destructive">
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </motion.div>
                        )}
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

                    {closedDays.length > 0 && (
                        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                                <CalendarOff className="h-4 w-4 text-gray-500" />
                                Closed on
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {closedDays.map(day => (
                                    <div key={day} className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-md">
                                        {day}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Opens at</Label>
                            <Select name="openTime" value={isClosed ? 'Closed' : timings.openTime} onValueChange={(value) => {
                                setIsClosed(value === 'Closed');
                                setTimings((prev: any) => ({ ...prev, openTime: value }));
                            }}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                    {timeOptions.map(time => <SelectItem key={`open-${time}`} value={time}>{time}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        {!isClosed && (
                            <div>
                                <Label>Closes at</Label>
                                <Select name="closingTime" value={timings.closingTime} onValueChange={(value) => setTimings((prev: any) => ({ ...prev, closingTime: value }))}>
                                   <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                   <SelectContent>
                                        {timeOptions.map(time => <SelectItem key={`close-${time}`} value={time}>{time}</SelectItem>)}
                                   </SelectContent>
                                </Select>
                            </div>
                        )}
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
    const [timings, setTimings] = useState<any>({ workingDays: [], openTime: '09:00', closingTime: '18:00', timingNotes: '' });
    const [isNoteVisible, setIsNoteVisible] = useState(false);
    
    const initialState: UpdateTimingsState = {};
    const [state, formAction, isPending] = useActionState(updateBusinessTimings, initialState);

    useEffect(() => {
        if (businessId) {
            const fetchTimingsData = async () => {
                setIsLoading(true);
                const { data, error } = await getBusinessTimings(businessId);

                if (error) {
                    toast({ title: 'Error', description: "Failed to load timings.", variant: 'destructive'});
                } else if (data) {
                    setTimings({
                        workingDays: data.workingDays || [],
                        openTime: data.openTime || '09:00',
                        closingTime: data.closingTime || '18:00',
                        timingNotes: data.timing_notes || '',
                    });
                    if (data.timing_notes) {
                        setIsNoteVisible(true);
                    }
                }
                setIsLoading(false);
            };
            fetchTimingsData();
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
    
    return (
        <form action={formAction}>
            <input type="hidden" name="businessId" value={businessId} />
             <div className="max-w-4xl mx-auto space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Alert className="bg-primary/5 border-primary/20 text-primary rounded-3xl shadow-lg">
                        <Info className="h-5 w-5" />
                        <AlertDescription>
                            Let your customers know when to reach you. You can also configure dual timing slots in a single day.
                        </AlertDescription>
                    </Alert>
                </motion.div>

                <div className="space-y-4">
                    <TimeSlot isFirst={true} index={0} timings={timings} setTimings={setTimings} />
                </div>
                
                 {state?.errors?.closingTime && <p className="text-xs text-red-500 mt-1">{state.errors.closingTime[0]}</p>}
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} whileHover={{ scale: 1.01 }}>
                    <Link href={`/business-dashboard/holiday-timings?id=${businessId}`}>
                        <Card className="rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border-none bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center cursor-pointer group">
                            <div>
                                <h3 className="font-semibold">Holiday Timings</h3>
                                <p className="text-sm text-gray-500">Add holiday timings to let your customers know when you're open for business.</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </Card>
                    </Link>
                </motion.div>

                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="additional-note" checked={isNoteVisible} onCheckedChange={(checked) => setIsNoteVisible(!!checked)} />
                        <Label htmlFor="additional-note">Additional Note on Timings</Label>
                    </div>
                    {isNoteVisible && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
                           <Textarea 
                             name="timingNotes" 
                             placeholder="e.g. Closed for lunch between 1 PM - 2 PM" 
                             defaultValue={timings.timingNotes}
                           />
                        </motion.div>
                    )}
                </div>
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
            <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-20 border-b border-gray-100">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href={`/business-dashboard?id=${businessId}`}>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="icon">
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                        </motion.div>
                    </Link>
                    <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Update Business Timings</h1>
                </div>
            </header>

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
