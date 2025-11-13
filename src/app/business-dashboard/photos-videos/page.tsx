
'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, Info, Camera, Grip, Loader2, UploadCloud, Video, Trash2, X, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { Card, CardContent } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { uploadMedia, deleteMedia, getGallery } from './actions';
import type { GalleryItem } from '@/lib/types';


function PhotosVideosComponent() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id');
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchGalleryData = async () => {
        if (!businessId) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        const { data, error } = await getGallery(businessId);
        if (error) {
            toast({ title: 'Error', description: 'Failed to load gallery.', variant: 'destructive' });
        } else {
            setGallery(data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchGalleryData();
    }, [businessId]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !businessId) return;
        setIsUploading(true);

        const formData = new FormData();
        formData.append('businessId', businessId);
        for (const file of e.target.files) {
            formData.append('files', file);
        }

        const result = await uploadMedia(formData);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            await fetchGalleryData(); // Refetch gallery
        } else {
            toast({ title: 'Upload Failed', description: result.message, variant: 'destructive' });
        }
        setIsUploading(false);
        e.target.value = ''; // Reset file input
    };

    const handleDelete = async (id: string) => {
        if (!businessId || !confirm('Are you sure you want to delete this item?')) return;
        
        const result = await deleteMedia(id, businessId);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setGallery(prev => prev.filter(item => item.id !== id));
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
        >
            <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-20 border-b border-gray-100">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/business-dashboard?id=${businessId || ''}`}>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="ghost" size="icon"><ChevronLeft className="h-6 w-6" /></Button>
                            </motion.div>
                        </Link>
                        <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Photo &amp; Video Gallery</h1>
                    </div>
                    <Button variant="ghost" size="icon"><Grip className="h-6 w-6" /></Button>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-6 relative z-10">
                <div className="max-w-4xl mx-auto space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Alert className="bg-primary/5 border-primary/20 text-primary rounded-3xl shadow-lg">
                            <Info className="h-5 w-5" />
                            <AlertDescription className="text-sm">
                                Make your business look more trustworthy by uploading photos and videos of your business premises.
                                <br />
                                <span className="font-semibold">Recommended Size: 1000 px X 1000 px</span>
                            </AlertDescription>
                        </Alert>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                        <Card className="rounded-3xl shadow-lg">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                     {isLoading ? (
                                        [...Array(5)].map((_, i) => <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />)
                                     ) : (
                                        <>
                                            {gallery.map(item => (
                                                <div key={item.id} className="relative group aspect-square">
                                                    {item.media_type === 'image' ? (
                                                        <Image src={item.media_url} alt={item.caption || 'Gallery item'} layout="fill" objectFit="cover" className="rounded-lg" />
                                                    ) : (
                                                        <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
                                                            <Video className="h-10 w-10 text-white" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                                        <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}>
                                                            <Trash2 className="h-5 w-5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            <label htmlFor="media-upload" className="aspect-square border-2 border-dashed border-primary/30 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary/5 transition-all duration-300 text-primary hover:border-primary">
                                                {isUploading ? <Loader2 className="h-8 w-8 animate-spin" /> : <UploadCloud className="h-8 w-8" />}
                                                <span className="text-xs font-semibold mt-2">{isUploading ? 'Uploading...' : 'Upload Media'}</span>
                                            </label>
                                            <input
                                                id="media-upload"
                                                ref={fileInputRef}
                                                type="file"
                                                multiple
                                                className="hidden"
                                                accept="image/*,video/*"
                                                onChange={handleFileChange}
                                                disabled={isUploading || !businessId}
                                            />
                                        </>
                                     )}
                                </div>
                                {gallery.length === 0 && !isLoading && (
                                     <div className="text-center py-10">
                                        <Camera className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold">Your gallery is empty</h3>
                                        <p className="text-gray-500 text-sm mt-1">Start by uploading your first photo or video.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </motion.div>
    );
}

function PhotosVideosPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-12 w-12 animate-spin" /></div>}>
            <PhotosVideosComponent />
        </Suspense>
    );
}

export default function Page() {
  return (
    <Suspense>
      <PhotosVideosPage />
    </Suspense>
  )
}
