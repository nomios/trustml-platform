import React from "react";
import { motion } from "framer-motion";
import { Heart, Briefcase, Target, Flower, TrendingUp, Shield, Globe, Users, Star } from "lucide-react";

import { JourneyIcon1 } from "./icons/JourneyIcon1";
import { JourneyIcon2 } from "./icons/JourneyIcon2";
import { JourneyIcon3 } from "./icons/JourneyIcon3";

const Container = ({ children, className = "" }) => (
  <div className={`max-w-7xl mx-auto px-6 ${className}`}>{children}</div>
);

const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg";
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40",
    secondary: "bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 backdrop-blur-sm",
    outline: "border-2 border-white text-white hover:bg-white hover:text-indigo-600"
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const DriveCard = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-slate-800/70 text-center shadow-2xl backdrop-blur-sm transition-all duration-300 border border-slate-700/70 rounded-xl p-6"
  >
    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-500 rounded-full">
      <Icon className="h-8 w-8 text-white" />
    </div>
    <h3 className="text-xl leading-7 font-bold text-white mb-3">
      {title}
    </h3>
    <p className="leading-[26px] text-slate-300 m-0">
      {description}
    </p>
  </motion.div>
);



const ProfessionalJourneySection = () => {
  const journeyItems = [
    {
      icon: <JourneyIcon1 className="w-6 h-6" />,
      company: 'AI Fraud Intelligence Consultant',
      role: 'Fravity (Agentic AI Copilot)',
      description: 'Advising an early-stage startup building human-in-the-loop fraud platform that combines autonomous agent intelligence with expert decision-making. Shaping their approach to identity verification, bot detection, and adaptive risk scoring using agentic AI frameworks.',
      isCurrent: true
    },
    {
      icon: <JourneyIcon2 className="w-6 h-6" />,
      company: 'Signifyd',
      role: 'Senior Director Risk Intelligence',
      description: 'Led transformation to AI-powered risk intelligence organization, implementing automated anomaly detection, KPI frameworks, and AI powered analysis for analyst enablement.'
    },
    {
      icon: <JourneyIcon3 className="w-6 h-6" />,
      company: 'OfferUp',
      role: 'Head of Trust and Safety',
      description: 'Built a comprehensive trust and safety program from zero, implementing real-time fraud detection, behavioral risk models, and ML-powered enforcement systems. Scaled team from 1 to 50+ people while establishing clear OKRs, operational frameworks, and identity verification protocols that protected millions of marketplace transactions.'
    },
    {
      icon: <JourneyIcon2 className="w-6 h-6" />,
      company: 'eBay',
      role: 'Senior Manager Trust Science',
      description: 'Built foundational fraud detection infrastructure processing millions of transactions daily, establishing the scalable architecture that evolved into modern AI-powered risk systems. Pioneered early machine learning applications for payment fraud, account takeover prevention, and seller risk assessment.'
    },
    {
      icon: <JourneyIcon3 className="w-6 h-6" />,
      company: 'Early Career Foundation',
      role: 'Various eBay Risk Roles',
      description: 'Developed core competencies in risk modeling, fraud pattern recognition, and identity verification systems. Built early detection systems and behavioral analytics models, laying the groundwork for future expertise in AI-driven trust and safety solutions.'
    }
  ];

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-500 via-indigo-400 to-slate-600"></div>

      <div className="space-y-8">
        {journeyItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
          >
            <div className={`flex items-start bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-2xl border transition-all duration-300 hover:bg-slate-800/90 hover:scale-[1.02] ${item.isCurrent ? 'border-indigo-500/50 shadow-indigo-500/20' : 'border-slate-600/70'
              }`}>
              {/* Icon with connecting line */}
              <div className={`relative flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white z-10 ${item.isCurrent ? 'ring-4 ring-indigo-500/30 bg-indigo-500' : ''
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
  );
};

const ExpertiseSection = () => {
  const driveAreas = [
    {
      icon: Shield,
      title: "Proven Results",
      description: "Track record of building systems that scale to billions of decisions and achieve measurable impact on platform safety."
    },
    {
      icon: Flower,
      title: "Innovation Leader",
      description: "Early adopter of AI/ML in risk detection, staying ahead of emerging threats with cutting-edge technology."
    },
    {
      icon: Users,
      title: "Team Builder",
      description: "Experience scaling teams from individual contributor to 50+ person organizations with clear operational frameworks."
    },
    {
      icon: Globe,
      title: "Enterprise Scale",
      description: "Built and operated trust systems for global platforms serving millions of users across diverse markets."
    }
  ];

  const stats = [
    { value: "1999", label: "Started at eBay" },
    { value: "25+", label: "Years Experience" },
    { value: "4", label: "Major Platforms" },
    { value: "1B+", label: "Decisions Built" }
  ];

  return (
    <section id="expertise" className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 scroll-mt-16 md:scroll-mt-20 lg:scroll-mt-24 xl:scroll-mt-36 2xl:scroll-mt-40">
      <Container>
        {/* About Section */}
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center bg-indigo-700/50 text-sm leading-5 font-medium text-indigo-300 rounded-full py-2 px-4">
              <Heart className="w-4 h-4" />
              <span className="ml-2">About TrustML Studio</span>
            </div>
            <h2 className="text-5xl font-bold leading-[48px] text-white m-0 mb-6">
              25+ Years Building
              <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent ml-2">
                Trusted Systems
              </span>
            </h2>
            <p className="max-w-[768px] text-xl leading-7 text-slate-300 mx-auto my-0">
              TrustML Studio is an AI fraud risk consulting firm led by Michael
              Pezely, a senior Trust & Safety and Risk Strategy Leader with 25+
              years architecting global fraud prevention, policy enforcement,
              and platform integrity programs at companies like eBay, OfferUp,
              and Signifyd.
            </p>
          </motion.div>
        </div>

        {/* What Drives My Work Section */}
        <div className="mb-20">
          <div className="mb-12 text-center">
            <h3 className="text-4xl leading-9 font-bold text-white mb-4">
              What Drives My Work
            </h3>
            <p className="max-w-[672px] text-slate-300 mx-auto my-0">
              The principles and experiences that guide my approach to building
              trust and safety systems.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {driveAreas.map((area, index) => (
              <DriveCard key={index} {...area} />
            ))}
          </div>
        </div>



        {/* Professional Journey Section */}
        <div className="mb-20">
          <div className="mb-12 text-center">
            <h3 className="text-4xl leading-9 font-bold text-white mb-4">
              AI-Powered Fraud & Risk Intelligence Journey
            </h3>
            <p className="max-w-[672px] text-slate-300 mx-auto my-0">
              A comprehensive evolution from foundational risk systems to cutting-edge agentic AI fraud prevention. Transforming financial security through intelligent automation, predictive modeling, and autonomous threat detection across enterprise-scale platforms.
            </p>
          </div>
          <ProfessionalJourneySection />
        </div>

        {/* Our Approach Section */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-8 shadow-2xl backdrop-blur-sm"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center bg-indigo-600 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl leading-8 font-bold text-white mb-4">
              My Approach
            </h3>
            <p className="leading-[26px] text-slate-300 mb-4">
              Effective trust and safety is
              built on three pillars: deep technical expertise, strategic
              business alignment, and human-centered design. My approach
              combines cutting-edge AI with practical operational frameworks.
            </p>
            <p className="leading-[26px] text-slate-300 m-0">
              Whether building from scratch or optimizing existing systems, I
              focus on scalable solutions that grow with your business while
              maintaining the human oversight necessary for complex trust
              decisions.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-8 shadow-2xl backdrop-blur-sm"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center bg-indigo-600 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl leading-8 font-bold text-white mb-4">
              Current Focus
            </h3>
            <p className="leading-[26px] text-slate-300 mb-4">
              TrustML studio is particularly excited about agentic AI systems
              that empower analysts and operators with autonomous agents for
              risk detection and policy enforcement. These systems represent the
              next evolution in trust and safety technology.
            </p>
            <p className="leading-[26px] text-slate-300 m-0">
              Our recent work includes designing AI-native fraud intelligence
              platforms and developing Model Context Protocols that enable
              non-technical users to leverage powerful AI capabilities.
            </p>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="mb-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center bg-slate-800/70 border border-slate-700/70 rounded-xl p-6 shadow-2xl backdrop-blur-sm"
            >
              <div className="mb-2 text-4xl leading-[48px] font-bold text-white">
                {stat.value}
              </div>
              <div className="text-slate-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-blue-500 text-center text-white rounded-2xl p-12 shadow-lg shadow-indigo-500/30"
        >
          <h3 className="text-3xl leading-9 font-bold mb-4">
            Let's Work Together
          </h3>
          <p className="max-w-[672px] text-white mx-auto mb-8 my-0">
            Ready to discuss how my 25+ years of experience can
            help accelerate your trust and safety initiatives? I love to hear
            about your challenges and explore how we can work together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-slate-900 shadow-lg shadow-indigo-500/30 hover:bg-slate-800"
              onClick={() => window.SchedulingService?.openScheduling('general')}
            >
              Schedule Consultation
            </Button>
            
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default ExpertiseSection;