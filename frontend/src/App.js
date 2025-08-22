import React from "react";
import { motion } from "framer-motion";
import { Menu, X, Shield, Brain, TrendingUp, Users, Zap, CheckCircle, ArrowRight, Star, Award, Download, Send, Github, Linkedin, Twitter, Play, BarChart3, Lock, Cpu, Globe, FileText, Mail, Phone, MapPin, Target, Eye, AlertTriangle, Settings } from "lucide-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Import components
import ServicesSection from "./components/Services";
import ExpertiseSection from "./components/Expertise";
import CaseStudiesSection from "./components/CaseStudies";
import AboutSection from "./components/About";
import ResourcesSection from "./components/Resources";
import ContactSection from "./components/Contact";
import Footer from "./components/Footer";

// Utility Components
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

// Header Component
const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <Container className="py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => scrollToSection('hero')}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="font-bold text-xl text-gray-900">TrustML.Studio</div>
            <div className="text-sm text-gray-600">AI Fraud Risk Consulting</div>
          </div>
        </motion.div>

        <nav className="hidden lg:flex items-center space-x-8">
          {[
            { name: 'Services', id: 'services' },
            { name: 'Expertise', id: 'expertise' },
            { name: 'Case Studies', id: 'case-studies' },
            { name: 'About', id: 'about' },
            { name: 'Resources', id: 'resources' },
            { name: 'Contact', id: 'contact' }
          ].map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {item.name}
            </motion.button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center space-x-4">
          <Button variant="outline" size="sm">View Resume</Button>
          <Button size="sm" onClick={() => scrollToSection('contact')}>Schedule Consultation</Button>
        </div>

        <button
          className="lg:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </Container>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-white border-t shadow-lg"
        >
          <Container className="py-4 space-y-3">
            {[
              { name: 'Services', id: 'services' },
              { name: 'Expertise', id: 'expertise' },
              { name: 'Case Studies', id: 'case-studies' },
              { name: 'About', id: 'about' },
              { name: 'Resources', id: 'resources' },
              { name: 'Contact', id: 'contact' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block py-2 text-gray-700 hover:text-blue-600 w-full text-left"
              >
                {item.name}
              </button>
            ))}
            <div className="pt-4 space-y-2">
              <Button variant="outline" size="sm" className="w-full">View Resume</Button>
              <Button size="sm" className="w-full" onClick={() => scrollToSection('contact')}>Schedule Consultation</Button>
            </div>
          </Container>
        </motion.div>
      )}
    </header>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e5e7eb%22%20fill-opacity%3D%220.3%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      
      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Target className="w-4 h-4" />
                <span>AI Fraud Risk Consulting | 25+ Years Experience</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Transform Your 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Risk Strategy</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                25+ years architecting fraud prevention and trust systems at eBay, OfferUp, and Signifyd. 
                We help companies build AI-powered risk programs that scale from startup to billions in decisions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="group" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
                  Schedule Consultation
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg" className="group">
                  <Download className="w-5 h-5 mr-2" />
                  Download Resume
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Former eBay, OfferUp, Signifyd</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">1B+ fraud decisions built</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">95% abuse reduction achieved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">AI/ML early adopter</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Career Impact</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-500">Proven Results</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">eBay</div>
                    <div className="text-sm text-blue-600">1B+ decisions/week</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">OfferUp</div>
                    <div className="text-sm text-green-600">95% abuse reduction</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700">Signifyd</div>
                    <div className="text-sm text-purple-600">60% faster response</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">Current Focus</div>
                    <div className="text-sm text-gray-600">Agentic AI for Risk Intelligence</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

// Credibility Section
const CredibilitySection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h3 className="text-lg font-medium text-gray-500 mb-6">Trusted by Leading Companies</h3>
        </motion.div>
        
        <div className="flex flex-wrap items-center justify-center gap-12 grayscale opacity-60">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg"
            alt="eBay"
            className="h-8 hover:opacity-100 transition-opacity"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/1c/OfferUp_Logo.svg"
            alt="OfferUp"
            className="h-8 hover:opacity-100 transition-opacity"
          />
          <img
            src="https://companieslogo.com/img/orig/signifyd_BIG-4a98f9ba.svg"
            alt="Signifyd"
            className="h-8 hover:opacity-100 transition-opacity"
          />
        </div>
      </Container>
    </section>
  );
};

// Stats Section
const StatsSection = () => {
  const stats = [
    { number: "1999", label: "Started at eBay", icon: Award },
    { number: "25+", label: "Years Experience", icon: Shield },
    { number: "95%", label: "Max Abuse Reduction", icon: TrendingUp },
    { number: "3", label: "Major Platforms Built", icon: Target }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

// Main App Component
const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <CredibilitySection />
        <StatsSection />
        <ServicesSection />
        <ExpertiseSection />
        <CaseStudiesSection />
        <AboutSection />
        <ResourcesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}