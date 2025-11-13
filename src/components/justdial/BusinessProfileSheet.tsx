
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
    ChevronLeft, ChevronRight, BookUser, Mail, MapPin, Clock, Calendar, 
    LayoutGrid, IndianRupee, Users, ImageIcon, Info, FileText, Link as LinkIcon, Share2, Briefcase
} from 'lucide-react';
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

const MissingBadge = ({ text, color }: { text: string, color?: string }) => (
    <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${color || 'bg-red-100 text-red-700'}`}>
        <Info className="h-3 w-3" />
        {text}
    </div>
)

export function BusinessProfileSheet({ isOpen, onOpenChange, businessId }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void, businessId: string | null }) {
  
  const profileItems = [
    { type: 'item', icon: BookUser, title: 'Business Name', value: 'Xncoder', missing: false, href: `/business-dashboard/edit-business-name?id=${businessId}` },
    { type: 'item', icon: Mail, title: 'Contact Details', value: '+(91)-8329863637', missing: false, href: `/business-dashboard/edit-contact-details?id=${businessId}` },
    { type: 'item', icon: MapPin, title: 'Business Address', value: '00,Kamal Chowk-440017', missing: true, missingText: 'Street Missing', href: `/business-dashboard/edit-business-address?id=${businessId}` },
    { type: 'item', icon: MapPin, title: 'Map Location', value: '', missing: true, missingText: 'Missing Info', href: `/business-dashboard/edit-map-location?id=${businessId}` },
    { type: 'item', icon: Clock, title: 'Business Timings', value: 'Opens at 11:00 am on Mon', missing: false, href: `/business-dashboard/update-business-timings?id=${businessId}` },
    { type: 'item', icon: Calendar, title: 'Year of Establishment', value: '', missing: true, missingText: 'Missing Info', href: `/business-dashboard/year-of-establishment?id=${businessId}` },
    { type: 'item', icon: LayoutGrid, title: 'Business Categories', value: 'IT Solution Providers', missing: false, href: `/business-dashboard/update-business-categories?id=${businessId}` },
    { type: 'divider' },
    { 
        type: 'card', 
        icon: ImageIcon, 
        title: 'Photos and Videos', 
        cardText: 'Add Photos and Videos',
        href: `/business-dashboard/photos-videos?id=${businessId}`
    },
    { 
        type: 'card', 
        icon: FileText, 
        title: 'Rate Card / Catalogue', 
        cardText: 'Add Rate Card / Catalogue',
        href: `/business-dashboard/catalogue?id=${businessId}`
    },
     { type: 'divider' },
    { type: 'item', icon: LinkIcon, title: 'Business Website', subtitle: 'Add Your Website Link to Showcase On Your Business Profile Page', missing: true, missingText: 'Missing Info', href: `/business-dashboard/update-business-website?id=${businessId}` },
    { type: 'banner' },
    { type: 'item', icon: Share2, title: 'Social Media', subtitle: '', missing: true, missingText: 'Missing Info', href: `/business-dashboard/social-media?id=${businessId}` },
    { type: 'item', icon: Briefcase, title: 'Business Tools', subtitle: 'Manage Offers, Reviews and more', missing: true, missingText: '20 Pending', badgeColor: 'bg-red-100 text-red-700' },
    { type: 'item', icon: IndianRupee, title: 'Yearly Turnover', value: '', missing: true, missingText: 'Missing Info', href: `/business-dashboard/yearly-turnover?id=${businessId}` },
    { type: 'item', icon: Users, title: 'Number of Employees', value: '', missing: true, missingText: 'Missing Info', href: `/business-dashboard/number-of-employees?id=${businessId}` },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:w-[450px] sm:w-[400px] p-0 flex flex-col bg-gray-50">
        <SheetHeader className="p-4 border-b bg-white">
          <SheetTitle className="flex items-center gap-4">
             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
                <ChevronLeft className="h-5 w-5" />
             </Button>
            Business Profile
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {profileItems.map((item, index) => {
                if (item.type === 'divider') {
                    return <hr key={`divider-${index}`} className="border-gray-200"/>
                }
                
                if (item.type === 'banner') {
                    return (
                        <div key="banner" className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-4">
                            <div>
                                <h4 className="font-semibold text-sm">Get a Professional Looking Website for Your Business Today</h4>
                                <Button size="sm" className="mt-2 bg-orange-500 hover:bg-orange-600 h-7 text-xs">GO DIGITAL NOW</Button>
                            </div>
                            <Image src={findImage('website-banner')} alt="Website banner" width={100} height={60} />
                        </div>
                    )
                }

                if (item.type === 'card') {
                    const Icon = item.icon!;
                    const Wrapper = item.href ? Link : 'div';
                    const props = item.href ? { href: item.href, passHref: true } : {};
                    return (
                        <Wrapper key={index} {...props}>
                            <div className="bg-white p-4 rounded-lg border border-gray-200 cursor-pointer">
                                <div className="flex items-center gap-3 mb-3">
                                    <Icon className="h-5 w-5 text-gray-500" />
                                    <h4 className="font-semibold text-sm">{item.title}</h4>
                                </div>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50">
                                    <div className="h-8 w-8 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-400 mb-2">
                                        +
                                    </div>
                                    <span className="text-xs font-medium text-gray-600">{item.cardText}</span>
                                </div>
                            </div>
                        </Wrapper>
                    )
                }

                const Icon = item.icon!;
                const Wrapper = item.href ? Link : 'div';
                const props = item.href ? { href: item.href, passHref: true } : {};
                
                return (
                    <Wrapper key={index} {...props}>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer border border-gray-200 hover:bg-gray-50">
                          <div className="flex items-center gap-4">
                              <Icon className="h-5 w-5 text-gray-500" />
                              <div>
                                  <h4 className="font-semibold text-sm">{item.title}</h4>
                                  {item.value && <p className="text-xs text-gray-500">{item.value}</p>}
                                  {item.subtitle && <p className="text-xs text-gray-500">{item.subtitle}</p>}
                              </div>
                          </div>
                          <div className="flex items-center gap-2">
                              {item.missing && <MissingBadge text={item.missingText!} color={item.badgeColor} />}
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
