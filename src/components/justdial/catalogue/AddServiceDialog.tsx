
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ImagePlus, AlertTriangle, PlusCircle, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { createOrUpdateService, type FormState } from '@/app/business-dashboard/catalogue/actions';
import { Loader2 } from 'lucide-react';
import { useActionState } from 'react';

type AddServiceDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialPhoto?: File | null;
  onClose?: () => void;
  onServiceAdded: () => void;
  service?: any | null;
};

export function AddServiceDialog({ isOpen, onOpenChange, initialPhoto, onClose, onServiceAdded, service }: AddServiceDialogProps) {
  const [step, setStep] = useState(1);
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [pricingType, setPricingType] = useState('single');
  const [servicePhoto, setServicePhoto] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [vendorId, setVendorId] = useState<string | null>(null);
  
  const isEditing = !!service;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const initialState: FormState = {};
  const actionToCall = isEditing ? createOrUpdateService.bind(null, service?._id) : createOrUpdateService.bind(null, null);
  const [state, formAction, isPending] = useActionState(actionToCall, initialState);


  useEffect(() => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                setVendorId(JSON.parse(user).id);
            } catch (e) {
                console.error("Failed to parse user from localStorage");
            }
        }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (isEditing && service) {
        setServiceName(service.serviceName || '');
        setDescription(service.description || '');
        setPricingType(service.priceType || 'single');
        if (service.serviceImage) {
            const fullUrl = service.serviceImage.startsWith('http') ? service.serviceImage : `${apiBaseUrl}${service.serviceImage.replace(/\\/g, '/').replace(/^.*uploads/, '/uploads')}`;
            setPreviewUrl(fullUrl);
        } else {
            setPreviewUrl(null);
        }
        setAttachments([]);
        setStep(2);
      } else if (initialPhoto) {
        setServicePhoto(initialPhoto);
        setStep(2);
      } else {
        handleClose(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, service, isEditing, initialPhoto, apiBaseUrl]);


  useEffect(() => {
    if (servicePhoto) {
        const url = URL.createObjectURL(servicePhoto);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    } else if (!isEditing) {
        setPreviewUrl(null);
    }
  }, [servicePhoto, isEditing]);
  
    useEffect(() => {
        if (state.message) {
            if (state.errors) {
                toast({ title: "Error", description: state.message, variant: 'destructive' });
            } else {
                toast({ title: "Success", description: state.message });
                onServiceAdded();
                handleClose();
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, toast, onServiceAdded]);


  const handleContinue = () => {
    if (serviceName.trim() !== '') {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (!initialPhoto && step > 1) {
        setStep(step - 1);
    }
  };
  
  const handleClose = (isResetting = false) => {
    if (!isResetting && onClose) onClose();
    setStep(1);
    setServiceName('');
    setDescription('');
    setPricingType('single');
    setServicePhoto(null);
    setPreviewUrl(null);
    setAttachments([]);
    if (!isResetting) onOpenChange(false);
  }

  const handleAttachmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesToAdd = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...filesToAdd]);
    }
    // Reset file input to allow selecting the same file again
    if (e.target) e.target.value = '';
  };

  const removeAttachment = (indexToRemove: number) => {
    setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const renderPriceInputs = () => {
    switch (pricingType) {
      case 'single':
        return (
          <div className="flex items-center gap-2">
              <div className="flex-1 space-y-1">
                  <Label htmlFor="actualPrice" className="text-xs">Actual Price</Label>
                  <Input id="actualPrice" name="actualPrice" placeholder="₹" defaultValue={service?.actualPrice || ''} />
              </div>
               <div className="flex-1 space-y-1">
                  <Label htmlFor="discountPrice" className="text-xs">Disc. Price</Label>
                  <Input id="discountPrice" name="discountPrice" placeholder="₹" defaultValue={service?.discountPrice || ''} />
              </div>
              <span className="text-gray-400 pt-5">/</span>
               <div className="flex-1 space-y-1">
                  <Label htmlFor="unit" className="text-xs">Unit</Label>
                  <Input id="unit" name="unit" placeholder="e.g. per project" defaultValue={service?.unit || ''}/>
              </div>
          </div>
        );
      case 'range':
        return (
           <div className="flex items-center gap-2">
              <div className="flex-1 space-y-1">
                  <Label htmlFor="minPrice" className="text-xs">Min. Price</Label>
                  <Input id="minPrice" name="minPrice" placeholder="₹" defaultValue={service?.minPrice || ''} />
              </div>
              <div className="flex-1 space-y-1">
                  <Label htmlFor="maxPrice" className="text-xs">Max. Price</Label>
                  <Input id="maxPrice" name="maxPrice" placeholder="₹" defaultValue={service?.maxPrice || ''} />
              </div>
              <span className="text-gray-400 pt-5">/</span>
               <div className="flex-1 space-y-1">
                  <Label htmlFor="unit" className="text-xs">Unit</Label>
                  <Input id="unit" name="unit" placeholder="e.g. per item" defaultValue={service?.unit || ''} />
              </div>
          </div>
        );
      case 'qty_based':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
                <div className="flex-1 space-y-1">
                    <Label htmlFor="qty-from" className="text-xs">Qty. From</Label>
                    <Input id="qty-from" name="quantityPricing[0][from]" placeholder="e.g. 1" />
                </div>
                <div className="flex-1 space-y-1">
                    <Label htmlFor="qty-to" className="text-xs">Qty. To</Label>
                    <Input id="qty-to" name="quantityPricing[0][to]" placeholder="e.g. 10" />
                </div>
                <div className="flex-1 space-y-1">
                    <Label htmlFor="qty-price" className="text-xs">Price</Label>
                    <Input id="qty-price" name="quantityPricing[0][price]" placeholder="₹" />
                </div>
            </div>
            <Button type="button" variant="outline" className="w-full border-dashed">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add another range
            </Button>
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 flex flex-col h-[90vh]">
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
                {!isEditing && step > 1 && !initialPhoto && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBack}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                )}
                <DialogTitle>{isEditing ? 'Update Service' : 'Add a Service'}</DialogTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent hover:text-accent-foreground rounded-full" onClick={() => handleClose()}>
                <X className="h-5 w-5" />
            </Button>
        </DialogHeader>

        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="flex flex-col flex-1">
            <div className="p-6 flex-1">
              <DialogDescription className="mb-4">
                Enter the name of the service you want to add to your catalogue.
              </DialogDescription>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="service-name" className="text-right">
                    Service Name
                  </Label>
                  <Input
                    id="service-name"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., Website Development"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="p-4 border-t mt-auto flex-shrink-0">
              <Button type="submit" disabled={!serviceName.trim()}>Continue</Button>
            </DialogFooter>
          </form>
        )}

        {step === 2 && (
            <form action={formAction} ref={formRef} className='flex flex-col min-h-0'>
                {vendorId && <input type="hidden" name="vendorId" value={vendorId} />}
                {typeof window !== 'undefined' && <input type="hidden" name="token" value={localStorage.getItem('accessToken') || ''} />}
                {servicePhoto && <input type="file" name="serviceImage" value={undefined} className="hidden" ref={(node) => {
                    if (node) {
                      const dataTransfer = new DataTransfer();
                      dataTransfer.items.add(servicePhoto);
                      node.files = dataTransfer.files;
                    }
                }}/>}
                 {attachments.map((file, index) => (
                    <input
                        key={index}
                        type="file"
                        name="attachments"
                        value={undefined}
                        className="hidden"
                        ref={(node) => {
                            if (node) {
                                const dataTransfer = new DataTransfer();
                                dataTransfer.items.add(file);
                                node.files = dataTransfer.files;
                            }
                        }}
                    />
                 ))}

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                       {previewUrl ? (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                                <Image src={previewUrl} alt="Service photo preview" layout="fill" objectFit="cover" />
                            </div>
                        ) : (
                             <Label htmlFor="serviceImage" className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer">
                                <ImagePlus className="h-10 w-10 text-blue-500 mb-2" />
                                <h3 className="font-semibold text-blue-600">Add a Service Photo</h3>
                                <p className="text-xs text-gray-500 mt-1">Recommended Size: 1000 px X 1000 px</p>
                                <Input id="serviceImage" name="serviceImage" type="file" className="hidden" />
                            </Label>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="serviceName">Service Name</Label>
                            <Input id="serviceName" name="serviceName" defaultValue={serviceName} />
                             {state?.errors?.serviceName && <p className="text-xs text-red-500 mt-1">{state.errors.serviceName[0]}</p>}
                        </div>

                        <div className="space-y-3">
                            <Label>Select Pricing Type</Label>
                            <ToggleGroup type="single" name="priceType" value={pricingType} onValueChange={(value) => value && setPricingType(value)} className="w-full grid grid-cols-3 border rounded-md overflow-hidden">
                               <ToggleGroupItem value="single" className={cn("rounded-none data-[state=on]:bg-primary data-[state=on]:text-white", pricingType !== 'single' && 'hover:bg-gray-100')}>Single Price</ToggleGroupItem>
                               <ToggleGroupItem value="range" className={cn("rounded-none border-l data-[state=on]:bg-primary data-[state=on]:text-white", pricingType !== 'range' && 'hover:bg-gray-100')}>Price Range</ToggleGroupItem>
                               <ToggleGroupItem value="qty_based" className={cn("rounded-none border-l data-[state=on]:bg-primary data-[state=on]:text-white text-xs p-1 leading-tight h-auto", pricingType !== 'qty_based' && 'hover:bg-gray-100')}>Price based on Qty. Range</ToggleGroupItem>
                            </ToggleGroup>
                            
                            {renderPriceInputs()}
                            
                             <div className="bg-yellow-100 border border-yellow-200 text-yellow-800 text-sm p-3 rounded-md flex items-start gap-2">
                                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <p>Add Pricing Details to Get More Relevant Leads</p>
                            </div>
                        </div>

                         <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <div className="relative">
                               <Textarea id="description" name="description" placeholder="Enter service description" defaultValue={description} />
                            </div>
                            <div className="text-right text-xs text-gray-500">{description.length}/8000 Characters</div>
                        </div>
                        
                        {!isEditing && (
                             <div className="space-y-3">
                              <Label>Attach Files</Label>
                              <div className="bg-yellow-100 border border-yellow-200 text-yellow-800 text-xs p-3 rounded-md flex items-start gap-2">
                                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                  <p>Upload up to 5 files of 25 MB each. Supported formats are images, PDF and Microsoft Office Documents.</p>
                              </div>
                              {attachments.length > 0 && (
                                <div className="space-y-2">
                                  {attachments.map((file, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                                      <span className="text-sm truncate flex-1">{file.name}</span>
                                      <Button type="button" variant="ghost" size="icon" onClick={() => removeAttachment(index)} className="h-6 w-6">
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                               <Button type="button" variant="outline" className="w-full rounded-full" onClick={() => attachmentsInputRef.current?.click()}>
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  Attach Files
                               </Button>
                               <Input 
                                 ref={attachmentsInputRef}
                                 type="file"
                                 className="hidden" 
                                 multiple 
                                 onChange={handleAttachmentsChange} 
                                 accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                               />
                            </div>
                        )}
                    </div>
                </ScrollArea>
                 <DialogFooter className="p-4 border-t mt-auto flex-shrink-0">
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? 'Update Service' : 'Save'}
                    </Button>
                </DialogFooter>
            </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
