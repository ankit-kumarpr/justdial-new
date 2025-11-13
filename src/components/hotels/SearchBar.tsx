
'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Search, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useState } from 'react';

export function SearchBar() {
    const [checkInDate, setCheckInDate] = useState<Date | undefined>(new Date('2025-10-16'));
    const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(new Date('2025-10-17'));

    return (
    <Card className="p-2 bg-white shadow-md">
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            defaultValue="Mumbai"
            className="pl-10 border-gray-300 focus:ring-primary focus:border-primary h-11 text-base"
          />
        </div>
        <div className="relative flex-grow-[2]">
          <Input
            placeholder="Search for Hotels..."
            defaultValue="Hotels"
            className="border-gray-300 focus:ring-primary focus:border-primary h-11 text-base pr-12"
          />
        </div>

        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="h-11 text-base font-normal flex-grow">
                    <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                    {checkInDate ? format(checkInDate, 'dd-MM-yyyy') : 'Check-in'}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <CalendarPicker mode="single" selected={checkInDate} onSelect={setCheckInDate} />
            </PopoverContent>
        </Popover>

         <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="h-11 text-base font-normal flex-grow">
                    <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                    {checkOutDate ? format(checkOutDate, 'dd-MM-yyyy') : 'Check-out'}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <CalendarPicker mode="single" selected={checkOutDate} onSelect={setCheckOutDate} />
            </PopoverContent>
        </Popover>

        <Button className="h-11 bg-primary hover:bg-primary/90">
            <Search className="h-5 w-5 text-primary-foreground mr-2" />
            Search
        </Button>
      </div>
    </Card>
  );
}
