
'use client';

import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { FloatingButtons } from "@/components/justdial/FloatingButtons";
import { Card, CardContent } from '@/components/ui/card';
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
import { Building2, Phone, Clock, CheckCircle2, Sparkles, Loader2, FileText, PlayCircle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Country, State, City } from 'country-state-city';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

const BusinessDetailsStep = ({ data, setData, errors }: { data: Partial<any>, setData: React.Dispatch<React.SetStateAction<Partial<any>>>, errors: any }) => {
    const { toast } = useToast();
    const india = Country.getCountryByCode('IN');
    const states = State.getStatesOfCountry(india?.isoCode);
    const cities = data.stateCode ? City.getCitiesOfState(india!.isoCode, data.stateCode) : [];

    useEffect(() => {
        if (data.pincode && data.pincode.length === 6) {
            const fetchLocationData = async () => {
                try {
                    const response = await fetch(`https://api.postalpincode.in/pincode/${data.pincode}`);
                    const result = await response.json();
                    if (result && result[0] && result[0].Status === 'Success') {
                        const postOffice = result[0].PostOffice[0];
                        const stateName = postOffice.State;
                        const cityName = postOffice.District;

                        const matchingState = states.find(s => s.name === stateName);
                        if (matchingState) {
                            setData(prev => ({
                                ...prev,
                                state: matchingState.name,
                                stateCode: matchingState.isoCode,
                                city: cityName,
                            }));

                            // Allow cities to populate
                            setTimeout(() => {
                                const matchingCity = City.getCitiesOfState(india!.isoCode, matchingState.isoCode).find(c => c.name === cityName);
                                if (matchingCity) {
                                    setData(prev => ({...prev, city: matchingCity.name}));
                                }
                            }, 100);
                        }
                    } else {
                        toast({
                            title: "Invalid Pincode",
                            description: "Could not find location for the entered pincode.",
                            variant: "destructive",
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch pincode data", error);
                    toast({
                        title: "API Error",
                        description: "Failed to fetch location data. Please enter manually.",
                        variant: "destructive",
                    });
                }
            };
            fetchLocationData();
        }
    }, [data.pincode, setData, states, india, toast]);

    const handleStateChange = (stateCode: string) => {
        const state = states.find(s => s.isoCode === stateCode);
        setData(prev => ({ ...prev, stateCode, state: state?.name || '', city: '' }));
    };

    return (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
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
            
            <div className="space-y-2">
                <Label htmlFor="plotNo" className="text-gray-700 font-medium">Plot No. / Bldg No. / Wing / Shop No. / Floor</Label>
                <Input id="plotNo" name="plotNo" placeholder="Enter plot details" className="h-12" value={data.plotNo || ''} onChange={(e) => setData(prev => ({...prev, plotNo: e.target.value}))} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="buildingName" className="text-gray-700 font-medium">Building Name / Market / Colony / Society</Label>
                <Input id="buildingName" name="buildingName" placeholder="Enter building name" className="h-12" value={data.buildingName || ''} onChange={(e) => setData(prev => ({...prev, buildingName: e.target.value}))} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="street" className="text-gray-700 font-medium">Street / Road Name</Label>
                    <Input id="street" name="street" placeholder="Enter street name" className="h-12" value={data.street || ''} onChange={(e) => setData(prev => ({...prev, street: e.target.value}))} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="landmark" className="text-gray-700 font-medium">Landmark</Label>
                    <Input id="landmark" name="landmark" placeholder="Enter landmark" className="h-12" value={data.landmark || ''} onChange={(e) => setData(prev => ({...prev, landmark: e.target.value}))} />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="area" className="text-gray-700 font-medium">Area</Label>
                <Input id="area" name="area" placeholder="Enter Area" className="h-12" value={data.area || ''} onChange={(e) => setData(prev => ({...prev, area: e.target.value}))} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="pincode" className="text-gray-700 font-medium">Pincode</Label>
                <Input id="pincode" name="pincode" placeholder="Enter 6-digit pincode" className="h-12" value={data.pincode || ''} onChange={(e) => setData(prev => ({...prev, pincode: e.target.value}))} maxLength={6} />
                {errors?.pincode && <p className="text-xs text-red-500">{errors.pincode[0]}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select name="state" value={data.stateCode || ""} onValueChange={handleStateChange}>
                        <SelectTrigger className="h-12"><SelectValue placeholder="Select State" /></SelectTrigger>
                        <SelectContent>
                            {states.map(state => <SelectItem key={state.isoCode} value={state.isoCode}>{state.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {errors?.state && <p className="text-xs text-red-500">{errors.state[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                     <Select name="city" value={data.city || ""} onValueChange={(value) => setData(prev => ({...prev, city: value}))} disabled={!data.stateCode}>
                        <SelectTrigger className="h-12"><SelectValue placeholder="Select City" /></SelectTrigger>
                        <SelectContent>
                            {cities.map(city => <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {errors?.city && <p className="text-xs text-red-500">{errors.city[0]}</p>}
                </div>
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
                    <Input id="contactPersonName" name="contactPerson" placeholder="Enter name" className="h-12" value={data.contactPersonName || ''} onChange={(e) => setData(prev => ({...prev, contactPersonName: e.target.value}))} />
                    {errors?.contactPerson && <p className="text-xs text-red-500">{errors.contactPerson[0]}</p>}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="primaryMobileNumber" className="text-gray-700 font-medium">Mobile Number</Label>
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex h-12 w-24 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm">
                        +91
                    </div>
                    <Input id="primaryMobileNumber" name="mobileNumber" type="tel" placeholder="Enter mobile number" className="h-12 flex-1" value={data.primaryMobileNumber || ''} onChange={(e) => setData(prev => ({...prev, primaryMobileNumber: e.target.value}))} />
                </div>
                 {errors?.mobileNumber && <p className="text-xs text-red-500">{errors.mobileNumber[0]}</p>}
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
                        <Input id="openTime" name="businessHoursOpen" type="time" className="h-12" value={data.openTime || ''} onChange={(e) => setData(prev => ({...prev, openTime: e.target.value}))}/>
                        {errors?.businessHoursOpen && <p className="text-xs text-red-500">{errors.businessHoursOpen[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="closingTime" className="text-gray-700 font-medium">Close At</Label>
                        <Input id="closingTime" name="businessHoursClose" type="time" className="h-12" value={data.closingTime || ''} onChange={(e) => setData(prev => ({...prev, closingTime: e.target.value}))}/>
                        {errors?.businessHoursClose && <p className="text-xs text-red-500">{errors.businessHoursClose[0]}</p>}
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
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  const [user, setUser] = useState<any>(null);
  
  const [formDataState, setFormDataState] = useState<Partial<any>>({
    contactPersonTitle: 'Mr',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    openTime: '09:00',
    closingTime: '18:00',
  });
  const [isPending, setIsPending] = useState(false);
  const [clientErrors, setClientErrors] = useState<any>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    }
  }, []);

  const { toast } = useToast();
  const router = useRouter();

  const validateStep = (currentStep: number) => {
    let errors: any = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formDataState.businessName) { errors.businessName = ["Business Name is required."]; isValid = false; }
      if (!formDataState.gstNumber) { errors.gstNumber = ["GST Number is required."]; isValid = false; }
      if (!formDataState.pincode) { errors.pincode = ["Pincode is required."]; isValid = false; }
      if (!formDataState.city) { errors.city = ["City is required."]; isValid = false; }
      if (!formDataState.state) { errors.state = ["State is required."]; isValid = false; }
    } else if (currentStep === 2) {
      if (!formDataState.contactPersonName) { errors.contactPerson = ["Contact Person is required."]; isValid = false; }
      if (!formDataState.primaryMobileNumber) { errors.mobileNumber = ["Mobile Number is required."]; isValid = false; }
      else if (!/^\d{10}$/.test(formDataState.primaryMobileNumber)) { errors.mobileNumber = ["Mobile Number must be 10 digits."]; isValid = false; }
      if (!formDataState.email) { errors.email = ["Email is required."]; isValid = false; }
      else if (!/\S+@\S+\.\S+/.test(formDataState.email)) { errors.email = ["Invalid email format."]; isValid = false; }
    } else if (currentStep === 3) {
      if (!formDataState.workingDays || formDataState.workingDays.length === 0) { errors.workingDays = ["Please select at least one working day."]; isValid = false; }
      if (!formDataState.openTime) { errors.businessHoursOpen = ["Open Time is required."]; isValid = false; }
      if (!formDataState.closingTime) { errors.businessHoursClose = ["Closing Time is required."]; isValid = false; }
      if (formDataState.openTime && formDataState.closingTime && formDataState.openTime >= formDataState.closingTime) {
        errors.businessHoursClose = ["Closing Time must be after Open Time."]; isValid = false;
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
          // Optionally, navigate to the first step with an error
          if (!validateStep(1)) setStep(1);
          else if (!validateStep(2)) setStep(2);
          else if (!validateStep(3)) setStep(3);
          else if (!validateStep(4)) setStep(4);
          return;
      }
      
      setIsPending(true);
  
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
          toast({
              title: "Authentication Error",
              description: "You must be logged in to create a listing.",
              variant: "destructive"
          });
          setIsPending(false);
          return;
      }
  
      const formData = new FormData();
      
      // Append all fields from the state, mapping to correct API keys
      const keyMap: { [key: string]: string } = {
          contactPersonName: 'contactPerson',
          primaryMobileNumber: 'mobileNumber',
          contactPersonTitle: 'title',
          openTime: 'businessHoursOpen',
          closingTime: 'businessHoursClose',
      };

      Object.keys(formDataState).forEach(key => {
          const value = formDataState[key];
          const mappedKey = keyMap[key] || key;

          if (key === 'workingDays' && Array.isArray(value)) {
              formData.append(mappedKey, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
              formData.append(mappedKey, value);
          }
      });
      
      // Append files from the form element
      const aadharImageInput = formRef.current?.querySelector<HTMLInputElement>('input[name="aadharImage"]');
      if (aadharImageInput?.files?.[0]) {
          formData.append('aadharImage', aadharImageInput.files[0]);
      }
      
      const videoKycInput = formRef.current?.querySelector<HTMLInputElement>('input[name="videoKyc"]');
      if (videoKycInput?.files?.[0]) {
          formData.append('videoKyc', videoKycInput.files[0]);
      }
  
      try {
          const response = await fetch(`${apiBaseUrl}/api/kyc/submit`, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`,
              },
              body: formData,
          });
  
          const result = await response.json();
  
          if (!response.ok || !result.success) {
              throw new Error(result.message || 'Failed to submit business listing.');
          }
  
          toast({ title: "Success!", description: "Business listing submitted successfully! It is now pending for KYC approval." });
          router.push('/my-business');
  
      } catch (error) {
          const errorMessage = (error as Error).message;
          toast({
              title: "Submission Failed",
              description: errorMessage,
              variant: "destructive"
          });
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
    'Enter Your Business Details',
    'Enter Your Contact Details',
    'Set Your Business Timings',
    'Complete Your KYC'
  ];

  const stepIcons = [Building2, Phone, Clock, FileText];
  const StepIcon = stepIcons[step - 1];

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
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20"
            >
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-gray-700">100% Free - No Hidden Charges</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary"
              >
                Add Your Business
              </motion.span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600"
            >
              Join 4.9 Crore+ businesses and grow your reach today
            </motion.p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#ffffff"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 max-w-lg mx-auto"
          >
            <div className="flex items-center justify-center mb-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="flex items-center flex-1 last:flex-none">
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      step >= num
                        ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    animate={step === num ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {step > num ? <CheckCircle2 className="h-6 w-6" /> : num}
                  </motion.div>
                  {num < 4 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${
                      step > num ? 'bg-gradient-to-r from-primary to-accent' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(step / totalSteps) * 100} className="h-2" />
            <p className="text-center text-sm text-gray-500 mt-3">Step {step} of {totalSteps}</p>
          </motion.div>
             <form ref={formRef} onSubmit={handleSubmit}>
                {user?.id && <input type="hidden" name="userId" value={user.id} />}
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden lg:flex flex-col items-center justify-center sticky top-24"
                    >
                    <Card className="p-8 bg-gradient-to-br from-primary/5 via-white to-accent/5 border-0 shadow-2xl hover-lift">
                        <motion.div
                        className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        >
                        <StepIcon className="h-10 w-10 text-white" />
                        </motion.div>
                        <Image 
                        src={findImage(stepImages[step-1])!} 
                        alt="Business Listing Illustration"
                        width={400}
                        height={400}
                        className="mb-6 rounded-xl"
                        data-ai-hint="business form illustration"
                        />
                        <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-green-600 text-xs">✓</span></div>
                            <p className="text-sm text-gray-600">Reach 4.9 Crore+ customers instantly</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-green-600 text-xs">✓</span></div>
                            <p className="text-sm text-gray-600">Get verified business badge</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-green-600 text-xs">✓</span></div>
                            <p className="text-sm text-gray-600">24/7 customer support</p>
                        </div>
                        </div>
                    </Card>
                    </motion.div>

                    <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    >
                    <Card className="shadow-xl border-0 hover-lift">
                        <CardContent className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <motion.div
                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            >
                            <StepIcon className="h-6 w-6 text-white" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-900">{stepTitles[step-1]}</h2>
                        </div>
                        
                        <div style={{ display: step === 1 ? 'block' : 'none' }}>
                            <BusinessDetailsStep data={formDataState} setData={setFormDataState} errors={clientErrors} />
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
                        
                        {clientErrors?.server && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
                                {clientErrors.server[0]}
                            </div>
                        )}


                        <div className="flex justify-between mt-8 gap-4">
                            <Button 
                                type="button"
                                variant="outline" 
                                onClick={prevStep}
                                className={`h-12 px-8 border-2 ${step === 1 ? 'invisible' : ''}`}
                            >
                                Previous
                            </Button>
                           
                            {step < totalSteps ? (
                              <Button 
                                type="button"
                                onClick={handleNextStep} 
                                className="h-12 px-8 bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300"
                              >
                                Next Step →
                              </Button>
                            ) : (
                              <Button 
                                type="submit"
                                disabled={isPending || !formDataState.aadharNumber || String(formDataState.aadharNumber).length !== 12}
                                className="h-12 px-8 bg-gradient-to-r from-green-600 to-teal-600 hover:shadow-2xl transition-all duration-300"
                              >
                                {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5 mr-2" />}
                                Submit Listing
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
