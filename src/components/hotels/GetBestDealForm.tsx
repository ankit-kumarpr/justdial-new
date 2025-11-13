
'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function GetBestDealForm() {
    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle className="text-base">Get the List of Top Hotels</CardTitle>
                <p className="text-xs text-gray-500">We'll send you contact details in seconds for free</p>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                    <div>
                        <Label className="text-sm font-medium">What type of hotel are you looking for?</Label>
                        <RadioGroup defaultValue="budget" className="flex gap-4 mt-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="budget" id="budget" />
                                <Label htmlFor="budget" className="font-normal">Budget</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="luxury" id="luxury" />
                                <Label htmlFor="luxury" className="font-normal">Luxury</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="others" id="others" />
                                <Label htmlFor="others" className="font-normal">Others</Label>
                            </div>
                        </RadioGroup>
                    </div>
                     <div>
                        <Label htmlFor="name" className="sr-only">Name</Label>
                        <Input id="name" placeholder="ASHISH" />
                    </div>
                     <div>
                         <Label htmlFor="phone" className="sr-only">Phone</Label>
                        <Input id="phone" placeholder="8329863637" />
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Best Deal &gt;&gt;</Button>
                </form>
            </CardContent>
        </Card>
    )
}
