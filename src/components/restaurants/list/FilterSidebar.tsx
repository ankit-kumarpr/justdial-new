
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const filters = {
    sortBy: ['Popularity', 'Rating', 'Distance'],
    filterBy: ['Open Now', 'Jd Verified', 'Jd Trust', 'Rated'],
    categories: ['North Indian', 'Chinese', 'South Indian', 'Biryani', 'Pizza', 'Fast Food', 'Desserts', 'Cafe'],
    locations: ['Sitabuldi', 'Dharampeth', 'Pratap Nagar', 'Sadar', 'Manish Nagar'],
    moreFilters: ['Serves Alcohol', 'AC', 'Pure Veg', 'Wifi', 'Outdoor Seating', 'Live Music']
};

export function FilterSidebar() {
    const [selectedSort, setSelectedSort] = useState('Popularity');

    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" defaultValue={['sort-by', 'filter-by', 'categories', 'location']} className="w-full">
                    <AccordionItem value="sort-by">
                        <AccordionTrigger className="font-semibold">Sort By</AccordionTrigger>
                        <AccordionContent>
                             <RadioGroup value={selectedSort} onValueChange={setSelectedSort} className="space-y-2">
                                {filters.sortBy.map(option => (
                                    <div key={option} className="flex items-center space-x-2">
                                        <RadioGroupItem value={option} id={`sort-${option}`} />
                                        <Label htmlFor={`sort-${option}`} className="font-normal">{option}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="filter-by">
                        <AccordionTrigger className="font-semibold">Filter By</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2">
                                {filters.filterBy.map(option => (
                                    <div key={option} className="flex items-center space-x-2">
                                        <Checkbox id={`filter-${option}`} />
                                        <Label htmlFor={`filter-${option}`} className="font-normal">{option}</Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="categories">
                        <AccordionTrigger className="font-semibold">Categories</AccordionTrigger>
                        <AccordionContent>
                             <div className="space-y-2">
                                {filters.categories.map(option => (
                                    <div key={option} className="flex items-center space-x-2">
                                        <Checkbox id={`cat-${option}`} />
                                        <Label htmlFor={`cat-${option}`} className="font-normal">{option}</Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="location">
                        <AccordionTrigger className="font-semibold">Location</AccordionTrigger>
                        <AccordionContent>
                            <Input placeholder="Search Location" className="mb-2" />
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {filters.locations.map(option => (
                                    <div key={option} className="flex items-center space-x-2">
                                        <Checkbox id={`loc-${option}`} />
                                        <Label htmlFor={`loc-${option}`} className="font-normal">{option}</Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="more-filters">
                        <AccordionTrigger className="font-semibold">More Filters</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2">
                                {filters.moreFilters.map(option => (
                                    <div key={option} className="flex items-center space-x-2">
                                        <Checkbox id={`more-${option}`} />
                                        <Label htmlFor={`more-${option}`} className="font-normal">{option}</Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Button className="w-full mt-6">Apply Filters</Button>
            </CardContent>
        </Card>
    );
}
