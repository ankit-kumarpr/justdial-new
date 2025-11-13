
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { trendsSuccessStories } from "@/lib/justdial-data"
import Image from "next/image"

export function SuccessStories() {
  return (
    <section>
        <h2 className="text-base font-semibold mb-4">Success Stories</h2>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {trendsSuccessStories.map((story, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
              <div className="p-1">
                <Card className="overflow-hidden bg-white">
                  {story.image && <Image src={story.image} alt={story.name} width={300} height={200} className="w-full h-32 object-cover" />}
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm">{story.name}</h3>
                    <p className="text-xs text-gray-500">{story.location}</p>
                  </CardContent>
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
