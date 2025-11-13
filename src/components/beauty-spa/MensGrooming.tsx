import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mensGrooming } from "@/lib/beauty-spa-data";
import Image from "next/image";

export function MensGrooming() {
    return (
        <section>
            <h2 className="text-xl font-bold mb-4">Men's Grooming</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mensGrooming.map((item) => (
                    <Card key={item.name} className="flex items-center p-4 gap-4">
                        <div className="relative w-20 h-20 rounded-md overflow-hidden">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                data-ai-hint={item.hint}
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-xs text-gray-500">{item.location}</p>
                            <div className="flex gap-2 mt-2">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8">Show Number</Button>
                                <Button size="sm" variant="outline" className="h-8">WhatsApp</Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <div className="text-center mt-6">
                <Button>View All</Button>
            </div>
        </section>
    )
}
