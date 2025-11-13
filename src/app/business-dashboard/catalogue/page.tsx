

'use client';

import { useState, useRef, useEffect, Suspense, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, ChevronLeft, UploadCloud, Lightbulb, MoreHorizontal, Edit, Trash2, Camera, Video, Loader2, Plus, AlertCircle, FileText, View } from 'lucide-react';
import { AddServiceIcon, UploadIcon } from '@/components/icons/AdvertiseIcons';
import Link from 'next/link';
import { AddServiceDialog } from '@/components/justdial/catalogue/AddServiceDialog';
import { AddPhotoDialog } from '@/components/justdial/catalogue/AddPhotoDialog';
import { SelectServiceDialog } from '@/components/justdial/catalogue/SelectServiceDialog';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { apiFetch } from '@/lib/api-client';
import { ViewServiceDialog } from '@/components/justdial/catalogue/ViewServiceDialog';
import { deleteService, createOrUpdateService } from './actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


type Service = {
    _id: string;
    serviceName: string;
    description: string | null;
    priceType: 'single' | 'range' | 'qty_based';
    actualPrice?: number;
    discountPrice?: number;
    minPrice?: number;
    maxPrice?: number;
    unit?: string;
    serviceImage: string | null;
    attachments: string[];
    [key: string]: any; // Allow other properties
}

function CataloguePageComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);
    const [isAddPhotoDialogOpen, setIsAddPhotoDialogOpen] = useState(false);
    const [isSelectServiceDialogOpen, setIsSelectServiceDialogOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
    const [photoForService, setPhotoForService] = useState<File | null>(null);

    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [vendorId, setVendorId] = useState<string | null>(null);
    
    const [viewingServiceId, setViewingServiceId] = useState<string | null>(null);
    const [editingService, setEditingService] = useState<Service | null>(null);


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            if (user) {
                try {
                    setVendorId(JSON.parse(user).id);
                } catch (e) {
                    console.error("Failed to parse user from localStorage");
                }
            } else {
                 router.push('/login');
            }
        }
    }, [router]);

    const photoInputRef = useRef<HTMLInputElement>(null);

    const fetchServices = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        const user = localStorage.getItem('user');
        const currentVendorId = user ? JSON.parse(user).id : null;
        
        if (!token || !currentVendorId) {
            if (typeof window !== 'undefined' && !localStorage.getItem('accessToken')) {
                toast({ title: 'Authentication Error', description: 'Please log in to view services.', variant: 'destructive'});
                router.push('/login');
            }
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            const result = await apiFetch(`/api/service/allservice/${currentVendorId}`, token);
            if(result.success) {
                setServices(result.data || []);
            } else {
                throw new Error(result.message || 'Failed to fetch services.');
            }
        } catch (error) {
            const errorMessage = (error as Error).message;
            if (errorMessage.includes('Vendor not found')) {
                setServices([]);
            } else if (errorMessage.includes('token')) {
                // The apiFetch utility will handle redirection. We just need to stop loading.
                console.error("Token error, redirecting...");
            }
            else {
                toast({ title: 'Error', description: errorMessage, variant: 'destructive'});
                console.error(error);
            }
        }
        
        setIsLoading(false);
    }, [toast, router]);

    useEffect(() => {
        if (vendorId) {
            fetchServices();
        } else if (typeof window !== 'undefined' && !localStorage.getItem('user')) {
             setIsLoading(false);
        }
    }, [fetchServices, vendorId]);


    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedPhoto(file);
            setIsAddPhotoDialogOpen(true);
        }
    };
    
    const handleDeleteService = async (serviceId: string) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({ title: 'Error', description: 'Authentication required.', variant: 'destructive' });
            return;
        }
        const result = await deleteService(serviceId, token);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            fetchServices();
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };

    const handleOpenAddDialog = () => {
        setEditingService(null);
        setIsAddServiceDialogOpen(true);
    };

    const handleOpenEditDialog = (service: Service) => {
        setEditingService(service);
        setIsAddServiceDialogOpen(true);
    }


    const handleContinueWithNewService = (photo: File) => {
        setIsAddPhotoDialogOpen(false);
        setPhotoForService(photo);
        handleOpenAddDialog();
    };

    const handleAddToExistingService = (photo: File) => {
        setIsAddPhotoDialogOpen(false);
        setSelectedPhoto(photo);
        setIsSelectServiceDialogOpen(true);
    };
    
    const formatPrice = (service: Service) => {
        if (!service) return 'Not available';
        switch (service.priceType) {
            case 'single':
                return `₹${service.discountPrice || service.actualPrice} / ${service.unit || 'unit'}`;
            case 'range':
                return `₹${service.minPrice} - ₹${service.maxPrice} / ${service.unit || 'unit'}`;
            case 'qty_based':
                 return 'Quantity based';
            default:
                return 'Price on request';
        }
    }
    
    if (!vendorId && !isLoading) {
        return (
            <main className="p-4 md:p-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Business ID Missing</AlertTitle>
                    <AlertDescription>
                        Could not identify your business. Please access this page from your business dashboard.
                    </AlertDescription>
                </Alert>
            </main>
        )
    }

    const renderAllServices = () => {
        if (isLoading) {
            return <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>;
        }

        if (services.length === 0) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl p-12 flex flex-col items-center justify-center text-center"
                >
                    <AddServiceIcon />
                    <h2 className="text-xl font-bold mt-6 mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Showcase Your Services</h2>
                    <p className="text-gray-500 mb-6">Add Services and grab attention of your customers</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300" onClick={handleOpenAddDialog}>
                            <AddServiceIcon color="white" />
                            <span className="ml-2">Add Service</span>
                        </Button>
                    </motion.div>
                </motion.div>
            );
        }

        return (
            <div className='space-y-4'>
                {services.map(service => {
                     let imageUrl = 'https://picsum.photos/seed/placeholder/200/200';
                    if (service.serviceImage) {
                         if(service.serviceImage.startsWith('http')) {
                            imageUrl = service.serviceImage;
                         } else {
                            const cleanPath = service.serviceImage.replace(/\\/g, '/').replace(/^\/opt\/render\/project\/src/, '');
                            imageUrl = `${apiBaseUrl}${cleanPath}`;
                         }
                    }

                    return (
                        <Card key={service._id} className="overflow-hidden bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-4 flex gap-4 items-start">
                                 <div className="relative w-24 h-24 flex-shrink-0">
                                    <Image src={imageUrl} alt={service.serviceName} layout="fill" objectFit="cover" className="rounded-md" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold truncate">{service.serviceName}</h3>
                                    <p className="text-sm text-gray-600 font-medium">{formatPrice(service)}</p>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{service.description}</p>
                                    {service.attachments && service.attachments.length > 0 && (
                                        <Button variant="link" className="p-0 h-auto text-sm mt-2">
                                            <FileText className="mr-2 h-4 w-4" />
                                            View Attachments ({service.attachments.length})
                                        </Button>
                                    )}
                                </div>

                                <div className="flex-shrink-0">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => setViewingServiceId(service._id)}>
                                                <View className="mr-2 h-4 w-4"/> View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleOpenEditDialog(service)}>
                                                <Edit className="mr-2 h-4 w-4"/> Update
                                            </DropdownMenuItem>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4"/> Delete
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete this service from your catalogue.
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteService(service._id)}>
                                                        Delete
                                                    </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        );
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
        >
            <motion.div
                className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    x: [0, -50, 0],
                    y: [0, -30, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-20 border-b border-gray-100">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href={`/business-dashboard?id=${vendorId}`}>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="ghost" size="icon">
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>
                            </motion.div>
                        </Link>
                        <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Catalogue</h1>
                    </div>
                    <Button variant="ghost" size="icon">
                        <Bell className="h-6 w-6" />
                    </Button>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                   {renderAllServices()}
                   
                    <input
                        type="file"
                        ref={photoInputRef}
                        onChange={handlePhotoUpload}
                        className="hidden"
                        accept="image/*"
                    />
                </motion.div>
                
                 <TooltipProvider>
                    <div className="fixed bottom-8 right-8">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button className="h-14 w-14 rounded-full shadow-2xl" onClick={handleOpenAddDialog}>
                                    <Plus className="h-8 w-8" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="bg-black text-white p-2 rounded-md">
                                <p>Add more Services<br/>for your buyers!</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>

            </main>
            <AddServiceDialog 
                isOpen={isAddServiceDialogOpen} 
                onOpenChange={setIsAddServiceDialogOpen}
                initialPhoto={photoForService}
                onClose={() => setPhotoForService(null)}
                onServiceAdded={fetchServices}
                service={editingService}
            />
            <AddPhotoDialog 
                isOpen={isAddPhotoDialogOpen} 
                onOpenChange={setIsAddPhotoDialogOpen} 
                file={selectedPhoto}
                onContinueWithNewService={handleContinueWithNewService}
                onAddToExistingService={handleAddToExistingService}
            />
            <SelectServiceDialog
                isOpen={isSelectServiceDialogOpen}
                onOpenChange={setIsSelectServiceDialogOpen}
                photoFile={selectedPhoto}
            />
             <ViewServiceDialog
                isOpen={!!viewingServiceId}
                onClose={() => setViewingServiceId(null)}
                serviceId={viewingServiceId}
            />
        </motion.div>
    );
}


function CataloguePage() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin" /></div>}>
            <CataloguePageComponent />
        </Suspense>
    )
}

export default function Page() {
  return (
    <Suspense>
      <CataloguePage />
    </Suspense>
  )
}
