
'use client';
import { Button } from "@/components/ui/button";
import { restaurantQuickActions } from "@/lib/restaurants-data";
import Link from "next/link";

export function QuickActions() {
    return (
        <div className="flex justify-center gap-4 my-6">
            {restaurantQuickActions.map((action) => {
                const isBookTable = action.title === 'Book A Table';
                const isTrending = action.title === 'WHAT\'S TRENDING!';
                const isOrderFood = action.title === 'ORDER FOOD';
                
                let href = "#";
                if (isBookTable) href = "/restaurants/list";
                if (isTrending) href = "/restaurants/trending";
                if (isOrderFood) href = "/restaurants/order";

                const buttonContent = (
                    <>
                        <span className="text-2xl">{action.icon}</span>
                        <div>
                            <p className="font-semibold text-primary">{action.title}</p>
                            <p className="text-xs text-gray-500">{action.subtitle}</p>
                        </div>
                    </>
                );

                if (isBookTable || isTrending || isOrderFood) {
                    return (
                        <Link key={action.title} href={href} passHref>
                            <Button variant="outline" className="flex items-center gap-3 p-4 h-auto border-gray-300 shadow-sm hover:shadow-md hover:bg-gray-50">
                                {buttonContent}
                            </Button>
                        </Link>
                    );
                }
                
                return (
                    <Button key={action.title} variant="outline" className="flex items-center gap-3 p-4 h-auto border-gray-300 shadow-sm hover:shadow-md hover:bg-gray-50">
                        {buttonContent}
                    </Button>
                );
            })}
        </div>
    );
}
