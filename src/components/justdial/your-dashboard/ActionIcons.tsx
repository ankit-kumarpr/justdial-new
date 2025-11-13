
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || null;

export const ContactNumbersIcon = () => <Image src={findImage('yd-contact')!} alt="Contact Numbers" width={40} height={40} />;
export const StoreAddressIcon = () => <Image src={findImage('yd-address')!} alt="Store Address" width={40} height={40} />;
export const WhatsAppIcon = () => <Image src={findImage('yd-whatsapp')!} alt="WhatsApp" width={40} height={40} />;
export const BusinessCategoriesIcon = () => <Image src={findImage('yd-categories')!} alt="Business Categories" width={40} height={40} />;
export const HighQualityPhotosIcon = () => <Image src={findImage('yd-photos')!} alt="High Quality Photos" width={40} height={40} />;
export const VideoIcon = () => <Image src={findImage('yd-video')!} alt="Video" width={40} height={40} />;
export const ProductsWithPriceIcon = () => <Image src={findImage('yd-products')!} alt="Products with Price" width={40} height={40} />;
export const GetReviewsIcon = () => <Image src={findImage('yd-reviews')!} alt="Get Reviews" width={40} height={40} />;
export const SocialMediaIcon = () => <Image src={findImage('yd-social')!} alt="Social Media" width={40} height={40} />;
export const BusinessWebsiteIcon = () => <Image src={findImage('yd-website')!} alt="Business Website" width={40} height={40} />;
export const YearOfEstablishmentIcon = () => <Image src={findImage('yd-year')!} alt="Year of Establishment" width={40} height={40} />;
export const YearlyTurnoverIcon = () => <Image src={findImage('yd-turnover')!} alt="Yearly Turnover" width={40} height={40} />;
export const NumberOfEmployeesIcon = () => <Image src={findImage('yd-employees')!} alt="Number of Employees" width={40} height={40} />;
export const CompleteKYCIcon = () => <Image src={findImage('yd-kyc')!} alt="Complete KYC" width={40} height={40} />;
