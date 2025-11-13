'use client';

import { JustdialHeader } from '@/components/justdial/JustdialHeader';
import { JustdialFooter } from '@/components/justdial/JustdialFooter';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';
import { Button } from '@/components/ui/button';
import { Sparkles, Star, MessageSquare, TrendingUp, QrCode } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { pageTransition, fadeInUp, scaleIn, staggerContainer, staggerItem } from '@/lib/animations';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export default function ReviewsPage() {
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
      <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background pt-28 pb-16 overflow-hidden">
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
              <Star className="h-10 w-10 text-primary fill-primary" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient-animated">
                Customer Reviews
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Manage and respond to your customer feedback
            </p>
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
        {/* AI Response Feature Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="-mt-24 mb-8"
        >
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-6 border-2 border-primary/20 shadow-xl backdrop-blur-sm">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-8 w-8 text-primary" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-xl text-foreground flex items-center gap-2">
                    Auto AI Response to Reviews
                    <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full font-bold">NEW</span>
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    Let AI automatically respond to customer reviews professionally
                  </p>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg whitespace-nowrap"
                  data-testid="enable-ai-btn"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Enable Now
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-card rounded-2xl shadow-xl border border-border/50 p-12 backdrop-blur-sm"
        >
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className="flex justify-center mb-8"
            >
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 3, 0, -3, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                <Image 
                  src={findImage('no-reviews-illustration')}
                  alt="No reviews yet"
                  width={250}
                  height={250}
                  className="drop-shadow-2xl"
                  data-ai-hint="sad document mascot"
                />
              </motion.div>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium">Build Your Reputation</span>
              </div>
              
              <h2 className="text-3xl font-bold text-foreground mb-4">
                No Reviews Yet?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Ask your customers for reviews and boost your business credibility today!
              </p>
              
              {/* Action Cards */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-3 gap-4 mb-8"
              >
                <motion.div
                  variants={staggerItem}
                  className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-xl border border-primary/20 hover-lift"
                >
                  <Star className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Get More Reviews</h4>
                  <p className="text-sm text-muted-foreground">Increase your rating</p>
                </motion.div>
                
                <motion.div
                  variants={staggerItem}
                  className="bg-gradient-to-br from-accent/5 to-accent/10 p-6 rounded-xl border border-accent/20 hover-lift"
                >
                  <TrendingUp className="h-8 w-8 text-accent mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Boost Visibility</h4>
                  <p className="text-sm text-muted-foreground">Rank higher in search</p>
                </motion.div>
                
                <motion.div
                  variants={staggerItem}
                  className="bg-gradient-to-br from-chart-2/5 to-chart-2/10 p-6 rounded-xl border border-chart-2/20 hover-lift"
                >
                  <QrCode className="h-8 w-8 text-chart-2 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Easy QR Access</h4>
                  <p className="text-sm text-muted-foreground">Quick review collection</p>
                </motion.div>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 shadow-lg w-full sm:w-auto"
                    data-testid="get-reviews-btn"
                  >
                    <Star className="mr-2 h-5 w-5" />
                    Get Reviews
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-primary/20 hover:bg-primary/5 px-8 w-full sm:w-auto"
                    data-testid="share-qr-btn"
                  >
                    <QrCode className="mr-2 h-5 w-5" />
                    Share Ratings QR
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
      
      <JustdialFooter />
    </motion.div>
  );
}
