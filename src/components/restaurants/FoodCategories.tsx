

import { Card, CardContent } from "@/components/ui/card";
import { foodCategories } from "@/lib/restaurants-data";
import Image from "next/image";
import Link from "next/link";

export function FoodCategories() {
  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {foodCategories.map((category) => (
          <Card key={category.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-3">
              <div className="relative h-32 mb-3 rounded-md overflow-hidden">
                <Image 
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover"
                    data-ai-hint="food category"
                />
              </div>
              <h3 className="font-semibold text-sm mb-2">{category.title}</h3>
              <ul className="space-y-1">
                {category.subItems.map(item => (
                    <li key={item} className="text-xs text-gray-600 hover:text-primary cursor-pointer">{item}</li>
                ))}
                <li>
                    <Link href={`/restaurants/categories/${category.title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="text-xs text-primary font-semibold hover:underline">More</Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
