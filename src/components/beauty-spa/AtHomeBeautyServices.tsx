import { Card, CardContent } from "@/components/ui/card";
import { atHomeBeautyServices } from "@/lib/beauty-spa-data";
import Image from "next/image";

export function AtHomeBeautyServices() {
    return (
        <section>
            <h2 className="text-xl font-bold mb-4">At-Home Beauty And Wellness Services</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {atHomeBeautyServices.map((service) => (
                    <a key={service.name} href="#" className="group">
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-40">
                                <Image
                                    src={service.image}
                                    alt={service.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform"
                                    data-ai-hint={service.hint}
                                />
                            </div>
                            <CardContent className="p-3">
                                <h3 className="font-semibold text-center text-sm">{service.name}</h3>
                            </CardContent>
                        </Card>
                    </a>
                ))}
            </div>
        </section>
    )
}
