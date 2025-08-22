import React from "react";
import { motion } from "framer-motion";
import { Shield, Brain, TrendingUp, Users, Zap, Lock, Eye, AlertTriangle, CheckCircle, ArrowRight, Settings, Target, BarChart3 } from "lucide-react";

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

const ServiceCard = ({ icon: Icon, title, description, deliverables, duration, gradient, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="bg-white rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 overflow-hidden group"
  >
    <div className={`h-2 ${gradient}`} />
    <div className="p-8">
      <div className="flex items-center space-x-4 mb-6">
        <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <div className="text-sm text-gray-500">{duration}</div>
        </div>
      </div>
      
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
      
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Key Deliverables:</h4>
        <ul className="space-y-2">
          {deliverables.map((deliverable, index) => (
            <li key={index} className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 text-sm">{deliverable}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600">
        Discuss This Service
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  </motion.div>
);

const ConsultingApproach = () => {
  const steps = [
    {
      title: "Discovery & Assessment",
      description: "Deep dive into your current risk posture, pain points, and business objectives",
      icon: Eye,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Strategic Planning",
      description: "Design tailored risk strategy and roadmap aligned with your goals",
      icon: Target,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Implementation Support",
      description: "Guide execution with hands-on support and expertise transfer",
      icon: Settings,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Optimization & Scale",
      description: "Continuous improvement and scaling based on results and feedback",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="bg-gray-50 rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">My Consulting Approach</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const ServicesSection = () => {
  const services = [
    {
      icon: BarChart3,
      title: "Risk Strategy & Assessment",
      duration: "2-4 weeks",
      description: "Comprehensive evaluation of your current risk operations, identifying gaps and opportunities for improvement. Includes competitive analysis and industry benchmarking.",
      deliverables: [
        "Current state risk assessment report",
        "Gap analysis with prioritized recommendations", 
        "Risk KPI framework and measurement strategy",
        "90-day tactical improvement plan",
        "Executive presentation with findings"
      ],
      gradient: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      icon: Target,
      title: "Trust & Safety Program Build",
      duration: "8-12 weeks",
      description: "Design and implement end-to-end trust and safety programs from the ground up, including policy frameworks, operational processes, and technology stack.",
      deliverables: [
        "Complete trust & safety policy framework",
        "Operational runbooks and procedures",
        "Team structure and hiring recommendations",
        "Technology vendor evaluation and selection",
        "KPI dashboard and reporting framework",
        "Training materials and documentation"
      ],
      gradient: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      icon: Brain,
      title: "AI/ML Risk Intelligence",
      duration: "6-10 weeks", 
      description: "Modernize risk detection with AI and machine learning, from rule-based systems to advanced models and agentic frameworks for scalable fraud prevention.",
      deliverables: [
        "AI/ML strategy and implementation roadmap",
        "Model development and validation framework",
        "Agentic AI system architecture design",
        "Data pipeline and infrastructure recommendations",
        "Performance monitoring and optimization plan",
        "Team upskilling and knowledge transfer"
      ],
      gradient: "bg-gradient-to-r from-purple-500 to-purple-600"
    },
    {
      icon: Users,
      title: "Fractional Leadership",
      duration: "3-12 months",
      description: "Serve as your interim or fractional Head of Trust & Safety, providing executive leadership while you build internal capabilities or navigate transitions.",
      deliverables: [
        "Executive leadership and strategic direction",
        "Team management and development",
        "Board and investor communication",
        "Cross-functional stakeholder alignment",
        "Budget management and resource planning",
        "Succession planning and knowledge transfer"
      ],
      gradient: "bg-gradient-to-r from-orange-500 to-orange-600"
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Consulting
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Strategic consulting services designed to help companies build world-class trust and safety programs 
              that scale from startup to enterprise, backed by 25+ years of hands-on experience.
            </p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              {...service}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Consulting Approach */}
        <div className="mb-16">
          <ConsultingApproach />
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Risk Strategy?</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's discuss how TrustML.Studio's expertise can help you build a trust and safety program that protects your business 
            and enables sustainable growth. Schedule a consultation to explore your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Schedule Consultation
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              Download Case Studies
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default ServicesSection;