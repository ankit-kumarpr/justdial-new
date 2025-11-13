'use client';
import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { FloatingButtons } from "@/components/justdial/FloatingButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Target, Handshake, Award, Globe, TrendingUp } from "lucide-react";
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  pageTransition, 
  staggerContainer, 
  staggerItem, 
} from '@/lib/animations';

export default function AboutPage() {
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const timelineVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const cards = [
    {
      icon: Building2,
      title: "Our Company",
      description: "Founded in 1996, Gnetdial has grown to become a leading local search engine, connecting millions of users with businesses every day.",
      color: "primary",
      bgGradient: "from-primary/10 via-primary/5 to-transparent"
    },
    {
      icon: Target,
      title: "Our Mission",
      description: "To provide fast, free, reliable, and comprehensive information to our users and connect them to businesses.",
      color: "accent",
      bgGradient: "from-accent/10 via-accent/5 to-transparent"
    },
    {
      icon: Users,
      title: "Our Team",
      description: "Our team is composed of passionate professionals dedicated to innovation and customer satisfaction, driving our success.",
      color: "primary",
      bgGradient: "from-primary/10 via-primary/5 to-transparent"
    },
    {
      icon: Handshake,
      title: "Our Values",
      description: "We believe in integrity, customer focus, teamwork, and a constant drive for excellence in all that we do.",
      color: "accent",
      bgGradient: "from-accent/10 via-accent/5 to-transparent"
    }
  ];

  const timeline = [
    {
      year: "1996",
      title: "Inception",
      description: "Gnetdial is launched, pioneering the local search industry in India under the live operator-assisted model."
    },
    {
      year: "2007",
      title: "Website and Mobile",
      description: "Launched our internet and mobile internet services, making information accessible on the go."
    },
    {
      year: "2013",
      title: "IPO",
      description: "Gnetdial goes public with its Initial Public Offering, marking a significant milestone in our growth."
    },
    {
      year: "Today",
      title: "Innovation Continues",
      description: "Continuing to innovate with AI-driven search, online transactions, and a vast array of services for millions of users."
    }
  ];

  const achievements = [
    { icon: Award, number: "28+", label: "Years of Excellence" },
    { icon: Users, number: "100M+", label: "Users Served" },
    { icon: Building2, number: "20M+", label: "Business Listings" },
    { icon: Globe, number: "240+", label: "Cities Covered" },
  ];

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
      
      {/* Hero Section with Animated Background */}
      <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background pt-28 pb-20 overflow-hidden">
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
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20"
            >
              <Building2 className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Trusted Since 1996</span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">About Gnetdial</span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              India's No. 1 local search engine, providing comprehensive local search services across the nation.
            </motion.p>
          </motion.div>
        </div>

        {/* Decorative wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-16"
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

      <main className="flex-grow container mx-auto px-4 -mt-8 relative z-20 pb-16">
        {/* Cards Section */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="group"
            >
              <Card className="text-center h-full relative overflow-hidden border-0 shadow-2xl bg-white hover-lift">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <CardHeader className="flex flex-col items-center relative z-10">
                  <motion.div 
                    className={`p-5 bg-gradient-to-br ${card.color === 'primary' ? 'from-primary/20 to-primary/10' : 'from-accent/20 to-accent/10'} rounded-full mb-4 shadow-lg`}
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.1,
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <card.icon className={`h-10 w-10 ${card.color === 'primary' ? 'text-primary' : 'text-accent'}`} />
                  </motion.div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-gray-600 leading-relaxed">{card.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <Card className="bg-gradient-to-br from-primary/5 via-white to-accent/5 rounded-3xl p-12 shadow-2xl border-0 hover-lift relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ backgroundSize: '200% 200%' }}
            />
            
            <div className="relative z-10 grid md:grid-cols-4 gap-8 text-center">
              {achievements.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="group cursor-pointer"
                  >
                    <Icon className="h-12 w-12 mx-auto mb-4 text-primary group-hover:text-accent transition-colors" />
                    <motion.h3 
                      className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {stat.number}
                    </motion.h3>
                    <p className="text-xl text-gray-700 font-medium">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From humble beginnings to industry leadership, explore the milestones that shaped our story
            </p>
          </motion.div>
          
          <div className="relative max-w-5xl mx-auto">
            {/* Animated gradient line */}
            <motion.div 
              className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ transformOrigin: "top" }}
            />

            {timeline.map((item, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={timelineVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className={`relative mb-12 ${
                  index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'
                } md:w-1/2`}
              >
                <div className="ml-16 md:ml-0">
                  {/* Timeline dot */}
                  <motion.div
                    className="absolute left-6 md:left-1/2 top-0 -ml-4 md:-ml-6 w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full border-4 border-white shadow-xl z-10 flex items-center justify-center"
                    whileHover={{ scale: 1.2, rotate: 180 }}
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(178, 178, 178, 0.4)",
                        "0 0 0 10px rgba(178, 178, 178, 0)",
                      ],
                    }}
                    transition={{
                      boxShadow: {
                        duration: 2,
                        repeat: Infinity,
                      },
                    }}
                  >
                    <span className="text-white font-bold text-xs">{index + 1}</span>
                  </motion.div>

                  {/* Content Card */}
                  <motion.div
                    className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-0 hover-lift relative overflow-hidden group"
                    whileHover={{ scale: 1.02, x: index % 2 === 0 ? -5 : 5 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${index % 2 === 0 ? 'from-primary/5 to-transparent' : 'from-accent/5 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="relative z-10">
                      <motion.h3 
                        className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"
                        whileHover={{ scale: 1.05 }}
                      >
                        {item.year} - {item.title}
                      </motion.h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 shadow-2xl border-0 hover-lift text-white relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/50 to-accent/50"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ backgroundSize: '200% 200%' }}
            />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Ready to Grow Your Business?</h2>
              <p className="text-xl mb-8 text-white/90">Join millions of businesses already reaching customers through Gnetdial</p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 h-14 px-8"
                >
                  <Link href="/free-listing">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    List Your Business
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-primary shadow-2xl transition-all duration-300 hover:scale-105 h-14 px-8"
                >
                  <Link href="/advertise">
                    Advertise Now →
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </main>
      
      <JustdialFooter />
    </motion.div>
  );
}
