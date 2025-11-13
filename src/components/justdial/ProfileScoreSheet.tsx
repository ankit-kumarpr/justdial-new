
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, Mail, Building2, MapPin, LayoutGrid, ImageIcon, Tags, ThumbsUp, Share2, Link as LinkIcon, CalendarDays, IndianRupee, Users, FileCheck } from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from "@/components/ui/scroll-area";

const scoreActions = [
  { icon: Mail, text: 'Add 2 or More Contact Numbers', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  { icon: Building2, text: 'Add Complete Store Address', bgColor: 'bg-blue-100', iconColor: 'text-blue-600', badge: 'Building Missing' },
  { icon: MapPin, text: 'Add Map Location', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
  { 
    icon: () => <Image src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="whatsapp" width={24} height={24} />, 
    text: 'Add WhatsApp Number', 
    bgColor: 'bg-pink-100'
  },
  { icon: LayoutGrid, text: 'Add 10 or More Business Categories', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600', badge: '9 Pending' },
  { icon: ImageIcon, text: 'Add 10 or More High Quality Photos', bgColor: 'bg-red-100', iconColor: 'text-red-600', badge: '10 Pending' },
  { icon: Tags, text: 'Add Upto 10 Products with Price & Image', bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600', badge: '10 Pending' },
  { icon: ThumbsUp, text: 'Get up to 20 Reviews', bgColor: 'bg-cyan-100', iconColor: 'text-cyan-600', badge: '20 Pending' },
  { icon: Share2, text: 'Add Social Media Channels', bgColor: 'bg-pink-100', iconColor: 'text-pink-600' },
  { icon: LinkIcon, text: 'Add Business Website', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
  { icon: CalendarDays, text: 'Add Year of Establishment', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  { icon: IndianRupee, text: 'Add Yearly Turnover', bgColor: 'bg-red-100', iconColor: 'text-red-600' },
  { icon: Users, text: 'Add Number of Employees', bgColor: 'bg-cyan-100', iconColor: 'text-cyan-600' },
  { icon: FileCheck, text: 'Complete KYC', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
];

export function ProfileScoreSheet({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:w-[400px] sm:w-[350px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-4">
             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
                <ChevronLeft className="h-5 w-5" />
             </Button>
            Business Profile Score
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-600">Poor</span>
              <span className="font-bold text-lg">16%</span>
            </div>
            <Progress value={16} className="h-2 [&>div]:bg-red-600" />
            <p className="text-sm text-gray-600">
              Complete the options below to increase your profile score and reach out to more users on Justdial
            </p>

            <div className="grid grid-cols-2 gap-4">
              {scoreActions.map((action, index) => (
                <div key={index} className={`p-4 rounded-lg flex flex-col items-center justify-center text-center space-y-2 relative ${action.bgColor}`}>
                  {action.badge && <div className="absolute top-1 right-1 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded-sm">{action.badge}</div>}
                  <div className="h-10 w-10 flex items-center justify-center">
                      {typeof action.icon === 'function' ? action.icon() : <action.icon className={`h-6 w-6 ${action.iconColor}`} />}
                  </div>
                  <p className="text-xs font-semibold">{action.text}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
