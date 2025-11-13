
'use client';

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Image as ImageIcon, Trash2, Edit, IndianRupee } from "lucide-react";
import { BannerDialog } from "./BannerDialog";
import { OfferBannerDialog } from "@/components/super-admin/home-settings/OfferBannerDialog";
import type { Banner, OfferBannerPrice } from "@/lib/types";
import { getHeroBanners, deleteBanner, setOfferBannerPrice, getOfferBannerPrices, getOfferBanners, deleteOfferBannerByAdmin } from "./actions";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useActionState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpCircle, MinusCircle, ArrowDownCircle, AlertTriangle } from 'lucide-react';
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


const PricingForm = ({ place, prices }: { place: 'top' | 'middle' | 'bottom', prices: OfferBannerPrice | undefined }) => {
    const { toast } = useToast();
    const initialState: any = {};
    const [state, formAction, isPending] = useActionState(setOfferBannerPrice, initialState);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setToken(localStorage.getItem('accessToken'));
        }
    }, []);

    useEffect(() => {
        if (state.message) {
            if (state.errors) {
                toast({ title: 'Error', description: state.message, variant: 'destructive' });
            } else {
                toast({ title: 'Success!', description: state.message });
            }
        }
    }, [state, toast]);

    return (
        <form action={formAction} className="space-y-4">
            <input type="hidden" name="place" value={place} />
            <input type="hidden" name="token" value={token || ''} />
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor={`${place}-price7`}>Price for 7 Days</Label>
                    <Input id={`${place}-price7`} name="price7Days" type="number" placeholder="e.g., 100" defaultValue={prices?.price7Days} />
                    {state?.errors?.price7Days && <p className="text-xs text-red-500">{state.errors.price7Days[0]}</p>}
                </div>
                 <div className="space-y-1">
                    <Label htmlFor={`${place}-price14`}>Price for 14 Days</Label>
                    <Input id={`${place}-price14`} name="price14Days" type="number" placeholder="e.g., 200" defaultValue={prices?.price14Days} />
                     {state?.errors?.price14Days && <p className="text-xs text-red-500">{state.errors.price14Days[0]}</p>}
                </div>
                 <div className="space-y-1">
                    <Label htmlFor={`${place}-price21`}>Price for 21 Days</Label>
                    <Input id={`${place}-price21`} name="price21Days" type="number" placeholder="e.g., 300" defaultValue={prices?.price21Days} />
                     {state?.errors?.price21Days && <p className="text-xs text-red-500">{state.errors.price21Days[0]}</p>}
                </div>
                 <div className="space-y-1">
                    <Label htmlFor={`${place}-price30`}>Price for 30 Days</Label>
                    <Input id={`${place}-price30`} name="price30Days" type="number" placeholder="e.g., 400" defaultValue={prices?.price30Days} />
                     {state?.errors?.price30Days && <p className="text-xs text-red-500">{state.errors.price30Days[0]}</p>}
                </div>
            </div>
             <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save {place.charAt(0).toUpperCase() + place.slice(1)} Prices
            </Button>
        </form>
    )
}

