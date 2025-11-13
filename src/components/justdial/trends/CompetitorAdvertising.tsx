
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { competitorAdvertisingData } from '@/lib/justdial-data';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function CompetitorAdvertising() {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Your Competitors - How they Advertise</CardTitle>
        <p className="text-sm text-gray-500">Be the best in class and have an edge over competition</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {competitorAdvertisingData.map((competitor, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <div className="flex items-center gap-4">
              {competitor.logo && <Image src={competitor.logo} alt={competitor.name} width={40} height={40} />}
              <div>
                <p className="font-semibold">{competitor.name}</p>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold">{competitor.rating}</span>
                  <span className="text-gray-500">({competitor.reviews} Ratings)</span>
                </div>
                <p className="text-xs text-gray-500">{competitor.address}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-yellow-600">₹ {competitor.monthlyCharges.toLocaleString()} Monthly Charges</p>
              <p className="text-xs text-gray-500">Categories ({competitor.categories}) • Pin Codes ({competitor.pincodes})</p>
            </div>
          </div>
        ))}
         <div className="text-right mt-4">
            <Link href="/advertise" className="text-accent text-sm font-medium hover:underline">Advertise Now</Link>
        </div>
      </CardContent>
    </Card>
  );
}
