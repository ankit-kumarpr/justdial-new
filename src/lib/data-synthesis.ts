
import type { Business, Category, Hotel } from '@/lib/types';
import { Utensils, Wrench, Store, HeartPulse, BookOpen, Brush } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { hotelListData } from './hotel-data';

export const categories: Category[] = [
  { name: 'Restaurants', slug: 'restaurants', icon: Utensils },
  { name: 'Auto Repair', slug: 'auto-repair', icon: Wrench },
  { name: 'Retail', slug: 'retail', icon: Store },
  { name: 'Health', slug: 'health', icon: HeartPulse },
  { name: 'Bookstores', slug: 'bookstores', icon: BookOpen },
  { name: 'Art & Culture', slug: 'art-culture', icon: Brush },
];

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || null;

export const businesses: Business[] = [
  {
    id: '1',
    name: 'The Golden Spoon',
    category: 'restaurants',
    description: 'A fine dining experience with a modern twist on classic cuisine. Perfect for special occasions. We pride ourselves on using locally-sourced, organic ingredients to craft unforgettable dishes. Our tasting menu changes seasonally to reflect the best of what our region has to offer.',
    address: '123 Culinary Lane, Foodville, 90210',
    phone: '555-123-4567',
    website: 'https://thegoldenspoon.example.com',
    rating: 4.5,
    image: findImage('restaurant-1')!,
    gallery: [findImage('gallery-1')!, findImage('gallery-2')!, findImage('gallery-3')!, findImage('gallery-4')!, findImage('gallery-5')!],
    reviews: [
      { id: 'r1', author: 'Alice', rating: 5, comment: 'Absolutely amazing! The food was divine and the service was impeccable. A true gem.', date: '2023-10-26' },
      { id: 'r2', author: 'Bob', rating: 4, comment: 'Great atmosphere and creative dishes, but it was a bit pricey for the portion sizes.', date: '2023-10-22' },
    ],
    cuisines: ['North Indian', 'Mughlai', 'Chinese'],
  },
  {
    id: '2',
    name: 'QuickFix Auto',
    category: 'auto-repair',
    description: 'Reliable and fast auto repair services. We handle everything from oil changes to complex engine diagnostics. Our certified technicians have over 20 years of combined experience.',
    address: '456 Mechanic Row, Cartown, 60601',
    phone: '555-987-6543',
    website: 'https://quickfixauto.example.com',
    rating: 4.8,
    image: findImage('mechanic-1')!,
    gallery: [findImage('mechanic-1')!, findImage('gallery-6')!, findImage('gallery-7')!],
    reviews: [
      { id: 'r3', author: 'Charlie', rating: 5, comment: 'Honest and fair pricing. They explained everything clearly and my car runs like new!', date: '2023-09-15' },
    ],
    cuisines: [],
  },
  {
    id: '3',
    name: 'The Cozy Corner Bakery',
    category: 'restaurants',
    description: 'A charming local bakery known for its artisanal breads, delicious pastries, and custom cakes for all occasions. We bake everything from scratch daily using traditional family recipes.',
    address: '789 Sweet Street, Sugarton, 33101',
    phone: '555-234-5678',
    website: 'https://cozycorner.example.com',
    rating: 4.9,
    image: findImage('bakery-1')!,
    gallery: [findImage('bakery-1')!, findImage('gallery-8')!, findImage('gallery-9')!],
    reviews: [
        { id: 'r4', author: 'Diana', rating: 5, comment: 'The best croissants outside of Paris! A must-visit for anyone with a sweet tooth.', date: '2023-11-01' },
        { id: 'r5', author: 'Eve', rating: 5, comment: 'I order all my family\'s birthday cakes from here. They are always beautiful and delicious. Never disappointed.', date: '2023-10-28' },
    ],
    cuisines: ['Bakery', 'Desserts', 'Cafe'],
  },
  {
    id: '4',
    name: 'Page Turners',
    category: 'bookstores',
    description: 'An independent bookstore with a curated selection of new and used books across all genres. Join our weekly reading club or attend an author signing event!',
    address: '101 Library Ave, Readsville, 10001',
    phone: '555-345-6789',
    website: 'https://pageturners.example.com',
    rating: 4.7,
    image: findImage('bookstore-1')!,
    gallery: [findImage('bookstore-1')!, findImage('gallery-10')!, findImage('gallery-11')!],
    reviews: [
        { id: 'r6', author: 'Frank', rating: 5, comment: 'Found a rare first edition here. The owner is incredibly knowledgeable and passionate about books.', date: '2023-10-10' },
        { id: 'r7', author: 'Grace', rating: 4, comment: 'Lovely little shop, but I wish they had a bigger sci-fi section.', date: '2023-11-05' },
    ],
    cuisines: [],
  },
];

export const findBusinessById = (id: string): Business | undefined => businesses.find(b => b.id === id);

export const findHotelById = (id: string): Hotel | undefined => hotelListData.find(h => h.id === id);

export const searchBusinesses = (query: string) => {
  const lowerCaseQuery = query.toLowerCase();
  if (!lowerCaseQuery) return [];
  
  const allListings = [...businesses, ...hotelListData];

  return allListings.filter(b => 
    b.name.toLowerCase().includes(lowerCaseQuery) ||
    ('category' in b && b.category.toLowerCase().includes(lowerCaseQuery)) ||
    ('description' in b && b.description.toLowerCase().includes(lowerCaseQuery)) ||
    ('tags' in b && b.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)))
  );
};