export default function HomePageSettingsPage() {
  const [heroBanners, setHeroBanners] = useState<Banner[]>([]);
  const [offerBanners, setOfferBanners] = useState<any[]>([]);
  const [prices, setPrices] = useState<OfferBannerPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHeroDialogOpen, setIsHeroDialogOpen] = useState(false);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [selectedHeroBanner, setSelectedHeroBanner] = useState<Banner | null>(null);
  const [selectedOfferBanner, setSelectedOfferBanner] = useState<Banner | null>(null);
  const [dialogKey, setDialogKey] = useState(Date.now());
  const { toast } = useToast();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast({ title: 'Authentication Error', description: 'Please log in.', variant: 'destructive' });
      router.push('/login');
      return;
    }

    const [heroBannersResult, offerBannersResult, pricesResult] = await Promise.all([
      getHeroBanners(token),
      getOfferBanners(token),
      getOfferBannerPrices()
    ]);
    
    const handleResultError = (error: string | null, type: string) => {
        if(error) {
            toast({ title: "Error", description: `Failed to fetch ${type}: ${error}`, variant: 'destructive' });
            if (error.toLowerCase().includes('token')) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.dispatchEvent(new Event("storage"));
                router.push('/login');
            }
        }
    }

    handleResultError(heroBannersResult.error, 'hero banners');
    setHeroBanners(heroBannersResult.data || []);
    
    handleResultError(offerBannersResult.error, 'offer banners');
    setOfferBanners(offerBannersResult.data || []);

    handleResultError(pricesResult.error, 'prices');
    setPrices(pricesResult.data || []);

    setLoading(false);
  }, [toast, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditHero = (banner: Banner) => {
    setSelectedHeroBanner(banner);
    setDialogKey(Date.now());
    setIsHeroDialogOpen(true);
  };
  
  const handleEditOffer = (banner: Banner) => {
    setSelectedOfferBanner(banner);
    setDialogKey(Date.now());
    setIsOfferDialogOpen(true);
  };

  const handleAddHero = () => {
    setSelectedHeroBanner(null);
    setDialogKey(Date.now());
    setIsHeroDialogOpen(true);
  };

  const handleDeleteHero = async (id: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast({ title: 'Error', description: 'Authentication required.', variant: 'destructive' });
      return;
    }
    const result = await deleteBanner(id, token);
    if (result.success) {
      toast({ title: 'Success', description: 'Banner deleted successfully.' });
      fetchData();
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
  };
  
  const handleDeleteOffer = async (id: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast({ title: 'Error', description: 'Authentication required.', variant: 'destructive' });
      return;
    }
    const result = await deleteOfferBannerByAdmin(id, token);
    if (result.success) {
      toast({ title: 'Success', description: 'Offer banner deleted successfully.' });
      fetchData();
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
  };


  const getStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now < start) return { text: 'Scheduled', color: 'bg-blue-100 text-blue-800' };
    if (now > end) return { text: 'Expired', color: 'bg-gray-100 text-gray-800' };
    return { text: 'Active', color: 'bg-green-100 text-green-800' };
  };

  return (
    <main className="p-4 md:p-8 space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Home Page Hero Banners</CardTitle>
            <CardDescription>
              Manage the carousel banners on the main home page.
            </CardDescription>
          </div>
          <Button onClick={handleAddHero}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Banner
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : heroBanners.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg text-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No banners found.</p>
              <p className="text-xs text-muted-foreground">Click "Add Banner" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {heroBanners.map((banner) => {
                const status = getStatus(banner.startDate, banner.endDate);
                return (
                  <div key={banner._id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="relative w-32 h-20 bg-muted rounded-md overflow-hidden">
                      <Image src={banner.image} alt={banner.title} layout="fill" objectFit="cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{banner.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{banner.link}</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        <span>{new Date(banner.startDate).toLocaleDateString()}</span> - <span>{new Date(banner.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={status.color}>{status.text}</Badge>
                        <Button variant="ghost" size="icon" onClick={() => handleEditHero(banner)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                         <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="group">
                                <Trash2 className="h-6 w-6 text-destructive transition-colors group-hover:bg-destructive/10 p-0.5 rounded-sm" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this hero banner.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteHero(banner._id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
            <CardTitle>Purchased Offer Banners</CardTitle>
            <CardDescription>
                List of all active and scheduled offer banners purchased by vendors.
            </CardDescription>
        </CardHeader>
        <CardContent>
             {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : offerBanners.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg text-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No purchased offer banners found.</p>
                </div>
            ) : (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Placement</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {offerBanners.map(banner => {
                                const status = getStatus(banner.startDate, banner.endDate);
                                return (
                                    <TableRow key={banner._id}>
                                        <TableCell>
                                            <div className="relative w-20 h-10 bg-muted rounded-md overflow-hidden">
                                                {banner.image ? (
                                                    <Image src={banner.image} alt={banner.title || 'Banner'} layout="fill" objectFit="cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <ImageIcon className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{banner.uploadedBy?.name || 'N/A'}</TableCell>
                                        <TableCell>{banner.title || "-"}</TableCell>
                                        <TableCell className="capitalize">{banner.place}</TableCell>
                                        <TableCell>{banner.duration} days</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={status.color}>{status.text}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditOffer(banner as Banner)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                             <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="group">
                                                        <Trash2 className="h-6 w-6 text-destructive transition-colors group-hover:bg-destructive/10 p-0.5 rounded-sm" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete this offer banner.
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteOffer(banner._id)}>
                                                        Delete
                                                    </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Offer Banner Pricing</CardTitle>
          <CardDescription>
            Set the pricing for offer banners based on their placement on the page.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="top">
                <TabsList>
                    <TabsTrigger value="top">Top Placement</TabsTrigger>
                    <TabsTrigger value="middle">Middle Placement</TabsTrigger>
                    <TabsTrigger value="bottom">Bottom Placement</TabsTrigger>
                </TabsList>
                <TabsContent value="top" className="pt-4">
                    <PricingForm place="top" prices={prices.find(p => p.place === 'top')} />
                </TabsContent>
                 <TabsContent value="middle" className="pt-4">
                    <PricingForm place="middle" prices={prices.find(p => p.place === 'middle')} />
                </TabsContent>
                 <TabsContent value="bottom" className="pt-4">
                    <PricingForm place="bottom" prices={prices.find(p => p.place === 'bottom')} />
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>

      <BannerDialog 
        key={dialogKey}
        isOpen={isHeroDialogOpen}
        onClose={() => setIsHeroDialogOpen(false)}
        onSuccess={fetchData}
        banner={selectedHeroBanner}
        dialogKey={dialogKey}
      />

       <OfferBannerDialog 
        key={`offer-${dialogKey}`}
        isOpen={isOfferDialogOpen}
        onClose={() => setIsOfferDialogOpen(false)}
        onSuccess={fetchData}
        banner={selectedOfferBanner}
      />
    </main>
  );
}
