
'use client';

import { Suspense, useState, useEffect, useActionState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Info, Loader2, AlertCircle as AlertCircleIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { Card, CardContent } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { updateBusinessAddress, type EditAddressState, getBusinessAddress } from './actions';


function EditBusinessAddressForm() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id');
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);

    const [addressData, setAddressData] = useState<any>({
        businessName: '',
        plotnumber: '',
        buildingname: '',
        streetname: '',
        landmark: '',
        area: '',
        city: '',
        state: '',
        pincode: ''
    });

    const [isOccupancyDialogOpen, setIsOccupancyDialogOpen] = useState(false);
    const [isOccupancyConfirmed, setIsOccupancyConfirmed] = useState(false);

    const initialState: EditAddressState = {};
    const [state, formAction, isPending] = useActionState(updateBusinessAddress, initialState);

    useEffect(() => {
        if (businessId) {
            const fetchAddress = async () => {
                setIsLoading(true);
                const { data, error } = await getBusinessAddress(businessId);
                
                if (data) {
                    setAddressData(data);
                } else if (error) {
                    console.error("Error fetching address:", error);
                    toast({ title: "Error", description: "Failed to load address data.", variant: 'destructive'});
                }
                setIsLoading(false);
            };
            fetchAddress();
        } else {
            setIsLoading(false);
        }
    }, [businessId, toast]);

     useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? "Success!" : "Error",
                description: state.message,
                variant: state.success ? 'default' : 'destructive'
            });
        }
    }, [state, toast]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddressData((prev: any) => ({ ...prev, [name]: value }));
    };
    
    const handleOccupancyConfirm = () => {
        if (isOccupancyConfirmed) {
            setAddressData((prev: any) => ({ ...prev, buildingname: prev.businessName }));
            setIsOccupancyDialogOpen(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>;
    }
    
    if (!businessId) {
        return (
            <Alert variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    No business ID provided. Please access this page from your business dashboard.
                </AlertDescription>
            </Alert>
        );
    }
    
    return (
        <form action={formAction}>
            <input type="hidden" name="businessId" value={businessId} />
            <div className="max-w-3xl mx-auto space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Alert className="bg-primary/5 border-primary/20 text-primary rounded-3xl shadow-lg">
                            <Info className="h-5 w-5" />
                            <AlertDescription>
                                Provide the address that customers will use to find this business.
                            </AlertDescription>
                        </Alert>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardContent className="p-6 space-y-4 relative z-10">
                                <div>
                                    <Label htmlFor="area">Area</Label>
                                    <Input id="area" name="area" value={addressData.area || ""} onChange={handleInputChange} className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="pincode">Pincode *</Label>
                                    <Input id="pincode" name="pincode" value={addressData.pincode || ""} onChange={handleInputChange} className="mt-1" />
                                    {state?.errors?.pincode && <p className="text-xs text-red-500 mt-1">{state.errors.pincode[0]}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="plotnumber">Plot No. / Bldg No. / Wing / Shop No. / Floor</Label>
                                    <Input id="plotnumber" name="plotnumber" value={addressData.plotnumber || ""} onChange={handleInputChange} className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="buildingname">Building Name / Market / Colony / Society</Label>
                                    <Input id="buildingname" name="buildingname" value={addressData.buildingname || ""} onChange={handleInputChange} className="mt-1" />
                                    <div className="mt-1 text-xs">
                                        <AlertDialog open={isOccupancyDialogOpen} onOpenChange={setIsOccupancyDialogOpen}>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="link" className="text-xs text-primary hover:underline p-0 h-auto inline">
                                                    Click here
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Business Occupancy Confirmation</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                    Please select the checkbox below if this business occupies the entire space, both inside and outside (such as all floors, offices, or areas within the building). This means that no other businesses or tenants share the space with this business.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="occupancy-confirm" checked={isOccupancyConfirmed} onCheckedChange={(checked) => setIsOccupancyConfirmed(!!checked)} />
                                                    <label
                                                        htmlFor="occupancy-confirm"
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        I confirm this business occupies the entire premises.
                                                    </label>
                                                </div>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleOccupancyConfirm} disabled={!isOccupancyConfirmed}>
                                                        Agree
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <span className="text-gray-600"> if the entire building / premises is occupied by this business</span>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="streetname">Street / Road Name</Label>
                                    <Input id="streetname" name="streetname" value={addressData.streetname || ""} onChange={handleInputChange} className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="landmark">Landmark</Label>
                                    <Input id="landmark" name="landmark" value={addressData.landmark || ""} onChange={handleInputChange} className="mt-1" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="city">City *</Label>
                                        <Input id="city" name="city" value={addressData.city || ""} onChange={handleInputChange} className="mt-1" />
                                        {state?.errors?.city && <p className="text-xs text-red-500 mt-1">{state.errors.city[0]}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="state">State *</Label>
                                        <Input id="state" name="state" value={addressData.state || ""} onChange={handleInputChange} className="mt-1" />
                                        {state?.errors?.state && <p className="text-xs text-red-500 mt-1">{state.errors.state[0]}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
                 <footer className="bg-white/80 backdrop-blur-md py-4 border-t border-gray-100 sticky bottom-0 z-20 shadow-lg mt-6">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300" disabled={isPending}>
                               {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                               {isPending ? 'Saving...' : 'Save'}
                            </Button>
                        </motion.div>
                    </div>
                </footer>
        </form>
    );
}

function EditBusinessAddressPageComponent() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id') || '';

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
        >
            <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-20 border-b border-gray-100">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href={`/business-dashboard?id=${businessId}`}>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="icon">
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                        </motion.div>
                    </Link>
                    <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Business Address</h1>
                </div>
            </header>

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
