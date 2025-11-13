
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Phone, MessageSquare, Menu } from 'lucide-react';
import type { RestaurantListItemData } from '@/lib/restaurant-list-data';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type RestaurantListItemProps = {
    restaurant: RestaurantListItemData;
};

export function RestaurantListItem({ restaurant }: RestaurantListItemProps) {
    const ratingColor = restaurant.rating >= 4.0 ? 'bg-green-600' : restaurant.rating >= 3.0 ? 'bg-yellow-500' : 'bg-red-600';

    return (
        <Card className="bg-white">
            <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                    <Image
                        src={restaurant.image}
                        alt={restaurant.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                        data-ai-hint="restaurant food"
                    />
                </div>
                <div className="flex-grow">
                    {restaurant.sponsored && <p className="text-xs text-gray-500 mb-1">Sponsored</p>}
                    <h3 className="text-lg font-bold text-primary hover:text-primary/80">
                        <Link href={`/business/${restaurant.id}`}>{restaurant.name}</Link>
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <div className={`px-2 py-0.5 ${ratingColor} text-white rounded text-xs font-bold flex items-center gap-1`}>
                            {restaurant.rating.toFixed(1)} <Star className="h-3 w-3" />
                        </div>
                        <span className="text-xs text-gray-500">{restaurant.votes} Votes</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {restaurant.cuisines.map(cuisine => (
                            <Badge key={cuisine} variant="outline" className="text-xs">{cuisine}</Badge>
                        ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{restaurant.location}</p>
                    <p className="text-sm text-green-600 mt-1 font-medium">{restaurant.status}</p>
                    {restaurant.offer && (
                        <p className="text-sm font-semibold text-destructive mt-1">{restaurant.offer}</p>
                    )}
                    <div className="flex items-center gap-2 mt-4">
                        <Button className="bg-green-600 hover:bg-green-700">
                            <Phone className="mr-2 h-4 w-4" /> Call
                        </Button>
                        <Button variant="outline">
                            <MessageSquare className="mr-2 h-4 w-4" /> Enquiry
                        </Button>
                         <Button variant="outline">
                            <Menu className="mr-2 h-4 w-4" /> Check Menu
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
