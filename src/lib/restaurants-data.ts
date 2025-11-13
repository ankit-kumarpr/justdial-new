


import { PlaceHolderImages } from '@/lib/placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || null;

export const restaurantQuickActions = [
    { icon: '🏨', title: 'Book A Table', subtitle: 'Hassle free booking' },
    { icon: '🔥', title: 'WHAT\'S TRENDING!', subtitle: 'Top rated places' },
    { icon: '🛒', title: 'ORDER FOOD', subtitle: 'Food delivered to you' },
];

export const foodCategories = [
    { title: 'Indian & Mughlai', image: findImage('food-indian-mughlai') || 'https://picsum.photos/seed/food-indian-mughlai/300/200', subItems: ['North Indian', 'South Indian', 'Biryani'] },
    { title: 'Italian & Continental', image: findImage('food-italian-continental') || 'https://picsum.photos/seed/food-italian-continental/300/200', subItems: ['Pizza', 'Pasta', 'Steak'] },
    { title: 'Nightlife', image: findImage('food-nightlife') || 'https://picsum.photos/seed/food-nightlife/300/200', subItems: ['Pubs', 'Bars', 'Clubs'] },
    { title: 'Quick Bites', image: findImage('food-quick-bites') || 'https://picsum.photos/seed/food-quick-bites/300/200', subItems: ['Burgers', 'Sandwich', 'Fast Food'] },
    { title: 'Sweet Tooth', image: findImage('food-sweet-tooth') || 'https://picsum.photos/seed/food-sweet-tooth/300/200', subItems: ['Desserts', 'Ice Cream', 'Cakes'] },
    { title: 'Health', image: findImage('food-health') || 'https://picsum.photos/seed/food-health/300/200', subItems: ['Salads', 'Juices', 'Healthy Food'] },
];

export const aboutRestaurantSections = [
    {
        title: "Unearthing the Culinary Scene: Popular Restaurants & Caterers in Mumbai",
        content: "We can say that we cannot work, at least, come, carry on and go. A city of dreams and an amalgamation of diverse cultures, there is always something for foodies to explore in this city. Every street is lined with numerous restaurants to satiate your cravings. Right from the best restaurants to the ones that can be easily afforded, the city offers it all. Whether you wish to enjoy a fine dining experience or grab a quick bite from the street, you can never get enough of the culinary delights here."
    },
    {
        title: "Exploring the Local Scene",
        content: "When it comes to restaurants in Mumbai, you can find a plethora of options. From multi-cuisine restaurants to quick-service eateries, the city is a food lover's paradise. Whether you're craving authentic regional dishes or international flavors, you'll find something to suit your palate. Many restaurants also offer online ordering and delivery services, making it convenient to enjoy your favorite meals at home."
    }
];

export const restaurantFaqs = [
  {
    question: "What are some of the most popular cuisines in Mumbai?",
    answer:
      "Mumbai offers a diverse range of cuisines. Some of the most popular ones include North Indian, South Indian, Chinese, Italian, and of course, the local Maharashtrian food. You can also find a variety of street food options that are a must-try.",
  },
  {
    question: "How can I find restaurants near me?",
    answer:
      "You can use the Gnetdial app or website to search for restaurants in your vicinity. Just enter your location and the type of cuisine you are looking for, and you will get a list of options with ratings, reviews, and other details.",
  },
  {
    question: "Do restaurants in Mumbai offer home delivery?",
    answer:
      "Yes, many restaurants in Mumbai offer home delivery services. You can check the restaurant's profile on Gnetdial to see if they provide delivery to your area. Some also partner with third-party food delivery platforms.",
  },
  {
    question: "Is it necessary to book a table in advance?",
    answer:
      "For fine dining restaurants and popular casual dining spots, it is highly recommended to book a table in advance, especially during weekends and holidays, to avoid waiting. For smaller eateries and cafes, it is usually not necessary.",
  },
];

export type SubCategory = {
    name: string;
    image: string;
    tag?: string;
}

export const indianFlavours: SubCategory[] = [
    { name: 'Biryani', image: findImage('flavour-biryani')! },
    { name: 'Dhaba', image: findImage('flavour-dhaba')! },
    { name: 'Gujarati', image: findImage('flavour-gujarati')!, tag: 'Yummy Che!' },
    { name: 'Malwani', image: findImage('flavour-malwani')! },
    { name: 'Mughlai', image: findImage('flavour-mughlai')! },
    { name: 'North Indian', image: findImage('flavour-north-indian')! },
    { name: 'Pure Veg', image: findImage('flavour-pure-veg')! },
    { name: 'Sea Food', image: findImage('flavour-sea-food')! },
    { name: 'South Indian', image: findImage('flavour-south-indian')! },
    { name: 'Tandoori', image: findImage('flavour-tandoori')! },
];

export const italianFlavours: SubCategory[] = [
    { name: 'Pizza', image: findImage('flavour-pizza')! },
    { name: 'Pasta', image: findImage('flavour-pasta')! },
    { name: 'Risotto', image: findImage('flavour-risotto')! },
    { name: 'Lasagna', image: findImage('flavour-lasagna')! },
];

export const nightlifeFlavours: SubCategory[] = [
    { name: 'Pubs', image: findImage('flavour-pubs')! },
    { name: 'Bars', image: findImage('flavour-bars')! },
    { name: 'Clubs', image: findImage('flavour-clubs')! },
    { name: 'Lounges', image: findImage('flavour-lounges')! },
];

export const quickBitesFlavours: SubCategory[] = [
    { name: 'Burgers', image: findImage('flavour-burgers')! },
    { name: 'Sandwiches', image: findImage('flavour-sandwiches')! },
    { name: 'Wraps', image: findImage('flavour-wraps')! },
    { name: 'Street Food', image: findImage('flavour-street-food')! },
];

export const sweetToothFlavours: SubCategory[] = [
    { name: 'Cakes', image: findImage('flavour-cakes')! },
    { name: 'Ice Cream', image: findImage('flavour-ice-cream')! },
    { name: 'Pastries', image: findImage('flavour-pastries')! },
    { name: 'Indian Sweets', image: findImage('flavour-indian-sweets')! },
];

export const healthFlavours: SubCategory[] = [
    { name: 'Salads', image: findImage('flavour-salads')! },
    { name: 'Soups', image: findImage('flavour-soups')! },
    { name: 'Smoothies', image: findImage('flavour-smoothies')! },
    { name: 'Keto Options', image: findImage('flavour-keto')! },
];
