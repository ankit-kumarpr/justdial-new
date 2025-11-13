'use client';

import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Send, Clock, MessageCircle } from "lucide-react";
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';

export default function ContactPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      <JustdialHeader />
      <FloatingButtons />

      {/* Animated background blobs */}
      <motion.div
        className="fixed top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
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
        className="fixed bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background pt-28 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <MessageCircle className="h-12 w-12 text-primary" />
              <h1 className="text-5xl font-bold text-gray-800">Get in Touch</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We'd love to hear from you! Whether you have a question, feedback, or need assistance, our team is ready to help.
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
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="hover-lift bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-white"/>
                    </div>
                    <span className="text-gray-800">Call Us</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-2">For customer support, business inquiries, or any other questions.</p>
                  <a href="tel:8888888888" className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">88888 88888</a>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="hover-lift bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white"/>
                    </div>
                    <span className="text-gray-800">Email Us</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-2">Send us an email and we'll get back to you as soon as possible.</p>
                  <a href="mailto:support@gnetdial.com" className="text-xl font-bold text-primary hover:text-primary/80 transition-colors break-all">support@gnetdial.com</a>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="hover-lift bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white"/>
                    </div>
                    <span className="text-gray-800">Our Headquarters</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">Gnetdial Ltd. Palm Court Building M, 501/B, 5th Floor, New Link Road, Besides Goregaon Sports Complex, Malad West, Mumbai - 400064</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-bold text-gray-800">Business Hours</h3>
                  </div>
                  <div className="space-y-1 text-gray-700">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="p-6 md:p-8 bg-white/80 backdrop-blur-sm shadow-xl sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                  <Send className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Send a Message</h2>
              </div>
              <form className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="John Doe" 
                    className="mt-1 border-gray-300 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john.doe@example.com" 
                    className="mt-1 border-gray-300 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-gray-700 font-medium">Subject</Label>
                  <Input 
                    id="subject" 
                    type="text" 
                    placeholder="e.g., Feedback" 
                    className="mt-1 border-gray-300 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-gray-700 font-medium">Your Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Write your message here..." 
                    rows={5} 
                    className="mt-1 border-gray-300 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </main>

      <JustdialFooter />
    </motion.div>
  );
}
