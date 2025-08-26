import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Linkedin, ArrowRight, Heart } from "lucide-react";
import navigationService from "../utils/navigationService";
import ExternalLinkService from "../utils/externalLinkService";
import ContactMethodService from "../utils/contactMethodService";

const Container = ({ children, className = "" }) => (
  <div className={`max-w-7xl mx-auto px-6 ${className}`}>{children}</div>
);

const FooterSection = ({ title, children }) => (
  <div>
    <h3 className="font-semibold text-white mb-4">{title}</h3>
    {children}
  </div>
);

const FooterLink = ({ href, children, external = false, onClick, section }) => {
  const handleClick = (e) => {
    if (section) {
      e.preventDefault();
      navigationService.scrollToSection(section);
    } else if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a
      href={href}
      className="text-slate-300 hover:text-cyan-400 transition-colors block py-1 cursor-pointer"
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

const SocialLink = ({ platform, icon: Icon, label }) => (
  <a
    className="w-10 h-10 bg-slate-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors group"
    aria-label={label}
    {...ExternalLinkService.getSocialLinkProps(platform)}
  >
    <Icon className="w-5 h-5 text-slate-300 group-hover:text-white" />
  </a>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 border-t border-slate-700">
      <Container className="py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="/trustml.png"
                  alt="TrustML.Studio logo"
                  className="h-8 sm:h-10 w-auto object-contain rounded-lg"
                />
                <div>
                  <div className="font-bold text-xl text-white">TrustML.Studio</div>
                  <div className="text-xs text-slate-300">AI Focused Risk Consulting</div>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-6">
                TrustML.Studio provides AI fraud risk consulting with 25+ years architecting trust and safety systems at eBay, OfferUp, and Signifyd. 
                Helping companies build AI-powered risk programs that scale from startup to enterprise level.
              </p>
              <div className="flex space-x-3">
                <SocialLink platform="linkedin" icon={Linkedin} label="LinkedIn" />
                <SocialLink platform="email" icon={Mail} label="Email" />
              </div>
            </motion.div>
          </div>

          {/* Services */}
          <FooterSection title="Services">
            <div className="space-y-2">
              <FooterLink href="#services" section="services">Risk Strategy & Assessment</FooterLink>
              <FooterLink href="#services" section="services">Trust & Safety Program Build</FooterLink>
              <FooterLink href="#services" section="services">AI/ML Risk Intelligence</FooterLink>
              <FooterLink href="#services" section="services">Fractional Leadership</FooterLink>
              <FooterLink href="#expertise" section="expertise">Expertise Areas</FooterLink>
            </div>
          </FooterSection>

          {/* Background */}
          <FooterSection title="Background">
            <div className="space-y-2">
              <FooterLink href="#about" section="about">About Michael</FooterLink>
              <FooterLink href="#expertise" section="expertise">Professional Experience</FooterLink>
              <FooterLink href="#resources" section="resources">Thought Leadership</FooterLink>
              <a
                href="/resources/mpezely_resume-.pdf"
                className="text-slate-300 hover:text-cyan-400 transition-colors block py-1 cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume/CV
              </a>
            </div>
          </FooterSection>

          {/* Resources */}
          <FooterSection title="Resources">
            <div className="space-y-2">
              <FooterLink href="#" onClick={() => window.SchedulingService?.openScheduling('general')}>Schedule Consultation</FooterLink>
              <FooterLink href="#resources" section="resources">Downloads</FooterLink>
              <FooterLink 
                href={ContactMethodService.createMailtoLink()}
                external
                onClick={ContactMethodService.createEmailHandler(null, { 
                  trackingId: 'footer-email-direct' 
                })}
              >
                Email Direct
              </FooterLink>
            </div>
          </FooterSection>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="border-t border-slate-700 pt-12 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Stay Connected
              </h3>
              <p className="text-slate-300">
                Get insights on trust & safety trends, AI developments, and industry best practices from 20+ years of experience.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-slate-400"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white rounded-lg font-medium transition-colors flex items-center shadow-lg shadow-indigo-500/30">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="border-t border-slate-700 pt-8 mb-8"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Email</div>
                <a 
                  className="text-sm text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
                  {...ContactMethodService.getEmailLinkProps(null, { 
                    trackingId: 'footer-email' 
                  })}
                >
                  {ContactMethodService.getContactInfo().email}
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Office</div>
                <div className="text-sm text-slate-300">Seattle, WA</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="border-t border-slate-700 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <span>© {currentYear} TrustML.Studio All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <a href="/terms" className="text-slate-400 hover:text-cyan-400 transition-colors">Terms of Service</a>
              <span className="hidden md:inline">•</span>
              <a href="/privacy" className="text-slate-400 hover:text-cyan-400 transition-colors">Privacy Policy</a>
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-slate-400">
              <span>Built with experience from</span>
              <span className="font-semibold text-slate-300">eBay • OfferUp • Signifyd</span>
            </div>
          </div>
        </motion.div>
      </Container>
    </footer>
  );
};

export default Footer;