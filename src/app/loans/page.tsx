'use client';

import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { FloatingButtons } from "@/components/justdial/FloatingButtons";
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations';
import { DollarSign, Home, Car, GraduationCap, CreditCard, TrendingUp, Shield, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const loanTypes = [
  { icon: Home, title: 'Home Loan', rate: '8.5%', description: 'Low interest rates for your dream home' },
  { icon: Car, title: 'Car Loan', rate: '9.2%', description: 'Drive your dream car today' },
  { icon: GraduationCap, title: 'Education Loan', rate: '7.8%', description: 'Invest in your future' },
  { icon: CreditCard, title: 'Personal Loan', rate: '10.5%', description: 'Quick approval for urgent needs' },
];

const features = [
  { icon: TrendingUp, title: 'Low Interest Rates', description: 'Starting from 7.8% p.a.' },
  { icon: Clock, title: 'Quick Approval', description: 'Get approved in 24 hours' },
  { icon: Shield, title: 'Secure Process', description: '100% safe and transparent' },
];

export default function LoansPage() {
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
      
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background pt-28 pb-16 overflow-hidden">
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
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, 0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block mb-6"
            >
              <DollarSign className="h-16 w-16 text-primary mx-auto" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-gradient-animated">
              Financial Services & Loans
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Get the best loan options tailored to your needs
            </p>
            
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={staggerItem}>
                  <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover-lift">
                    <CardContent className="p-6 text-center">
                      <feature.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Loan Calculator Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-card/90 backdrop-blur-sm border-border/50 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Calculate Your EMI</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input placeholder="Loan Amount" className="h-12" data-testid="loan-amount-input" />
                    <Input placeholder="Interest Rate (%)" className="h-12" data-testid="interest-rate-input" />
                    <Input placeholder="Tenure (Years)" className="h-12" data-testid="tenure-input" />
                    <Button size="lg" className="h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90" data-testid="calculate-emi-btn">
                      Calculate EMI
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
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

      {/* Loan Types Section */}
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 text-sm px-4 py-2">Loan Options</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Loan Type</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find the perfect financing solution for your needs
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-8"
        >
          {loanTypes.map((loan, index) => (
            <motion.div key={index} variants={staggerItem}>
              <Card className="h-full hover-lift border-border/50 backdrop-blur-sm bg-card/80 group">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <loan.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">{loan.title}</h3>
                  <div className="text-center mb-3">
                    <span className="text-2xl font-bold text-primary">{loan.rate}</span>
                    <span className="text-sm text-muted-foreground ml-1">p.a.</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-center mb-4">{loan.description}</p>
                  <Button className="w-full" variant="outline" data-testid={`apply-${loan.title.toLowerCase().replace(' ', '-')}-btn`}>
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Need Help Choosing the Right Loan?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our financial experts are here to guide you through the process and help you find the best loan option
              </p>
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                Talk to an Expert
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      <JustdialFooter />
    </motion.div>
  );
}
