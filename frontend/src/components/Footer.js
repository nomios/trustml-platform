import React from "react";
import { motion } from "framer-motion";
import { Shield, Mail, Phone, MapPin, Twitter, Linkedin, Github, ArrowRight, Heart } from "lucide-react";

const Container = ({ children, className = "" }) => (
  <div className={`max-w-7xl mx-auto px-6 ${className}`}>{children}</div>
);

const FooterSection = ({ title, children }) => (
  <div>
    <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

const FooterLink = ({ href, children, external = false }) => (
  <a
    href={href}
    className="text-gray-600 hover:text-blue-600 transition-colors block py-1"
    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
  >
    {children}
  </a>
);

const SocialLink = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    className="w-10 h-10 bg-gray-100 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors group"
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
  >
    <Icon className="w-5 h-5 text-gray-600 group-hover:text-white" />
  </a>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-xl text-gray-900">TrustML.Studio</div>
                  <div className="text-xs text-gray-500">AI Fraud Risk Consulting</div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                TrustML.Studio provides AI fraud risk consulting with 25+ years architecting trust and safety systems at eBay, OfferUp, and Signifyd. 
                Helping companies build AI-powered risk programs that scale from startup to enterprise level.
              </p>
              <div className="flex space-x-3">
                <SocialLink href="https://linkedin.com/in/mpezely" icon={Linkedin} label="LinkedIn" />
                <SocialLink href="mailto:pezelymj@gmail.com" icon={Mail} label="Email" />
              </div>
            </motion.div>
          </div>

          {/* Services */}
          <FooterSection title="Services">
            <div className="space-y-2">
              <FooterLink href="#services">Risk Strategy & Assessment</FooterLink>
              <FooterLink href="#services">Trust & Safety Program Build</FooterLink>
              <FooterLink href="#services">AI/ML Risk Intelligence</FooterLink>
              <FooterLink href="#services">Fractional Leadership</FooterLink>
              <FooterLink href="#expertise">Expertise Areas</FooterLink>
              <FooterLink href="#case-studies">Case Studies</FooterLink>
            </div>
          </FooterSection>

          {/* Background */}
          <FooterSection title="Background">
            <div className="space-y-2">
              <FooterLink href="#about">About Michael</FooterLink>
              <FooterLink href="#expertise">Professional Experience</FooterLink>
              <FooterLink href="#case-studies">Past Engagements</FooterLink>
              <FooterLink href="#resources">Thought Leadership</FooterLink>
              <FooterLink href="/resume">Resume/CV</FooterLink>
              <FooterLink href="/speaking">Speaking Topics</FooterLink>
            </div>
          </FooterSection>

          {/* Resources */}
          <FooterSection title="Resources">
            <div className="space-y-2">
              <FooterLink href="#contact">Schedule Consultation</FooterLink>
              <FooterLink href="#resources">Downloads</FooterLink>
              <FooterLink href="/blog">Blog Posts</FooterLink>
              <FooterLink href="/presentations">Presentations</FooterLink>
              <FooterLink href="/testimonials">Client Testimonials</FooterLink>
              <FooterLink href="mailto:pezelymj@gmail.com">Email Direct</FooterLink>
            </div>
          </FooterSection>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="border-t border-gray-200 pt-12 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Stay Connected
              </h3>
              <p className="text-gray-600">
                Get insights on trust & safety trends, AI developments, and industry best practices from 20+ years of experience.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center">
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
          className="border-t border-gray-200 pt-8 mb-8"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Email</div>
                <div className="text-sm text-gray-600">pezelymj@gmail.com</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Phone</div>
                <div className="text-sm text-gray-600">+1 (555) 123-4567</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Office</div>
                <div className="text-sm text-gray-600">San Francisco, CA</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="border-t border-gray-200 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>© {currentYear} TrustML.Studio All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <span className="hidden md:inline">•</span>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <span>Built with experience from</span>
              <span className="font-semibold">eBay • OfferUp • Signifyd</span>
            </div>
          </div>
        </motion.div>
      </Container>
    </footer>
  );
};

export default Footer;