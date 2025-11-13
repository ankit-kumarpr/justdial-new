
import { PlaceHolderImages } from './placeholder-images';
import type { Hotel } from './types';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || null;

export const hotelListData: Hotel[] = [
    {
        id: 'hotel-1',
        name: 'Iraj Dolphin Resort',
        rating: 3.5,
        reviews: 29,
        trending: true,
        verified: false,
        location: 'Kolamb Beach Road, Karamb, Palghar',
        tags: ['Swimming Pool'],
        image: findImage('hotel-1')!,
        gallery: [findImage('hotel-1')!, findImage('gallery-1')!, findImage('gallery-2')!],
        amenities: ['Wi-Fi', 'Parking', 'Restaurant', 'AC']
    },
    {
        id: 'hotel-2',
        name: 'Zenith Hospitality',
        rating: 4.3,
        reviews: 17,
        trending: true,
        verified: false,
        location: 'CST Road, Kalina, Mumbai',
        tags: ['Hotels', 'Apartment Hotels'],
        image: findImage('hotel-2')!,
        gallery: [findImage('hotel-2')!, findImage('gallery-3')!, findImage('gallery-4')!],
        amenities: ['Wi-Fi', 'Parking', 'Restaurant', 'Gym']
    },
    {
        id: 'hotel-3',
        name: 'Shrikant Beach Farm House',
        rating: 4.1,
        reviews: 8,
        trending: false,
        verified: true,
        location: 'Kalamb Beach Road Nallasopara West, Palghar',
        tags: ['Farm House On Rent'],
        image: findImage('hotel-3')!,
        gallery: [findImage('hotel-3')!, findImage('gallery-5')!],
        amenities: ['Parking', 'AC']
    },
    {
        id: 'hotel-4',
        name: 'Sea King Resort',
        rating: 3.6,
        reviews: 330,
        trending: false,
        verified: false,
        location: 'Kalamb Beach Road, Karamb, Palghar',
        tags: ['Popular'],
        image: findImage('hotel-4')!,
        gallery: [findImage('hotel-4')!],
        amenities: ['Wi-Fi', 'Restaurant']
    },
     {
        id: 'hotel-5',
        name: 'R K Hotels Rooms',
        rating: 3.5,
        reviews: 2,
        trending: false,
        verified: false,
        location: 'Chandansar Road, Virar East, Palghar',
        tags: ['Parking Available'],
        image: findImage('hotel-5')!,
        gallery: [findImage('hotel-5')!],
        amenities: ['Parking', 'AC']
    },
     {
        id: 'hotel-6',
        name: 'Hotel Vandana Residency',
        rating: 4.2,
        reviews: 27,
        trending: true,
        verified: true,
        location: 'Badlapur Road, Ambernath, Thane',
        tags: ['3 Star Hotel'],
        image: findImage('hotel-6')!,
        gallery: [findImage('hotel-6')!],
        amenities: ['Wi-Fi', 'Parking', 'AC']
    },
     {
        id: 'hotel-7',
        name: 'Hotel Geeta Palace',
        rating: 3.8,
        reviews: 280,
        trending: false,
        verified: false,
        location: 'MIDC, Navi Mumbai',
        tags: ['Hotels', 'Lodging Services'],
        price: 1628,
        discount: 25,
        image: findImage('hotel-7')!,
        gallery: [findImage('hotel-7')!],
        amenities: ['Wi-Fi', 'Restaurant']
    },
     {
        id: 'hotel-8',
        name: 'Relax Palace',
        rating: 3.6,
        reviews: 50,
        trending: false,
        verified: false,
        location: 'Asalpha-Ghatkopar West, Mumbai',
        tags: ['Parking Available', 'WiFi', 'Swimming Pool'],
        image: findImage('hotel-8')!,
        gallery: [findImage('hotel-8')!],
        amenities: ['Wi-Fi', 'Parking', 'Gym', 'AC']
    },
     {
        id: 'hotel-9',
        name: 'Hotel Amaan Palace',
        rating: 2.6,
        reviews: 4,
        trending: false,
        verified: false,
        location: 'Hamar Abbas Lane, Dongri, Mumbai',
        tags: ['WiFi', 'Air Conditioned'],
        price: 616,
        image: findImage('hotel-9')!,
        gallery: [findImage('hotel-9')!],
        amenities: ['Wi-Fi', 'AC']
    },
     {
        id: 'hotel-10',
        name: 'Ld Waterpark and Beach Resort',
        rating: 4.0,
        reviews: 4378,
        trending: false,
        verified: true,
        location: 'Lopes Wada, Virar West, Palghar',
        tags: ['Parking Available', 'Swimming Pool', 'Air Conditioned'],
        image: findImage('hotel-10')!,
        gallery: [findImage('hotel-10')!],
        amenities: ['Wi-Fi', 'Parking', 'Restaurant', 'AC', 'Gym']
    }
];
