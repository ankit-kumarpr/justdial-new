
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import type { TopVendor } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Briefcase, MapPin, Server } from 'lucide-react';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || 'https://picsum.photos/seed/placeholder/300/200';

export function TopVendors({ vendors }: { vendors: TopVendor[] }) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    if (!vendors || vendors.length === 0) {
        return null;
    }

    return (
        <section className="py-8">
            <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-gray-900">Top Vendors Near You</h2>
                 <a href="#" className="text-accent hover:underline font-medium">View All →</a>
            </div>
             <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                {vendors.map((vendor) => {
                    let imageUrl = findImage('business-profile-image'); 
                    
                    if(vendor.business?.photos?.[0]) {
                        const imagePath = vendor.business.photos[0];
                        imageUrl = imagePath.startsWith('http') ? imagePath : `${apiBaseUrl}${imagePath}`;
                    }

                    return (
                        <CarouselItem key={vendor._id} className="md:basis-1/2 lg:basis-1/4">
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                                <div className="relative h-40">
                                    <Image
                                        src={imageUrl}
                                        alt={vendor.business?.businessName || vendor.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform"
                                        sizes="(max-width: 768px) 50vw, 33vw"
                                        data-ai-hint="business office"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-bold text-gray-900 group-hover:text-accent truncate text-lg">
                                        <Link href={`/business-dashboard?id=${vendor.business?._id}`}>{vendor.business?.businessName || vendor.name}</Link>
                                    </h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                        <MapPin className="h-4 w-4" />
                                        {vendor.distanceKm} km away
                                    </p>
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                        <Server className="h-4 w-4" />
                                        {vendor.totalServices} services
                                    </p>
                                    <Button asChild size="sm" className="w-full mt-4">
                                        <Link href={`/business-dashboard?id=${vendor.business?._id}`}>View Profile</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    );
                })}
                </CarouselContent>
                 <CarouselPrevious className="left-[-1rem]" />
                 <CarouselNext className="right-[-1rem]" />
            </Carousel>
        </section>
    );
}
