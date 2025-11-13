
'use client';

import { useState, Suspense, useEffect, useActionState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, PlusCircle, Trash2, Loader2, CalendarHeart } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { useSearchParams } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isEqual, startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { updateHolidayTimings, getHolidayTimings, type HolidayTimingsState } from './actions';
import { v4 as uuidv4 } from 'uuid';

const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
        options.push(`${i.toString().padStart(2, '0')}:00`);
        options.push(`${i.toString().padStart(2, '0')}:30`);
    }
    return options;
};

const timeOptions = generateTimeOptions();

type UpcomingHoliday = {
    name: string | { params: any; val: string };
    date: string; // Keep as string from API
};

export type TimeSlot = {
    id: string;
    open: string;
    close: string;
};

export type HolidayTiming = {
    id: string;
    date: Date;
    description: string;
    is_closed: boolean;
    slots: TimeSlot[];
};


function HolidayTimingsComponent() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id');
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [upcomingHolidays, setUpcomingHolidays] = useState<UpcomingHoliday[]>([]);
    const [isLoadingHolidays, setIsLoadingHolidays] = useState(true);

    const [holidayTimings, setHolidayTimings] = useState<HolidayTiming[]>([]);

    const initialState: HolidayTimingsState = {};
    const [state, formAction, isPending] = useActionState(updateHolidayTimings, initialState);

    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const response = await fetch('/api/holidays');
                if (!response.ok) throw new Error('Failed to fetch holidays');
                const data = await response.json();
                setUpcomingHolidays(data.holidays);
            } catch (error) {
                console.error('Error fetching upcoming holidays:', error);
                toast({ title: 'Error', description: 'Could not load upcoming holidays.', variant: 'destructive' });
            } finally {
                setIsLoadingHolidays(false);
            }
        };
        fetchHolidays();
    }, [toast]);
    
    const fetchTimingsData = useCallback(async () => {
         if (!businessId) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        const { data, error } = await getHolidayTimings(businessId);
        
        if (error) {
            toast({ title: "Error", description: "Failed to load holiday timings.", variant: "destructive" });
        } else if (data) {
            const formattedData = data.map(item => ({
                id: item.id,
                date: new Date(item.holiday_date),
                description: item.description || '',
                is_closed: item.is_closed,
                slots: item.time_slots ? item.time_slots.map((slot: any) => ({ ...slot, id: slot.id || uuidv4() })) : [],
            }));
            setHolidayTimings(formattedData);
        }
        setIsLoading(false);
    }, [businessId, toast]);

    useEffect(() => {
        fetchTimingsData();
    }, [fetchTimingsData]);

    useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? "Success!" : "Error",
                description: state.message,
                variant: state.success ? 'default' : 'destructive'
            });
        }
    }, [state, toast]);

    const handleHolidayToggle = (holiday: UpcomingHoliday, checked: boolean) => {
        const holidayDate = new Date(holiday.date);
        const holidayName = typeof holiday.name === 'string' ? holiday.name : holiday.name.val;

        setHolidayTimings(prev => {
            if (checked) {
                if (prev.some(h => isEqual(startOfDay(h.date), startOfDay(holidayDate)))) {
                    return prev;
                }
                return [...prev, { 
                    id: uuidv4(), 
                    date: holidayDate, 
                    description: holidayName, 
                    is_closed: false,
                    slots: [{ id: uuidv4(), open: '09:00', close: '18:00'}] 
                }];
            } else {
                return prev.filter(h => !isEqual(startOfDay(h.date), startOfDay(holidayDate)));
            }
        });
    };
    
    const handleAddNewDate = () => {
        const newDate = new Date();
        newDate.setHours(0,0,0,0);
        if (holidayTimings.some(h => isEqual(startOfDay(h.date), startOfDay(newDate)))) {
            toast({ title: "Info", description: "This date is already added. Please edit the existing entry."});
            return;
        }
        setHolidayTimings(prev => [...prev, {
            id: uuidv4(),
            date: newDate,
            description: 'Special Hours',
            is_closed: false,
            slots: [{ id: uuidv4(), open: '09:00', close: '18:00'}] 
        }]);
    }

    const handleDateChange = (holidayId: string, newDate?: Date) => {
        if (!newDate) return;
        setHolidayTimings(prev => prev.map(h => {
             if (h.id === holidayId) {
                // Check if the new date is already in the list (excluding the current one)
                const isDateTaken = prev.some(existing => 
                    existing.id !== holidayId && 
                    isEqual(startOfDay(existing.date), startOfDay(newDate))
                );
                
                if (isDateTaken) {
                    toast({ title: "Duplicate Date", description: "This date is already in your holiday list. Please choose another.", variant: "destructive"});
                    return h; // Return original holiday object
                }
                
                return { ...h, date: newDate, description: format(newDate, "eeee, dd MMMM") };
            }
            return h;
        }));
    };

    const handleIsClosedToggle = (holidayId: string) => {
        setHolidayTimings(prev => prev.map(h => {
            if (h.id === holidayId) {
                return { ...h, is_closed: !h.is_closed };
            }
            return h;
        }));
    };
    
    const handleSlotChange = (holidayId: string, slotId: string, field: 'open' | 'close', value: string) => {
        setHolidayTimings(prev => prev.map(h => {
            if (h.id === holidayId) {
                const newSlots = h.slots.map(s => s.id === slotId ? { ...s, [field]: value } : s);
                return { ...h, slots: newSlots };
            }
            return h;
        }));
    };

    const handleAddTimeSlot = (holidayId: string) => {
        setHolidayTimings(prev => prev.map(h => {
            if (h.id === holidayId) {
                return { ...h, slots: [...h.slots, { id: uuidv4(), open: '09:00', close: '18:00' }] };
            }
            return h;
        }));
    };
    
    const handleRemoveTimeSlot = (holidayId: string, slotId: string) => {
        setHolidayTimings(prev => prev.map(h => {
            if (h.id === holidayId) {
                if (h.slots.length > 1) {
                    return { ...h, slots: h.slots.filter(s => s.id !== slotId) };
                }
            }
            return h;
        }));
    };

    const handleRemoveDate = (holidayId: string) => {
        setHolidayTimings(prev => prev.filter(h => h.id !== holidayId));
    };
    

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

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
                    <Link href={`/business-dashboard/update-business-timings?id=${businessId}`}>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="icon">
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                        </motion.div>
                    </Link>
                    <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Add Holiday Timings</h1>
                </div>
            </header>

            <form action={formAction}>
                <input type="hidden" name="businessId" value={businessId || ''} />
                <input type="hidden" name="holidayTimings" value={JSON.stringify(holidayTimings)} />

                <main className="flex-grow container mx-auto px-4 py-6 relative z-10">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <CalendarHeart className="h-5 w-5 text-primary" />
                                  <h3 className="font-semibold text-lg">Upcoming Holidays</h3>
                                </div>
                                {isLoadingHolidays ? (
                                    <div className="flex items-center justify-center p-4">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                        <span className="ml-2">Loading holidays...</span>
                                    </div>
                                ) : (
                                  upcomingHolidays.map((holiday, index) => {
                                      const holidayName = typeof holiday.name === 'string' ? holiday.name : holiday.name.val;
                                      return (
                                        <div key={`${holidayName}-${index}`} className="flex items-center space-x-3 pb-4 border-b last:border-b-0">
                                            <Checkbox 
                                            id={`${holidayName}-${index}`}
                                            onCheckedChange={(checked) => handleHolidayToggle(holiday, !!checked)} 
                                            checked={holidayTimings.some(h => isEqual(startOfDay(h.date), startOfDay(new Date(holiday.date))))}
                                            />
                                            <div className="grid gap-1.5 leading-none">
                                                <label htmlFor={`${holidayName}-${index}`} className="font-medium cursor-pointer">{holidayName}</label>
                                                <p className="text-sm text-muted-foreground">{format(new Date(holiday.date), 'E, dd MMMM yyyy')}</p>
                                            </div>
                                        </div>
                                      )
                                  })
                                )}
                            </CardContent>
                        </Card>

                        {holidayTimings.map(holiday => (
                            <Card key={holiday.id} className="rounded-3xl shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="text-base font-semibold">
                                                    {format(holiday.date, 'E, dd MMMM yyyy')}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <Calendar mode="single" selected={holiday.date} onSelect={(date) => handleDateChange(holiday.id, date)} />
                                            </PopoverContent>
                                        </Popover>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveDate(holiday.id)}>
                                        <Trash2 className="h-5 w-5 text-destructive" />
                                    </Button>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id={`closed-${holiday.id}`} checked={holiday.is_closed} onCheckedChange={() => handleIsClosedToggle(holiday.id)} />
                                    <Label htmlFor={`closed-${holiday.id}`}>Closed for the day</Label>
                                </div>
                                {!holiday.is_closed && holiday.slots.map((slot, index) => (
                                        <div key={slot.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                                            <div>
                                                <Select value={slot.open} onValueChange={(value) => handleSlotChange(holiday.id, slot.id, 'open', value)}>
                                                    <SelectTrigger><SelectValue placeholder="Opens at" /></SelectTrigger>
                                                    <SelectContent>{timeOptions.map(time => <SelectItem key={`open-${slot.id}-${time}`} value={time}>{time}</SelectItem>)}</SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Select value={slot.close} onValueChange={(value) => handleSlotChange(holiday.id, slot.id, 'close', value)}>
                                                <SelectTrigger><SelectValue placeholder="Closes at" /></SelectTrigger>
                                                <SelectContent>{timeOptions.map(time => <SelectItem key={`close-${slot.id}-${time}`} value={time}>{time}</SelectItem>)}</SelectContent>
                                                </Select>
                                            </div>
                                            {index > 0 && 
                                                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveTimeSlot(holiday.id, slot.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            }
                                        </div>
                                ))}
                                {!holiday.is_closed && (
                                    <Button type="button" variant="link" className="p-0 h-auto text-primary" onClick={() => handleAddTimeSlot(holiday.id)}>
                                        <PlusCircle className="h-4 w-4 mr-2" /> Add Another Time Slot
                                    </Button>
                                )}
                                </CardContent>
                            </Card>
                        ))}
                        
                        <Button type="button" variant="link" className="p-0 h-auto text-primary text-base" onClick={handleAddNewDate}>
                            <PlusCircle className="h-5 w-5 mr-2" /> Add New Date
                        </Button>
                    </div>
                </main>
                
                <footer className="bg-white/80 backdrop-blur-md py-4 border-t border-gray-100 sticky bottom-0 z-20 shadow-lg">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 shadow-lg" disabled={isPending}>
                           {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                           {isPending ? 'Saving...' : 'Save and Continue'}
                        </Button>
                    </div>
                </footer>
            </form>
        </motion.div>
    );
}

function HolidayTimingsPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-12 w-12 animate-spin" /></div>}>
            <HolidayTimingsComponent />
        </Suspense>
    )
}

export default function Page() {
  return (
    <Suspense>
      <HolidayTimingsPage />
    </Suspense>
  )
}
