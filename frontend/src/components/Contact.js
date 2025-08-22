import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, Users, MessageSquare, Calendar, ArrowRight } from "lucide-react";

const Container = ({ children, className = "" }) => (
  <div className={`max-w-7xl mx-auto px-6 ${className}`}>{children}</div>
);

const Button = ({ children, variant = "primary", size = "md", className = "", disabled = false, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed";
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
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const ContactCard = ({ icon: Icon, title, description, action, gradient, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border text-center group"
  >
    <div className={`w-16 h-16 mx-auto mb-4 ${gradient} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
    <h3 className="font-bold text-xl text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
    <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600">
      {action}
      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
    </Button>
  </motion.div>
);

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="border border-gray-200 rounded-lg overflow-hidden"
  >
    <button
      onClick={onClick}
      className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
    >
      <span className="font-medium text-gray-900">{question}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ArrowRight className="w-5 h-5 text-gray-400 transform rotate-90" />
      </motion.div>
    </button>
    <motion.div
      initial={false}
      animate={{ height: isOpen ? "auto" : 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="px-6 pb-4 bg-gray-50">
        <p className="text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </motion.div>
  </motion.div>
);

const ContactSection = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
    message: '',
    interestedIn: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          company: formData.company,
          role: formData.role,
          interested_in: formData.interestedIn,
          message: formData.message
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        console.error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
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
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      icon: Calendar,
      title: "Schedule a Consultation",
      description: "Book a free 30-minute consultation to explore your needs and discuss potential engagement approaches.",
      action: "Book Consultation",
      gradient: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      icon: Users,
      title: "Fractional Leadership",
      description: "Discuss interim or fractional Head of Trust & Safety roles to provide executive leadership during transitions.",
      action: "Discuss Leadership",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600"
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
      <section id="contact" className="py-20 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h2>
            <p className="text-gray-600 mb-8">
              Thank you for reaching out. We'll get back to you within 24 hours.
            </p>
            <Button onClick={() => {setSubmitted(false); setFormData({firstName: '', lastName: '', email: '', company: '', role: '', message: '', interestedIn: 'general'})}}>
              Send Another Message
            </Button>
          </motion.div>
        </Container>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-white">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Mail className="w-4 h-4" />
              <span>Get in Touch</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Let's Build Something
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Amazing Together</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
            className="bg-gray-50 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Work Email *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@company.com"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    id="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="CTO, Product Manager, etc."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="interestedIn" className="block text-sm font-medium text-gray-700 mb-2">
                  I'm interested in *
                </label>
                <select
                  name="interestedIn"
                  id="interestedIn"
                  required
                  value={formData.interestedIn}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="general">General Information</option>
                  <option value="demo">Product Demo</option>
                  <option value="pricing">Pricing</option>
                  <option value="integration">Integration Support</option>
                  <option value="enterprise">Enterprise Solutions</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <div className="text-gray-600">pezelymj@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Phone</div>
                    <div className="text-gray-600">+1 (555) 123-4567</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Office</div>
                    <div className="text-gray-600">San Francisco, CA</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Response Time</div>
                    <div className="text-gray-600">Within 24 hours</div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
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