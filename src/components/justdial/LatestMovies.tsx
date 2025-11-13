'use client';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { jdLatestMovies } from '@/lib/justdial-data';
import Image from 'next/image';
import { Star } from 'lucide-react';

export function LatestMovies() {
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Latest Movies</h2>
        <a href="#" className="text-accent hover:underline font-medium">View All →</a>
      </div>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {jdLatestMovies.map((movie, index) => (
            <CarouselItem key={index} className="basis-1/2 md:basis-1/4 lg:basis-1/6">
              <a href="#" className="group">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={movie.image}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm truncate group-hover:text-accent">{movie.title}</h3>
                    <p className="text-xs text-gray-500">{movie.language}</p>
                    <div className="flex items-center gap-1 text-xs mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span>{movie.rating > 0 ? movie.rating.toFixed(1) : 'New'}</span>
                      <span className="text-gray-400">({movie.votes} votes)</span>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-[-1rem]" />
        <CarouselNext className="right-[-1rem]" />
      </Carousel>
    </section>
  );
}
