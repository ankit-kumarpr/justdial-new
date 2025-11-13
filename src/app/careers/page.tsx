'use client';

import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, ArrowRight, Briefcase, Users, TrendingUp, Heart } from "lucide-react";
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';

const jobOpenings = [
  { title: "Senior Software Engineer", department: "Technology", location: "Mumbai", type: "Full-time" },
  { title: "Product Manager - Mobile", department: "Product", location: "Bangalore", type: "Full-time" },
  { title: "Digital Marketing Specialist", department: "Marketing", location: "Delhi", type: "Full-time" },
  { title: "UX/UI Designer", department: "Design", location: "Pune", type: "Full-time" },
  { title: "Data Scientist", department: "Data Science", location: "Hyderabad", type: "Full-time" },
  { title: "Sales Executive", department: "Sales", location: "Mumbai", type: "Full-time" }
];

const perks = [
  { title: 'Competitive Salary', icon: TrendingUp, description: 'Industry-leading compensation packages' },
  { title: 'Great Team', icon: Users, description: 'Work with talented professionals' },
  { title: 'Work-Life Balance', icon: Heart, description: 'Flexible hours and remote options' },
  { title: 'Career Growth', icon: Briefcase, description: 'Learning and development opportunities' },
];

export default function CareersPage() {
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

      <main className="flex-grow relative z-10">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary via-primary/90 to-accent text-white py-24 overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Briefcase className="h-12 w-12" />
                <h1 className="text-5xl md:text-6xl font-extrabold">Join Our Team</h1>
              </div>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                Be a part of a dynamic and innovative company that's shaping the future of local search in India.
              </p>
            </motion.div>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </section>

        {/* Perks Section */}
        <section className="py-16 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Join Us?</h2>
            <div className="grid md:grid-cols-4 gap-6 mb-16">
              {perks.map((perk, index) => (
                <motion.div
                  key={perk.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                >
                  <Card className="text-center hover-lift bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
                          <perk.icon className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">{perk.title}</h3>
                      <p className="text-sm text-gray-600">{perk.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Job Openings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Current Openings</h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {jobOpenings.map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                >
                  <Card className="hover-lift bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-primary mb-1">{job.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{job.department}</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{job.location}</span>
                          </div>
                          <span className="text-gray-500">{job.type}</span>
                        </div>
                      </div>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md" asChild>
                        <a href="#">
                          Apply Now <ArrowRight className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
        
        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="bg-gradient-to-br from-primary/10 to-accent/10 py-16"
        >
          <div className="container mx-auto px-4 text-center">
            <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-8">
                <Briefcase className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Don't see a role for you?</h2>
                <p className="text-lg text-gray-600 mb-8">We're always looking for talented people. Send us your resume!</p>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md px-8">
                  Submit Your Resume
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.section>
      </main>

      <JustdialFooter />
    </motion.div>
  );
}
