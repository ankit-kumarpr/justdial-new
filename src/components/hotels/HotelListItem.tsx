
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, CheckCircle, Phone, MessageSquare } from 'lucide-react';
import type { Hotel } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type HotelListItemProps = {
    hotel: Hotel;
};

export function HotelListItem({ hotel }: HotelListItemProps) {
    const ratingColor = hotel.rating >= 4.0 ? 'bg-green-600' : hotel.rating >= 3.0 ? 'bg-yellow-500' : 'bg-red-600';

    return (
        <Card className="bg-white">
            <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                    <Image
                        src={hotel.image}
                        alt={hotel.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                        data-ai-hint="hotel exterior"
                    />
                     <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <div className={`px-2 py-0.5 ${ratingColor} text-white rounded text-xs font-bold flex items-center gap-1`}>
                            {hotel.rating.toFixed(1)} <Star className="h-3 w-3" />
                        </div>
                    </div>
                </div>
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-gray-800 hover:text-primary">
                        <Link href={`/business/${hotel.id}`}>{hotel.name}</Link>
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>{hotel.reviews} Ratings</span>
                        {hotel.trending && <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3 text-orange-500" /> Trending</span>}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{hotel.location}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {hotel.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                        {hotel.verified && <Badge variant="default" className="text-xs bg-green-100 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1"/>Verified</Badge>}
                    </div>
                    {hotel.price && (
                        <p className="text-lg font-bold text-red-600 mt-2">
                            ₹{hotel.price.toLocaleString()} <span className="text-sm text-gray-500 font-normal">onwards</span>
                            {hotel.discount && <span className="ml-2 text-sm text-green-600 font-semibold bg-green-100 px-2 py-1 rounded">{hotel.discount}% off</span>}
                        </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-4">
                        <Button className="bg-green-600 hover:bg-green-700 flex-1">
                            <Phone className="mr-2 h-4 w-4" /> 09922...
                        </Button>
                        <Button variant="outline" className="flex-1">
                             <Image src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="whatsapp" width={16} height={16} className="mr-2"/>
                             WhatsApp
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 flex-1">
                           Get Best Deal
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
