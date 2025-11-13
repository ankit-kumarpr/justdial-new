
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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { addPhotoToExistingService } from '@/app/business-dashboard/catalogue/actions';

type ServiceOption = {
    id: string;
    name: string;
    photos: { media_url: string | null }[];
};

type SelectServiceDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  photoFile: File | null;
};

export function SelectServiceDialog({ isOpen, onOpenChange, photoFile }: SelectServiceDialogProps) {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id');
    const { toast } = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [existingServices, setExistingServices] = useState<ServiceOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if(isOpen && businessId) {
            const fetchServices = async () => {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('vendor_services')
                    .select('id, name, vendor_service_photos(vendor_gallery(media_url))')
                    .eq('vendor_id', businessId);
                
                if (data) {
                    const formattedData = data.map(s => ({
                        id: s.id,
                        name: s.name,
                        photos: s.vendor_service_photos.map((p: any) => p.vendor_gallery)
                    }));
                    setExistingServices(formattedData);
                } else if (error) {
                    toast({ title: 'Error', description: 'Could not fetch services.', variant: 'destructive'});
                }
                setIsLoading(false);
            }
            fetchServices();
        }
    }, [isOpen, businessId, toast]);
    

    const filteredServices = existingServices.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectService = async (serviceId: string) => {
        if (!photoFile || !businessId) return;

        setIsSubmitting(true);
        const result = await addPhotoToExistingService(serviceId, photoFile, businessId);

        if (result.success) {
            toast({ title: "Success", description: result.message });
            onOpenChange(false);
        } else {
            toast({ title: "Error", description: result.message, variant: 'destructive' });
        }
        setIsSubmitting(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 flex flex-col h-[90vh]">
                <DialogHeader className="p-4 border-b flex-shrink-0 flex flex-row items-center justify-between">
                    <DialogTitle>Add to Existing Service</DialogTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 rounded-full" onClick={() => onOpenChange(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </DialogHeader>

                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Search service by name"
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-2">
                        {isLoading ? (
                             <div className="flex justify-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : filteredServices.length > 0 ? (
                            filteredServices.map(service => (
                                <div
                                    key={service.id}
                                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                                    onClick={() => !isSubmitting && handleSelectService(service.id)}
                                >
                                    <div className='relative w-10 h-10'>
                                    {service.photos && service.photos.length > 0 && service.photos[0].media_url ? (
                                        <Image src={service.photos[0].media_url} alt={service.name} width={40} height={40} className="rounded-md object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 bg-gray-200 rounded-md" />
                                    )}
                                    </div>
                                    <span className="font-medium text-sm flex-1">{service.name}</span>
                                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                <p>No services found.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
