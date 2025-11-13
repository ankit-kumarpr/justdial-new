'use client';

import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { FloatingButtons } from "@/components/justdial/FloatingButtons";
import { SearchBar } from "@/components/restaurants/list/SearchBar";
import { foodCategories, indianFlavours, italianFlavours, nightlifeFlavours, quickBitesFlavours, sweetToothFlavours, healthFlavours, type SubCategory } from "@/lib/restaurants-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations';
import { UtensilsCrossed, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type CategoryPageProps = {
    params: {
        slug: string;
    }
}

function getCategoryData(slug: string): { title: string; items: SubCategory[] } | null {
    const categoryMap: { [key: string]: { title: string; items: SubCategory[] } } = {
        'indian-mughlai': { title: 'Indian Flavours', items: indianFlavours },
        'italian-continental': { title: 'Italian & Continental', items: italianFlavours },
        'nightlife': { title: 'Nightlife', items: nightlifeFlavours },
        'quick-bites': { title: 'Quick Bites', items: quickBitesFlavours },
        'sweet-tooth': { title: 'Sweet Tooth', items: sweetToothFlavours },
        'health': { title: 'Health', items: healthFlavours }
    };
    const mainCategory = foodCategories.find(cat => cat.title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === slug);
    if (!mainCategory) return null;

    const key = mainCategory.title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
    return categoryMap[key] || { title: mainCategory.title, items: [] };
}


export default function RestaurantCategoryPage({ params }: CategoryPageProps) {
    const categoryData = getCategoryData(params.slug);

    if (!categoryData) {
        notFound();
    }

    return (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
          className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen"
        >
            <JustdialHeader />
            <FloatingButtons />
            
            {/* Enhanced Hero Section with Animated Background */}
            <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background pt-28 pb-12 overflow-hidden">
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

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                      initial={{ opacity: 0, y: -30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <UtensilsCrossed className="h-10 w-10 text-primary" />
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient-animated">
                                {categoryData.title}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-6">
                            <Badge variant="secondary" className="text-sm">
                                {categoryData.items.length} Options Available
                            </Badge>
                        </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <SearchBar />
                    </motion.div>
                </div>

                {/* Decorative wave divider */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                    <svg
                      className="relative block w-full h-12"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 1200 120"
                      preserveAspectRatio="none"
                    >
                        <motion.path
                          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                          fill="#ffffff"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                        />
                    </svg>
                </div>
            </section>

            <main className="container mx-auto px-4 py-12">
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 -mt-8"
                >
                    {categoryData.items.map((item, index) => (
                        <motion.div
                          key={item.name}
                          variants={staggerItem}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          data-testid={`category-item-${index}`}
                        >
                            <Link href="/restaurants/list" passHref>
                                <Card className="hover:shadow-xl transition-all hover-lift border-border/50 backdrop-blur-sm bg-card/80">
                                    <CardContent className="p-4 flex flex-col items-center text-center">
                                        <motion.div 
                                          className="relative w-24 h-24 rounded-full overflow-hidden mb-3 ring-2 ring-primary/10"
                                          whileHover={{ rotate: 5 }}
                                        >
                                            <Image 
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                                data-ai-hint="food type"
                                            />
                                        </motion.div>
                                        <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                                        {item.tag && (
                                            <Badge variant="outline" className="text-xs">
                                                {item.tag}
                                            </Badge>
                                        )}
                                        <ChevronRight className="h-4 w-4 text-muted-foreground mt-2" />
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </main>
            
            <JustdialFooter />
        </motion.div>
    )
}
