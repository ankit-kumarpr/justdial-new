import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { weddingServices } from "@/lib/beauty-spa-data";
import Image from "next/image";
import { Star } from "lucide-react";

export function WeddingServices() {
    return (
        <section>
            <h2 className="text-xl font-bold mb-4">Explore Wedding Services</h2>
            <Tabs defaultValue="makeup-artists">
                <TabsList>
                    <TabsTrigger value="makeup-artists">Makeup Artists</TabsTrigger>
                    <TabsTrigger value="wedding-halls">Wedding Halls</TabsTrigger>
                </TabsList>
                <TabsContent value="makeup-artists" className="space-y-4 pt-4">
                    {weddingServices.makeupArtists.map(item => (
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
                                <div className="flex items-center gap-1 text-xs">
                                    <Star className="w-3 h-3 text-green-500 fill-green-500" />
                                    <span className="font-bold text-green-600">{item.rating}</span>
                                    <span className="text-gray-500">({item.reviews} Ratings)</span>
                                </div>
                                <p className="text-xs text-gray-500">{item.location}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8">Show Number</Button>
                                <Button size="sm" className="bg-primary hover:bg-primary/90 h-8">View and Book</Button>
                            </div>
                        </Card>
                    ))}
                </TabsContent>
                <TabsContent value="wedding-halls">
                    <p className="text-center text-gray-500 py-8">Wedding Halls coming soon!</p>
                </TabsContent>
            </Tabs>
            <div className="text-center mt-6">
                <Button>View All</Button>
            </div>
        </section>
    )
}
