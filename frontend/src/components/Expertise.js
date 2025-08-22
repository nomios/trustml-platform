import React from "react";
import { motion } from "framer-motion";
import { Brain, Cpu, Zap, Shield, BarChart3, Settings, Globe, Database, ArrowRight, Play, CheckCircle2, Award, Target, Users, TrendingUp } from "lucide-react";

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

const ExpertiseCard = ({ icon: Icon, title, description, experience, achievements }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border"
  >
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600 text-sm mb-4">{description}</p>
    <div className="mb-4">
      <div className="text-xs font-medium text-gray-500 mb-2">EXPERIENCE</div>
      <div className="text-sm text-gray-700">{experience}</div>
    </div>
    {achievements && (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">{achievements}</span>
        </div>
      </div>
    )}
  </motion.div>
);

const TechEvolution = () => {
  const evolution = [
    { name: "Rule-Based Systems", era: "1999-2015", description: "Built eBay's foundational rule engines" },
    { name: "Machine Learning", era: "2015-2021", description: "Deployed ML models at scale for OfferUp" },
    { name: "AI & Deep Learning", era: "2021-2023", description: "Led AI-powered risk intelligence at Signifyd" },
    { name: "Agentic AI", era: "2023-Present", description: "Designing LLM-driven autonomous risk systems" }
  ];

  return (
    <div className="bg-gray-900 rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-white mb-8 text-center">Technology Evolution & Expertise</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {evolution.map((tech, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className="bg-blue-600 rounded-lg p-4 mb-4">
              <div className="text-white font-bold text-lg">{tech.name}</div>
              <div className="text-blue-200 text-sm">{tech.era}</div>
            </div>
            <div className="text-gray-300 text-sm">{tech.description}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CareerHighlights = () => {
  const highlights = [
    {
      company: "eBay",
      role: "Sr Manager, Risk Management",
      period: "1999-2015",
      achievement: "Pioneered scalable trust enforcement systems",
      detail: "Built platform supporting 1B+ automated decisions weekly",
      icon: Globe,
      color: "from-blue-500 to-blue-600"
    },
    {
      company: "OfferUp", 
      role: "Head of Trust and Safety",
      period: "2015-2021",
      achievement: "Built end-to-end T&S program from ground up",
      detail: "Achieved 95% reduction in abusive user interactions",
      icon: Shield,
      color: "from-green-500 to-green-600"
    },
    {
      company: "Signifyd",
      role: "Senior Director Risk Intelligence", 
      period: "2021-2025",
      achievement: "Led AI-powered risk intelligence organization",
      detail: "60% faster fraud response across 10,000+ merchants",
      icon: Brain,
      color: "from-purple-500 to-purple-600"
    },
    {
      company: "Current",
      role: "Independent Consultant",
      period: "2025-Present", 
      achievement: "Advising on agentic AI risk systems",
      detail: "Designing LLM-driven fraud intelligence platforms",
      icon: Zap,
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      {highlights.map((highlight, index) => {
        const Icon = highlight.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${highlight.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-lg text-gray-900">{highlight.company}</h4>
                  <span className="text-sm text-gray-500">{highlight.period}</span>
                </div>
                <div className="text-blue-600 font-medium mb-2">{highlight.role}</div>
                <div className="text-gray-900 font-medium mb-1">{highlight.achievement}</div>
                <div className="text-gray-600 text-sm">{highlight.detail}</div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

const ExpertiseSection = () => {
  const expertiseAreas = [
    {
      icon: Shield,
      title: "Trust & Safety Leadership",
      description: "End-to-end program design and execution, from startup to enterprise scale with proven methodologies.",
      experience: "Head of T&S at OfferUp, Sr Manager at eBay",
      achievements: "Built programs protecting millions of users"
    },
    {
      icon: Brain,
      title: "AI & Machine Learning",
      description: "Early adopter of ML in risk detection, evolving from rule-based to agentic AI systems over 15+ years.",
      experience: "ML deployment since 2015, LLM integration since 2023",
      achievements: "Implemented AI reducing fraud response by 60%"
    },
    {
      icon: BarChart3,
      title: "Risk Strategy & Operations",
      description: "Strategic risk management across fintech, marketplaces, and payments with data-driven approaches.",
      experience: "Risk Intelligence leadership at Signifyd",
      achievements: "Supported 10,000+ merchants with real-time detection"
    },
    {
      icon: Settings,
      title: "Platform Architecture",
      description: "Designing and scaling enforcement systems, rule engines, and detection platforms for high-volume environments.",
      experience: "Co-developed eBay's rules platform v1-v3",
      achievements: "Managed 30,000+ annual rule updates"
    },
    {
      icon: Users,
      title: "Team Building & Leadership",
      description: "Scaling cross-functional teams from individual contributor to 50+ person organizations.",
      experience: "Built teams at OfferUp from 1 to 50+ people",
      achievements: "Led global teams of 20+ analysts and engineers"
    },
    {
      icon: Target,
      title: "Executive Communication",
      description: "C-level advisory, board presentations, and stakeholder alignment on risk strategy and business impact.",
      experience: "C-level Risk Operating Group participation",
      achievements: "Delivered KPI-driven insights to protect margins"
    }
  ];

  return (
    <section id="expertise" className="py-20 bg-gray-50">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              <span>25+ Years of Expertise</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Deep Expertise in 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> AI Fraud Risk</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              25+ years of hands-on experience building trust and safety systems at scale, 
              from eBay's foundational platforms to cutting-edge agentic AI frameworks.
            </p>
          </motion.div>
        </div>

        {/* Career Highlights */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Career Highlights</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Progressive leadership roles at industry-leading companies, each building on the last 
              to create comprehensive expertise in trust, safety, and risk intelligence.
            </p>
          </motion.div>
          <CareerHighlights />
        </div>

        {/* Expertise Areas */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Core Expertise Areas</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive skill set spanning technical implementation, strategic leadership, 
              and operational excellence in trust and safety.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {expertiseAreas.map((area, index) => (
              <ExpertiseCard key={index} {...area} />
            ))}
          </div>
        </div>

        {/* Technology Evolution */}
        <div className="mb-16">
          <TechEvolution />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-12 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Leverage This Expertise?
            </h3>
            <p className="text-gray-600 mb-8">
              Whether you need strategic guidance, hands-on implementation, or fractional leadership, 
              my experience can help accelerate your trust and safety initiatives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group">
                Schedule Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                View Detailed Resume
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default ExpertiseSection;