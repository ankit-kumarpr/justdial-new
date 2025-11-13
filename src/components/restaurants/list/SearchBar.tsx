
'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function SearchBar() {
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
            placeholder="Search for Restaurants..."
            className="border-gray-300 focus:ring-primary focus:border-primary h-11 text-base pr-12"
          />
        </div>
        <Button className="h-11 bg-primary hover:bg-primary/90">
            <Search className="h-5 w-5 text-primary-foreground mr-2" />
            Search
        </Button>
      </div>
    </Card>
  );
}
