'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

type LocationContextType = {
  city: string;
  setCity: (city: string) => void;
  latitude: number | null;
  setLatitude: (lat: number | null) => void;
  longitude: number | null;
  setLongitude: (lon: number | null) => void;
  address: string;
  setAddress: (address: string) => void;
  state: string;
  setState: (state: string) => void;
  pincode: string;
  setPincode: (pincode: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState('Mumbai');
  const [latitude, setLatitude] = useState<number | null>(19.0760);
  const [longitude, setLongitude] = useState<number | null>(72.8777);
  const [address, setAddress] = useState('Andheri West, Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('400053');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const value = {
    city,
    setCity,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    address,
    setAddress,
    state,
    setState,
    pincode,
    setPincode,
    isLoading,
    setIsLoading,
    error,
    setError,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}