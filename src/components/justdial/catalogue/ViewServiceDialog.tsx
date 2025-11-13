
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, X, FileText, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getSingleService } from '@/app/business-dashboard/catalogue/actions';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';

type ViewServiceDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string | null;
};

const DetailItem = ({ label, value }: { label: string, value: string | number | undefined | null }) => {
    if (!value) return null;
    return (
        <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-sm">{value}</p>
        </div>
    )
}

export function ViewServiceDialog({ isOpen, onClose, serviceId }: ViewServiceDialogProps) {
  const { toast } = useToast();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (isOpen && serviceId) {
        const fetchService = async () => {
            setLoading(true);
            const { data, error } = await getSingleService(serviceId);
            if (error) {
                toast({ title: 'Error', description: `Failed to fetch service details: ${error}`, variant: 'destructive' });
                onClose();
            } else {
                setService(data);
            }
            setLoading(false);
        };
        fetchService();
    }
  }, [isOpen, serviceId, toast, onClose]);
  
  const formatPrice = (svc: any) => {
    if (!svc) return 'Not available';
    switch (svc.priceType) {
        case 'single':
            return `₹${svc.discountPrice || svc.actualPrice} / ${svc.unit || 'unit'}`;
        case 'range':
            return `₹${svc.minPrice} - ₹${svc.maxPrice} / ${svc.unit || 'unit'}`;
        case 'qty_based':
             return 'Quantity based pricing';
        default:
            return 'Price on request';
    }
  }
  
  const constructUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/\\/g, '/').replace(/^.*uploads/, '/uploads');
    return `${apiBaseUrl}${cleanPath}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0 flex flex-col h-[90vh]">
        <DialogHeader className="p-4 border-b flex-shrink-0 flex flex-row items-center justify-between">
            <DialogTitle>Service Details</DialogTitle>
             <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent hover:text-accent-foreground rounded-full" onClick={onClose}>
                <X className="h-5 w-5" />
            </Button>
        </DialogHeader>

        <ScrollArea className="flex-1">
            {loading ? (
                 <div className="flex justify-center items-center h-full p-6">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : service ? (
                <div className="p-6 space-y-6">
                    {service.serviceImage && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                           <Image src={constructUrl(service.serviceImage)} alt={service.serviceName} layout="fill" objectFit="cover" />
                        </div>
                    )}
                    <h2 className="text-2xl font-bold">{service.serviceName}</h2>
                    
                    <div className="space-y-4">
                        <h3 className="font-semibold border-b pb-1">Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                             <DetailItem label="Price" value={formatPrice(service)} />
                             <DetailItem label="Vendor" value={service.vendorId?.name} />
                        </div>
                        {service.description && <DetailItem label="Description" value={service.description} />}
                    </div>

                    {service.attachments && service.attachments.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="font-semibold border-b pb-1">Attachments</h3>
                             <div className="space-y-2">
                                {service.attachments.map((attachment: string, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
                                        <div className="flex items-center gap-2 text-sm truncate">
                                            <FileText className="h-4 w-4 text-gray-500" />
                                            <span className="truncate">{attachment.split('/').pop()}</span>
                                        </div>
                                        <a href={constructUrl(attachment)} target="_blank" rel="noopener noreferrer">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-6 text-center text-gray-500">
                    <p>Could not load service details.</p>
                </div>
            )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
