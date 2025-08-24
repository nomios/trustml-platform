import React from "react";
import { motion } from "framer-motion";
import { Shield, Brain, TrendingUp, Users, Zap, Lock, Eye, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

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

const SolutionCard = ({ icon: Icon, title, description, features, gradient, delay = 0 }) => (
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
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
      
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600">
        Learn More
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  </motion.div>
);

const UseCaseCard = ({ title, description, metrics, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border hover:shadow-lg transition-all duration-300"
  >
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h4 className="font-semibold text-gray-900">{title}</h4>
    </div>
    <p className="text-gray-600 text-sm mb-4">{description}</p>
    <div className="space-y-2">
      {metrics.map((metric, index) => (
        <div key={index} className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{metric.label}</span>
          <span className="text-sm font-medium text-gray-900">{metric.value}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

const SolutionsSection = () => {
  const solutions = [
    {
      icon: Shield,
      title: "Fraud Detection",
      description: "Advanced ML algorithms that detect fraudulent activities in real-time with industry-leading accuracy rates.",
      features: [
        "Real-time transaction monitoring",
        "Behavioral pattern analysis",
        "Multi-layered risk scoring",
        "False positive reduction"
      ],
      gradient: "bg-gradient-to-r from-red-500 to-red-600"
    },
    {
      icon: Brain,
      title: "AI Risk Assessment",
      description: "Intelligent risk profiling that adapts to new threats and evolving user behaviors automatically.",
      features: [
        "Dynamic risk modeling",
        "Continuous learning algorithms",
        "Predictive threat detection",
        "Automated decision making"
      ],
      gradient: "bg-gradient-to-r from-purple-500 to-purple-600"
    },
    {
      icon: Eye,
      title: "Identity Verification",
      description: "Comprehensive identity verification system with document analysis and biometric authentication.",
      features: [
        "Document authenticity verification",
        "Biometric matching",
        "Liveness detection",
        "Global compliance standards"
      ],
      gradient: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      icon: TrendingUp,
      title: "Trust Scoring",
      description: "Dynamic trust scores that help you make informed decisions about user interactions and transactions.",
      features: [
        "Multi-factor trust calculation",
        "Historical behavior analysis",
        "Social network analysis",
        "Real-time score updates"
      ],
      gradient: "bg-gradient-to-r from-blue-500 to-blue-600"
    }
  ];

  const useCases = [
    {
      title: "E-commerce",
      description: "Protect your marketplace from fraudulent transactions and fake accounts",
      icon: Users,
      metrics: [
        { label: "Fraud Reduction", value: "94%" },
        { label: "False Positives", value: "<2%" }
      ]
    },
    {
      title: "Fintech",
      description: "Secure financial transactions and comply with regulatory requirements",
      icon: TrendingUp,
      metrics: [
        { label: "AML Compliance", value: "100%" },
        { label: "Processing Speed", value: "50ms" }
      ]
    },
    {
      title: "Social Platforms",
      description: "Build safer communities by detecting harmful content and behaviors",
      icon: Shield,
      metrics: [
        { label: "Content Accuracy", value: "96%" },
        { label: "Response Time", value: "Real-time" }
      ]
    },
    {
      title: "Gaming",
      description: "Prevent cheating, fraud, and create fair gaming environments",
      icon: Zap,
      metrics: [
        { label: "Cheat Detection", value: "99%" },
        { label: "Bot Prevention", value: "98%" }
      ]
    }
  ];

  return (
    <section id="solutions" className="py-20 bg-gray-50">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Complete Trust & Safety
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive suite of AI-powered tools designed to protect your platform, 
              users, and business from fraud, risks, and threats.
            </p>
          </motion.div>
        </div>

        {/* Solutions Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {solutions.map((solution, index) => (
            <SolutionCard
              key={index}
              {...solution}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Leading Industries
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our solutions adapt to your specific industry needs with proven results across various sectors.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <UseCaseCard key={index} {...useCase} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of companies that trust TrustML to protect their platforms and users. 
            Start your free trial today and see the difference AI-powered trust can make.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              Schedule Demo
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default SolutionsSection;