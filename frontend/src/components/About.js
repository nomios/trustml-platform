import React from "react";
import { motion } from "framer-motion";
import {
  Heart as HeartIcon,
  Target as TargetIcon,
  ArrowRight as ArrowRightIcon,
  Calendar as CalendarIcon,
  Shield as ShieldIcon,
  Brain as BrainIcon
} from "lucide-react";

const Container = ({ children, className = "" }) => (
  <div className={`max-w-7xl mx-auto px-6 ${className}`}>{children}</div>
);

const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg";
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40",
    secondary: "bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 backdrop-blur-sm",
    outline: "border-2 border-white text-white hover:bg-white hover:text-slate-900"
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

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-slate-800 scroll-mt-16 md:scroll-mt-20 lg:scroll-mt-24 xl:scroll-mt-36 2xl:scroll-mt-40">
      <Container className="md:px-24 py-16">
        {/* Header */}
        <div className="mb-20 text-center relative">
          {/* Decorative elements */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full opacity-70"></div>
          <div className="absolute -z-10 top-20 left-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -z-10 top-40 right-0 w-40 h-40 bg-cyan-600/20 rounded-full blur-3xl"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center bg-indigo-900/30 text-sm font-medium text-indigo-300 backdrop-blur-sm border border-indigo-700/50 rounded-full px-4 py-2 hover:bg-indigo-900/40 transition-colors duration-300">
              <HeartIcon className="h-4 w-4" />
              <span className="ml-2">About Michael</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-[1.2]">
              The Person Behind
              <span className="block mt-2 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                TrustML Studio
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Beyond the professional achievements and technical expertise,
              here's what drives my passion for building trust and safety
              systems that protect millions of users worldwide.
            </p>
          </motion.div>
        </div>

        {/* Personal Background */}
        <div className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="group bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-indigo-700/70 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] relative overflow-hidden"
            >
              <div className="absolute -z-10 inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center bg-indigo-600 rounded-xl transform transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <HeartIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                Why Trust & Safety?
                <span className="ml-2 text-xs font-normal px-2 py-1 bg-indigo-900/50 text-indigo-300 rounded-full">Core Mission</span>
              </h3>
              <p className="leading-[26px] text-slate-300 mb-4">
                Trust is at the core of every digital interaction. My work centers on building systems, strategies, and teams that make it possible for real users to connect, transact, and grow in environments protected from fraud and abuse.
              </p>
              <p className="leading-[26px] text-slate-300">
                I focus on the critical intersection of identity, behavior, and platform integrity. By combining human insight with technical precision, I help organizations distinguish authentic users from bots, fraudsters, and other threats. The result is stronger protection for individuals and resilient digital ecosystems that can thrive in the face of evolving risks.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="group bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-700/70 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] relative overflow-hidden"
            >
              <div className="absolute -z-10 inset-0 bg-gradient-to-br from-cyan-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center bg-cyan-600 rounded-xl transform transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <TargetIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                Looking Forward
                <span className="ml-2 text-xs font-normal px-2 py-1 bg-cyan-900/50 text-cyan-300 rounded-full">Vision</span>
              </h3>
              <p className="leading-[26px] text-slate-300">
                The future of trust and safety depends on intelligent systems that adapt and learn at scale. As threats evolve, from sophisticated bots to synthetic identities, defenses must be just as dynamic. Agentic AI is a breakthrough that extends human judgment to deliver real-time detection while preserving a frictionless experience for legitimate users.              </p>
              <p className="leading-[26px] text-slate-300">
                At TrustML Studio, I'm building the next generation of trust systems. By uniting behavioral analytics, identity intelligence, and adaptive risk scoring, we create environments where businesses can grow confidently, users feel safe, and fraud has nowhere to hide.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Philosophy */}
        <div className="mb-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-slate-900 to-slate-800 text-center border border-slate-700/50 rounded-2xl p-12 hover:border-indigo-700/30 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-cyan-400 opacity-70"></div>
            <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">My Philosophy</h3>
            <div className="max-w-4xl mx-auto text-xl md:text-2xl leading-[1.6] text-slate-300 italic relative">
              <div className="absolute -left-8 -top-6 text-6xl text-indigo-400/20">"</div>
              <p>
              The best fraud and risk systems stay invisible to good users and impenetrable to bad actors. 
              They should feel like magic, protecting without getting in the way. 
              That balance requires more than strong technology. It also needs a 
              nuanced understanding of the threat landscape.
              </p>
              <div className="absolute -right-8 -bottom-6 text-6xl text-indigo-400/20">"</div>
            </div>
            <div className="mt-8 font-medium text-indigo-300 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-indigo-900/50 border border-indigo-700/50 flex items-center justify-center mr-3">
                <span className="text-white font-bold">M</span>
              </div>
              Michael Pezely
            </div>
          </motion.div>
        </div>

        {/* Key Principles */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Key Principles</h3>
            <p className="text-slate-300 max-w-2xl mx-auto">The foundation of effective trust and safety systems</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{
              title: 'User-Centric Design',
              description: 'Security measures that enhance rather than hinder the user experience',
              icon: <HeartIcon className="h-6 w-6" />, color: 'bg-indigo-600'
            }, {
              title: 'Adaptive Intelligence',
              description: 'Systems that learn and evolve alongside emerging threats',
              icon: <BrainIcon className="h-6 w-6" />, color: 'bg-cyan-600'
            }, {
              title: 'Holistic Protection',
              description: 'Comprehensive defense across all potential vulnerability points',
              icon: <ShieldIcon className="h-6 w-6" />, color: 'bg-indigo-600'
            }].map((item, index) => (
              <div key={index} className="group bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-indigo-700/50 transition-all duration-300 flex flex-col items-center text-center">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center ${item.color} rounded-lg transform transition-transform duration-300 group-hover:scale-110`}>
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-12 text-center text-white shadow-2xl shadow-indigo-500/20 border border-slate-700/50 relative overflow-hidden"
        >
          <div className="absolute -z-10 top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_70%)]"></div>
          <div className="absolute -z-10 bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.1),transparent_70%)]"></div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Let's Work Together</h3>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Ready to discuss how TrustML Studio can accelerate your risk or trust initiatives? I'd love to hear about your challenges and explore how we can work together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              className="group rounded-xl"
              onClick={() => window.SchedulingService?.openScheduling('general')}
            >
              <CalendarIcon className="h-5 w-5 mr-2" />
              Schedule Consultation
              <ArrowRightIcon className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button variant="secondary" size="lg" className="rounded-xl text-indigo-300">
              Learn More
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default AboutSection;