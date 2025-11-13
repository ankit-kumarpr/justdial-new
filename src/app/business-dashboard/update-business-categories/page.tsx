
'use client';

import { useState, useEffect, useActionState, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { Card, CardContent } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { updateBusinessCategories, getVendorCategories, getAllCategories, type UpdateCategoriesState } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';

type CategoryOption = {
    id: string;
    name: string;
}

function UpdateCategoriesComponent() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id');
    const { toast } = useToast();
    
    const [isLoading, setIsLoading] = useState(true);
    const [allCategories, setAllCategories] = useState<CategoryOption[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    
    const initialState: UpdateCategoriesState = {};
    const [state, formAction, isPending] = useActionState(updateBusinessCategories, initialState);

    useEffect(() => {
        if (!businessId) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            const [allCatsRes, vendorCatsRes] = await Promise.all([
                getAllCategories(),
                getVendorCategories(businessId),
            ]);
            
            if (allCatsRes.error) {
                toast({ title: "Error", description: "Could not load categories.", variant: 'destructive'});
            } else {
                setAllCategories(allCatsRes.data);
            }

            if (vendorCatsRes.error) {
                toast({ title: "Error", description: "Could not load your current category.", variant: 'destructive'});
            } else if (vendorCatsRes.data) {
                setSelectedCategoryId(vendorCatsRes.data[0] || ''); // Expecting only one
            }
            
            setIsLoading(false);
        };
        fetchData();
    }, [businessId, toast]);

    useEffect(() => {
        if (state?.message) {
            if (state.success) {
                toast({ title: "Success!", description: state.message });
            } else {
                toast({ title: "Error", description: state.message, variant: 'destructive' });
            }
        }
    }, [state, toast]);

    const categoryOptions: ComboboxOption[] = allCategories.map(cat => ({
        value: cat.id,
        label: cat.name,
        searchValue: cat.name,
    }));


    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
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
        )
    }

    return (
        <form action={formAction}>
            <input type="hidden" name="businessId" value={businessId} />
            <input type="hidden" name="categoryId" value={selectedCategoryId} />

            <main className="flex-grow container mx-auto px-4 py-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <CardContent className="p-6 space-y-6 relative z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <p className="text-sm text-gray-600 mb-2">
                                    Categories describe what your business is and the products and services your business offers. Please select one category for customers to find your business.
                                </p>
                                <p className="text-xs text-gray-500">
                                    Please note: Edits may go for moderation and it can take up to 24-48 hours to be published.
                                </p>
                            </motion.div>

                            <div>
                                <h3 className="text-sm font-semibold mb-3">Select a Category</h3>
                                <Combobox
                                    options={categoryOptions}
                                    value={selectedCategoryId}
                                    onValueChange={setSelectedCategoryId}
                                    placeholder="Search and select a category..."
                                    className="w-full"
                                />
                                {state?.errors?.categoryId && <p className="text-xs text-red-500 mt-1">{state.errors.categoryId[0]}</p>}
                            </div>

                        </CardContent>
                    </Card>
                </motion.div>
            </main>
            
            <footer className="bg-white/80 backdrop-blur-md py-4 border-t border-gray-100 sticky bottom-0 z-20 shadow-lg">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300" disabled={isPending || !selectedCategoryId}>
                             {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                             {isPending ? 'Saving...' : 'Save Category'}
                        </Button>
                    </motion.div>
                </div>
            </footer>
        </form>
    );
}

function UpdateBusinessCategoriesPage() {
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
                    <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Update Business Category</h1>
                </div>
            </header>
            <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                <UpdateCategoriesComponent />
            </Suspense>
        </motion.div>
    );
}

export default function Page() {
  return (
    <Suspense>
      <UpdateBusinessCategoriesPage />
    </Suspense>
  )
}
