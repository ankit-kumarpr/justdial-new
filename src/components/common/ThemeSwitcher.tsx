
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Palette, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';

const themes = [
  { name: 'default', className: '' },
  { name: 'blue', className: 'theme-blue' },
  { name: 'green', className: 'theme-green' },
  { name: 'orange', className: 'theme-orange' },
  { name: 'cyan', className: 'theme-cyan' },
];

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');
  const switcherRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const checkUserRole = () => {
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          const user = JSON.parse(userString);
          setIsSuperAdmin(user?.role === 'superadmin');
        } catch (e) {
          setIsSuperAdmin(false);
        }
      } else {
        setIsSuperAdmin(false);
      }
    };

    checkUserRole();
    window.addEventListener('storage', checkUserRole);
    return () => window.removeEventListener('storage', checkUserRole);
  }, []);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'default';
    setCurrentTheme(savedTheme);
    document.body.className = themes.find(t => t.name === savedTheme)?.className || '';
  }, []);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [switcherRef]);

  const handleThemeChange = (themeName: string) => {
    setCurrentTheme(themeName);
    const theme = themes.find(t => t.name === themeName);
    document.body.className = theme?.className || '';
    localStorage.setItem('app-theme', themeName);
  };

  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/super-admin');

  if (!isMounted || isSuperAdmin) {
    return null;
  }
  
  const switcherClasses = cn(
    'fixed top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ease-in-out',
    isAdminRoute && !isMobile
      ? 'group-data-[state=expanded]:left-[16rem] group-data-[state=collapsed]:left-[3rem]'
      : 'left-0',
    !isOpen && (isAdminRoute && !isMobile ? '' : '-translate-x-full')
  );

  return (
    <div
      ref={switcherRef}
      className={switcherClasses}
    >
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="secondary"
          size="icon"
          className="absolute left-full top-1/2 -translate-y-1/2 rounded-l-none shadow-lg"
        >
          {isOpen ? <ChevronLeft /> : <Palette />}
        </Button>
        <div className="bg-background border-r border-t border-b p-4 rounded-r-lg shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5" />
            <h3 className="font-semibold">Customize Theme</h3>
          </div>
          <div className="flex flex-col gap-2">
            {themes.map(theme => (
              <Button
                key={theme.name}
                variant={currentTheme === theme.name ? 'default' : 'outline'}
                className={cn('w-full justify-start', theme.className)}
                onClick={() => handleThemeChange(theme.name)}
              >
                <span className="w-4 h-4 rounded-full mr-2 bg-primary border" />
                {theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
