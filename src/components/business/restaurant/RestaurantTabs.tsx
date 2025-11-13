
'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Business, Review } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Search } from "lucide-react";
import { StarRating } from "../star-rating";
import { ReviewForm } from "../review-form";
import Image from "next/image";

const menuItems = {
    'Recommended': [
        {name: 'Dal Makhani', price: '₹350', veg: true},
        {name: 'Paneer Butter Masala', price: '₹400', veg: true},
        {name: 'Chicken Tikka', price: '₹450', veg: false},
    ],
    'Main Course': [
        {name: 'Kadai Paneer', price: '₹380', veg: true},
        {name: 'Butter Chicken', price: '₹500', veg: false},
        {name: 'Fish Curry', price: '₹550', veg: false},
    ],
    'Breads': [
        {name: 'Tandoori Roti', price: '₹50', veg: true},
        {name: 'Naan', price: '₹60', veg: true},
        {name: 'Garlic Naan', price: '₹70', veg: true},
    ]
}

const faqs = [
    {
        question: "What are some of the most popular cuisines in Mumbai?",
        answer: "Mumbai offers a diverse range of cuisines. Some of the most popular ones include North Indian, South Indian, Chinese, Italian, and of course, the local Maharashtrian food. You can also find a variety of street food options that are a must-try."
    },
    {
        question: "How can I find restaurants near me?",
        answer: "You can use the Gnetdial app or website to search for restaurants in your vicinity. Just enter your location and the type of cuisine you are looking for, and you will get a list of options with ratings, reviews, and other details."
    }
];

export function RestaurantTabs({ business }: { business: Business }) {
  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="menu">Menu</TabsTrigger>
        <TabsTrigger value="photos">Photos</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      <TabsContent value="about">
        <Card>
            <CardHeader><CardTitle className="text-lg">About {business.name}</CardTitle></CardHeader>
            <CardContent>
                <p className="text-sm text-gray-600 mb-6">{business.description}</p>
                <div className="space-y-4 text-sm">
                    <div>
                        <h4 className="font-semibold mb-2">Opening Hours</h4>
                        <p className="text-gray-600">Open now - 11am to 11pm (Today)</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Highlights</h4>
                        <div className="flex flex-wrap gap-2">
                             {business.cuisines.map(c => <span key={c} className="bg-gray-100 px-2 py-1 rounded-full text-xs">{c}</span>)}
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2">Address</h4>
                        <p className="text-gray-600">{business.address}</p>
                    </div>
                </div>
                 <div className="mt-6">
                    <h3 className="font-semibold mb-2">FAQs</h3>
                     {faqs.map(faq => (
                        <div key={faq.question} className="mb-2">
                            <p className="font-medium text-gray-800">Q: {faq.question}</p>
                            <p className="text-gray-600">A: {faq.answer}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="menu">
         <Card>
            <CardHeader>
                <CardTitle className="text-lg">Menu</CardTitle>
                <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search from menu..." className="pl-9" />
                </div>
            </CardHeader>
            <CardContent>
                {Object.entries(menuItems).map(([category, items]) => (
                    <div key={category} className="mb-6">
                        <h4 className="font-bold text-base mb-2">{category} ({items.length})</h4>
                        <div className="space-y-3">
                            {items.map(item => (
                                <div key={item.name} className="flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-4 h-4 border ${item.veg ? 'border-green-500' : 'border-red-500'} flex items-center justify-center`}>
                                                <div className={`w-2 h-2 rounded-full ${item.veg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            </div>
                                            <p className="font-medium">{item.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-sm">{item.price}</p>
                                        <Button variant="outline" size="sm">Add</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
         </Card>
      </TabsContent>
       <TabsContent value="photos">
        <Card>
            <CardHeader><CardTitle className="text-lg">Photos</CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {business.gallery.map((img, index) => (
                         <div key={index} className="relative aspect-square w-full h-auto rounded-md overflow-hidden">
                            <Image src={img} alt={`${business.name} gallery image ${index + 1}`} fill className="object-cover" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reviews">
        <Card>
            <CardHeader><CardTitle className="text-lg">Reviews</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-4 mb-8">
                     {business.reviews.map((review: Review) => (
                        <div key={review.id} className="border-b pb-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                    {review.author.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold">{review.author}</p>
                                    <StarRating rating={review.rating} size={14} />
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">{review.comment}</p>
                            <p className="text-xs text-gray-400 mt-2">{review.date}</p>
                        </div>
                    ))}
                </div>
                <ReviewForm businessId={business.id} />
            </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
