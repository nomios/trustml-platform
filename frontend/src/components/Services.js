import React from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, Users, Eye, CheckCircle, ArrowRight, Settings, Target, BarChart3, ChevronDown } from "lucide-react";
import ContactService from "../utils/contactService";
import SchedulingService from "../utils/schedulingService";
import ResourceService from "../utils/resourceService";

const Container = ({ children, className = "" }) => (
  <div className={`max-w-7xl mx-auto px-6 ${className}`}>{children}</div>
);

const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg";
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40",
    secondary: "bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 backdrop-blur-sm",
    outline: "border-2 border-indigo-600 text-indigo-400 hover:bg-indigo-600 hover:text-white"
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

const ServiceCard = ({ icon: Icon, title, description, deliverables, duration, gradient, serviceId, delay = 0 }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/70 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 overflow-hidden"
    >
      <div className={`h-2 ${gradient}`} />

      {/* Header - Always Visible */}
      <div
        className="p-6 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <div className="text-sm text-slate-400">{duration}</div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-shrink-0"
          >
            <ChevronDown className="w-6 h-6 text-slate-400" />
          </motion.div>
        </div>

        <p className="text-slate-300 mt-4 leading-relaxed">{description}</p>
      </div>

      {/* Expandable Content */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{
          height: { duration: 0.4, ease: "easeInOut" },
          opacity: { duration: 0.3, delay: isExpanded ? 0.1 : 0 }
        }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6">
          <div className="border-t border-slate-700/50 pt-6">
            <div className="mb-6">
              <h4 className="font-semibold text-white mb-3">Key Deliverables:</h4>
              <ul className="space-y-2">
                {deliverables.map((deliverable, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
                    transition={{ delay: isExpanded ? index * 0.05 + 0.2 : 0, duration: 0.3 }}
                    className="flex items-start space-x-3"
                  >
                    <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{deliverable}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 10 }}
              transition={{ delay: isExpanded ? 0.3 : 0, duration: 0.3 }}
            >
              <Button
                variant="primary"
                className="w-full"
                onClick={() => ContactService.openServiceContact(serviceId)}
              >
                Discuss This Service
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ConsultingApproach = () => {
  const steps = [
    {
      title: "Discovery & Assessment",
      description: "Deep dive into your current risk posture, pain points, and business objectives",
      icon: Eye,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      title: "Strategic Planning",
      description: "Design tailored risk strategy and roadmap aligned with your goals",
      icon: Target,
      color: "from-cyan-500 to-cyan-600"
    },
    {
      title: "Implementation Support",
      description: "Guide execution with hands-on support and expertise transfer",
      icon: Settings,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Optimization & Scale",
      description: "Continuous improvement and scaling based on results and feedback",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
      <h3 className="text-2xl font-bold text-white mb-8 text-center">My Consulting Approach</h3>
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
              <h4 className="font-semibold text-white mb-2">{step.title}</h4>
              <p className="text-slate-300 text-sm">{step.description}</p>
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
      serviceId: "risk-strategy",
      duration: "2-4 weeks",
      description: "Comprehensive evaluation of your current risk operations, identifying gaps and opportunities for improvement. Includes competitive analysis and industry benchmarking.",
      deliverables: [
        "Current state risk assessment report",
        "Gap analysis with prioritized recommendations",
        "Risk KPI framework and measurement strategy",
        "90-day tactical improvement plan",
        "Executive presentation with findings"
      ],
      gradient: "bg-gradient-to-r from-indigo-500 to-indigo-600"
    },
    {
      icon: Target,
      title: "Trust & Safety Program Build",
      serviceId: "program-build",
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
      gradient: "bg-gradient-to-r from-cyan-500 to-cyan-600"
    },
    {
      icon: Brain,
      title: "AI/ML Risk Intelligence",
      serviceId: "ai-ml-intelligence",
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
      gradient: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      title: "Fractional Leadership",
      serviceId: "fractional-leadership",
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
      gradient: "bg-gradient-to-r from-purple-500 to-purple-600"
    }
  ];

  return (
    <section id="services" className="py-20 bg-slate-800 scroll-mt-16 md:scroll-mt-20 lg:scroll-mt-24 xl:scroll-mt-36 2xl:scroll-mt-40">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Consulting
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400"> Services</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
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
          className="text-center bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl p-12 text-white shadow-2xl shadow-indigo-500/20"
        >
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Risk Strategy?</h3>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Let's discuss how TrustML.Studio's expertise can help you build a trust and safety program that protects your business
            and enables sustainable growth. Schedule a consultation to explore your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => SchedulingService.openScheduling('general')}
            >
              Schedule Consultation
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-indigo-600"
              {...ResourceService.getDownloadLinkProps('gameverse-case-study', {
                trackingSource: 'services-cta'
              })}
            >
              Download Case Studies
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default ServicesSection;