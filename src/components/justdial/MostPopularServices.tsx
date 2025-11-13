
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import type { PopularService } from '@/lib/types';

export function MostPopularServices({ services }: { services: PopularService[] }) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!services || services.length === 0) {
        return null;
    }

    const formatPrice = (service: PopularService) => {
        switch (service.priceType) {
            case 'fixed':
                return `₹${service.discountPrice || service.actualPrice}`;
            case 'range':
                return `₹${service.minPrice} - ₹${service.maxPrice}`;
            default:
                return 'Price on request';
        }
    };

    return (
        <section className="py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Most Popular Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {services.map((service) => {
                    let imageUrl = 'https://picsum.photos/seed/placeholder/300/200';
                    if (service.serviceImage) {
                        if (service.serviceImage.startsWith('http')) {
                            imageUrl = service.serviceImage;
                        } else {
                            const cleanPath = service.serviceImage.replace(/\\/g, '/').replace(/^D:\/mytestbackend/, '');
                            imageUrl = `${apiBaseUrl}${cleanPath}`;
                        }
                    }

                    return (
                        <a href="#" key={service._id} className="group">
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="relative h-32">
                                    <Image
                                        src={imageUrl}
                                        alt={service.serviceName}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform"
                                        sizes="(max-width: 768px) 50vw, 33vw"
                                        data-ai-hint="service"
                                    />
                                </div>
                                <CardContent className="p-3">
                                    <h4 className="font-medium text-gray-900 group-hover:text-accent truncate">
                                        {service.serviceName}
                                    </h4>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-sm font-bold text-primary">{formatPrice(service)}</p>
                                        <Button size="sm" variant="outline">Enquire Now</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </a>
                    );
                })}
            </div>
        </section>
    );
}
