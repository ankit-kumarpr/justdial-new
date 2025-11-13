
import { Business } from "@/lib/types";
import { RestaurantGallery } from "../restaurant-gallery";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Phone, MessageSquare, Menu, Calendar, Share2, Heart, Edit } from "lucide-react";
import { RestaurantTabs } from "./RestaurantTabs";
import Image from "next/image";
import { CardHeader, CardTitle } from "@/components/ui/card";

export function RestaurantDetails({ business }: { business: Business }) {
    const ratingColor = business.rating >= 4.0 ? 'bg-green-600' : business.rating >= 3.0 ? 'bg-yellow-500' : 'bg-red-600';

    return (
        <>
            <RestaurantGallery business={business} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className='lg:col-span-2 space-y-6'>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-bold">{business.name}</h1>
                                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={`px-2 py-0.5 ${ratingColor} text-white rounded text-sm font-bold flex items-center gap-1`}>
                                            {business.rating.toFixed(1)}
                                        </div>
                                        <span className="text-sm text-gray-500">{business.reviews.length} Ratings</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{business.address}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon"><Share2 className="h-5 w-5"/></Button>
                                    <Button variant="outline" size="icon"><Heart className="h-5 w-5"/></Button>
                                    <Button variant="outline" size="icon"><Edit className="h-5 w-5"/></Button>
                                </div>
                            </div>
                             <Separator className="my-4"/>
                             <div className="flex flex-wrap gap-2">
                                <Button className="bg-green-600 hover:bg-green-700"><Phone className="mr-2 h-4 w-4" /> Call</Button>
                                <Button variant="outline"><MessageSquare className="mr-2 h-4 w-4"/>Enquiry</Button>
                                <Button variant="outline"><Menu className="mr-2 h-4 w-4"/>Check Menu</Button>
                                <Button variant="outline"><Calendar className="mr-2 h-4 w-4"/>Book a Table</Button>
                             </div>
                        </CardContent>
                    </Card>

                    <RestaurantTabs business={business} />
                </div>
                <div className="space-y-6">
                    <Card>
                         <CardHeader>
                            <CardTitle className="text-base">CALL</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center text-center">
                                <p className="text-2xl font-bold tracking-wider">{business.phone}</p>
                                <p className="text-xs text-gray-500">Kandivali West, Mumbai</p>
                                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700"><Phone className="mr-2 h-4 w-4" />Call Now</Button>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Location & Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative h-40 rounded-md overflow-hidden">
                               <Image src="https://picsum.photos/seed/map-location/400/200" alt="Map" fill className="object-cover" />
                            </div>
                            <p className="text-sm mt-4">{business.address}</p>
                            <Button variant="link" className="p-0 h-auto text-blue-600 mt-2">Get Directions</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}
