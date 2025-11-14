
'use client';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from '@/contexts/LocationContext';

type SearchSectionProps = {
    onSearch: (query: string) => void;
};

export function SearchSection({ onSearch }: SearchSectionProps) {
    const { city, setCity, isLoading, setLatitude, setLongitude } = useLocation();
    const [localCity, setLocalCity] = useState(city);
    const [isFocused, setIsFocused] = useState(false);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const [allCities, setAllCities] = useState<string[]>([]);
    const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
    const queryInputRef = useRef<HTMLInputElement>(null);
    const cityInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLocalCity(city);
    }, [city]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch('/api/cities');
                const data = await response.json();
                if (data.cities) {
                    setAllCities(data.cities);
                }
            } catch (error) {
                console.error("Failed to fetch cities:", error);
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([]);
            setIsSuggestionsOpen(false);
            return;
        }

        const debounceTimer = setTimeout(() => {
            fetch(`/api/search-suggestions?q=${query}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.data && Array.isArray(data.data.suggestions)) {
                        setSuggestions(data.data.suggestions);
                        setIsSuggestionsOpen(true);
                        setFocusedSuggestionIndex(-1);
                    } else {
                        setSuggestions([]);
                        setIsSuggestionsOpen(false);
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch suggestions:", err);
                    setSuggestions([]);
                    setIsSuggestionsOpen(false);
                });
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsSuggestionsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = (searchTerm: string) => {
        if (!searchTerm.trim()) return;
        setIsSuggestionsOpen(false);
        setQuery(searchTerm);
        onSearch(searchTerm);
    };

    const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalCity(value);
        if (value.length > 1) {
            const filteredCities = allCities.filter(c =>
                c.toLowerCase().startsWith(value.toLowerCase())
            ).slice(0, 7);
            setSuggestions(filteredCities);
            setIsSuggestionsOpen(true);
            setFocusedSuggestionIndex(-1);
        } else {
            setSuggestions([]);
            setIsSuggestionsOpen(false);
        }
    };

    const handleCitySuggestionClick = async (selectedCity: string) => {
        setLocalCity(selectedCity);
        setCity(selectedCity);
        setSuggestions([]);
        setIsSuggestionsOpen(false);

        try {
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${selectedCity}`);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const { latitude, longitude } = data.results[0];
                setLatitude(latitude);
                setLongitude(longitude);
            }
        } catch (error) {
            console.error("Failed to fetch coordinates for city:", error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isSuggestionsOpen || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusedSuggestionIndex(prev => (prev + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusedSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (focusedSuggestionIndex !== -1) {
                const selectedSuggestion = suggestions[focusedSuggestionIndex];
                if (e.currentTarget === cityInputRef.current) {
                    handleCitySuggestionClick(selectedSuggestion);
                    queryInputRef.current?.focus();
                } else if (e.currentTarget === queryInputRef.current) {
                    handleSearch(selectedSuggestion);
                }
            } else if (e.currentTarget === queryInputRef.current && query) {
                handleSearch(query);
            }
        } else if (e.key === 'Escape') {
            setIsSuggestionsOpen(false);
        }
    };


    return (
        <div className="relative">
            {/* Floating decorative elements */}
            <motion.div
                className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20"
                >
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-sm font-medium text-gray-700">India's #1 Local Search Engine</span>
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="block"
                    >
                        Discover Local
                    </motion.span>
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary text-gradient-animated"
                    >
                        Businesses
                    </motion.span>
                </h1>
                
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-lg text-gray-600 mb-8"
                >
                    Search across{' '}
                    <motion.span
                        className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        4.9 Crore+
                    </motion.span>
                    {' '}businesses instantly
                </motion.p>
            </motion.div>

            <div className="relative" ref={searchContainerRef}>
                <div className="flex flex-col gap-4">
                     <motion.div
                        className="relative group z-30"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-all duration-300 group-hover:text-primary group-hover:scale-110" />
                            <Input
                                ref={cityInputRef}
                                value={isLoading ? 'Fetching location...' : localCity}
                                onChange={handleCityInputChange}
                                onKeyDown={handleKeyDown}
                                onBlur={() => setCity(localCity)}
                                onFocus={() => setQuery('')}
                                disabled={isLoading}
                                className="pl-12 h-16 text-lg border-2 border-gray-200 rounded-2xl focus:border-primary hover:border-gray-300 transition-all duration-300 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                                placeholder="Enter location"
                                data-testid="search-location-input"
                            />
                             {isSuggestionsOpen && suggestions.length > 0 && document.activeElement === cityInputRef.current && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-30"
                                >
                                    <ul className="py-1">
                                        {suggestions.map((suggestion, index) => (
                                            <li
                                                key={index}
                                                className={`px-4 py-3 cursor-pointer text-gray-700 transition-colors ${focusedSuggestionIndex === index ? 'bg-primary/10' : 'hover:bg-primary/10'}`}
                                                onMouseDown={() => handleCitySuggestionClick(suggestion)}
                                                onMouseEnter={() => setFocusedSuggestionIndex(index)}
                                            >
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    <form
                        className="relative group z-20"
                        onSubmit={(e) => { e.preventDefault(); handleSearch(query); }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative">
                            <Input
                                ref={queryInputRef}
                                placeholder="Search for Restaurants, Hotels, Services..."
                                className="h-16 text-lg border-2 border-gray-200 rounded-2xl pr-16 focus:border-primary hover:border-gray-300 transition-all duration-300 bg-white shadow-sm hover:shadow-md focus:shadow-lg pl-6"
                                data-testid="search-query-input"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => {
                                    setIsFocused(true);
                                    setLocalCity(city); // Reset city input if user focuses on search
                                }}
                            />
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300 rounded-xl ripple group"
                                    size="icon"
                                    data-testid="search-button"
                                >
                                    <motion.div
                                        animate={isFocused ? { rotate: [0, 10, -10, 0] } : {}}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Search className="h-5 w-5 text-white" />
                                    </motion.div>
                                </Button>
                            </motion.div>
                        </div>
                        {isSuggestionsOpen && suggestions.length > 0 && query.length > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-20"
                            >
                                <ul className="py-2">
                                    {suggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className={`px-4 py-3 cursor-pointer text-gray-700 transition-colors ${focusedSuggestionIndex === index ? 'bg-primary/10' : 'hover:bg-primary/10'}`}
                                            onMouseDown={() => handleSearch(suggestion)}
                                            onMouseEnter={() => setFocusedSuggestionIndex(index)}
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
