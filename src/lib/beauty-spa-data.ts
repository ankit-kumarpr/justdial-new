
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || null;

export const popularBeautyServices = [
    { name: 'Hair Cut', description: 'Stylish cuts for everyone', icon: findImage('spa-haircut')!, hint: 'haircut' },
    { name: 'Facial', description: 'Rejuvenating skin treatments', icon: findImage('spa-facial')!, hint: 'facial' },
    { name: 'Manicure', description: 'Perfectly polished nails', icon: findImage('spa-manicure')!, hint: 'manicure' },
    { name: 'Pedicure', description: 'Relaxing foot care', icon: findImage('spa-pedicure')!, hint: 'pedicure' },
    { name: 'Massage', description: 'Relieve stress and tension', icon: findImage('spa-massage')!, hint: 'massage' },
    { name: 'Threading', description: 'Precise hair removal', icon: findImage('spa-threading')!, hint: 'eyebrows' },
    { name: 'Hair Styling', description: 'For any occasion', icon: findImage('spa-styling')!, hint: 'hair styling' },
    { name: 'Waxing', description: 'Smooth skin solutions', icon: findImage('spa-waxing')!, hint: 'waxing' },
    { name: 'Bridal Makeup', description: 'Look stunning on your day', icon: findImage('spa-bridal')!, hint: 'bridal makeup' },
    { name: 'Makeup', description: 'Professional makeup application', icon: findImage('spa-makeup')!, hint: 'makeup' },
    { name: 'Hair Straightening', description: 'Sleek and smooth hair', icon: findImage('spa-straightening')!, hint: 'hair straightening' },
    { name: 'Hair Colouring', description: 'Vibrant new looks', icon: findImage('spa-coloring')!, hint: 'hair coloring' }
];

export const topSalonsAndSpas = [
    { name: 'Kishore Ambience The Salon', location: 'Kandivali West, Mumbai', image: findImage('spa-salon-1')!, hint: 'salon interior' },
    { name: 'Feel Spas', location: 'Malad West, Mumbai', image: findImage('spa-salon-2')!, hint: 'spa room' },
    { name: 'Enrich Salons', location: 'Ghatkopar West, Mumbai', image: findImage('spa-salon-3')!, hint: 'modern salon' },
    { name: 'Looks Salon', location: 'Bandra West, Mumbai', image: findImage('spa-salon-4')!, hint: 'luxury salon' }
];

export const specializedBeautySpots = [
    { name: 'Ayurvedic Spa', image: findImage('spa-spot-ayurvedic')!, hint: 'ayurvedic spa' },
    { name: 'Female Spa', image: findImage('spa-spot-female')!, hint: 'woman relaxing' },
    { name: 'Unisex', image: findImage('spa-spot-unisex')!, hint: 'salon interior' },
    { name: 'Massage for Men', image: findImage('spa-spot-men')!, hint: 'man massage' }
];

export const cosmeticProcedures = {
    mainImage: { src: findImage('spa-cosmetic-main')!, alt: 'Cosmetic Procedures', hint: 'woman face' },
    services: [
        { name: 'Botox', image: findImage('spa-cosmetic-botox')!, hint: 'botox injection' },
        { name: 'Skin Tightening', image: findImage('spa-cosmetic-tightening')!, hint: 'skin care' },
        { name: 'Hair Transplant', image: findImage('spa-cosmetic-hair')!, hint: 'hair treatment' },
        { name: 'Liposuction', image: findImage('spa-cosmetic-lipo')!, hint: 'body contouring' }
    ]
};

export const atHomeBeautyServices = [
    { name: 'Skin', image: findImage('spa-athome-skin')!, hint: 'facial mask' },
    { name: 'Make-Up Artists', image: findImage('spa-athome-makeup')!, hint: 'makeup artist' },
    { name: 'Salon Services', image: findImage('spa-athome-salon')!, hint: 'hair styling' },
    { name: 'Mehendi Artists', image: findImage('spa-athome-mehendi')!, hint: 'mehendi hands' },
    { name: 'Nail Artists', image: findImage('spa-athome-nails')!, hint: 'nail art' }
];

export const tattooServices = [
    { name: 'Tattoo Artists', image: findImage('spa-tattoo-artist')!, hint: 'tattoo artist' },
    { name: 'Permanent Tattoos', image: findImage('spa-tattoo-permanent')!, hint: 'arm tattoo' },
    { name: 'Temporary Tattoos', image: findImage('spa-tattoo-temporary')!, hint: 'temporary tattoo' },
    { name: 'Tattoo Removal', image: findImage('spa-tattoo-removal')!, hint: 'laser removal' }
];

export const weddingServices = {
    makeupArtists: [
        { name: 'Priyasvi Bridal Studio By Archana', rating: 4.9, reviews: 106, location: 'Dadar West, Mumbai', image: findImage('spa-wedding-1')!, hint: 'bridal makeup' },
        { name: 'Nidhi Makeup Artist', rating: 4.8, reviews: 92, location: 'Andheri West, Mumbai', image: findImage('spa-wedding-2')!, hint: 'makeup artist' },
        { name: 'Nisha Idnani Makeup Artist', rating: 4.9, reviews: 78, location: 'Chembur, Mumbai', image: findImage('spa-wedding-3')!, hint: 'bride' },
        { name: 'Priti Memory Maker', rating: 4.7, reviews: 112, location: 'Thane West, Thane', image: findImage('spa-wedding-4')!, hint: 'wedding photography' },
    ]
};

export const wellnessAndRelaxation = [
    { name: 'Aromatherapy Centres', image: findImage('spa-wellness-aroma')!, hint: 'aromatherapy' },
    { name: 'Ayurvedic Body Massage', image: findImage('spa-wellness-ayurvedic')!, hint: 'ayurvedic massage' },
    { name: 'Couple Spa', image: findImage('spa-wellness-couple')!, hint: 'couple spa' },
    { name: 'Foot Reflexology', image: findImage('spa-wellness-foot')!, hint: 'foot massage' },
    { name: 'Massages', image: findImage('spa-wellness-massage')!, hint: 'back massage' }
];

export const mensGrooming = [
    { name: 'Jawad Habibs Hair & Beauty Salon', location: 'Juhu, Mumbai', image: findImage('spa-mens-1')!, hint: 'men haircut' },
    { name: 'VLCC Salon', location: 'Santacruz West, Mumbai', image: findImage('spa-mens-2')!, hint: 'men grooming' },
    { name: 'Looks Salon', location: 'Bandra West, Mumbai', image: findImage('spa-mens-3')!, hint: 'modern salon' }
];
