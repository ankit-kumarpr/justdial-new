
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

type Service = {
    _id: string;
    serviceName: string;
    serviceImage: string | null;
    totalEnquiries: number;
};

type TrendingSearchesProps = {
    services: Service[];
};

export function TrendingSearches({ services }: TrendingSearchesProps) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!services || services.length === 0) {
        return null; // Or a skeleton loader
    }

    return (
        <section className="py-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">Trending Services Near You</h2>
                    <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded">NEW</span>
                </div>
                <a href="#" className="text-accent hover:underline font-medium">View All →</a>
            </div>
            
            <p className="text-gray-600 mb-6">Stay updated with the latest local trends in services.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {services.slice(0, 10).map((service) => {
                    const imageUrl = service.serviceImage
                        ? service.serviceImage.startsWith('http')
                            ? service.serviceImage
                            : `${apiBaseUrl}${service.serviceImage.replace(/\\/g, '/').replace(/^D:\/mytestbackend/, '')}`
                        : 'https://picsum.photos/seed/placeholder/300/200';
                    
                    return (
                        <a href="#" key={service._id} className="group">
                            <Card className="text-center hover:shadow-lg transition-all group-hover:border-accent/20">
                                <CardContent className="p-4 flex flex-col items-center gap-3">
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                        <Image
                                            src={imageUrl}
                                            alt={service.serviceName}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform"
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 10vw"
                                        />
                                    </div>
                                    <div className="text-sm font-medium text-gray-900 group-hover:text-accent text-center leading-tight">
                                        {service.serviceName}
                                    </div>
                                    <span className="text-xs text-accent hover:underline">{service.totalEnquiries}+ options</span>
                                </CardContent>
                            </Card>
                        </a>
                    );
                })}
            </div>
        </section>
    );
}
