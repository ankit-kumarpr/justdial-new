'use client';

import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { FloatingButtons } from "@/components/justdial/FloatingButtons";
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem, fadeInUp } from '@/lib/animations';
import { Truck, Package, Shield, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const services = [
  { icon: Package, title: 'Packing Services', description: 'Professional packing with quality materials' },
  { icon: Truck, title: 'Transportation', description: 'Safe and timely vehicle transport' },
  { icon: Shield, title: 'Insurance Coverage', description: 'Comprehensive protection for your goods' },
  { icon: MapPin, title: 'Door-to-Door Service', description: 'Complete relocation solution' },
];

const features = [
  { icon: Clock, title: 'On-Time Delivery', value: '98%' },
  { icon: Shield, title: 'Insured Transport', value: '100%' },
  { icon: Truck, title: 'Fleet Size', value: '500+' },
];

export default function PackersAndMoversPage() {
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
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block mb-6"
            >
              <Truck className="h-16 w-16 text-primary mx-auto" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-gradient-animated">
              Packers & Movers
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Hassle-free moving and relocation services you can trust
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
                      <p className="text-3xl font-bold text-foreground mb-1">{feature.value}</p>
                      <p className="text-sm text-muted-foreground">{feature.title}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Quote Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-card/90 backdrop-blur-sm border-border/50 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Get Free Quote</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input placeholder="Your Name" className="h-12" data-testid="name-input" />
                    <Input placeholder="Phone Number" className="h-12" data-testid="phone-input" />
                    <Input placeholder="From Location" className="h-12" data-testid="from-input" />
                    <Button size="lg" className="h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90" data-testid="get-quote-btn">
                      Get Quote
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

      {/* Services Section */}
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 text-sm px-4 py-2">Our Services</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Moving Solutions</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From packing to unpacking, we handle everything with care
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-8"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={staggerItem}>
              <Card className="h-full hover-lift border-border/50 backdrop-blur-sm bg-card/80">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Section */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Need Immediate Assistance?</h3>
              <p className="text-muted-foreground mb-6">Our team is available 24/7 to help you</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </Button>
                <Button size="lg" variant="outline">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      <JustdialFooter />
    </motion.div>
  );
}
