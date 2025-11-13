
'use client';
import * as React from 'react';
import { plans, planFeatures } from '@/lib/gnetdial-data';
import { Button } from '@/components/ui/button';
import { Check, X, Info, Star, Loader2, Crown, ArrowUpCircle, MinusCircle, ArrowDownCircle } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { GrowthPlanIcon } from '@/components/icons/AdvertiseIcons';
import { motion } from 'framer-motion';
import { calculateOfferBannerPrice, createOfferBannerOrder, verifyOfferBannerPayment } from '@/app/advertise/actions';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { ToastAction } from '@/components/ui/toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}


const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

const featureIcons: { [key: string]: React.ElementType } = {
  'Search Visibility': () => <Image src="https://picsum.photos/seed/f-sv/24/24" alt="" width={24} height={24} />,
  'Guaranteed Leads': () => <Image src="https://picsum.photos/seed/f-gl/24/24" alt="" width={24} height={24} />,
  'Online Catalogue': () => <Image src="https://picsum.photos/seed/f-oc/24/24" alt="" width={24} height={24} />,
  'Payment Solutions': () => <Image src="https://picsum.photos/seed/f-ps/24/24" alt="" width={24} height={24} />,
  'Smart Lead System': () => <Image src="https://picsum.photos/seed/f-sls/24/24" alt="" width={24} height={24} />,
  'Competitor Analysis': () => <Image src="https://picsum.photos/seed/f-ca/24/24" alt="" width={24} height={24} />,
  'Premium Customer Support': () => <Image src="https://picsum.photos/seed/f-pcs/24/24" alt="" width={24} height={24} />,
  'Trust Stamp': () => <Image src="https://picsum.photos/seed/f-ts/24/24" alt="" width={24} height={24} />,
  'Verified Seal': () => <Image src="https://picsum.photos/seed/f-vs/24/24" alt="" width={24} height={24} />,
};

const PriceDisplay = ({ placement }: { placement: 'top' | 'middle' | 'bottom' }) => {
  const [duration, setDuration] = React.useState<string | undefined>();
  const [calculatedPrice, setCalculatedPrice] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDurationChange = async (value: string) => {
    setDuration(value);
    setLoading(true);
    setCalculatedPrice(null);

    const token = localStorage.getItem('accessToken');
    if (!token) {
        toast({
            title: "Authentication Required",
            description: "Please log in to calculate the price.",
            variant: "destructive",
            action: <ToastAction altText="Login" onClick={() => router.push('/login')}>Login</ToastAction>,
        });
        setLoading(false);
        return;
    }

    const { price, error } = await calculateOfferBannerPrice(placement, parseInt(value), token);
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else {
      setCalculatedPrice(price);
    }
    setLoading(false);
  };
  
  const handleBuyPlacement = async () => {
    if (!duration) {
      toast({
        title: "Duration Not Selected",
        description: "Please select a duration to purchase.",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to purchase an ad placement.",
        variant: "destructive",
        action: <ToastAction altText="Login" onClick={() => router.push('/login')}>Login</ToastAction>,
      });
      return;
    }
    
    setLoading(true);

    const { order, error } = await createOfferBannerOrder(placement, parseInt(duration), token);
    
    if (error || !order) {
        setLoading(false);
        toast({ title: 'Order Creation Failed', description: error || 'Could not create payment order.', variant: 'destructive'});
        return;
    }

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : {};

    const options = {
      key: order.razorpayKeyId,
      amount: order.amount, // amount is in paise
      currency: "INR",
      name: "Gnetdial Ad Placement",
      description: `Payment for ${duration}-day ${placement} banner`,
      order_id: order.orderId,
      handler: async function (response: any) {
        const verificationResult = await verifyOfferBannerPayment(
            order.bannerId,
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            token
        );

        if (verificationResult.success) {
            toast({
                title: "Payment Verified!",
                description: verificationResult.message,
                duration: 10000,
            });
            router.push('/business-dashboard/offers');
        } else {
             toast({
                title: "Payment Verification Failed",
                description: verificationResult.message,
                variant: "destructive",
            });
        }
      },
      prefill: {
        name: user.name || "Gnetdial User",
        email: user.email || "",
        contact: user.phone || ""
      },
      theme: {
        color: "#10b981" 
      }
    };
    
    const rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response: any){
      toast({
        title: "Payment Failed",
        description: response.error.description,
        variant: "destructive",
      });
    });
    
    setLoading(false);
    rzp1.open();
  };

  const priceData = [
    { label: '7 Days', value: '7' },
    { label: '14 Days', value: '14' },
    { label: '21 Days', value: '21' },
    { label: '30 Days', value: '30' },
  ];

  return (
    <div className="p-4 bg-white/50 rounded-lg text-left">
        <Label className="font-semibold">Select Duration:</Label>
        <RadioGroup onValueChange={handleDurationChange} value={duration} className="grid grid-cols-2 gap-2 my-3">
            {priceData.map(item => (
                <div key={item.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={item.value} id={`${placement}-${item.value}`} />
                    <Label htmlFor={`${placement}-${item.value}`} className="text-sm font-normal">{item.label}</Label>
                </div>
            ))}
        </RadioGroup>
        
        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center h-20 flex items-center justify-center">
            {loading && !calculatedPrice ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : (
                calculatedPrice !== null ? (
                    <div>
                        <p className="text-xs text-gray-500">Total Price</p>
                        <p className="font-bold text-2xl text-primary">₹{calculatedPrice.toLocaleString()}</p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">Select a duration to see the price</p>
                )
            )}
        </div>
        <Button className="w-full mt-4 bg-primary hover:bg-primary/90 shadow-md" disabled={!duration || loading} onClick={handleBuyPlacement}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
            Buy {placement.charAt(0).toUpperCase() + placement.slice(1)} Placement
        </Button>
    </div>
  );
};


