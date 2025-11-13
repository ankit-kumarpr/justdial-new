
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function FloatingButtons() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        setIsLoggedIn(!!token);
      }
    };
    checkLoginStatus();

    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleFreeListingClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push('/register');
    }
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
      <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground [writing-mode:vertical-rl] rotate-180 h-auto py-2 px-1 rounded-r-md rounded-l-none shadow-lg">
        <Link href="/advertise">Advertise</Link>
      </Button>
      <Button asChild className="bg-secondary hover:bg-secondary/80 text-secondary-foreground [writing-mode:vertical-rl] rotate-180 h-auto py-2 px-1 rounded-r-md rounded-l-none shadow-lg">
        <Link href="/free-listing" onClick={handleFreeListingClick}>Add Business</Link>
      </Button>
    </div>
  );
}
