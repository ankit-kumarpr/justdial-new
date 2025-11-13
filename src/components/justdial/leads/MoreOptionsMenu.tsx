
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { ChevronRight, PlayCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || null;

const moreOptions = [
    { label: "Edit my Business", icon: findImage('more-options-edit') },
    { label: "Promote Now", icon: findImage('more-options-promote') },
    { label: "Business Booster", icon: findImage('more-options-booster') },
    { label: "Get Ratings", icon: findImage('more-options-ratings') },
];

const learningVideos = [
    { title: "Performance-Report", description: "Analyze business performance", image: findImage('video-performance') },
    { title: "Rate-Enquiry", description: "Rate the enquiries quality", image: findImage('video-rate-enquiry') },
    { title: "Enquiry-Card", description: "Read/Unread Enquiries", image: findImage('video-enquiry-card') },
    { title: "All-Enquiries-Page", description: "Enquiries type pages", image: findImage('video-all-enquiries') },
]

export function MoreOptionsMenu({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 flex flex-col h-full sm:h-auto sm:max-h-[90vh]">
        <DialogHeader className="p-4 border-b flex-shrink-0">
          <DialogTitle className="font-semibold">More Options</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full">
              <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                      {moreOptions.map(option => (
                          <div key={option.label} className="border rounded-lg p-4 flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:shadow-sm">
                              {option.icon && <Image src={option.icon} alt={option.label} width={32} height={32} />}
                              <span className="text-sm font-medium">{option.label}</span>
                          </div>
                      ))}
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <div className="flex items-center gap-3">
                          {findImage('more-options-faq') && <Image src={findImage('more-options-faq')!} alt="FAQ's" width={24} height={24} />}
                          <span className="font-medium">FAQ's</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="mt-6">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold">Self Learning Videos</h3>
                          <Link href="#" className="text-sm text-blue-600 font-medium">View More</Link>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {learningVideos.map(video => (
                              <div key={video.title} className="border rounded-lg overflow-hidden relative group">
                                  <div className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-2 py-0.5 rounded font-bold z-10">*Important</div>
                                  <div className="relative aspect-[9/16]">
                                      {video.image && <Image src={video.image} alt={video.title} fill className="object-cover" />}
                                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                          <PlayCircle className="h-10 w-10 text-white" />
                                      </div>
                                  </div>
                                  <div className="p-3">
                                      <h4 className="font-semibold text-sm">{video.title}</h4>
                                      <p className="text-xs text-gray-500">{video.description}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

              </div>
          </ScrollArea>
        </div>
        <div className="p-4 border-t bg-white flex-shrink-0">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">To access all enquires Upgrade Now</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
