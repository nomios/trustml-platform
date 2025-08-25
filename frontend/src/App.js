import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Shield, TrendingUp, CheckCircle, ArrowRight, Award, Download, Target, Brain, Users, BarChart3, Cpu } from "lucide-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import SchedulingService from "./utils/schedulingService";
import navigationService from "./utils/navigationService";
import ExternalLinkService from "./utils/externalLinkService";

// Import components
import ServicesSection from "./components/Services";
import ExpertiseSection from "./components/Expertise";
import AboutSection from "./components/About";
import ResourcesSection from "./components/Resources";
import ContactSection from "./components/Contact";
import Footer from "./components/Footer";
import TermsOfService from "./components/TermsOfService";
import PrivacyPolicy from "./components/PrivacyPolicy";

// Utility Components
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
    navigationService.scrollToSection(sectionId);
    setIsOpen(false);
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
      <Container className="py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => scrollToSection('hero')}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="font-bold text-xl text-white">TrustML.Studio</div>
            <div className="text-sm text-slate-300">AI Fraud Risk Consulting</div>
          </div>
        </motion.div>

        <nav className="hidden lg:flex items-center space-x-8">
          {[
            { name: 'Services', id: 'services' },
            { name: 'Expertise', id: 'expertise' },
            { name: 'About', id: 'about' },
            { name: 'Resources', id: 'resources' },
            { name: 'Contact', id: 'contact' }
          ].map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-slate-300 hover:text-cyan-400 font-medium transition-colors"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {item.name}
            </motion.button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            {...ExternalLinkService.getExternalLinkProps('/resources/mpezely_resume-.pdf', {
              trackingId: 'header-resume-view',
              category: 'resume'
            })}
          >
            View Resume
          </Button>
          <Button size="sm" onClick={() => window.SchedulingService?.openScheduling('general') || navigationService.scrollToSection('contact')}>Schedule Consultation</Button>
        </div>

        <button
          className="lg:hidden p-2 text-slate-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </Container>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-slate-900 border-t border-slate-700 shadow-lg"
        >
          <Container className="py-4 space-y-3">
            {[
              { name: 'Services', id: 'services' },
              { name: 'Expertise', id: 'expertise' },
              { name: 'About', id: 'about' },
              { name: 'Resources', id: 'resources' },
              { name: 'Contact', id: 'contact' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block py-2 text-slate-300 hover:text-cyan-400 w-full text-left transition-colors"
              >
                {item.name}
              </button>
            ))}
            <div className="pt-4 space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                {...ExternalLinkService.getExternalLinkProps('/resources/mpezely_resume-.pdf', {
                  trackingId: 'mobile-resume-view',
                  category: 'resume'
                })}
              >
                View Resume
              </Button>
              <Button size="sm" className="w-full" onClick={() => window.SchedulingService?.openScheduling('general') || navigationService.scrollToSection('contact')}>Schedule Consultation</Button>
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
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23475569%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
      <div className="absolute inset-0 backdrop-blur-[1px]" />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 bg-indigo-900/30 text-indigo-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-indigo-700/50 backdrop-blur-sm">
                <Target className="w-4 h-4" />
                <span>AI Fraud Risk Consulting | 25+ Years Experience</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Outpace Fraud with
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400"> Adaptive AI Defense and Risk Strategy</span>
              </h1>

              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                25+ years architecting fraud prevention and trust systems at eBay, OfferUp, and Signifyd.
                We help companies build AI-powered risk programs that scale from startup to billions in decisions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="group" onClick={() => window.SchedulingService?.openScheduling('general') || navigationService.scrollToSection('contact')}>
                  Schedule Consultation
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="group"
                  {...ExternalLinkService.getExternalLinkProps('/resources/mpezely_resume-.pdf', {
                    trackingId: 'hero-resume-download',
                    category: 'resume'
                  })}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Resume
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-cyan-400" />
                  <span className="text-slate-300">Former eBay, OfferUp, Signifyd</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-cyan-400" />
                  <span className="text-slate-300">1B+ fraud decisions built</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-cyan-400" />
                  <span className="text-slate-300">95% abuse reduction achieved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-cyan-400" />
                  <span className="text-slate-300">AI/ML early adopter</span>
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
            <div className="relative bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-700/70">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-white">Core Expertise</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300">Proven Results</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative bg-gradient-to-br from-indigo-900/50 to-indigo-800/50 p-4 rounded-lg border border-indigo-700/30 overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center mb-2">
                        <Shield className="w-5 h-5 text-indigo-300 mr-2" />
                        <div className="font-semibold text-indigo-300">Trust & Safety</div>
                      </div>
                      <div className="text-sm text-indigo-400">End-to-end program design and execution at scale</div>
                    </div>
                    <Shield className="absolute bottom-2 right-2 w-12 h-12 text-indigo-700/30" />
                  </div>

                  <div className="relative bg-gradient-to-br from-cyan-900/50 to-cyan-800/50 p-4 rounded-lg border border-cyan-700/30 overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center mb-2">
                        <BarChart3 className="w-5 h-5 text-cyan-300 mr-2" />
                        <div className="font-semibold text-cyan-300">Risk Intelligence</div>
                      </div>
                      <div className="text-sm text-cyan-400">Data-driven approaches across global platforms</div>
                    </div>
                    <BarChart3 className="absolute bottom-2 right-2 w-12 h-12 text-cyan-700/30" />
                  </div>

                  <div className="relative bg-gradient-to-br from-blue-900/50 to-blue-800/50 p-4 rounded-lg border border-blue-700/30 overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center mb-2">
                        <Users className="w-5 h-5 text-blue-300 mr-2" />
                        <div className="font-semibold text-blue-300">Identity Systems</div>
                      </div>
                      <div className="text-sm text-blue-400">Advanced authentication and verification</div>
                    </div>
                    <Users className="absolute bottom-2 right-2 w-12 h-12 text-blue-700/30" />
                  </div>

                  <div className="relative bg-gradient-to-br from-purple-900/50 to-purple-800/50 p-4 rounded-lg border border-purple-700/30 overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center mb-2">
                        <Brain className="w-5 h-5 text-purple-300 mr-2" />
                        <div className="font-semibold text-purple-300">AI & ML</div>
                      </div>
                      <div className="text-sm text-purple-400">From rule-based to agentic AI systems</div>
                    </div>
                    <Brain className="absolute bottom-2 right-2 w-12 h-12 text-purple-700/30" />
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





// Main App Component
const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ExpertiseSection />
        <AboutSection />
        <ResourcesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  // Initialize services globally
  useEffect(() => {
    window.SchedulingService = SchedulingService;
    navigationService.initialize();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </BrowserRouter>
  );
}