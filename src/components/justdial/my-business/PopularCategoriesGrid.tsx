import { popularCategories } from '@/lib/my-business-data';
import Link from 'next/link';

export function PopularCategoriesGrid() {
    return (
        <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Popular Categories</h2>
            <div className="border-t pt-4">
                <div className="columns-2 md:columns-4 lg:columns-6">
                    {popularCategories.map((category, index) => (
                        <Link
                            key={index}
                            href="#"
                            className="block text-sm text-gray-600 hover:text-accent mb-2 break-inside-avoid"
                        >
                            {category}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
