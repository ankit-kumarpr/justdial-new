
'use client';
import { Business } from "@/lib/types";
import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";


export function RestaurantGallery({ business }: { business: Business }) {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const validGalleryImages = business.gallery?.filter(img => img) || [];

    const openGallery = (index: number) => {
        setCurrentImageIndex(index);
        setIsGalleryOpen(true);
    };

    const closeGallery = () => setIsGalleryOpen(false);

    if (validGalleryImages.length === 0) {
        return null;
    }

    const goToNext = () => {
        setCurrentImageIndex((prev) => (prev + 1) % validGalleryImages.length);
    };

    const goToPrevious = () => {
        setCurrentImageIndex((prev) => (prev - 1 + validGalleryImages.length) % validGalleryImages.length);
    };

    return (
        <>
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-96">
                <div className="col-span-2 row-span-2 relative rounded-md overflow-hidden cursor-pointer" onClick={() => openGallery(0)}>
                    <Image src={validGalleryImages[0]} alt="Main gallery image" fill className="object-cover" />
                </div>
                {validGalleryImages.slice(1, 5).map((img, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden cursor-pointer" onClick={() => openGallery(index + 1)}>
                        <Image src={img} alt={`Gallery image ${index + 2}`} fill className="object-cover" />
                        {index === 3 && validGalleryImages.length > 5 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-2xl font-bold">
                                +{validGalleryImages.length - 5}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col">
                    <DialogHeader className="p-4 flex-row justify-between items-center border-b">
                        <DialogTitle>{business.name} Photos</DialogTitle>
                         <Button variant="ghost" size="icon" onClick={closeGallery}><X/></Button>
                    </DialogHeader>
                    <div className="flex-1 relative">
                        <Image src={validGalleryImages[currentImageIndex]} alt={`Image ${currentImageIndex + 1}`} fill className="object-contain"/>
                    </div>
                    <div className="flex justify-center items-center gap-4 p-4 border-t">
                        <Button variant="outline" size="icon" onClick={goToPrevious}><ChevronLeft /></Button>
                        <span className="text-sm font-medium">{currentImageIndex + 1} / {validGalleryImages.length}</span>
                        <Button variant="outline" size="icon" onClick={goToNext}><ChevronRight /></Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
