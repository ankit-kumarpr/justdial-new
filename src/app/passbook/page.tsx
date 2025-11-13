
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronLeft, Grip, User, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { pageTransition, fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import { JustdialHeader } from '@/components/justdial/JustdialHeader';
import { JustdialFooter } from '@/components/justdial/JustdialFooter';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export default function PassbookPage() {
  const [filter, setFilter] = useState('1m');

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen flex flex-col"
    >
      <JustdialHeader />
      <FloatingButtons />

      {/* Animated background blobs */}
      <motion.div
        className="fixed top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
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
        className="fixed bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"
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

      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/leads" passHref>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 cursor-pointer">
                <h1 className="font-semibold text-lg">Xncoder</h1>
                <ChevronDown className="h-4 w-4" />
              </div>
              <p className="text-sm text-gray-500">Kamal Chowk, Nagpur</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-accent"/>
              <div className="text-sm">
                <p className="font-semibold">Customer</p>
                <p className="text-gray-500">Support</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4" />
            <Button variant="ghost" size="icon" asChild>
                <Link href="/my-business">
                    <Grip className="h-6 w-6 text-gray-600" />
                </Link>
            </Button>
          </div>
        </div>
        <div className="container mx-auto px-4 py-3 border-t">
          <div className="flex justify-between items-center">
            <Button variant="link" className="text-accent font-semibold p-0">Passbook</Button>
            <div className="flex items-center gap-4">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-32 bg-white">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Month</SelectItem>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex-1 flex flex-col relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex flex-col items-center justify-center text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl"
          >
            <Image 
              src={findImage('no-passbook-illustration')!}
              alt="No passbook details found"
              width={250}
              height={250}
              className="mx-auto mb-6 drop-shadow-lg"
              data-ai-hint="sad document mascot"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Passbook Details Found</h2>
            <p className="text-gray-500">Your transaction history will appear here</p>
          </motion.div>
        </motion.div>
      </main>

      <JustdialFooter />
    </motion.div>
  );
}
