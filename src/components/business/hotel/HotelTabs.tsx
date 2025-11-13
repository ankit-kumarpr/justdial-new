
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hotel, Review } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { ReviewForm } from "../review-form";
import { StarRating } from "../star-rating";
import Image from "next/image";
import { Wifi, Utensils, ParkingCircle, Dumbbell, Wind } from "lucide-react";

const hotelFaqs = [
    {
        question: "What are the check-in and check-out times?",
        answer: "Standard check-in time is 2:00 PM and check-out is at 12:00 PM. Early check-in or late check-out may be available upon request, subject to availability and potential charges."
    },
    {
        question: "Is breakfast included in the room rate?",
        answer: "This depends on the booking package. Most of our rates include a complimentary buffet breakfast. Please check the details of your specific booking."
    },
     {
        question: "Do you have parking facilities?",
        answer: "Yes, we offer complimentary on-site parking for our guests. Valet service is also available."
    }
];

const AmenityIcon = ({ amenity }: { amenity: string }) => {
    switch (amenity.toLowerCase()) {
        case 'wi-fi': return <Wifi className="h-5 w-5 text-gray-600" />;
        case 'restaurant': return <Utensils className="h-5 w-5 text-gray-600" />;
        case 'parking': return <ParkingCircle className="h-5 w-5 text-gray-600" />;
        case 'gym': return <Dumbbell className="h-5 w-5 text-gray-600" />;
        case 'ac': return <Wind className="h-5 w-5 text-gray-600" />;
        default: return null;
    }
};

export function HotelTabs({ hotel }: { hotel: Hotel }) {
  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="amenities">Amenities</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="photos">Photos</TabsTrigger>
      </TabsList>
      <TabsContent value="about">
        <Card>
            <CardHeader><CardTitle className="text-lg">About {hotel.name}</CardTitle></CardHeader>
            <CardContent>
                <p className="text-sm text-gray-600 mb-6">A comfortable and affordable stay in the heart of the city. We offer a range of amenities to make your stay pleasant.</p>
                <div className="space-y-4 text-sm">
                     <div>
                        <h4 className="font-semibold mb-2">Address</h4>
                        <p className="text-gray-600">{hotel.location}</p>
                    </div>
                </div>
                 <div className="mt-6">
                    <h3 className="font-semibold mb-2">FAQs</h3>
                     {hotelFaqs.map(faq => (
                        <div key={faq.question} className="mb-2">
                            <p className="font-medium text-gray-800">Q: {faq.question}</p>
                            <p className="text-gray-600">A: {faq.answer}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="amenities">
        <Card>
            <CardHeader><CardTitle className="text-lg">Amenities</CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hotel.amenities?.map(amenity => (
                        <div key={amenity} className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
                            <AmenityIcon amenity={amenity} />
                            <span className="text-sm">{amenity}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="photos">
        <Card>
            <CardHeader><CardTitle className="text-lg">Photos</CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {(hotel.gallery || [hotel.image]).map((img, index) => (
                         <div key={index} className="relative aspect-square w-full h-auto rounded-md overflow-hidden">
                            <Image src={img} alt={`${hotel.name} gallery image ${index + 1}`} fill className="object-cover" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reviews">
        <Card>
            <CardHeader><CardTitle className="text-lg">Reviews</CardTitle></CardHeader>
            <CardContent>
                <ReviewForm businessId={hotel.id} />
            </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
