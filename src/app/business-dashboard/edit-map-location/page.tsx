
'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, AlertTriangle, CheckCircle, LocateFixed } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSearchParams } from 'next/navigation';
import maplibregl, { Map, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useToast } from '@/hooks/use-toast';
import { updateLocation, getLocation } from '../actions';
import { DashboardHeader } from '@/components/justdial/your-dashboard/DashboardHeader';


function EditMapLocationComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const marker = useRef<Marker | null>(null);
  const { toast } = useToast();

  const [lngLat, setLngLat] = useState({ lng: 79.0882, lat: 21.1458 }); // Default to Nagpur
  const [zoom] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const businessId = searchParams.get('id');

  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

  useEffect(() => {
    if (!businessId) {
        setError("No business ID provided. Please access this page from your business dashboard.");
        setIsLoading(false);
        return;
    }
    
    if (!apiKey || apiKey.includes('YOUR_MAPTILER_API_KEY')) {
      setError("MapTiler API Key is not configured. Please add NEXT_PUBLIC_MAPTILER_API_KEY to your .env file.");
      setIsLoading(false);
      return;
    }

    const fetchLocation = async () => {
        const { data, error } = await getLocation(businessId);

        if (error) {
            console.error("Error fetching location:", error);
            toast({ title: "Error", description: "Failed to load saved location.", variant: "destructive"});
        } else if (data && data.latitude && data.longitude) {
            setLngLat({ lng: data.longitude, lat: data.latitude });
        }
        setIsLoading(false);
    };
    fetchLocation();
    
  }, [businessId, apiKey, toast]);


  useEffect(() => {
    if (isLoading || map.current || !mapContainer.current || !apiKey) return;
    
    map.current = new Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
      center: [lngLat.lng, lngLat.lat],
      zoom: zoom,
    });

    map.current.on('load', () => {
      map.current!.getCanvas().style.cursor = 'pointer';
      
      marker.current = new Marker({ draggable: true })
        .setLngLat([lngLat.lng, lngLat.lat])
        .addTo(map.current!);

      // Update state when marker is dragged
      marker.current.on('dragend', () => {
        const newLngLat = marker.current!.getLngLat();
        setLngLat({ lng: newLngLat.lng, lat: newLngLat.lat });
      });

      // Update marker and state when map is clicked
      map.current!.on('click', (e) => {
          const { lng, lat } = e.lngLat;
          marker.current?.setLngLat([lng, lat]);
          setLngLat({ lng, lat });
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, apiKey]);


  const handleSaveLocation = async () => {
    if (!businessId) {
        toast({ title: "Error", description: "Business ID is missing.", variant: "destructive" });
        return;
    }
    setIsSaving(true);
    
    const result = await updateLocation(businessId, lngLat.lat, lngLat.lng);

    if (result.success) {
        toast({ title: "Success", description: "Location saved successfully!" });
    } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
    }
    
    setIsSaving(false);
  };
  
  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive",
      });
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLngLat({ lng: longitude, lat: latitude });
        if (map.current) {
          map.current.flyTo({ center: [longitude, latitude], zoom: 15 });
          marker.current?.setLngLat([longitude, latitude]);
        }
        setIsLocating(false);
        toast({
          title: "Location Found",
          description: "Your current location has been set.",
        });
      },
      (error) => {
        setIsLocating(false);
        let message = "An unknown error occurred.";
        if (error.code === error.PERMISSION_DENIED) {
          message = "You denied the request for Geolocation.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          message = "The request to get user location timed out.";
        }
        toast({
          title: "Geolocation Error",
          description: message,
          variant: "destructive",
        });
      }
    );
  };


  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
    >
      <DashboardHeader 
        title="Map & Location" 
        rightContent={
             <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={handleGeolocate} variant="outline" disabled={isLocating || isLoading || !!error}>
                   {isLocating ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Locating...</>
                  ) : (
                      <><LocateFixed className="mr-2 h-4 w-4" /> Use My Location</>
                  )}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={handleSaveLocation} disabled={isSaving || isLoading || !!error}>
                    {isSaving ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                    ) : (
                        <><CheckCircle className="mr-2 h-4 w-4" /> Save Location</>
                    )}
                </Button>
              </motion.div>
            </div>
        }
      />

      <main className="relative z-10 flex-grow flex flex-col p-4">
        {error ? (
           <Alert variant="destructive" className="max-w-xl mx-auto">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
        ) : (
        <Card className="flex-grow w-full relative rounded-2xl overflow-hidden border-2 border-primary/10 shadow-xl">
            <CardContent className="p-0 h-full w-full relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                        <p className="ml-4 text-lg">Loading Map...</p>
                    </div>
                )}
                <div ref={mapContainer} className="h-full w-full" />
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-4 left-4"
                 >
                    <Alert className="bg-white/90 backdrop-blur-sm shadow-2xl border-primary/20">
                        <MapPin className="h-5 w-5 text-primary" />
                        <AlertDescription>
                            Click on the map or drag the pin to set your precise business location.
                        </AlertDescription>
                    </Alert>
                </motion.div>
            </CardContent>
        </Card>
        )}
      </main>
    </motion.div>
  );
}

function EditMapLocationPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin" /></div>}>
            <EditMapLocationComponent />
        </Suspense>
    );
}

export default function Page() {
  return (
    <Suspense>
      <EditMapLocationPage />
    </Suspense>
  )
}