export function Plans() {

  return (
    <section className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold mb-3 text-gradient-animated">Choose Your Plan</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">Grow and the communities with our awesome features. We have a plan for everyone to grow your business today.</p>
        </motion.div>
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4 min-w-[1000px]">
          {/* Plan Headers */}
          {plans.map((plan, index) => {
            const isGrowthPlan = plan.name === 'Growth';
            return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={isGrowthPlan ? {} : { scale: 1.05, y: -10 }}
              className={cn(
                `flex-1 min-w-[220px] p-6 rounded-2xl text-center relative overflow-hidden shadow-lg transition-all duration-300`,
                plan.highlight 
                  ? 'bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary shadow-xl' 
                  : 'bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200',
                isGrowthPlan && 'lg:min-w-[400px] flex-grow-[2] bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 border-2 border-amber-300'
              )}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.highlight ? 'from-primary/5 to-accent/5' : 'from-gray-100/50 to-transparent'} opacity-0 hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10 flex flex-col h-full">
                {plan.highlight && (
                  <div className="absolute -top-3 -right-3">
                    <Star className="h-10 w-10 text-yellow-400 fill-yellow-400 rotate-12" />
                  </div>
                )}
                {isGrowthPlan && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs font-bold py-1 px-4 rounded-full shadow-lg">
                    PREMIUM
                  </div>
                )}
                {plan.duration && !isGrowthPlan && (
                  <motion.div 
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold py-1 px-3 rounded-full inline-block mb-3 shadow-lg"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {plan.duration}
                  </motion.div>
                )}
                <h3 className="font-bold text-xl flex items-center justify-center gap-2 mb-2 pt-4">
                  {plan.name === 'Growth' ? <Crown className="text-amber-500" /> : <GrowthPlanIcon />}
                  {plan.name}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{plan.subtitle}</p>
                
                <div className="flex-grow">
                  {isGrowthPlan ? (
                      <Tabs defaultValue="top" className="w-full mt-4">
                        <TabsList className="grid w-full grid-cols-3 bg-amber-100/50">
                          <TabsTrigger value="top"><ArrowUpCircle className="w-4 h-4 mr-1"/>Top</TabsTrigger>
                          <TabsTrigger value="middle"><MinusCircle className="w-4 h-4 mr-1"/>Middle</TabsTrigger>
                          <TabsTrigger value="bottom"><ArrowDownCircle className="w-4 h-4 mr-1"/>Bottom</TabsTrigger>
                        </TabsList>
                        <TabsContent value="top">
                          <PriceDisplay placement="top" />
                        </TabsContent>
                        <TabsContent value="middle">
                          <PriceDisplay placement="middle" />
                        </TabsContent>
                        <TabsContent value="bottom">
                          <PriceDisplay placement="bottom" />
                        </TabsContent>
                      </Tabs>
                  ) : (
                    <>
                      {plan.originalPrice && <p className="text-sm text-gray-400 line-through">₹{plan.originalPrice}</p>}
                      <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        ₹{plan.price}<span className="text-sm font-normal text-gray-600">/day</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{plan.priceSubtitle}</p>
                      {plan.discount && (
                        <motion.p 
                          className="text-green-600 font-semibold mt-2"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          {plan.discount}% OFF
                        </motion.p>
                      )}
                    </>
                  )}
                </div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-auto">
                  {!isGrowthPlan && (
                    <Button 
                      variant={plan.highlight ? 'default' : 'outline'} 
                      className={`w-full mt-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
                        plan.highlight 
                          ? 'bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90' 
                          : 'bg-white hover:bg-gray-50 border-2'
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  )}
                </motion.div>
              </div>
            </motion.div>
              )
          })}
        </div>
        
        <motion.div 
          className="mt-6 min-w-[1000px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {planFeatures.map((feature, featureIndex) => (
            <motion.div 
              key={feature.name} 
              className={`flex items-center py-4 border-t hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all duration-300 ${featureIndex === 0 ? 'border-t-2 border-gray-300' : 'border-gray-200'}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: featureIndex * 0.05 }}
            >
              <div className="w-[25%] flex items-center space-x-2 text-sm font-medium">
                {featureIcons[feature.name] && React.createElement(featureIcons[feature.name])}
                <span>{feature.name}</span>
                {feature.info && (
                  <motion.div whileHover={{ scale: 1.2, rotate: 180 }}>
                    <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                  </motion.div>
                )}
              </div>
              {feature.values.map((value, planIndex) => (
                <motion.div 
                  key={planIndex} 
                  className="w-[18.75%] text-center"
                  whileHover={{ scale: 1.1 }}
                >
                  {typeof value === 'boolean' ? (
                    value ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: planIndex * 0.1 }}
                      >
                        <Check className="w-6 h-6 text-green-500 mx-auto" />
                      </motion.div>
                    ) : (
                      <X className="w-6 h-6 text-red-400 mx-auto opacity-50" />
                    )
                  ) : (
                    <span className="text-sm font-semibold text-gray-700">{value}</span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ))}
        </motion.div>
      </div>
      <p className="text-xs text-gray-400 mt-6">* All prices are exclusive of taxes. Package & price are subject to change without any prior notice.</p>
      </div>
    </section>
  );
}
