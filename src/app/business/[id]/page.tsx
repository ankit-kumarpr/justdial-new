import { findBusinessById, findHotelById } from '@/lib/data-synthesis';
import BusinessClientPage from './BusinessClientPage';
import type { Metadata } from 'next';

type BusinessPageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const business = findBusinessById(params.id) || findHotelById(params.id);
  if (!business) {
    return { title: 'Business Not Found' };
  }
  return {
    title: `${business.name} | Gnetdial`,
    description: `Details for ${business.name}`,
  };
}

export default function BusinessIdPage({ params }: BusinessPageProps) {
  const business = findBusinessById(params.id);
  const hotel = findHotelById(params.id);

  return <BusinessClientPage business={business} hotel={hotel} />;
}
