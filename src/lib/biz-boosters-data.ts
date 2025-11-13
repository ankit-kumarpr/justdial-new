
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || null;

export type Booster = {
    id: string;
    title: string;
    originalPrice?: string;
    discount?: string;
    price: string;
    priceType: 'day' | 'certificate';
    priceLabel: string;
    image: string;
    imageHint: string;
    buttonText: string;
    buttonIcon?: 'lock';
    explore?: boolean;
    badge?: string;
    badgeColor?: string;
    trending?: boolean;
    bgColor: string;
    borderColor: string;
};

export const bizBoostersData: Booster[] = [
    {
        id: 'mobile-banner',
        title: 'Mobile Banner on Gnetdial',
        originalPrice: '67',
        discount: '25% off',
        price: '50',
        priceType: 'day',
        priceLabel: 'Starting at',
        image: findImage('biz-booster-mobile-banner') || 'https://picsum.photos/seed/bb1/100/100',
        imageHint: 'mobile phone ad',
        buttonText: 'Buy Now',
        explore: true,
        badge: 'Most Popular',
        badgeColor: 'bg-orange-500',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
    },
    {
        id: 'website-banner',
        title: 'Website Banner on Gnetdial',
        originalPrice: '45',
        discount: '25% off',
        price: '34',
        priceType: 'day',
        priceLabel: 'Starting at',
        image: findImage('biz-booster-website-banner') || 'https://picsum.photos/seed/bb2/100/100',
        imageHint: 'website browser ad',
        buttonText: 'Buy Now',
        explore: true,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
    },
    {
        id: 'combo-banner',
        title: 'Web & Mobile Combo Banner',
        originalPrice: '89',
        discount: '25% off',
        price: '67',
        priceType: 'day',
        priceLabel: 'Starting at',
        image: findImage('biz-booster-combo-banner') || 'https://picsum.photos/seed/bb3/100/100',
        imageHint: 'website and mobile ad',
        buttonText: 'Buy Now',
        explore: true,
        badge: 'Combo Offer',
        badgeColor: 'bg-blue-500',
        trending: true,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
    },
    {
        id: 'business-website',
        title: 'Get Your Business Website',
        originalPrice: '50',
        discount: '72% off',
        price: '14',
        priceType: 'day',
        priceLabel: 'Starting at',
        image: findImage('biz-booster-business-website') || 'https://picsum.photos/seed/bb4/100/100',
        imageHint: 'laptop website',
        buttonText: 'Buy Now',
        explore: true,
        badge: 'Recommended',
        badgeColor: 'bg-gray-800',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
    },
    {
        id: 'rating-certificate',
        title: 'Gd Rating Certificate',
        originalPrice: '8000',
        discount: '25% off',
        price: '6,000',
        priceType: 'certificate',
        priceLabel: 'Pricing Per Certificate',
        image: findImage('biz-booster-rating-certificate') || 'https://picsum.photos/seed/bb5/100/100',
        imageHint: 'certificate award',
        buttonText: 'Order Now',
        explore: true,
        badge: 'Most Viewed',
        badgeColor: 'bg-blue-600',
        bgColor: 'bg-pink-50',
        borderColor: 'border-pink-200'
    },
    {
        id: 'whatsapp-leads',
        title: 'Receive Leads on WhatsApp',
        originalPrice: '10',
        discount: '25% off',
        price: '7',
        priceType: 'day',
        priceLabel: 'Starting at',
        image: findImage('biz-booster-whatsapp-leads') || 'https://picsum.photos/seed/bb6/100/100',
        imageHint: 'whatsapp chat',
        buttonText: 'Unlock',
        buttonIcon: 'lock',
        badge: 'New Launch',
        badgeColor: 'bg-pink-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
    },
     {
        id: 'verified-badge',
        title: 'Gd Verified Badge',
        originalPrice: '28',
        discount: '25% off',
        price: '21',
        priceType: 'day',
        priceLabel: 'Starting at',
        image: findImage('biz-booster-verified-badge') || 'https://picsum.photos/seed/bb7/100/100',
        imageHint: 'verified badge',
        buttonText: 'Unlock',
        buttonIcon: 'lock',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
    },
     {
        id: 'trust-seal',
        title: 'Gd Trust Seal',
        originalPrice: '28',
        discount: '25% off',
        price: '21',
        priceType: 'day',
        priceLabel: 'Starting at',
        image: findImage('biz-booster-trust-seal') || 'https://picsum.photos/seed/bb8/100/100',
        imageHint: 'trust seal',
        buttonText: 'Unlock',
        buttonIcon: 'lock',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
    },
];
