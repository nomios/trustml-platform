import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Shield, Users, Zap, CheckCircle, Star, ArrowRight, BarChart3, DollarSign, Clock, Award } from "lucide-react";

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

const CaseStudyCard = ({ 
  company, 
  industry, 
  challenge, 
  solution, 
  results, 
  metrics, 
  testimonial, 
  logo, 
  gradient,
  delay = 0 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="bg-white rounded-2xl shadow-xl border overflow-hidden hover:shadow-2xl transition-all duration-300"
  >
    <div className={`h-1 ${gradient}`} />
    
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
              {logo}
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900">{company}</h3>
              <p className="text-gray-500 text-sm">{industry}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>

      {/* Challenge */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">Challenge</h4>
        <p className="text-gray-600 text-sm leading-relaxed">{challenge}</p>
      </div>

      {/* Solution */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">My Approach</h4>
        <p className="text-gray-600 text-sm leading-relaxed">{solution}</p>
      </div>

      {/* Results */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Results</h4>
        <ul className="space-y-2">
          {results.map((result, index) => (
            <li key={index} className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-gray-700 text-sm">{result}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-gray-900">{metric.value}</div>
            <div className="text-xs text-gray-500">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Testimonial */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
        <p className="text-gray-700 text-sm italic mb-2">"{testimonial.quote}"</p>
        <div className="text-xs text-gray-600">
          <span className="font-medium">{testimonial.author}</span>
          <span className="text-gray-400"> - {testimonial.title}</span>
        </div>
      </div>

      {/* CTA */}
      <Button variant="outline" className="w-full">
        Read Full Case Study
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  </motion.div>
);

const StatCard = ({ icon: Icon, value, label, change, changeType }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    className="bg-white rounded-xl p-6 shadow-lg border"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        changeType === 'positive' ? 'bg-green-100' : 'bg-blue-100'
      }`}>
        <Icon className={`w-5 h-5 ${
          changeType === 'positive' ? 'text-green-600' : 'text-blue-600'
        }`} />
      </div>
      {change && (
        <div className={`text-xs px-2 py-1 rounded-full ${
          changeType === 'positive' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {change}
        </div>
      )}
    </div>
    <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </motion.div>
);

const CaseStudiesSection = () => {
  const caseStudies = [
    {
      company: "OfferUp",
      industry: "C2C Marketplace",
      logo: "📱",
      gradient: "bg-gradient-to-r from-green-500 to-green-600",
      challenge: "Rapidly growing marketplace needed comprehensive trust and safety program to combat fraud, scams, and abuse while maintaining user experience and platform growth. Manual processes couldn't scale with millions of transactions.",
      solution: "Built end-to-end trust and safety program from ground up, implementing real-time fraud detection, behavioral risk models, and ML-powered enforcement systems. Scaled team from 1 to 50+ people with clear OKRs and operational frameworks.",
      results: [
        "Achieved 95% reduction in abusive user interactions",
        "Scaled from reactive to proactive enforcement",
        "Built team of 50+ cross-functional specialists",
        "Implemented ML models reducing crime reports by 80%",
        "Managed multi-million dollar T&S budget optimization"
      ],
      metrics: [
        { label: "Abuse Reduction", value: "95%" },
        { label: "Team Growth", value: "1→50+" },
        { label: "Crime Reduction", value: "80%" },
        { label: "Budget Managed", value: "$MM" }
      ],
      testimonial: {
        quote: "Your impact was massive. Our millions of customers have had a safer experience because of your leadership!",
        author: "Nick Huzar",
        title: "CEO, OfferUp"
      }
    },
    {
      company: "Signifyd",
      industry: "E-commerce Risk Intelligence",
      logo: "🛡️",
      gradient: "bg-gradient-to-r from-blue-500 to-blue-600",
      challenge: "Risk intelligence team needed to scale capabilities to support 10,000+ merchants with faster fraud detection and response times. Existing processes were too slow and manual for rapid threat evolution.",
      solution: "Led transformation to AI-powered risk intelligence organization, implementing automated threat detection, KPI frameworks, and Model Context Protocol for analyst enablement. Built cross-functional alignment with C-level risk operating group.",
      results: [
        "Reduced fraud response times by 60%",
        "Improved team productivity by 50% through automation",
        "Deployed AI agents for Python-based analysis",
        "Established KPI-driven C-level reporting",
        "Supported 10,000+ merchants with real-time detection"
      ],
      metrics: [
        { label: "Response Speed", value: "60% faster" },
        { label: "Productivity Gain", value: "50%" },
        { label: "Merchants Supported", value: "10K+" },
        { label: "AI Integration", value: "100%" }
      ],
      testimonial: {
        quote: "Michael's leadership in building our AI-powered risk intelligence capabilities transformed how we detect and respond to fraud across our merchant network.",
        author: "Risk Leadership Team",
        title: "Signifyd"
      }
    },
    {
      company: "eBay",
      industry: "Global E-commerce Platform",
      logo: "🌐",
      gradient: "bg-gradient-to-r from-purple-500 to-purple-600",
      challenge: "Global marketplace needed scalable rule-based enforcement systems to handle millions of transactions across diverse markets. Required platform supporting 1 billion+ automated decisions weekly.",
      solution: "Co-developed eBay's foundational rules platform (v1-v3), introducing early machine learning techniques and building analyst tools for policy enforcement. Led global team of 20+ analysts and engineers.",
      results: [
        "Built platform supporting 1B+ decisions weekly",
        "Managed 30,000+ annual rule updates",
        "Introduced early ML techniques for optimization",
        "Led global team of 20+ specialists",
        "Established governance for production systems"
      ],
      metrics: [
        { label: "Decisions Supported", value: "1B+/week" },
        { label: "Rule Updates", value: "30K+/year" },
        { label: "Team Size", value: "20+" },
        { label: "Global Markets", value: "All" }
      ],
      testimonial: {
        quote: "Michael was instrumental in building eBay's trust enforcement platform that became the backbone of our marketplace integrity across global markets.",
        author: "eBay Leadership",
        title: "Risk Management"
      }
    }
  ];

  const overallStats = [
    { icon: Users, value: "1B+", label: "Decisions Built Weekly", change: "+∞%", changeType: "positive" },
    { icon: Shield, value: "95%", label: "Max Abuse Reduction", change: "+95%", changeType: "positive" },
    { icon: TrendingUp, value: "60%", label: "Faster Response Times", change: "+60%", changeType: "positive" },
    { icon: Award, value: "25+", label: "Years Experience", change: "Proven", changeType: "positive" }
  ];

  return (
    <section id="case-studies" className="py-20 bg-gray-50">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BarChart3 className="w-4 h-4" />
              <span>Success Stories</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Real Results from
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Real Companies</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how leading companies across different industries have transformed their 
              trust and safety operations with TrustML Studio's AI-powered solutions.
            </p>
          </motion.div>
        </div>

        {/* Overall Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {overallStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Case Studies */}
        <div className="space-y-12 mb-16">
          {caseStudies.map((study, index) => (
            <CaseStudyCard
              key={index}
              {...study}
              delay={index * 0.2}
            />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Ready to Achieve Similar Results?</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the companies that have transformed their trust and safety operations with strategic 
            consulting and hands-on expertise. Start your success story today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Schedule Consultation
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              View Detailed Resume
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default CaseStudiesSection;