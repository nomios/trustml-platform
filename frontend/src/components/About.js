import React from "react";
import { motion } from "framer-motion";
import { Users, Award, Globe, Zap, Target, Heart, Star, ArrowRight, CheckCircle, TrendingUp, Shield, Brain, Calendar, MapPin, Briefcase } from "lucide-react";

const Container = ({ children, className = "" }) => (
  <div className={`max-w-7xl mx-auto px-6 ${className}`}>{children}</div>
);

const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:border-gray-300",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
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

const ValueCard = ({ icon: Icon, title, description, gradient }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border text-center"
  >
    <div className={`w-16 h-16 mx-auto mb-4 ${gradient} rounded-full flex items-center justify-center`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
    <h3 className="font-bold text-xl text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

const ExperienceTimeline = () => {
  const experiences = [
    {
      company: "Fravity (Agentic Copilot)",
      role: "Independent Consultant", 
      period: "July 2025 – Present",
      description: "Advising early-stage startup on agentic fraud intelligence platform architecture",
      icon: Brain,
      current: true
    },
    {
      company: "Signifyd",
      role: "Senior Director Risk Intelligence",
      period: "Feb 2023 - June 2025", 
      description: "Built and scaled AI-powered risk intelligence team, improved productivity 50%",
      icon: TrendingUp,
      current: false
    },
    {
      company: "Signifyd", 
      role: "Director Risk Intelligence",
      period: "Sept 2021 - Jan 2023",
      description: "Established KPI frameworks, accelerated fraud detection speed by 60%",
      icon: Target,
      current: false
    },
    {
      company: "OfferUp",
      role: "Head of Trust and Safety",
      period: "Feb 2017 - Sept 2021",
      description: "Built comprehensive T&S program, achieved 95% reduction in abuse",
      icon: Shield,
      current: false
    },
    {
      company: "eBay",
      role: "Sr Manager, Risk Management",
      period: "1999-2015", 
      description: "Co-developed foundational rules platform supporting 1B+ decisions weekly",
      icon: Globe,
      current: false
    }
  ];

  return (
    <div className="space-y-6">
      {experiences.map((exp, index) => {
        const Icon = exp.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`flex items-start space-x-4 p-6 rounded-xl border ${
              exp.current ? 'bg-blue-50 border-blue-200' : 'bg-white'
            }`}
          >
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              exp.current ? 'bg-blue-600' : 'bg-gray-600'
            }`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg text-gray-900">{exp.company}</h3>
                <span className="text-sm text-gray-500">{exp.period}</span>
              </div>
              <div className={`font-medium mb-2 ${exp.current ? 'text-blue-700' : 'text-gray-700'}`}>
                {exp.role} {exp.current && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs ml-2">Current</span>}
              </div>
              <p className="text-gray-600 text-sm">{exp.description}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

const Milestone = ({ year, title, description, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="flex items-start space-x-4"
  >
    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <div className="flex items-center space-x-2 mb-2">
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">{year}</span>
      </div>
      <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </motion.div>
);

const AboutSection = () => {
  const values = [
    {
      icon: Shield,
      title: "Proven Results",
      description: "Track record of building systems that scale to billions of decisions and achieve measurable impact on platform safety.",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      icon: Brain,
      title: "Innovation Leader",
      description: "Early adopter of AI/ML in risk detection, staying ahead of emerging threats with cutting-edge technology.",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      icon: Users,
      title: "Team Builder",
      description: "Experience scaling teams from individual contributor to 50+ person organizations with clear operational frameworks.",
      gradient: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      icon: Globe,
      title: "Enterprise Scale",
      description: "Built and operated trust systems for global platforms serving millions of users across diverse markets.",
      gradient: "bg-gradient-to-br from-orange-500 to-orange-600"
    }
  ];

  const stats = [
    { number: "1999", label: "Started at eBay" },
    { number: "25+", label: "Years Experience" },
    { number: "4", label: "Major Platforms" },
    { number: "1B+", label: "Decisions Built" }
  ];

  const milestones = [
    {
      year: "1999",
      title: "Joined eBay Risk Management",
      description: "Started building foundational trust enforcement systems for global marketplace.",
      icon: Star
    },
    {
      year: "2015",
      title: "Led OfferUp Trust & Safety",
      description: "Built comprehensive T&S program from ground up for fast-growing C2C marketplace.",
      icon: TrendingUp
    },
    {
      year: "2021",
      title: "Signifyd Risk Intelligence",
      description: "Led transformation to AI-powered risk intelligence supporting 10,000+ merchants.",
      icon: Brain
    },
    {
      year: "2025",
      title: "Independent Consulting",
      description: "Started consulting practice focused on agentic AI and risk intelligence systems.",
      icon: Target
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              <span>About TrustML.Studio</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              25+ Years Building
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Trusted Systems</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
               TrustML.Studio is an AI fraud risk consulting firm led by Michael Pezely, a senior Trust & Safety and Risk Strategy Leader 
              with 25+ years architecting global fraud prevention, policy enforcement, and platform integrity programs at companies like eBay, OfferUp, and Signifyd.
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Professional Journey */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Approach</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              At TrustML.Studio, we believe that effective trust and safety is built on three pillars: deep technical expertise, 
              strategic business alignment, and human-centered design. Our approach combines cutting-edge AI 
              with practical operational frameworks.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether building from scratch or optimizing existing systems, we focus on scalable solutions 
              that grow with your business while maintaining the human oversight necessary for complex 
              trust decisions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8"
          >
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Current Focus</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              TrustML.Studio is particularly excited about agentic AI systems that empower analysts and operators 
              with autonomous agents for risk detection and policy enforcement. These systems represent 
              the next evolution in trust and safety technology.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our recent work includes designing AI-native fraud intelligence platforms and developing 
              Model Context Protocols that enable non-technical users to leverage powerful AI capabilities.
            </p>
          </motion.div>
        </div>

        {/* Professional Journey Timeline */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Professional Journey</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Career progression from building foundational systems at eBay to leading AI-powered 
              risk intelligence and now consulting on cutting-edge agentic systems.
            </p>
          </motion.div>
          <ExperienceTimeline />
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">What Drives My Work</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles and experiences that guide my approach to building trust and safety systems.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </div>

        {/* Key Milestones */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Career Milestones</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Key moments that shaped my expertise in trust, safety, and risk intelligence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {milestones.map((milestone, index) => (
              <Milestone key={index} {...milestone} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Let's Work Together</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Ready to discuss how TrustML.Studio's 25+ years of experience can help accelerate your trust and safety initiatives? 
            We'd love to hear about your challenges and explore how we can work together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              Schedule Consultation
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
              Download Resume
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default AboutSection;