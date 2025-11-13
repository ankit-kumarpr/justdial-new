
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || null;

export interface RestaurantListItemData {
    id: string;
    name: string;
    sponsored?: boolean;
    rating: number;
    votes: number;
    cuisines: string[];
    location: string;
    status: string;
    offer?: string;
    image: string;
}

export const restaurantListData: RestaurantListItemData[] = [
    {
        id: '1',
        name: 'The Golden Spoon',
        sponsored: true,
        rating: 4.5,
        votes: 125,
        cuisines: ['North Indian', 'Mughlai', 'Chinese'],
        location: 'Kandivali West, Mumbai',
        status: 'Open until 11:00 pm',
        offer: '29% OFF',
        image: findImage('restaurant-1')!
    },
    {
        id: '3',
        name: 'The Cozy Corner Bakery',
        rating: 4.9,
        votes: 340,
        cuisines: ['Bakery', 'Desserts', 'Cafe'],
        location: 'Bandra West, Mumbai',
        status: 'Open until 10:00 pm',
        image: findImage('bakery-1')!
    },
    {
        id: 'rest-3',
        name: 'Mirchi and Mime',
        rating: 4.8,
        votes: 1800,
        cuisines: ['North Indian', 'Mughlai'],
        location: 'Powai, Mumbai',
        status: 'Open until 11:30 pm',
        image: findImage('restaurant-3')!
    },
    {
        id: 'rest-4',
        name: 'Global Fusion',
        rating: 4.7,
        votes: 2500,
        cuisines: ['Asian', 'Chinese', 'Japanese', 'North Indian'],
        location: 'Bandra West, Mumbai',
        status: 'Open until 1:00 am',
        image: findImage('restaurant-4')!
    },
    {
        id: 'rest-5',
        name: 'Yauatcha',
        rating: 4.6,
        votes: 1500,
        cuisines: ['Chinese', 'Dimsum', 'Asian'],
        location: 'Bandra Kurla Complex, Mumbai',
        status: 'Open until 12:00 am',
        image: findImage('restaurant-5')!
    },
     {
        id: 'rest-6',
        name: 'Pizza Express',
        rating: 4.3,
        votes: 950,
        cuisines: ['Pizza', 'Italian'],
        location: 'Colaba, Mumbai',
        status: 'Open until 11:00 pm',
        image: findImage('restaurant-6')!
    },
    {
        id: 'rest-7',
        name: 'Bademiya',
        sponsored: true,
        rating: 4.1,
        votes: 3200,
        cuisines: ['Kebab', 'North Indian', 'Mughlai'],
        location: 'Colaba, Mumbai',
        status: 'Open until 1:00 am',
        image: findImage('restaurant-7')!
    }
];
