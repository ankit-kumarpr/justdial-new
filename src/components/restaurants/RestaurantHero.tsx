'use client';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export function RestaurantHero() {
  return (
    <div className="relative h-48 md:h-64 my-6 rounded-lg overflow-hidden">
      <Image
        src={findImage('restaurant-hero-banner')}
        alt="It's all about food"
        fill
        className="object-cover"
        data-ai-hint="food platter"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <h1 className="text-white text-4xl md:text-5xl font-bold tracking-wider">IT'S ALL ABOUT FOOD</h1>
      </div>
    </div>
  );
}