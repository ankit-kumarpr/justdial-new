
'use client';

import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Camera, Loader2, UploadCloud, Video, Eye, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { Card, CardContent } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { uploadMedia, uploadVideo, deleteMedia, deleteVideo, getGallery } from './actions';
import type { GalleryItem } from '@/lib/types';
import { MediaViewerDialog } from '@/components/business-dashboard/photos-videos/MediaViewerDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from '@/components/justdial/your-dashboard/DashboardHeader';

function PhotosVideosComponent() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id');
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [photos, setPhotos] = useState<GalleryItem[]>([]);
    const [videos, setVideos] = useState<GalleryItem[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const photoInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    const fetchGalleryData = useCallback(async () => {
        if (!businessId) {
            setIsLoading(false);
            return;
        }
        const token = localStorage.getItem('accessToken');
        if (!token) {
             setIsLoading(false);
             return;
        }
        setIsLoading(true);
        const { data, error } = await getGallery(businessId, token);
        if (error) {
            toast({ title: 'Error', description: 'Failed to load gallery.', variant: 'destructive' });
        } else {
            setPhotos(data.filter(item => item.media_type === 'image'));
            setVideos(data.filter(item => item.media_type === 'video'));
        }
        setIsLoading(false);
    }, [businessId, toast]);

    useEffect(() => {
        fetchGalleryData();
    }, [fetchGalleryData]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
        const files = e.target.files;
        if (!files || files.length === 0 || !businessId) return;
        
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({ title: 'Error', description: 'Authentication required to upload.', variant: 'destructive' });
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append('businessId', businessId);
        formData.append('token', token);
        
        let result;
        if (type === 'image') {
            for (const file of files) {
                formData.append('photos', file);
            }
            result = await uploadMedia(formData);
        } else {
            formData.append('video', files[0]);
            result = await uploadVideo(formData);
        }

        if (result.success) {
            toast({ title: 'Success', description: result.message });
            await fetchGalleryData();
        } else {
            toast({ title: 'Upload Failed', description: result.message, variant: 'destructive' });
        }
        setIsUploading(false);
        e.target.value = '';
    };
    
    const openMediaViewer = (item: GalleryItem) => {
        setSelectedItem(item);
        setIsViewerOpen(true);
    };

    const handleDelete = async (item: GalleryItem) => {
        if (!businessId) return;

        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({ title: 'Error', description: 'Authentication is required.', variant: 'destructive' });
            return;
        }
        
        const result = item.media_type === 'image' 
            ? await deleteMedia(item.media_url, token)
            : await deleteVideo(token);
            
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            fetchGalleryData();
            setIsViewerOpen(false); 
            setSelectedItem(null);
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };

    const renderPhotosGrid = () => (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {photos.map(item => (
                <div key={item.id} className="relative group aspect-square cursor-pointer" onClick={() => openMediaViewer(item)}>
                    <Image src={item.media_url} alt={item.caption || 'Gallery item'} layout="fill" objectFit="cover" className="rounded-lg" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Eye className="h-8 w-8 text-white"/>
                    </div>
                </div>
            ))}
            <label htmlFor="photo-upload" className="aspect-square border-2 border-dashed border-primary/30 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary/5 transition-all duration-300 text-primary hover:border-primary">
                {isUploading ? <Loader2 className="h-8 w-8 animate-spin" /> : <UploadCloud className="h-8 w-8" />}
                <span className="text-xs font-semibold mt-2">{isUploading ? 'Uploading...' : `Upload Photos`}</span>
                 <Button onClick={() => photoInputRef.current?.click()} className="mt-4">
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload Photos
                </Button>
            </label>
        </div>
    );
    
    const renderVideoSection = () => {
      const video = videos[0]; // Since there's only one
      
      return (
        <div className="flex flex-col items-center justify-center">
          {video ? (
             <div className="relative group aspect-video w-full max-w-lg cursor-pointer" onClick={() => openMediaViewer(video)}>
                <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
                    <PlayCircle className="h-16 w-16 text-white/80" />
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Eye className="h-12 w-12 text-white"/>
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">Click to play video. You can upload a new video to replace this one.</p>
            </div>
          ) : (
             <div className="text-center py-10">
                <Video className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Your video gallery is empty</h3>
                <p className="text-gray-500 text-sm mt-1">Upload your business video.</p>
            </div>
          )}
          <label htmlFor="video-upload" className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 cursor-pointer">
            {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5 mr-2" />}
            {isUploading ? 'Uploading...' : video ? 'Replace Video' : 'Upload Video'}
          </label>
        </div>
      );
    }

    return (
      <>
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
        >
            <DashboardHeader title="Photo & Video Gallery" />

            <main className="flex-grow container mx-auto px-4 py-6 relative z-10">
                <div className="max-w-6xl mx-auto space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Alert className="bg-primary/5 border-primary/20 text-primary rounded-3xl shadow-lg">
                            <Info className="h-5 w-5" />
                            <AlertDescription className="text-sm">
                                Make your business look more trustworthy by uploading photos and videos of your business premises.
                                <br />
                                <span className="font-semibold">Recommended Size: 1000 px X 1000 px for photos.</span>
                            </AlertDescription>
                        </Alert>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                        <Card className="rounded-3xl shadow-lg">
                            <CardContent className="p-6">
                                <Tabs defaultValue="photos">
                                    <TabsList>
                                        <TabsTrigger value="photos">Photos</TabsTrigger>
                                        <TabsTrigger value="videos">Video</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="photos" className="mt-6">
                                        {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
                                            photos.length === 0 ? (
                                                <div className="text-center py-10">
                                                    <Camera className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                                    <h3 className="text-lg font-semibold">Your photo gallery is empty</h3>
                                                    <p className="text-gray-500 text-sm mt-1">Start by uploading your first photo.</p>
                                                    <Button onClick={() => photoInputRef.current?.click()} className="mt-4">
                                                      <UploadCloud className="mr-2 h-4 w-4" />
                                                      Upload Photos
                                                    </Button>
                                                </div>
                                            ) : renderPhotosGrid()
                                        )}
                                        <input
                                            id="photo-upload"
                                            ref={photoInputRef}
                                            type="file"
                                            multiple
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, 'image')}
                                            disabled={isUploading || !businessId}
                                        />
                                    </TabsContent>
                                    <TabsContent value="videos" className="mt-6">
                                         {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div> : renderVideoSection()}
                                        <input
                                            id="video-upload"
                                            ref={videoInputRef}
                                            type="file"
                                            className="hidden"
                                            accept="video/*"
                                            onChange={(e) => handleFileUpload(e, 'video')}
                                            disabled={isUploading || !businessId}
                                        />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </motion.div>
         {selectedItem && (
            <MediaViewerDialog
                isOpen={isViewerOpen}
                onClose={() => setIsViewerOpen(false)}
                item={selectedItem}
                onDelete={handleDelete}
            />
        )}
      </>
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
