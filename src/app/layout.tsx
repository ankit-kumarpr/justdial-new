import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';
import { Suspense } from 'react';
import { LocationProvider } from '@/contexts/LocationContext';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gnetdial',
  description: 'Your friendly neighborhood business directory.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <LocationProvider>
          <Suspense>
            <ThemeSwitcher />
          </Suspense>
          {children}
          <Toaster />
        </LocationProvider>
      </body>
    </html>
  );
}
