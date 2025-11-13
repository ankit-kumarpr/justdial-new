
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { AddOffersIcon, ReplyToReviewsIcon, GetReviewsIcon, ShareRatingsQRIcon, ShareBusinessCardIcon, ReplyToQuestionsIcon } from "./BusinessToolsIcons";
import Link from "next/link";

const toolsItems = [
    { icon: <AddOffersIcon />, label: "Add Offers / Deals / Coupon Codes", href: "/business-dashboard/offers" },
    { icon: <ReplyToReviewsIcon />, label: "Reply to Reviews", href: "/reviews" },
    { icon: <GetReviewsIcon />, label: "Get up to 20 Reviews & Ratings from Customers", badge: "20 Pending", href: "/business-dashboard/get-ratings" },
    { icon: <ShareRatingsQRIcon />, label: "Share Ratings QR Code", href: "/business-dashboard/ratings-qr" },
    { icon: <ShareBusinessCardIcon />, label: "Share Business Card", href: "/business-dashboard/share-business-card" },
    { icon: <ReplyToQuestionsIcon />, label: "Reply to Questions", href: "/questions" },
];

const MissingBadge = ({ text }: { text: string }) => (
    <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium">
        <Info className="h-3 w-3" />
        {text}
    </div>
)

export function BusinessToolsSheet({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:w-[450px] sm:w-[400px] p-0 flex flex-col bg-gray-50">
        <SheetHeader className="p-4 border-b bg-white">
          <SheetTitle className="flex items-center gap-4">
             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
                <ChevronLeft className="h-5 w-5" />
             </Button>
            Business Tools
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {toolsItems.map((item, index) => {
              const Wrapper = item.href ? Link : 'div';
              const props = item.href ? { href: item.href, passHref: true } : {};

              return (
                <Wrapper key={index} {...props}>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg cursor-pointer border border-gray-200 hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                          {item.icon}
                          <span className="font-semibold text-sm">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && <MissingBadge text={item.badge} />}
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                  </div>
                </Wrapper>
              )
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
