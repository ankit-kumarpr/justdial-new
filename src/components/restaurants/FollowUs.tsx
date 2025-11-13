
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

export function FollowUs() {
    return (
        <section className="my-12">
            <h3 className="font-semibold mb-3">Follow us on</h3>
            <div className="flex gap-4">
                <a href="#" aria-label="Facebook"><Facebook className="h-8 w-8 text-gray-500 hover:text-blue-600" /></a>
                <a href="#" aria-label="YouTube"><Youtube className="h-8 w-8 text-gray-500 hover:text-red-600" /></a>
                <a href="#" aria-label="Instagram"><Instagram className="h-8 w-8 text-gray-500 hover:text-pink-500" /></a>
                <a href="#" aria-label="LinkedIn"><Linkedin className="h-8 w-8 text-gray-500 hover:text-blue-700" /></a>
                <a href="#" aria-label="Twitter"><Twitter className="h-8 w-8 text-gray-500 hover:text-sky-500" /></a>
            </div>
        </section>
    );
}
