import React from "react";
import { motion } from "framer-motion";
import { Heart, Target, ArrowRight } from "lucide-react";
import ResourceService from "../utils/resourceService";

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
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-indigo-900/30 text-indigo-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-indigo-700/50 backdrop-blur-sm">
              <Heart className="w-4 h-4" />
              <span>About Michael</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              The Person Behind
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400"> TrustML.Studio</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Beyond the professional achievements and technical expertise, here's what drives my passion
              for building trust and safety systems that protect millions of users worldwide.
            </p>
          </motion.div>
        </div>

        {/* Personal Background */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Why Trust & Safety?</h3>
              <p className="text-slate-300 leading-relaxed mb-4">
              Trust is the foundation of all meaningful digital interactions—whether between humans, systems, or increasingly complex digital identities. Every system I've built, every team I've led, and every strategy I've developed has been guided by one principle: creating secure environments where authentic users can connect, transact, and thrive while sophisticated threats are kept at bay.
              </p>
              <p className="text-slate-300 leading-relaxed">
              The intersection of identity verification, behavioral analysis, and platform integrity fascinates me. It's where human insight meets technical precision—understanding not just who users claim to be, but how genuine actors behave differently from bots, fraudsters, and bad actors. In this space, the right solution protects both individual users and entire digital ecosystems from evolving threats.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
            >
              <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Looking Forward</h3>
              <p className="text-slate-300 leading-relaxed mb-4">
              The future of trust and safety lies in intelligent systems that adapt and learn at scale. As digital threats evolve—from sophisticated bots to synthetic identities—our defenses must become equally sophisticated. I'm excited about agentic AI that amplifies human judgment, enabling real-time threat detection while maintaining seamless experiences for legitimate users.
              </p>
              <p className="text-slate-300 leading-relaxed">
              Through TrustML Studio, I'm building next-generation trust systems that combine behavioral analytics, identity intelligence, and adaptive risk scoring. The goal: creating digital environments that are both more secure and more accessible in an increasingly automated world.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Philosophy */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-12 text-center border border-slate-700/50"
          >
            <h3 className="text-3xl font-bold text-white mb-6">My Philosophy</h3>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              "The best fraud and risk systems are invisible to good users and impenetrable to bad actors. They should feel like magic by effortlessly protecting without getting in the way. This balance demands both technology and nuanced understanding of threat landscapes."
            </p>
            <div className="mt-8 text-indigo-300 font-medium">— Michael Pezely</div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-12 text-center text-white shadow-2xl shadow-indigo-500/20 border border-slate-700/50"
        >
          <h3 className="text-3xl font-bold mb-4">Let's Work Together</h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Ready to discuss how TrustML studio can help accelerate your risk or trust initiatives?
            I'd love to hear about your challenges and explore how we can work together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
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

export default AboutSection;