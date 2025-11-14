
'use client';

import { Suspense, useEffect, useState, useActionState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, MapPin, Loader2, LocateFixed, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardHeader } from '@/components/justdial/your-dashboard/DashboardHeader';
import { useRouter, useSearchParams } from 'next/navigation';
import { getBusinessAddress, updateBusinessAddress, type AddressFormState } from './actions';
import { useToast } from '@/hooks/use-toast';
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
import Map, { Marker, MapLayerMouseEvent } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';

type AddressData = {
    businessPlotNo: string;
    businessBuildingName: string;
    businessStreet: string;
    businessLandmark: string;
    businessArea: string;
    businessPincode: string;
    businessState: string;
    businessCity: string;
    latitude: number;
    longitude: number;
};

type ViewState = {
    longitude: number;
    latitude: number;
    zoom: number;
};


function EditBusinessAddressForm() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id');
    const { toast } = useToast();
    const router = useRouter();
    
    const [formData, setFormData] = useState<Partial<AddressData>>({
        latitude: 19.0760, // Default to Mumbai
        longitude: 72.8777,
    });
    const [viewState, setViewState] = useState<ViewState>({
        latitude: 19.0760,
        longitude: 72.8777,
        zoom: 14,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const [userType, setUserType] = useState<'individual' | 'vendor' | null>(null);
    const [isOccupancyDialogOpen, setIsOccupancyDialogOpen] = useState(false);

    const initialState: AddressFormState = {};
    const [state, formAction, isPending] = useActionState(updateBusinessAddress, initialState);

    const fetchAddress = useCallback(async (id: string, userToken: string) => {
        setIsLoading(true);
        const { data, error } = await getBusinessAddress(id, userToken);
        if (error) {
            toast({ title: "Error", description: "Failed to load business address.", variant: 'destructive'});
        } else if (data) {
            setFormData(data);
            setViewState(prev => ({ ...prev, latitude: data.latitude, longitude: data.longitude, zoom: 16 }));
        }
        setIsLoading(false);
    }, [toast]);

    useEffect(() => {
        const userToken = localStorage.getItem('accessToken');
        const userJson = localStorage.getItem('user');
        if (userToken) {
            setToken(userToken);
            if (userJson) {
                try {
                    const user = JSON.parse(userJson);
                    // Determine userType. Let's assume the API or another source tells us this.
                    // For now, we'll need to infer it or have it passed.
                    // Let's default to 'vendor' for now if not specified.
                    setUserType(user.role === 'user' ? 'individual' : 'vendor');
                } catch(e) { console.error(e); setUserType('vendor'); }
            }

            if (businessId) {
                fetchAddress(businessId, userToken);
            } else {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
            router.push('/login');
        }
    }, [businessId, fetchAddress, router]);
    
    useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? "Success!" : "Error",
                description: state.message,
                variant: state.success ? 'default' : 'destructive'
            });
            if (state.success && businessId && token) {
                fetchAddress(businessId, token); // Re-fetch data on success
            }
        }
    }, [state, toast, businessId, token, fetchAddress]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleMapClick = (e: MapLayerMouseEvent) => {
      const { lng, lat } = e.lngLat;
      setFormData(prev => ({ ...prev, longitude: lng, latitude: lat }));
    };

    const handleMapDrag = (e: any) => {
        setFormData(prev => ({
            ...prev,
            longitude: e.lngLat.lng,
            latitude: e.lngLat.lat,
        }));
    };

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData(prev => ({ ...prev, latitude, longitude }));
                    setViewState(prev => ({ ...prev, latitude, longitude, zoom: 16 }));
                    toast({ title: "Location Updated", description: "Map centered to your current location." });
                },
                () => {
                    toast({ title: "Location Error", description: "Could not retrieve your location. Please check browser permissions.", variant: 'destructive' });
                }
            );
        } else {
            toast({ title: "Unsupported", description: "Geolocation is not supported by your browser.", variant: 'destructive' });
        }
    };
    
    if (isLoading) {
        return <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>;
    }

    if (!businessId) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    No business ID provided. Please access this page from your business dashboard.
                </AlertDescription>
            </Alert>
        );
    }
    
    const addressPrefix = userType === 'individual' ? 'personal' : 'business';

    return (
        <form action={formAction}>
            <input type="hidden" name="businessId" value={businessId} />
            <input type="hidden" name="token" value={token || ''} />
            <input type="hidden" name="latitude" value={formData.latitude || ''} />
            <input type="hidden" name="longitude" value={formData.longitude || ''} />
            <input type="hidden" name="userType" value={userType || 'vendor'} />

            <div className="max-w-4xl mx-auto space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Alert className="bg-primary/5 border-primary/20 text-primary rounded-3xl shadow-lg">
                        <Info className="h-5 w-5" />
                        <AlertDescription>
                            Provide the address that customers will use to find this business.
                        </AlertDescription>
                    </Alert>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <CardContent className="p-6 space-y-4 relative z-10">
                            <div className="space-y-2">
                                <Label htmlFor={`${addressPrefix}PlotNo`}>Plot No. / Bldg No. / Wing / Shop No. / Floor</Label>
                                <Input id={`${addressPrefix}PlotNo`} name={`${addressPrefix}PlotNo`} defaultValue={(formData as any)[`${addressPrefix}PlotNo`] || ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`${addressPrefix}BuildingName`}>Building Name / Market / Colony / Society</Label>
                                <Input id={`${addressPrefix}BuildingName`} name={`${addressPrefix}BuildingName`} defaultValue={(formData as any)[`${addressPrefix}BuildingName`] || ''} />
                                {userType === 'vendor' && <div className="mt-1 text-xs">
                                    <AlertDialog open={isOccupancyDialogOpen} onOpenChange={setIsOccupancyDialogOpen}>
                                        <AlertDialogTrigger asChild>
                                            <Button type="button" variant="link" className="text-xs text-primary hover:underline p-0 h-auto inline">
                                                Click here
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Entire Building Occupied?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    If this business occupies the entire building, check this box. This helps improve location accuracy.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction>Confirm</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    <span className="text-gray-600"> if the entire building / premises is occupied by this business</span>
                                </div>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`${addressPrefix}Street`}>Street / Road Name</Label>
                                <Input id={`${addressPrefix}Street`} name={`${addressPrefix}Street`} defaultValue={(formData as any)[`${addressPrefix}Street`] || ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`${addressPrefix}Landmark`}>Landmark</Label>
                                <Input id={`${addressPrefix}Landmark`} name={`${addressPrefix}Landmark`} defaultValue={(formData as any)[`${addressPrefix}Landmark`] || ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`${addressPrefix}Area`}>Area</Label>
                                <Input id={`${addressPrefix}Area`} name={`${addressPrefix}Area`} defaultValue={(formData as any)[`${addressPrefix}Area`] || ''} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`${addressPrefix}Pincode`}>Pincode *</Label>
                                    <Input id={`${addressPrefix}Pincode`} name={`${addressPrefix}Pincode`} defaultValue={(formData as any)[`${addressPrefix}Pincode`] || ''} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`${addressPrefix}City`}>City *</Label>
                                    <Input id={`${addressPrefix}City`} name={`${addressPrefix}City`} defaultValue={(formData as any)[`${addressPrefix}City`] || ''} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`${addressPrefix}State`}>State *</Label>
                                    <Input id={`${addressPrefix}State`} name={`${addressPrefix}State`} defaultValue={(formData as any)[`${addressPrefix}State`] || ''} />
                                </div>
                            </div>
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center gap-2">
                                    <Label className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Set Location on Map</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={handleCurrentLocation}>
                                        <LocateFixed className="h-4 w-4 mr-2" />
                                        Use Current Location
                                    </Button>
                                </div>
                                <Card className="h-96 w-full relative rounded-2xl overflow-hidden border-2 border-primary/10 shadow-lg bg-gray-100">
                                    <Map
                                        {...viewState}
                                        onMove={evt => setViewState(evt.viewState)}
                                        onClick={handleMapClick}
                                        mapLib={maplibregl}
                                        style={{width: '100%', height: '100%'}}
                                        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
                                    >
                                        <Marker 
                                            longitude={formData.longitude!} 
                                            latitude={formData.latitude!} 
                                            anchor="bottom"
                                            draggable
                                            onDragEnd={handleMapDrag}
                                        >
                                            <div className="text-red-500">
                                                <MapPin size={40} strokeWidth={1.5} />
                                            </div>
                                        </Marker>
                                    </Map>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
             <footer className="bg-white/80 backdrop-blur-md py-4 border-t border-gray-100 sticky bottom-0 z-20 shadow-lg mt-6">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300" disabled={isPending}>
                           {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                           Save Address
                        </Button>
                    </motion.div>
                </div>
            </footer>
        </form>
    );
}

function EditBusinessAddressPageComponent() {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
        >
             <DashboardHeader title="Business Address" />

            <main className="flex-grow container mx-auto px-4 py-6 relative z-10">
                <Suspense fallback={<div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>}>
                    <EditBusinessAddressForm />
                </Suspense>
            </main>
        </motion.div>
    );
}

export default function EditBusinessAddressPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin" /></div>}>
            <EditBusinessAddressPageComponent />
        </Suspense>
    );
}
