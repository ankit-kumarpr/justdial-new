
'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, PlusCircle, Camera, Search } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { DashboardHeader } from '@/components/justdial/your-dashboard/DashboardHeader';
import { useSearchParams } from 'next/navigation';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

type Certificate = {
    id: number;
    title: string;
    certifiedBy: string;
    month: string;
    year: string;
    photo: File | null;
};

const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

function CertificatesPageComponent() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id');

    const [certificates, setCertificates] = useState<Certificate[]>([
        { id: 1, title: '', certifiedBy: '', month: '', year: '', photo: null },
    ]);

    const addCertificate = () => {
        setCertificates([...certificates, { id: Date.now(), title: '', certifiedBy: '', month: '', year: '', photo: null }]);
    };

    const removeCertificate = (id: number) => {
        setCertificates(certificates.filter(cert => cert.id !== id));
    };

    const handleInputChange = (id: number, field: keyof Certificate, value: any) => {
        setCertificates(certificates.map(cert => cert.id === id ? { ...cert, [field]: value } : cert));
    };

    const handlePhotoUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleInputChange(id, 'photo', e.target.files[0]);
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
            {/* Animated background blobs */}
            <motion.div
                className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    x: [0, -50, 0],
                    y: [0, -30, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <DashboardHeader title="Certificate Details" />

            <main className="flex-grow container mx-auto px-4 py-6 relative z-10">
                <div className="max-w-4xl mx-auto space-y-6">
                    {certificates.map((cert, index) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <CardContent className="p-6 relative z-10">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="font-semibold text-gray-700">Certificate {index + 1}</h2>
                                        {certificates.length > 1 && (
                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-destructive" onClick={() => removeCertificate(cert.id)}>
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </motion.div>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor={`cert-title-${cert.id}`}>Certificate Title</Label>
                                            <Input id={`cert-title-${cert.id}`} placeholder="Certificate Title" value={cert.title} onChange={e => handleInputChange(cert.id, 'title', e.target.value)} className="mt-1" />
                                        </div>
                                        <div>
                                            <Label htmlFor={`certified-by-${cert.id}`}>Certified By</Label>
                                            <Input id={`certified-by-${cert.id}`} placeholder="Certified By" value={cert.certifiedBy} onChange={e => handleInputChange(cert.id, 'certifiedBy', e.target.value)} className="mt-1" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor={`month-${cert.id}`}>Month</Label>
                                                <Select value={cert.month} onValueChange={value => handleInputChange(cert.id, 'month', value)}>
                                                    <SelectTrigger id={`month-${cert.id}`} className="mt-1"><SelectValue placeholder="Month" /></SelectTrigger>
                                                    <SelectContent>
                                                        {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor={`year-${cert.id}`}>Year</Label>
                                                <Select value={cert.year} onValueChange={value => handleInputChange(cert.id, 'year', value)}>
                                                    <SelectTrigger id={`year-${cert.id}`} className="mt-1"><SelectValue placeholder="Year" /></SelectTrigger>
                                                    <SelectContent>
                                                        {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="relative w-24 h-24 rounded-md border bg-gray-100 flex items-center justify-center">
                                                    <Image src={findImage('certificate-sample')} alt="Sample certificate" width={96} height={96} className="object-cover rounded-md"/>
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                                                        <Search className="h-6 w-6"/>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-primary font-semibold">View Sample</span>
                                            </div>

                                            <div className="flex flex-col items-center gap-1">
                                                <Label htmlFor={`cert-photo-${cert.id}`} className="w-24 h-24 rounded-md border-2 border-dashed border-primary/40 bg-primary/5 flex flex-col items-center justify-center cursor-pointer text-primary hover:bg-primary/10 transition-all duration-300">
                                                    {cert.photo ? 
                                                        <Image src={URL.createObjectURL(cert.photo)} alt="Certificate photo preview" width={96} height={96} className="object-cover rounded-md p-1" />
                                                        : 
                                                        <>
                                                            <Camera className="h-8 w-8" />
                                                            <span className="text-xs font-semibold mt-1 text-center">Upload Certificate Photo</span>
                                                        </>
                                                    }
                                                </Label>
                                                <Input type="file" id={`cert-photo-${cert.id}`} className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(cert.id, e)} />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button variant="link" className="text-primary p-0 h-auto" onClick={addCertificate}>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Another Certificate
                        </Button>
                    </motion.div>
                </div>
            </main>

            <footer className="bg-white/80 backdrop-blur-md py-4 border-t border-gray-100 sticky bottom-0 z-20 shadow-lg">
                <div className="container mx-auto px-4">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button className="w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300">Save</Button>
                    </motion.div>
                </div>
            </footer>
        </motion.div>
    );
}

export default function CertificatesPage() {
    return (
        <Suspense>
            <CertificatesPageComponent />
        </Suspense>
    )
}
