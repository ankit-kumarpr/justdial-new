

import Link from "next/link";
import Image from "next/image";
import type { Business } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "./star-rating";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Phone, MessageSquare } from "lucide-react";

type BusinessCardProps = {
  business: Business;
};

export function BusinessCard({ business }: BusinessCardProps) {
  const name = business.businessName || business.name;
  const address = business.businessAddress || business.address;
  // Use a default placeholder if no image is available
  const image = "https://picsum.photos/seed/placeholder/400/300";
  const rating = business.rating || 0;
  // The new API doesn't seem to provide reviews count directly, so let's default to 0
  const reviewsCount = 0; 
  
  const rawPhoneNumber = business.mobileNumber || business.phone;
  const maskedPhoneNumber = rawPhoneNumber 
    ? `+91 ${rawPhoneNumber.substring(0, rawPhoneNumber.length - 5)}*****` 
    : 'Call';

  const businessId = business._id || business.id;

  return (
    <Card className="bg-white overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <CardContent className="p-4 flex flex-col md:flex-row gap-6">
        <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
            <Link href={`/business-profile?id=${businessId}`} className="group" prefetch={false}>
              <Image
                src={image}
                alt={`Image of ${name}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-md group-hover:scale-105 transition-transform"
                data-ai-hint="business photo"
              />
           </Link>
        </div>

        <div className="flex-grow">
          <Link href={`/business-profile?id=${businessId}`} className="group" prefetch={false}>
            {business.category && <Badge variant="secondary" className="mb-2 capitalize">{business.category}</Badge>}
            <h3 className="text-lg font-bold leading-tight group-hover:text-accent truncate">
              {name}
            </h3>
            <div className="flex items-center gap-2 my-1">
                <StarRating rating={rating} size={16} />
                <span className="text-xs text-muted-foreground">{reviewsCount} reviews</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {address}
            </p>
          </Link>
          <div className="flex items-center gap-2 mt-4">
              <Button className="bg-green-600 hover:bg-green-700 flex-1">
                  <Phone className="mr-2 h-4 w-4" /> 
                  {maskedPhoneNumber}
              </Button>
              <Button variant="outline" className="flex-1">
                  <MessageSquare className="mr-2 h-4 w-4"/>
                  Enquiry
              </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
