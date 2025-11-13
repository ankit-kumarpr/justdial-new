
import { jdFooterLinks } from '@/lib/justdial-data';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import Link from 'next/link';

export function JustdialFooter() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 pt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-8">
          <div>
            <h4 className="font-semibold mb-3 text-gray-800">Popular Categories</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {jdFooterLinks.popularCategories.map(link => <li key={link}><a href="#" className="hover:text-accent">{link}</a></li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-800">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {jdFooterLinks.quickLinks.map(link => (
                <li key={link.name}><Link href={link.href} className="hover:text-accent">{link.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-800">Top Cities</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {jdFooterLinks.topCities.map(link => <li key={link}><a href="#" className="hover:text-accent">{link}</a></li>)}
            </ul>
          </div>
          <div>
             <h4 className="font-semibold mb-3 text-gray-800">About</h4>
            <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about" className="hover:text-accent">About us</Link></li>
                <li><Link href="/careers" className="hover:text-accent">Careers</Link></li>
                <li><Link href="/contact" className="hover-text-accent">Contact Us</Link></li>
            </ul>
          </div>
           <div className="col-span-2">
            <h4 className="font-semibold mb-3 text-gray-800">Follow us on</h4>
            <div className="flex gap-4 mb-6">
                <a href="#" aria-label="Facebook"><Facebook className="h-6 w-6 text-gray-500 hover:text-blue-600" /></a>
                <a href="#" aria-label="Twitter"><Twitter className="h-6 w-6 text-gray-500 hover:text-sky-500" /></a>
                <a href="#" aria-label="Instagram"><Instagram className="h-6 w-6 text-gray-500 hover:text-pink-500" /></a>
                <a href="#" aria-label="LinkedIn"><Linkedin className="h-6 w-6 text-gray-500 hover:text-blue-700" /></a>
                <a href="#" aria-label="YouTube"><Youtube className="h-6 w-6 text-gray-500 hover:text-red-600" /></a>
            </div>
             <h4 className="font-semibold mb-3 text-gray-800">Download the App</h4>
            <div className="flex items-center gap-4">
                <a href="#" aria-label="Download on the App Store">
                    <img src="https://content.jdmagicbox.com/images_new/jstbrows/appstore.svg" alt="App Store" className="h-10"/>
                </a>
                <a href="#" aria-label="Get it on Google Play">
                    <img src="https://content.jdmagicbox.com/images_new/jstbrows/gplay.svg" alt="Google Play" className="h-10"/>
                </a>
            </div>
          </div>
        </div>
        
        <div className="py-6 text-center text-xs text-gray-500 border-t border-gray-200 dark:border-gray-700">
          <p>Copyright © 2008-2024 Gnetdial Ltd. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/terms-conditions" className="hover:underline">Terms of Use</Link>
            <Link href="/policy" className="hover:underline">Privacy Policy</Link>
            <a href="#" className="hover:underline">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
