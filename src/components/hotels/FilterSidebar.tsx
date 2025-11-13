
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Star } from 'lucide-react';
import { useState } from 'react';

const hotelFilters = {
    starRating: ['5 Star', '4 Star', '3 Star', '2 Star'],
    hotelView: ['Sea View', 'Pool View', 'City View'],
    petsEssential: ['Pets Allowed'],
    userRatings: ['4.5 & above', '4 & above', '3 & above'],
    amenities: ['Swimming Pool', 'Wi-Fi', 'Parking', 'Restaurant', 'Gym', 'Spa']
};

export function FilterSidebar() {
    const [priceRange, setPriceRange] = useState([500, 5000]);

    return (
        <Card className="sticky top-24">
            <CardContent className="p-4">
                <Accordion type="multiple" defaultValue={['sort-by', 'filter-by', 'star-rating', 'amenities']} className="w-full">
                    <AccordionItem value="star-rating">
                        <AccordionTrigger className="font-semibold text-sm">Star Rating</AccordionTrigger>
                        <AccordionContent>
                             <div className="space-y-2">
                                {hotelFilters.starRating.map(option => (
                                    <div key={option} className="flex items-center space-x-2">
                                        <Checkbox id={`rating-${option}`} />
                                        <Label htmlFor={`rating-${option}`} className="font-normal text-sm flex items-center">
                                            {option}
                                            <Star className="w-4 h-4 ml-1 text-yellow-400 fill-current" />
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="budget">
                        <AccordionTrigger className="font-semibold text-sm">Budget</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4">
                                <Slider
                                    defaultValue={[500, 5000]}
                                    max={10000}
                                    step={100}
                                    onValueChange={setPriceRange}
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>₹{priceRange[0]}</span>
                                    <span>₹{priceRange[1]}</span>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="amenities">
                        <AccordionTrigger className="font-semibold text-sm">Amenities</AccordionTrigger>
                        <AccordionContent>
                             <div className="space-y-2">
                                {hotelFilters.amenities.map(option => (
                                    <div key={option} className="flex items-center space-x-2">
                                        <Checkbox id={`amenity-${option}`} />
                                        <Label htmlFor={`amenity-${option}`} className="font-normal text-sm">{option}</Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="user-ratings">
                        <AccordionTrigger className="font-semibold text-sm">User Ratings</AccordionTrigger>
                        <AccordionContent>
                             <div className="space-y-2">
                                {hotelFilters.userRatings.map(option => (
                                    <div key={option} className="flex items-center space-x-2">
                                        <Checkbox id={`user-rating-${option}`} />
                                        <Label htmlFor={`user-rating-${option}`} className="font-normal text-sm">{option}</Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Apply Filters</Button>
            </CardContent>
        </Card>
    );
}
