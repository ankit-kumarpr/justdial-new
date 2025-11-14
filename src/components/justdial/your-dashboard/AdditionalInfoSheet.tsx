
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { AwardsIcon, CertificatesIcon, ProfessionalAssociationsIcon } from "./AdditionalInfoIcons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function AdditionalInfoSheet({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
  const searchParams = useSearchParams();
  const businessId = searchParams.get('id');

  const infoItems = [
      { icon: <AwardsIcon />, label: "Awards", href: `/business-dashboard/awards?id=${businessId}` },
      { icon: <CertificatesIcon />, label: "Certificates", href: `/business-dashboard/certificates?id=${businessId}` },
      { icon: <ProfessionalAssociationsIcon />, label: "Professional Associations", href: `/business-dashboard/professional-associations?id=${businessId}` },
      { icon: <Users className="h-10 w-10 text-gray-500" />, label: "Manage Employees", href: `/business-dashboard/employees?id=${businessId}` },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:w-[450px] sm:w-[400px] p-0 flex flex-col bg-gray-50">
        <SheetHeader className="p-4 border-b bg-white">
          <SheetTitle className="flex items-center gap-4">
             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
                <ChevronLeft className="h-5 w-5" />
             </Button>
            Additional Business Info
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {infoItems.map((item, index) => (
                <Link href={item.href} key={index} passHref>
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg cursor-pointer border border-gray-200 hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                            {item.icon}
                            <span className="font-semibold text-sm">{item.label}</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                </Link>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
