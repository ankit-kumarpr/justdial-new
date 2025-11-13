
import { Hotel } from "@/lib/types";
import { RestaurantGallery } from "../restaurant-gallery"; // Re-using gallery component
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Share2, Heart } from "lucide-react";
import { HotelTabs } from "./HotelTabs";

export function HotelDetails({ hotel }: { hotel: Hotel }) {
    const ratingColor = hotel.rating >= 4.0 ? 'bg-green-600' : hotel.rating >= 3.0 ? 'bg-yellow-500' : 'bg-red-600';

    return (
        <div className="space-y-6">
            <RestaurantGallery business={{...hotel, gallery: hotel.gallery || [hotel.image]}} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3">
                     <Card>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-bold">{hotel.name}</h1>
                                        {hotel.verified && <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={`px-2 py-0.5 ${ratingColor} text-white rounded text-sm font-bold flex items-center gap-1`}>
                                            {hotel.rating.toFixed(1)}
                                        </div>
                                        <span className="text-sm text-gray-500">{hotel.reviews} Ratings</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{hotel.location}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon"><Share2 className="h-5 w-5"/></Button>
                                    <Button variant="outline" size="icon"><Heart className="h-5 w-5"/></Button>
                                </div>
                            </div>
                             <Separator className="my-4"/>
                             <div className="flex flex-wrap gap-2">
                                <Button className="bg-green-600 hover:bg-green-700">Call Now</Button>
                                <Button>Get Best Deal</Button>
                                <Button variant="outline">Check-in</Button>
                                <Button variant="outline">Check-out</Button>
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
             <HotelTabs hotel={hotel} />
        </div>
    );
}
