
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { businessProfileInsightsData } from '@/lib/justdial-data';
import Image from 'next/image';
import { Info } from 'lucide-react';

export function BusinessProfileInsights() {
  const ratingInsight = businessProfileInsightsData.find(i => i.title === 'Rating');
  const reviewsInsight = businessProfileInsightsData.find(i => i.title === 'Reviews');
  const photosInsight = businessProfileInsightsData.find(i => i.title === 'Photos');

  return (
    <div className='space-y-6'>
        <Card className="bg-white">
            <CardHeader className='flex flex-row justify-between items-center'>
                <CardTitle className="text-base font-semibold">How your business is rated</CardTitle>
                <Info className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
                {ratingInsight && (
                    <div className="flex justify-between items-center py-4">
                        <div className="text-center">
                        <p className="text-3xl font-bold text-destructive">{ratingInsight.you.value}</p>
                        <p className="text-sm text-gray-500">{ratingInsight.you.label}</p>
                        </div>
                        <div className="flex flex-col items-center">
                        {ratingInsight.icon && <Image src={ratingInsight.icon} alt={ratingInsight.title} width={32} height={32} />}
                        <p className="text-sm font-semibold mt-1">{ratingInsight.title}</p>
                        </div>
                        <div className="text-center">
                        <p className="text-3xl font-bold">{ratingInsight.competition.value}</p>
                        <p className="text-sm text-gray-500">{ratingInsight.competition.label}</p>
                        </div>
                    </div>
                )}
                 <div className="bg-primary/10 p-3 rounded-lg flex justify-between items-center">
                    <p className="text-sm text-primary/90">Ask your customers to rate your service</p>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">Increase My Ratings</Button>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-white">
            <CardHeader className='flex flex-row justify-between items-center'>
                <CardTitle className="text-base font-semibold">How many reviews your business has received</CardTitle>
                <Info className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
                {reviewsInsight && (
                    <div className="flex justify-between items-center py-4">
                        <div className="text-center">
                        <p className="text-3xl font-bold text-destructive">{reviewsInsight.you.value}</p>
                        <p className="text-sm text-gray-500">{reviewsInsight.you.label}</p>
                        </div>
                        <div className="flex flex-col items-center">
                        {reviewsInsight.icon && <Image src={reviewsInsight.icon} alt={reviewsInsight.title} width={32} height={32} />}
                        <p className="text-sm font-semibold mt-1">{reviewsInsight.title}</p>
                        </div>
                        <div className="text-center">
                        <p className="text-3xl font-bold">{reviewsInsight.competition.value}</p>
                        <p className="text-sm text-gray-500">{reviewsInsight.competition.label}</p>
                        </div>
                    </div>
                )}
                 <div className="bg-primary/10 p-3 rounded-lg flex justify-between items-center">
                    <p className="text-sm text-primary/90">Businesses with more reviews get more views and leads</p>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">Ask More Reviews</Button>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-white">
            <CardHeader className='flex flex-row justify-between items-center'>
                <CardTitle className="text-base font-semibold">How engaging is your business</CardTitle>
                <Info className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
                {photosInsight && (
                    <div className="flex justify-between items-center py-4">
                        <div className="text-center">
                        <p className="text-3xl font-bold text-destructive">{photosInsight.you.value}</p>
                        <p className="text-sm text-gray-500">{photosInsight.you.label}</p>
                        </div>
                        <div className="flex flex-col items-center">
                        {photosInsight.icon && <Image src={photosInsight.icon} alt={photosInsight.title} width={32} height={32} />}
                        <p className="text-sm font-semibold mt-1">{photosInsight.title}</p>
                        </div>
                        <div className="text-center">
                        <p className="text-3xl font-bold">{photosInsight.competition.value}</p>
                        <p className="text-sm text-gray-500">{photosInsight.competition.label}</p>
                        </div>
                    </div>
                )}
                 <div className="bg-primary/10 p-3 rounded-lg flex justify-between items-center">
                    <p className="text-sm text-primary/90">Upload more photos to increase your profile strength</p>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">Upload More Photos</Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
