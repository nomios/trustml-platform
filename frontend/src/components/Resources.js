import React from "react";
import { motion } from "framer-motion";
import { FileText, Video, BookOpen, Download, ArrowRight, Star, Calendar, Clock, User, Tag, Search, Filter } from "lucide-react";

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

const ResourceCard = ({ 
  type, 
  title, 
  description, 
  author, 
  readTime, 
  category, 
  featured = false, 
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
    className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border overflow-hidden group ${
      featured ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
    }`}
  >
    {featured && (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2">
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-medium">Featured Resource</span>
        </div>
      </div>
    )}
    
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${gradient} rounded-lg flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
              {type}
            </span>
          </div>
        </div>
        {rating && (
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{rating}</span>
          </div>
        )}
      </div>

      <h3 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
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
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Downloads</span>
            <span className="text-sm font-medium text-gray-900">{downloadCount}</span>
          </div>
        </div>
      )}

      <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600">
        <Download className="w-4 h-4 mr-2" />
        Access Resource
      </Button>
    </div>
  </motion.div>
);

const WebinarCard = ({ title, description, date, duration, presenter, registrations, upcoming = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border"
  >
    <div className="flex items-center justify-between mb-4">
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
        upcoming 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-700'
      }`}>
        {upcoming ? 'Upcoming' : 'On-Demand'}
      </span>
      <div className="text-sm text-gray-500">{registrations} registered</div>
    </div>

    <h3 className="font-bold text-lg text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 text-sm mb-4">{description}</p>

    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
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

const ResourcesSection = () => {
  const resources = [
    {
      type: "White Paper",
      title: "The Complete Guide to AI-Powered Fraud Detection",
      description: "A comprehensive 45-page guide covering modern fraud detection techniques, implementation strategies, and best practices for fintech companies.",
      author: "Dr. Sarah Chen",
      readTime: "25 min read",
      category: "Fraud Prevention",
      featured: true,
      downloadCount: "12,400+",
      rating: "4.9",
      icon: FileText,
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      type: "Case Study",
      title: "How GameVerse Reduced Cheating by 98% with AI",
      description: "Detailed analysis of how a major gaming platform eliminated cheating and toxic behavior using TrustML's AI-powered detection system.",
      author: "Michael Rodriguez",
      readTime: "15 min read",
      category: "Gaming",
      downloadCount: "8,200+",
      rating: "4.8",
      icon: BookOpen,
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      type: "eBook",
      title: "Trust & Safety for Marketplaces: 2024 Playbook",
      description: "Essential strategies for building trust in two-sided marketplaces, covering verification, reviews, disputes, and community management.",
      author: "Trust & Safety Team",
      readTime: "35 min read",
      category: "Marketplaces",
      downloadCount: "15,600+",
      rating: "4.9",
      icon: BookOpen,
      gradient: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      type: "Technical Guide",
      title: "Implementing Real-time ML at Scale",
      description: "Technical deep-dive into building and deploying machine learning systems that can process millions of decisions per second.",
      author: "David Rodriguez",
      readTime: "20 min read",
      category: "Engineering",
      downloadCount: "6,800+",
      rating: "4.7",
      icon: FileText,
      gradient: "bg-gradient-to-br from-orange-500 to-orange-600"
    },
    {
      type: "Research Paper",
      title: "Fairness in AI-Driven Trust Systems",
      description: "Academic research on bias detection and mitigation in trust and safety AI systems, with practical implementation guidelines.",
      author: "Dr. Priya Patel",
      readTime: "30 min read",
      category: "AI Ethics",
      downloadCount: "4,200+",
      rating: "4.8",
      icon: FileText,
      gradient: "bg-gradient-to-br from-red-500 to-red-600"
    },
    {
      type: "Benchmark Report",
      title: "Industry Trust & Safety Benchmarks 2024",
      description: "Annual report comparing trust and safety metrics across industries, with actionable insights and performance benchmarks.",
      author: "Research Team",
      readTime: "18 min read",
      category: "Industry Analysis",
      downloadCount: "11,300+",
      rating: "4.9",
      icon: BookOpen,
      gradient: "bg-gradient-to-br from-indigo-500 to-indigo-600"
    }
  ];

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

  return (
    <section id="resources" className="py-20 bg-gray-50">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              <span>Knowledge Hub</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Insights &
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Resources</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert insights, research, and practical guides from 25+ years building trust and safety systems. 
              Learn from real-world implementations and stay ahead of emerging threats.
            </p>
          </motion.div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <Button variant="outline" className="whitespace-nowrap">
            <Filter className="w-4 h-4 mr-2" />
            Filter by Category
          </Button>
        </div>

        {/* Featured Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {resources.map((resource, index) => (
            <ResourceCard
              key={index}
              {...resource}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Webinars Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Webinars & Events</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
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

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Get the latest insights, research findings, and product updates delivered to your inbox. 
            Join 10,000+ trust and safety professionals who trust our newsletter.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <Button variant="secondary">
                Subscribe
              </Button>
            </div>
            <p className="text-blue-200 text-sm mt-3">
              No spam, unsubscribe anytime. Read our privacy policy.
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default ResourcesSection;