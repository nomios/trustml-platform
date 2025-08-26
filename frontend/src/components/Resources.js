import React from "react";
import { motion } from "framer-motion";
import { FileText, BookOpen, Download, Clock, User, Tag, Star } from "lucide-react";
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

const ResourceCard = ({
  resourceId,
  type,
  title,
  description,
  author,
  readTime,
  category,
  downloadCount,
  rating,
  icon: Icon,
  gradient,
  delay = 0
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-2xl hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 border border-slate-700/70 overflow-hidden group hover:-translate-y-1"
  >

    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${gradient} rounded-lg flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded-full text-xs font-medium border border-slate-600/50">
              {type}
            </span>
          </div>
        </div>
        {rating && (
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-cyan-400 text-cyan-400" />
            <span className="text-sm font-medium text-slate-300">{rating}</span>
          </div>
        )}
      </div>

      <h3 className="font-bold text-lg text-white mb-3 group-hover:text-indigo-300 transition-colors">
        {title}
      </h3>

      <p className="text-slate-300 text-sm mb-4 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span>{author}</span>
          </div>
          {readTime && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{readTime}</span>
            </div>
          )}
        </div>
        {category && (
          <div className="flex items-center space-x-1">
            <Tag className="w-3 h-3" />
            <span>{category}</span>
          </div>
        )}
      </div>

      {downloadCount && (
        <div className="bg-slate-700/50 rounded-lg p-3 mb-4 border border-slate-600/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Downloads</span>
            <span className="text-sm font-medium text-white">{downloadCount}</span>
          </div>
        </div>
      )}

      <Button
        variant="outline"
        className="w-full group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600"
        {...(resourceId ? ResourceService.getDownloadLinkProps(resourceId, {
          trackingSource: 'resources-section'
        }) : {})}
      >
        <Download className="w-4 h-4 mr-2" />
        Access Resource
      </Button>
    </div>
  </motion.div>
);

// COMMENTED OUT - WebinarCard component
/*
const WebinarCard = ({ title, description, date, duration, presenter, registrations, upcoming = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-indigo-900/50 to-cyan-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50"
  >
    <div className="flex items-center justify-between mb-4">
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
        upcoming 
          ? 'bg-cyan-900/30 text-cyan-300 border border-cyan-700/50' 
          : 'bg-slate-700/50 text-slate-300 border border-slate-600/50'
      }`}>
        {upcoming ? 'Upcoming' : 'On-Demand'}
      </span>
      <div className="text-sm text-slate-400">{registrations} registered</div>
    </div>

    <h3 className="font-bold text-lg text-white mb-3">{title}</h3>
    <p className="text-slate-300 text-sm mb-4">{description}</p>

    <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{duration}</span>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <User className="w-4 h-4" />
        <span>{presenter}</span>
      </div>
    </div>

    <Button variant={upcoming ? "primary" : "outline"} className="w-full">
      {upcoming ? 'Register Now' : 'Watch Recording'}
      <ArrowRight className="w-4 h-4 ml-2" />
    </Button>
  </motion.div>
);
*/

const ResourcesSection = () => {
  const resources = [
    {
      resourceId: "ai-fraud-detection-guide",
      type: "White Paper",
      title: "The Complete Guide to AI-Powered Fraud Detection",
      description: "A comprehensive guide covering modern fraud detection techniques, AI/ML implementation strategies, and best practices for building robust trust & safety systems.",
      author: "Michael Pezely",
      readTime: "32 min read",
      category: "Fraud Prevention",
      downloadCount: "New Release",
      rating: "5.0",
      icon: FileText,
      gradient: "bg-gradient-to-br from-indigo-500 to-indigo-600"
    }
  ];

  // COMMENTED OUT - Webinar data array
  /*
  const webinars = [
    {
      title: "Building Trust in AI: Explainable ML for Fraud Detection",
      description: "Learn how to implement explainable AI systems that build trust with users and regulators while maintaining high accuracy.",
      date: "March 15, 2024",
      duration: "45 min",
      presenter: "Dr. Sarah Chen",
      registrations: "2,400+",
      upcoming: true
    },
    {
      title: "Scaling Trust & Safety: From Startup to Enterprise",
      description: "Best practices for building and scaling trust and safety operations as your platform grows from thousands to millions of users.",
      date: "February 28, 2024",
      duration: "60 min",
      presenter: "Michael Thompson",
      registrations: "1,800+",
      upcoming: false
    },
    {
      title: "The Future of Identity Verification",
      description: "Explore emerging trends in identity verification, from biometrics to blockchain-based solutions.",
      date: "April 12, 2024",
      duration: "50 min",
      presenter: "Alex Kim",
      registrations: "1,200+",
      upcoming: true
    }
  ];
  */

  return (
    <section id="resources" className="py-20 bg-slate-800 scroll-mt-16 md:scroll-mt-20 lg:scroll-mt-24 xl:scroll-mt-36 2xl:scroll-mt-40">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-purple-900/30 text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-purple-700/50 backdrop-blur-sm">
              <BookOpen className="w-4 h-4" />
              <span>Knowledge Hub</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Insights &
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400"> Resources</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Download our comprehensive AI-powered fraud detection guide. Learn from 25+ years of experience
              building trust and safety systems with real-world implementations and cutting-edge strategies.
            </p>
          </motion.div>
        </div>



        {/* Featured Resource */}
        <div className="flex justify-center mb-16">
          <div className="max-w-lg w-full">
            {resources.map((resource, index) => (
              <ResourceCard
                key={index}
                {...resource}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>

        {/* Webinars Section - COMMENTED OUT */}
        {/*
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-white mb-4">Webinars & Events</h3>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Join our experts for live discussions on the latest trends in trust and safety, 
              or catch up on our on-demand webinar library.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {webinars.map((webinar, index) => (
              <WebinarCard key={index} {...webinar} />
            ))}
          </div>
        </div>
        */}

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl p-12 text-center text-white shadow-2xl shadow-indigo-500/20"
        >
          <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Get the latest insights, research findings, and product updates delivered to your inbox.
            Join 10,000+ trust and safety professionals who trust our newsletter.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/90 backdrop-blur-sm"
              />
              <Button variant="secondary">
                Subscribe
              </Button>
            </div>
            <p className="text-indigo-200 text-sm mt-3">
              No spam, unsubscribe anytime. Read our privacy policy.
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default ResourcesSection;