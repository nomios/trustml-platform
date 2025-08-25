import React from 'react';
import { motion } from 'framer-motion';
import { JourneyIcon1 } from './icons/JourneyIcon1';
import { JourneyIcon2 } from './icons/JourneyIcon2';
import { JourneyIcon3 } from './icons/JourneyIcon3';

const defaultItems = [
  {
    icon: <JourneyIcon1 className="w-6 h-6" />,
    company: 'Fravity (Agentic AI Copilot)',
    role: 'AI Fraud Intelligence Consultant',
    period: 'July 2025 – Present',
    description: 'Leading architecture design for next-generation agentic fraud detection platform, implementing cutting-edge AI models to prevent financial crimes in real-time',
    isCurrent: true
  },
  {
    icon: <JourneyIcon2 className="w-6 h-6" />,
    company: 'Signifyd',
    role: 'Senior Director Risk Intelligence',
    period: 'Feb 2023 - June 2025',
    description: 'Built and scaled AI-powered risk intelligence team of 15+ engineers, deployed machine learning models that improved fraud detection accuracy by 50% and reduced false positives by 35%'
  },
  {
    icon: <JourneyIcon3 className="w-6 h-6" />,
    company: 'Signifyd',
    role: 'Director Risk Intelligence',
    period: 'Sept 2021 - Jan 2023',
    description: 'Established comprehensive KPI frameworks for fraud prevention, accelerated threat detection speed by 60% through automated AI-driven risk assessment systems'
  }
];

export function ProfessionalJourney({
  title = 'AI-Powered Fraud & Risk Intelligence',
  subtitle = 'Pioneering the future of fraud prevention through advanced AI and machine learning. From scaling enterprise risk systems to architecting next-generation agentic fraud intelligence platforms.',
  items = defaultItems,
  'data-id': dataId
}) {
  return (
    <div className="w-full bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8" data-id={dataId}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-300 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </div>
        
        {/* Connected Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-500 via-indigo-400 to-slate-600"></div>
          
          <div className="space-y-8">
            {items.map((item, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className={`flex items-start bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-2xl border transition-all duration-300 hover:bg-slate-800/90 hover:scale-[1.02] ${
                  item.isCurrent ? 'border-indigo-500/50 shadow-indigo-500/20' : 'border-slate-600/70'
                }`}>
                  {/* Icon with connecting line */}
                  <div className={`relative flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white z-10 ${
                    item.isCurrent ? 'ring-4 ring-indigo-500/30 bg-indigo-500' : ''
                  }`}>
                    {item.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="ml-6 flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <h3 className="text-xl font-bold text-white">
                        {item.company}
                      </h3>
                      <span className="text-sm text-slate-400 whitespace-nowrap font-medium">
                        {item.period}
                      </span>
                    </div>
                    
                    <div className="mb-3 flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-slate-200 text-base">
                        {item.role}
                      </span>
                      {item.isCurrent && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/50 text-indigo-200 border border-indigo-400/30 animate-pulse">
                          Current Role
                        </span>
                      )}
                    </div>
                    
                    <p className="text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}