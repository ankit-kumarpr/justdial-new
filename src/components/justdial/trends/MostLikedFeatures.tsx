
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { mostLikedFeaturesData } from "@/lib/justdial-data"
import Image from "next/image"

export function MostLikedFeatures() {
  return (
    <section>
        <h2 className="text-base font-semibold mb-4">Most Liked Features by competitors</h2>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {mostLikedFeaturesData.map((feature, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="p-4 flex items-center gap-4 bg-white">
                    {feature.image && <Image src={feature.image} alt={feature.title} width={80} height={80} />}
                    <div>
                        <h3 className="font-semibold text-sm">{feature.title}</h3>
                        <p className="text-xs text-gray-500">{feature.description}</p>
                        <a href="#" className="text-xs text-accent hover:underline mt-1 inline-block">What are its features?</a>
                    </div>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-[-1rem]"/>
        <CarouselNext className="right-[-1rem]"/>
      </Carousel>
    </section>
  )
}
