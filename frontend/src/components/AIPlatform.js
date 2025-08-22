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
    { name: "Rule-Based Systems", era: "2009-2015", description: "Built eBay's foundational rule engines" },
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
      period: "2009-2015",
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
              <span>20+ Years of Expertise</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Deep Expertise in 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Trust & Safety</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Two decades of hands-on experience building trust and safety systems at scale, 
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

const FeatureCard = ({ icon: Icon, title, description, highlight }) => (
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
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    {highlight && (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">{highlight}</span>
        </div>
      </div>
    )}
  </motion.div>
);

const TechStack = () => {
  const technologies = [
    { name: "TensorFlow", logo: "🧠", description: "Deep learning framework" },
    { name: "PyTorch", logo: "🔥", description: "Neural networks" },
    { name: "Apache Kafka", logo: "📊", description: "Real-time streaming" },
    { name: "Redis", logo: "⚡", description: "In-memory database" },
    { name: "PostgreSQL", logo: "🐘", description: "Primary database" },
    { name: "Kubernetes", logo: "☸️", description: "Container orchestration" },
    { name: "Docker", logo: "🐳", description: "Containerization" },
    { name: "GraphQL", logo: "📡", description: "API layer" }
  ];

  return (
    <div className="bg-gray-900 rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">Built on Modern Tech Stack</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {technologies.map((tech, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className="text-3xl mb-2">{tech.logo}</div>
            <div className="text-white font-medium text-sm">{tech.name}</div>
            <div className="text-gray-400 text-xs">{tech.description}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const AIWorkflow = () => {
  const steps = [
    {
      title: "Data Ingestion",
      description: "Real-time data collection from multiple sources",
      icon: Database,
      color: "from-green-500 to-green-600"
    },
    {
      title: "AI Processing",
      description: "Advanced ML models analyze patterns and anomalies",
      icon: Brain,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Risk Scoring",
      description: "Dynamic risk assessment with confidence levels",
      icon: BarChart3,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Action Execution",
      description: "Automated responses based on risk thresholds",
      icon: Zap,
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="relative">
      <div className="grid md:grid-cols-4 gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 transform -translate-x-4">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const AIPlatformSection = () => {
  const platformFeatures = [
    {
      icon: Brain,
      title: "Advanced Machine Learning",
      description: "State-of-the-art neural networks and ensemble models trained on billions of data points.",
      highlight: "99.9% accuracy with continuous learning"
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Lightning-fast decision making with sub-50ms response times for critical transactions.",
      highlight: "Process 1M+ transactions per second"
    },
    {
      icon: Shield,
      title: "Multi-layered Security",
      description: "Comprehensive security framework with encryption, access controls, and audit trails.",
      highlight: "SOC 2 Type II certified"
    },
    {
      icon: Settings,
      title: "Customizable Rules",
      description: "Flexible rule engine that adapts to your business logic and compliance requirements.",
      highlight: "No-code rule configuration"
    },
    {
      icon: Globe,
      title: "Global Scale",
      description: "Cloud-native architecture designed to handle enterprise-level traffic worldwide.",
      highlight: "99.99% uptime SLA"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive dashboards and reporting tools for deep insights into your data.",
      highlight: "Real-time monitoring & alerts"
    }
  ];

  return (
    <section id="ai-platform" className="py-20 bg-white">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Cpu className="w-4 h-4" />
              <span>AI-Powered Platform</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              The Most Advanced 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> AI Platform</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built from the ground up with cutting-edge AI technology, our platform delivers 
              unmatched accuracy, speed, and scalability for trust and safety applications.
            </p>
          </motion.div>
        </div>

        {/* AI Workflow */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How Our AI Works</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our intelligent system processes data through multiple AI stages to deliver precise, 
              actionable insights in real-time.
            </p>
          </motion.div>
          <AIWorkflow />
        </div>

        {/* Platform Features */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Platform Capabilities</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enterprise-grade features designed for mission-critical applications with the highest 
              standards of performance and reliability.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {platformFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-16">
          <TechStack />
        </div>

        {/* Platform Demo CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-12 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              See the Platform in Action
            </h3>
            <p className="text-gray-600 mb-8">
              Experience the power of our AI platform with a personalized demo. See how it can 
              transform your trust and safety operations in just 30 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group">
                <Play className="w-5 h-5 mr-2" />
                Watch Live Demo
              </Button>
              <Button variant="outline" size="lg">
                Schedule Personal Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default AIPlatformSection;