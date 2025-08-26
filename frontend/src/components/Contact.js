import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle, Clock, Users, MessageSquare, Calendar, ArrowRight } from "lucide-react";
import ContactService from "../utils/contactService";
import SchedulingService from "../utils/schedulingService";
import ContactMethodService from "../utils/contactMethodService";

const Container = ({ children, className = "" }) => (
  <div className={`max-w-7xl mx-auto px-6 ${className}`}>{children}</div>
);

const Button = ({ children, variant = "primary", size = "md", className = "", disabled = false, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed";
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
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const ContactCard = ({ icon: Icon, title, description, action, gradient, onClick, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-2xl hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 border border-slate-700/70 text-center group hover:-translate-y-1"
  >
    <div className={`w-16 h-16 mx-auto mb-4 ${gradient} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
    <h3 className="font-bold text-xl text-white mb-3">{title}</h3>
    <p className="text-slate-300 mb-4 leading-relaxed">{description}</p>
    <Button 
      variant="outline" 
      className="w-full group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600"
      onClick={onClick}
    >
      {action}
      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
    </Button>
  </motion.div>
);

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="border border-slate-600/50 rounded-lg overflow-hidden bg-slate-800/50 backdrop-blur-sm"
  >
    <button
      onClick={onClick}
      className="w-full px-6 py-4 text-left bg-slate-800/50 hover:bg-slate-700/50 transition-colors flex items-center justify-between"
    >
      <span className="font-medium text-white">{question}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ArrowRight className="w-5 h-5 text-slate-400 transform rotate-90" />
      </motion.div>
    </button>
    <motion.div
      initial={false}
      animate={{ height: isOpen ? "auto" : 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="px-6 pb-4 bg-slate-700/50">
        <p className="text-slate-300 leading-relaxed">{answer}</p>
      </div>
    </motion.div>
  </motion.div>
);

const ContactSection = ({ prefilledService = null, prefilledInquiry = null } = {}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
    message: '',
    interestedIn: prefilledInquiry || 'general',
    serviceType: prefilledService || '',
    urgency: 'normal'
  });

  // Handle URL parameters and service pre-population
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const serviceParam = urlParams.get('service');
    const inquiryParam = urlParams.get('inquiry');
    
    if (serviceParam || inquiryParam) {
      const servicePresets = serviceParam ? ContactService.getServicePresets(serviceParam) : {};
      
      setFormData(prev => ({
        ...prev,
        serviceType: serviceParam || prev.serviceType,
        interestedIn: inquiryParam || servicePresets.interestedIn || prev.interestedIn,
        message: servicePresets.message || prev.message
      }));
    }
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [openFAQ, setOpenFAQ] = useState(0);

  // Web3Forms configuration (frontend-only submission)
  const WEB3FORMS_ACCESS_KEY = process.env.REACT_APP_WEB3FORMS_ACCESS_KEY || '64a4d871-b84c-4c19-ae0b-4592b5d683bb';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    // Client-side validation using ContactService
    const validationErrors = ContactService.validateFormData(formData);
    if (validationErrors.length > 0) {
      setSubmitError(validationErrors[0]);
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Submit via Web3Forms
      const web3Payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        subject: `New Contact Request - ${formData.serviceType || formData.interestedIn}`,
        message: formData.message,
        first_name: formData.firstName,
        last_name: formData.lastName,
        company: formData.company,
        role: formData.role,
        interested_in: formData.interestedIn,
        service_type: formData.serviceType,
        urgency: formData.urgency
      };

      const web3Response = await fetch(`https://api.web3forms.com/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(web3Payload)
      });

      const web3Json = await web3Response.json().catch(() => ({}));

      if (web3Response.status === 200) {
        setSubmitted(true);
        setSubmitError('');

        ContactService.trackContactInteraction('form_submission_success', {
          service_type: formData.serviceType,
          interested_in: formData.interestedIn,
          urgency: formData.urgency
        });
      } else {
        setSubmitError(web3Json.message || 'Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: MessageSquare,
      title: "Start a Conversation",
      description: "Get in touch to discuss your trust & safety challenges, current pain points, and how I can help.",
      action: "Send Message",
      gradient: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      onClick: () => {
        // Scroll to contact form
        const contactForm = document.querySelector('#contact form');
        if (contactForm) {
          contactForm.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      icon: Calendar,
      title: "Schedule a Consultation",
      description: "Book a free 30-minute consultation to explore your needs and discuss potential engagement approaches.",
      action: "Book Consultation",
      gradient: "bg-gradient-to-br from-cyan-500 to-cyan-600",
      onClick: () => SchedulingService.openScheduling('general')
    },
    {
      icon: Users,
      title: "Fractional Leadership",
      description: "Discuss interim or fractional Head of Trust & Safety roles to provide executive leadership during transitions.",
      action: "Discuss Leadership",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      onClick: () => SchedulingService.openScheduling('general')
    }
  ];

  const faqs = [
    {
      question: "How quickly can I start working with you?",
      answer: "Most consulting engagements can begin within 1-2 weeks of our initial conversation. For urgent situations, I can often accommodate faster start times depending on my availability and the scope of work."
    },
    {
      question: "What kind of support do you provide during engagements?",
      answer: "I provide hands-on consultation, strategic guidance, implementation support, and knowledge transfer. This includes regular check-ins, documentation, training sessions, and ongoing communication throughout our engagement."
    },
    {
      question: "How does consulting pricing work?",
      answer: "Pricing depends on the scope, duration, and complexity of the engagement. I offer project-based rates for defined deliverables and hourly rates for ongoing advisory work. Fractional leadership roles are typically monthly retainers."
    },
    {
      question: "Can you work with my existing team and systems?",
      answer: "Absolutely. I specialize in working within existing organizational structures and integrating with current teams, processes, and technology stacks. My goal is to enhance and optimize what you have while introducing new capabilities."
    },
    {
      question: "What industries do you work with?",
      answer: "I primarily work with fintech, marketplaces, e-commerce platforms, and digital payment companies. My experience spans B2C marketplaces, financial services, gaming platforms, and any business dealing with user-generated content or transactions."
    }
  ];

  if (submitted) {
    return (
      <section id="contact" className="py-20 bg-slate-900">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Message Sent!</h2>
            <p className="text-slate-300 mb-8">
              Thank you for reaching out. We'll get back to you within 24 hours.
            </p>
            <Button onClick={() => {setSubmitted(false); setFormData({firstName: '', lastName: '', email: '', company: '', role: '', message: '', interestedIn: 'general', serviceType: '', urgency: 'normal'})}}>
              Send Another Message
            </Button>
          </motion.div>
        </Container>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-slate-900 scroll-mt-16 md:scroll-mt-20 lg:scroll-mt-24 xl:scroll-mt-36 2xl:scroll-mt-40">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-cyan-900/30 text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-cyan-700/50 backdrop-blur-sm">
              <Mail className="w-4 h-4" />
              <span>Get in Touch</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Let's Build Something
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400"> Amazing Together</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Ready to transform your trust and safety operations? Get in touch with our team to learn how 
              TrustML can help protect your platform and users.
            </p>
          </motion.div>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <ContactCard key={index} {...method} delay={index * 0.1} />
          ))}
        </div>

        {/* Main Contact Form */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && (
                <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-300">{submitError}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-600/50 bg-slate-700/50 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm placeholder-slate-400"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-600/50 bg-slate-700/50 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm placeholder-slate-400"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Work Email *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-600/50 bg-slate-700/50 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm placeholder-slate-400"
                  placeholder="john@company.com"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    id="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-600/50 bg-slate-700/50 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm placeholder-slate-400"
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-2">
                    Your Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-600/50 bg-slate-700/50 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm placeholder-slate-400"
                    placeholder="CTO, Product Manager, etc."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="interestedIn" className="block text-sm font-medium text-slate-300 mb-2">
                    I'm interested in *
                  </label>
                  <select
                    name="interestedIn"
                    id="interestedIn"
                    required
                    value={formData.interestedIn}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-600/50 bg-slate-700/50 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm"
                  >
                    <option value="general">General Information</option>
                    <option value="consultation">Free Consultation</option>
                    <option value="pricing">Pricing & Proposals</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="speaking">Speaking Engagements</option>
                    <option value="resources">Resources & Case Studies</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="serviceType" className="block text-sm font-medium text-slate-300 mb-2">
                    Service Type
                  </label>
                  <select
                    name="serviceType"
                    id="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-600/50 bg-slate-700/50 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm"
                  >
                    <option value="">Select a service (optional)</option>
                    <option value="risk-strategy">Risk Strategy & Assessment</option>
                    <option value="program-build">Trust & Safety Program Build</option>
                    <option value="ai-ml-intelligence">AI/ML Risk Intelligence</option>
                    <option value="fractional-leadership">Fractional Leadership</option>
                    <option value="other">Other / Not Sure</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-slate-300 mb-2">
                  Timeline / Urgency
                </label>
                <select
                  name="urgency"
                  id="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-600/50 bg-slate-700/50 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm"
                >
                  <option value="normal">Normal (within 1-2 weeks)</option>
                  <option value="urgent">Urgent (within a few days)</option>
                  <option value="immediate">Immediate (ASAP)</option>
                  <option value="planning">Planning ahead (1+ months)</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-600/50 bg-slate-700/50 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm placeholder-slate-400"
                  placeholder="Tell us about your use case, challenges, or questions..."
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Contact Info & FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Get in touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-900/50 rounded-lg flex items-center justify-center border border-indigo-700/50">
                    <Mail className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Email</div>
                    <a 
                      className="text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer"
                      {...ContactMethodService.getEmailLinkProps(null, { 
                        trackingId: 'contact-info-email' 
                      })}
                    >
                      {ContactMethodService.getContactInfo().email}
                    </a>
                  </div>
                </div>



                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center border border-blue-700/50">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Office</div>
                    <div className="text-slate-300">Seattle, WA</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center border border-purple-700/50">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Response Time</div>
                    <div className="text-slate-300">Within 24 hours</div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openFAQ === index}
                    onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default ContactSection;