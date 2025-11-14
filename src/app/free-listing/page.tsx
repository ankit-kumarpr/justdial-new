
'use client';

import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { FloatingButtons } from "@/components/justdial/FloatingButtons";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { Building2, Phone, Clock, CheckCircle2, Sparkles, Loader2, FileText, PlayCircle, Upload, MapPin, LocateFixed, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Country, State, City } from 'country-state-city';
import Map, { Marker, MapLayerMouseEvent } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { getVendorStatus } from '@/app/my-business/actions';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

const BusinessDetailsStep = ({ data, setData, errors, viewState, setViewState, userType }: { data: Partial<any>, setData: React.Dispatch<React.SetStateAction<Partial<any>>>, errors: any, viewState: any, setViewState: any, userType: 'individual' | 'vendor' }) => {
    const { toast } = useToast();
    const india = Country.getCountryByCode('IN');
    const states = State.getStatesOfCountry(india?.isoCode);
    const addressPrefix = userType === 'individual' ? 'personal' : 'business';

    const getFieldValue = (fieldName: string) => {
        return data[`${addressPrefix}${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`] || '';
    }

    const setFieldValue = (fieldName: string, value: any) => {
        setData((prev: any) => ({ ...prev, [`${addressPrefix}${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`]: value }));
    }

    const getError = (fieldName: string) => {
        return errors?.[`${addressPrefix}${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`];
    }
    
    const pincode = getFieldValue('pincode');
    const stateCode = data[`${addressPrefix}StateCode`];
    const cities = stateCode ? City.getCitiesOfState(india!.isoCode, stateCode) : [];

    useEffect(() => {
        if (pincode && pincode.length === 6) {
            const fetchLocationData = async () => {
                try {
                    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                    const result = await response.json();
                    if (result && result[0] && result[0].Status === 'Success') {
                        const postOffice = result[0].PostOffice[0];
                        const stateName = postOffice.State;
                        const cityName = postOffice.District;

                        const matchingState = states.find(s => s.name === stateName);
                        if (matchingState) {
                            setData(prev => ({
                                ...prev,
                                [`${addressPrefix}State`]: matchingState.name,
                                [`${addressPrefix}StateCode`]: matchingState.isoCode,
                                [`${addressPrefix}City`]: cityName,
                            }));
                        }
                    } else {
                        toast({ title: "Invalid Pincode", description: "Could not find location for the entered pincode.", variant: "destructive" });
                    }
                } catch (error) {
                    toast({ title: "API Error", description: "Failed to fetch location data.", variant: "destructive" });
                }
            };
            fetchLocationData();
        }
    }, [pincode, setData, states, india, toast, addressPrefix]);

    const handleStateChange = (newCode: string) => {
        const state = states.find(s => s.isoCode === newCode);
        setData(prev => ({
            ...prev,
            [`${addressPrefix}StateCode`]: newCode,
            [`${addressPrefix}State`]: state?.name || '',
            [`${addressPrefix}City`]: '',
        }));
    };
    
    const handleMapClick = (e: MapLayerMouseEvent) => {
        const { lng, lat } = e.lngLat;
        setData(prev => ({ ...prev, longitude: lng, latitude: lat }));
    };

    const handleMarkerDrag = (e: any) => {
        const { lng, lat } = e.lngLat;
        setData(prev => ({
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
                    setData(prev => ({ ...prev, latitude, longitude }));
                    setViewState(prev => ({ ...prev, latitude, longitude, zoom: 16 }));
                    toast({ title: "Location Updated", description: "Map centered to your current location." });
                },
                () => { toast({ title: "Location Error", description: "Could not retrieve your location.", variant: 'destructive' }); }
            );
        } else {
            toast({ title: "Unsupported", description: "Geolocation is not supported by your browser.", variant: 'destructive' });
        }
    };


    return (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
            {userType === 'vendor' && (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="businessName" className="text-gray-700 font-medium">Business Name</Label>
                        <Input id="businessName" name="businessName" placeholder="Enter your business name" className="h-12" value={data.businessName || ''} onChange={(e) => setData(prev => ({...prev, businessName: e.target.value}))} />
                        {errors?.businessName && <p className="text-xs text-red-500">{errors.businessName[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gstNumber" className="text-gray-700 font-medium">GST Number</Label>
                        <Input id="gstNumber" name="gstNumber" placeholder="Enter your GST number" className="h-12" value={data.gstNumber || ''} onChange={(e) => setData(prev => ({...prev, gstNumber: e.target.value}))} />
                        {errors?.gstNumber && <p className="text-xs text-red-500">{errors.gstNumber[0]}</p>}
                    </div>
                </>
            )}
            
            <div className="space-y-2">
                <Label htmlFor={`${addressPrefix}PlotNo`} className="text-gray-700 font-medium">Plot No. / Bldg No. / Wing / Shop No. / Floor</Label>
                <Input id={`${addressPrefix}PlotNo`} name={`${addressPrefix}PlotNo`} placeholder="Enter plot details" className="h-12" value={getFieldValue('plotNo')} onChange={(e) => setFieldValue('plotNo', e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`${addressPrefix}BuildingName`} className="text-gray-700 font-medium">Building Name / Market / Colony / Society</Label>
                <Input id={`${addressPrefix}BuildingName`} name={`${addressPrefix}BuildingName`} placeholder="Enter building name" className="h-12" value={getFieldValue('buildingName')} onChange={(e) => setFieldValue('buildingName', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`${addressPrefix}Street`} className="text-gray-700 font-medium">Street / Road Name</Label>
                    <Input id={`${addressPrefix}Street`} name={`${addressPrefix}Street`} placeholder="Enter street name" className="h-12" value={getFieldValue('street')} onChange={(e) => setFieldValue('street', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${addressPrefix}Landmark`} className="text-gray-700 font-medium">Landmark</Label>
                    <Input id={`${addressPrefix}Landmark`} name={`${addressPrefix}Landmark`} placeholder="Enter landmark" className="h-12" value={getFieldValue('landmark')} onChange={(e) => setFieldValue('landmark', e.target.value)} />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor={`${addressPrefix}Area`} className="text-gray-700 font-medium">Area</Label>
                <Input id={`${addressPrefix}Area`} name={`${addressPrefix}Area`} placeholder="Enter Area" className="h-12" value={getFieldValue('area')} onChange={(e) => setFieldValue('area', e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label htmlFor={`${addressPrefix}Pincode`} className="text-gray-700 font-medium">Pincode</Label>
                <Input id={`${addressPrefix}Pincode`} name={`${addressPrefix}Pincode`} placeholder="Enter 6-digit pincode" className="h-12" value={pincode} onChange={(e) => setFieldValue('pincode', e.target.value)} maxLength={6} />
                {getError('pincode') && <p className="text-xs text-red-500">{getError('pincode')[0]}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`${addressPrefix}State`}>State</Label>
                    <Select name={`${addressPrefix}State`} value={stateCode || ""} onValueChange={handleStateChange}>
                        <SelectTrigger className="h-12"><SelectValue placeholder="Select State" /></SelectTrigger>
                        <SelectContent>
                            {states.map(state => <SelectItem key={state.isoCode} value={state.isoCode}>{state.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {getError('state') && <p className="text-xs text-red-500">{getError('state')[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${addressPrefix}City`}>City</Label>
                     <Select name={`${addressPrefix}City`} value={getFieldValue('city')} onValueChange={(value) => setFieldValue('city', value)} disabled={!stateCode}>
                        <SelectTrigger className="h-12"><SelectValue placeholder="Select City" /></SelectTrigger>
                        <SelectContent>
                            {cities.map(city => <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {getError('city') && <p className="text-xs text-red-500">{getError('city')[0]}</p>}
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
                        {data.latitude && data.longitude && (
                            <Marker 
                                longitude={data.longitude!} 
                                latitude={data.latitude!} 
                                anchor="bottom"
                                draggable
                                onDragEnd={handleMarkerDrag}
                            >
                                <div className="text-red-500">
                                    <MapPin size={40} strokeWidth={1.5} />
                                </div>
                            </Marker>
                        )}
                    </Map>
                </Card>
            </div>

        </motion.div>
    );
};

const ContactDetailsStep = ({ data, setData, errors }: { data: Partial<any>, setData: React.Dispatch<React.SetStateAction<Partial<any>>>, errors: any }) => {
    
    return (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="contactPersonTitle" className="text-gray-700 font-medium">Title</Label>
                    <Select name="contactPersonTitle" value={data.contactPersonTitle} onValueChange={(value) => setData(prev => ({...prev, contactPersonTitle: value}))}>
                        <SelectTrigger id="contactPersonTitle" className="h-12">
                            <SelectValue placeholder="Mr." />
                        </SelectTrigger>
                        <SelectContent><SelectItem value="Mr">Mr.</SelectItem><SelectItem value="Mrs">Mrs.</SelectItem><SelectItem value="Ms">Ms.</SelectItem></SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contactPersonName" className="text-gray-700 font-medium">Contact Person</Label>
                    <Input id="contactPersonName" name="contactPersonName" placeholder="Enter name" className="h-12" value={data.contactPersonName || ''} onChange={(e) => setData(prev => ({...prev, contactPersonName: e.target.value}))} />
                    {errors?.contactPersonName && <p className="text-xs text-red-500">{errors.contactPersonName[0]}</p>}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="primaryMobileNumber" className="text-gray-700 font-medium">Mobile Number</Label>
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex h-12 w-24 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm">
                        +91
                    </div>
                    <Input id="primaryMobileNumber" name="primaryMobileNumber" type="tel" placeholder="Enter mobile number" className="h-12 flex-1" value={data.primaryMobileNumber || ''} onChange={(e) => setData(prev => ({...prev, primaryMobileNumber: e.target.value}))} />
                </div>
                 {errors?.primaryMobileNumber && <p className="text-xs text-red-500">{errors.primaryMobileNumber[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="whatsappNumber" className="text-gray-700 font-medium">WhatsApp Number</Label>
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex h-12 w-24 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm">
                        +91
                    </div>
                    <Input id="whatsappNumber" name="whatsappNumber" type="tel" placeholder="Enter WhatsApp number" className="h-12 flex-1" value={data.whatsappNumber || ''} onChange={(e) => setData(prev => ({...prev, whatsappNumber: e.target.value}))}/>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <Input id="email" name="email" type="email" placeholder="example@business.com" className="h-12" value={data.email || ''} onChange={(e) => setData(prev => ({...prev, email: e.target.value}))} />
                 {errors?.email && <p className="text-xs text-red-500">{errors.email[0]}</p>}
            </div>
        </motion.div>
    );
};

const BusinessTimingsStep = ({ data, setData, errors }: { data: Partial<any>, setData: React.Dispatch<React.SetStateAction<Partial<any>>>, errors: any }) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleDayToggle = (day: string, checked: boolean) => {
        setData(prev => {
            const currentDays = prev.workingDays || [];
            const newDays = checked
                ? [...currentDays, day] // Add day if checked
                : currentDays.filter((d: string) => d !== day); // Remove day if unchecked
            return { ...prev, workingDays: newDays };
        });
    };

    const handleSelectAll = (checked: boolean) => {
        setData(prev => ({...prev, workingDays: checked ? daysOfWeek : []}));
    };
    
    const allDaysSelected = (data.workingDays || []).length === daysOfWeek.length;

    return (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
            <div>
                <Label className="font-bold text-gray-900 text-lg mb-4 block">Days of the Week</Label>
                <div className="flex items-center space-x-2 mb-4 p-3 bg-gray-50 rounded-lg">
                    <Checkbox id="selectAllDays" onCheckedChange={handleSelectAll} checked={allDaysSelected} />
                    <Label htmlFor="selectAllDays" className="cursor-pointer">Select All Days</Label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {daysOfWeek.map(day => (
                         <motion.div 
                             key={day}
                             whileHover={{ scale: 1.02 }}
                             className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                         >
                            <input 
                                type="checkbox" 
                                name="workingDays" 
                                value={day}
                                checked={(data.workingDays || []).includes(day)}
                                readOnly
                                className="hidden"
                            />
                            <Checkbox 
                                id={day.toLowerCase()} 
                                checked={(data.workingDays || []).includes(day)} 
                                onCheckedChange={(checked: boolean) => handleDayToggle(day, checked)} 
                            />
                            <Label htmlFor={day.toLowerCase()} className="cursor-pointer">{day}</Label>
                        </motion.div>
                    ))}
                </div>
                {errors?.workingDays && <p className="text-xs text-red-500 mt-2">{errors.workingDays[0]}</p>}
            </div>
            <div>
                <Label className="font-bold text-gray-900 text-lg mb-4 block">Business Hours</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="openTime" className="text-gray-700 font-medium">Open At</Label>
                        <Input id="openTime" name="openTime" type="time" className="h-12" value={data.openTime || ''} onChange={(e) => setData(prev => ({...prev, openTime: e.target.value}))}/>
                        {errors?.openTime && <p className="text-xs text-red-500">{errors.openTime[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="closingTime" className="text-gray-700 font-medium">Close At</Label>
                        <Input id="closingTime" name="closingTime" type="time" className="h-12" value={data.closingTime || ''} onChange={(e) => setData(prev => ({...prev, closingTime: e.target.value}))}/>
                        {errors?.closingTime && <p className="text-xs text-red-500">{errors.closingTime[0]}</p>}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const KycStep = ({ data, setData, errors }: { data: Partial<any>, setData: React.Dispatch<React.SetStateAction<Partial<any>>>, errors: any }) => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
        <div className="space-y-2">
            <Label htmlFor="aadharNumber" className="text-gray-700 font-medium">Aadhar Card Number</Label>
            <Input id="aadharNumber" name="aadharNumber" placeholder="Enter 12-digit Aadhar number" className="h-12" value={data.aadharNumber || ''} onChange={(e) => setData(prev => ({...prev, aadharNumber: e.target.value}))} />
            {errors?.aadharNumber && <p className="text-xs text-red-500">{errors.aadharNumber[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="aadharImage" className="text-gray-700 font-medium">Upload Aadhar Card</Label>
            <Input id="aadharImage" name="aadharImage" type="file" className="h-12 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
            {errors?.aadharImage && <p className="text-xs text-red-500">{errors.aadharImage[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="videoKyc" className="text-gray-700 font-medium">Video KYC</Label>
             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <div className="relative w-full aspect-video bg-gray-900 rounded-md mb-4 flex items-center justify-center">
                    <Image src="https://picsum.photos/seed/kyc-demo/400/225" alt="Video KYC Demo" layout="fill" objectFit="cover" className="rounded-md" />
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Button variant="ghost" size="icon" className="h-16 w-16 bg-white/30 hover:bg-white/50 rounded-full">
                            <PlayCircle className="h-10 w-10 text-white" />
                        </Button>
                    </div>
                </div>
                 <p className="text-xs text-gray-500 mb-4">Click to play demo video on how to shoot Video KYC</p>
                <div className="grid grid-cols-2 gap-4 w-full">
                    <Button variant="outline" className="w-full">
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Shoot Video KYC
                    </Button>
                    <div className="flex items-center justify-center border rounded-md bg-white">
                        <Label htmlFor="videoKyc" className="text-sm font-medium text-gray-700 p-2 cursor-pointer flex items-center justify-center w-full h-full">
                            <Upload className="mr-2 h-4 w-4" /> Upload Video
                        </Label>
                        <Input id="videoKyc" name="videoKyc" type="file" className="hidden" accept="video/*" />
                    </div>
                </div>
                 {errors?.videoKyc && <p className="text-xs text-red-500 mt-2">{errors.videoKyc[0]}</p>}
            </div>
        </div>
    </motion.div>
);


export default function FreeListingPage() {
  const [userType, setUserType] = useState<'individual' | 'vendor' | null>(null);
  const [isExistingVendor, setIsExistingVendor] = useState<boolean | null>(null); // null is loading state
  const [step, setStep] = useState(1);
  
  const [user, setUser] = useState<any>(null);
  
  const [formDataState, setFormDataState] = useState<Partial<any>>({
    contactPersonTitle: 'Mr',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    openTime: '09:00',
    closingTime: '18:00',
    latitude: 19.0760,
    longitude: 72.8777,
  });

   const [viewState, setViewState] = useState({
    latitude: 19.0760,
    longitude: 72.8777,
    zoom: 12,
  });


  const [isPending, setIsPending] = useState(false);
  const [clientErrors, setClientErrors] = useState<any>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  const router = useRouter();
  const { toast } = useToast();

   useEffect(() => {
    const checkUserStatus = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }

        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setFormDataState(prev => ({
                ...prev,
                userId: parsedUser.id,
                contactPersonName: parsedUser.name || '',
                primaryMobileNumber: parsedUser.phone || '',
                email: parsedUser.email || ''
            }));
        }

        const { isVendor, error } = await getVendorStatus(token);
        if (error) {
            toast({ title: "Error", description: "Could not verify your status.", variant: "destructive"});
            // Fallback to showing choice if status check fails
            setIsExistingVendor(false);
        } else {
            setIsExistingVendor(isVendor);
            if (isVendor) {
                setUserType('vendor');
            }
        }
    };
    checkUserStatus();
  }, [router, toast]);

  const totalSteps = userType === 'individual' ? 4 : 4;

  const validateStep = (currentStep: number) => {
    let errors: any = {};
    let isValid = true;
    const addressPrefix = userType === 'individual' ? 'personal' : 'business';

    if (currentStep === 1) {
        if (userType === 'vendor') {
            if (!formDataState.businessName) { errors.businessName = ["Business Name is required."]; isValid = false; }
            if (!formDataState.gstNumber) { errors.gstNumber = ["GST Number is required."]; isValid = false; }
        }
        if (!formDataState[`${addressPrefix}Pincode`]) { errors[`${addressPrefix}Pincode`] = ["Pincode is required."]; isValid = false; }
        if (!formDataState[`${addressPrefix}City`]) { errors[`${addressPrefix}City`] = ["City is required."]; isValid = false; }
        if (!formDataState[`${addressPrefix}State`]) { errors[`${addressPrefix}State`] = ["State is required."]; isValid = false; }
    } else if (currentStep === 2) {
      if (!formDataState.contactPersonName) { errors.contactPersonName = ["Contact Person is required."]; isValid = false; }
      if (!formDataState.primaryMobileNumber) { errors.primaryMobileNumber = ["Mobile Number is required."]; isValid = false; }
      else if (!/^\d{10}$/.test(formDataState.primaryMobileNumber)) { errors.primaryMobileNumber = ["Mobile Number must be 10 digits."]; isValid = false; }
      if (!formDataState.email) { errors.email = ["Email is required."]; isValid = false; }
      else if (!/\S+@\S+\.\S+/.test(formDataState.email)) { errors.email = ["Invalid email format."]; isValid = false; }
    } else if (currentStep === 3) {
      if (!formDataState.workingDays || formDataState.workingDays.length === 0) { errors.workingDays = ["Please select at least one working day."]; isValid = false; }
      if (!formDataState.openTime) { errors.openTime = ["Open Time is required."]; isValid = false; }
      if (!formDataState.closingTime) { errors.closingTime = ["Closing Time is required."]; isValid = false; }
      if (formDataState.openTime && formDataState.closingTime && formDataState.openTime >= formDataState.closingTime) {
        errors.closingTime = ["Closing Time must be after Open Time."]; isValid = false;
      }
    } else if (currentStep === 4) {
      if (!formDataState.aadharNumber) { errors.aadharNumber = ["Aadhar Number is required."]; isValid = false; }
      else if (!/^\d{12}$/.test(formDataState.aadharNumber)) { errors.aadharNumber = ["Aadhar Number must be 12 digits."]; isValid = false; }
    }

    setClientErrors(errors);
    return isValid;
  };
  
 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      let allStepsValid = true;
      for (let i = 1; i <= totalSteps; i++) {
        if (!validateStep(i)) {
          allStepsValid = false;
        }
      }

      if (!allStepsValid) {
          toast({
              title: "Validation Error",
              description: "Please fill in all required fields correctly across all steps before submitting.",
              variant: "destructive"
          });
          for (let i = 1; i <= totalSteps; i++) {
              if (!validateStep(i)) {
                  setStep(i);
                  break;
              }
          }
          return;
      }
      
      setIsPending(true);
  
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
          toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
          setIsPending(false);
          router.push('/login');
          return;
      }
  
      const formData = new FormData(formRef.current!);
      formData.append('userType', userType!);
      formData.append('workingDays', JSON.stringify(formDataState.workingDays));
      formData.append('latitude', formDataState.latitude?.toString() || '');
      formData.append('longitude', formDataState.longitude?.toString() || '');

  
      try {
          const response = await fetch(`${apiBaseUrl}/api/kyc/submit`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` },
              body: formData,
          });
  
          const result = await response.json();
  
          if (!response.ok || !result.success) {
              throw new Error(result.message || 'Failed to submit business listing.');
          }
  
          toast({ title: "Success!", description: "Listing submitted successfully! Pending KYC approval." });
          router.push('/my-business');
  
      } catch (error) {
          const errorMessage = (error as Error).message;
          toast({ title: "Submission Failed", description: errorMessage, variant: "destructive" });
          setClientErrors({ server: [errorMessage] });
      } finally {
          setIsPending(false);
      }
  };


  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, totalSteps));
      setClientErrors(null);
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive"
      });
    }
  }

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    setClientErrors(null);
  }

  const stepImages = [
    'free-listing-business-details',
    'free-listing-contact-details',
    'free-listing-business-timings',
    'kyc-icon'
  ];
  
  const stepTitles = [
    userType === 'vendor' ? 'Enter Your Business Details' : 'Enter Your Personal Address',
    'Enter Your Contact Details',
    'Set Your Working Hours',
    'Complete Your KYC',
  ];
  
  const stepIcons = [
    userType === 'vendor' ? Building2 : MapPin,
    Phone,
    Clock,
    FileText,
  ];

  const StepIcon = userType ? stepIcons[step - 1] : Sparkles;

  if (isExistingVendor === null) {
      return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary"/>
        </div>
      )
  }

  if (!userType) {
    return (
        <motion.div
            initial="initial" animate="animate" exit="exit" variants={pageTransition}
            className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50"
        >
            <JustdialHeader />
            <FloatingButtons />
            <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-12">
                <Card className="w-full max-w-4xl p-8 text-center shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold mb-2">Choose Your Listing Type</CardTitle>
                        <CardDescription className="text-gray-600 mb-8 text-lg">
                            How would you like to be represented on our platform?
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-8">
                        <motion.div
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="p-6 border-2 rounded-2xl cursor-pointer hover:border-primary hover:shadow-xl transition-all"
                            onClick={() => setUserType('individual')}
                        >
                            <UserIcon className="h-12 w-12 mx-auto text-primary mb-4" />
                            <h3 className="text-xl font-bold mb-2">Individual</h3>
                            <p className="text-gray-500 text-sm">
                                Best for freelancers, professionals, or any individual (e.g., staff member) offering a service.
                            </p>
                        </motion.div>
                         <motion.div
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="p-6 border-2 rounded-2xl cursor-pointer hover:border-accent hover:shadow-xl transition-all"
                            onClick={() => setUserType('vendor')}
                        >
                            <Building2 className="h-12 w-12 mx-auto text-accent mb-4" />
                            <h3 className="text-xl font-bold mb-2">Business / Vendor</h3>
                            <p className="text-gray-500 text-sm">
                                Ideal for registered businesses with a physical location, managing employee records, and company-level operations.
                            </p>
                        </motion.div>
                    </CardContent>
                </Card>
            </main>
            <JustdialFooter />
        </motion.div>
    )
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      <JustdialHeader />
      <FloatingButtons />

      <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background pt-28 pb-12 overflow-hidden">
        <motion.div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-gray-700">100% Free - No Hidden Charges</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
                Add Your Business
              </motion.span>
            </h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg text-gray-600">
              Join 4.9 Crore+ businesses and grow your reach today
            </motion.p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <motion.path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }} />
          </svg>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12 max-w-lg mx-auto">
            <div className="flex items-center justify-center mb-4">
              {[...Array(totalSteps)].map((_, i) => {
                const num = i + 1;
                return (
                  <div key={num} className="flex items-center flex-1 last:flex-none">
                    <motion.div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${ step >= num ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg' : 'bg-gray-200 text-gray-500' }`} whileHover={{ scale: 1.1 }} animate={step === num ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 0.5 }}>
                      {step > num ? <CheckCircle2 className="h-6 w-6" /> : num}
                    </motion.div>
                    {num < totalSteps && ( <div className={`flex-1 h-1 mx-2 rounded ${ step > num ? 'bg-gradient-to-r from-primary to-accent' : 'bg-gray-200' }`} /> )}
                  </div>
                )
              })}
            </div>
            <Progress value={(step / totalSteps) * 100} className="h-2" />
            <p className="text-center text-sm text-gray-500 mt-3">Step {step} of {totalSteps}</p>
          </motion.div>
             <form ref={formRef} onSubmit={handleSubmit}>
                {user?.id && <input type="hidden" name="userId" value={user.id} />}
                <input type="hidden" name="userType" value={userType} />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="hidden lg:flex flex-col items-center justify-center sticky top-24">
                      <Card className="p-8 bg-gradient-to-br from-primary/5 via-white to-accent/5 border-0 shadow-2xl hover-lift">
                        <motion.div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg" whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.6 }}>
                          <StepIcon className="h-10 w-10 text-white" />
                        </motion.div>
                        <Image src={findImage(stepImages[step-1])!} alt="Business Listing Illustration" width={400} height={400} className="mb-6 rounded-xl" data-ai-hint="business form illustration" />
                        <div className="space-y-3">
                          <div className="flex items-start gap-3"><div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-green-600 text-xs">✓</span></div><p className="text-sm text-gray-600">Reach 4.9 Crore+ customers instantly</p></div>
                          <div className="flex items-start gap-3"><div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-green-600 text-xs">✓</span></div><p className="text-sm text-gray-600">Get verified business badge</p></div>
                          <div className="flex items-start gap-3"><div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-green-600 text-xs">✓</span></div><p className="text-sm text-gray-600">24/7 customer support</p></div>
                        </div>
                      </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                    <Card className="shadow-xl border-0 hover-lift">
                        <CardContent className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <motion.div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                              <StepIcon className="h-6 w-6 text-white" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-900">{stepTitles[step-1]}</h2>
                        </div>
                        
                        <div style={{ display: step === 1 ? 'block' : 'none' }}>
                            <BusinessDetailsStep data={formDataState} setData={setFormDataState} errors={clientErrors} viewState={viewState} setViewState={setViewState} userType={userType!} />
                        </div>
                        <div style={{ display: step === 2 ? 'block' : 'none' }}>
                            <ContactDetailsStep data={formDataState} setData={setFormDataState} errors={clientErrors} />
                        </div>
                         <div style={{ display: step === 3 ? 'block' : 'none' }}>
                            <BusinessTimingsStep data={formDataState} setData={setFormDataState} errors={clientErrors} />
                        </div>
                         <div style={{ display: step === 4 ? 'block' : 'none' }}>
                            <KycStep data={formDataState} setData={setFormDataState} errors={clientErrors} />
                        </div>
                        
                        {clientErrors?.server && ( <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm"> {clientErrors.server[0]} </div> )}

                        <div className="flex justify-between mt-8 gap-4">
                            <Button type="button" variant="outline" onClick={prevStep} className={`h-12 px-8 border-2 ${step === 1 ? 'invisible' : ''}`} > Previous </Button>
                           
                            {step < totalSteps ? (
                              <Button type="button" onClick={handleNextStep} className="h-12 px-8 bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300"> Next Step → </Button>
                            ) : (
                              <Button type="submit" disabled={isPending || !formDataState.aadharNumber} className="h-12 px-8 bg-gradient-to-r from-green-600 to-teal-600 hover:shadow-2xl transition-all duration-300">
                                {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5 mr-2" />} Submit Listing
                              </Button>
                            )}
                        </div>
                        </CardContent>
                    </Card>
                    </motion.div>
                </div>
            </form>
        </div>
      </main>
      <JustdialFooter />
    </motion.div>
  );
}

