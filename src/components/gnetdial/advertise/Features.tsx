
'use client';
import { features } from '@/lib/gnetdial-data';
import { motion } from 'framer-motion';


export function Features() {
  return (
    <section className="mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4 text-gradient-animated">Powerful Features</h2>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">Everything you need to succeed in growing your business</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <motion.div 
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="flex items-start space-x-4 bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 relative overflow-hidden group"
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${index % 2 === 0 ? 'from-primary/5 to-transparent' : 'from-accent/5 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <motion.div 
              className="flex-shrink-0 relative z-10"
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.6 }}
            >
              {feature.icon}
            </motion.div>
            <div className="relative z-10">
              <h3 className="font-semibold text-lg flex items-center mb-2">
                {feature.title}
                {feature.verified && (
                  <motion.span 
                    className="ml-2 text-xs text-blue-600 font-semibold bg-blue-100 px-3 py-1 rounded-full"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    VERIFIED
                  </motion.span>
                )}
              </h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
