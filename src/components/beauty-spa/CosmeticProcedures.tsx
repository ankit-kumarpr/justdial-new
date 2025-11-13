import { Card, CardContent } from "@/components/ui/card";
import { cosmeticProcedures } from "@/lib/beauty-spa-data";
import Image from "next/image";

export function CosmeticProcedures() {
    return (
        <section className="bg-pink-50 p-8 rounded-lg">
            <div className="flex items-center gap-8">
                <div className="w-1/3 relative self-stretch">
                     <Image
                        src={cosmeticProcedures.mainImage.src}
                        alt={cosmeticProcedures.mainImage.alt}
                        fill
                        className="object-cover rounded-lg"
                        data-ai-hint={cosmeticProcedures.mainImage.hint}
                    />
                </div>
                <div className="w-2/3">
                    <h2 className="text-xl font-bold mb-4">Cosmetic Procedures</h2>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {cosmeticProcedures.services.map((service) => (
                            <a key={service.name} href="#" className="group">
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="relative h-28">
                                        <Image
                                            src={service.image}
                                            alt={service.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform"
                                            data-ai-hint={service.hint}
                                        />
                                    </div>
                                    <CardContent className="p-2">
                                        <h3 className="font-semibold text-center text-xs">{service.name}</h3>
                                    </CardContent>
                                </Card>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
