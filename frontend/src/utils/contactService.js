// Contact form service utilities

export const ContactService = {
  // Service type mappings
  serviceTypes: {
    'risk-strategy': 'Risk Strategy & Assessment',
    'program-build': 'Trust & Safety Program Build', 
    'ai-ml-intelligence': 'AI/ML Risk Intelligence',
    'fractional-leadership': 'Fractional Leadership'
  },

  // Inquiry type mappings
  inquiryTypes: {
    'general': 'General Information',
    'consultation': 'Free Consultation',
    'pricing': 'Pricing & Proposals',
    'partnership': 'Partnership Opportunities',
    'speaking': 'Speaking Engagements',
    'resources': 'Resources & Case Studies'
  },

  // Pre-populate form based on service type
  getServicePresets: (serviceType) => {
    const presets = {
      'risk-strategy': {
        interestedIn: 'consultation',
        message: 'I\'m interested in learning more about Risk Strategy & Assessment services. Please help me understand how you can evaluate our current risk operations and identify improvement opportunities.'
      },
      'program-build': {
        interestedIn: 'consultation', 
        message: 'I\'d like to discuss Trust & Safety Program Build services. We need help designing and implementing a comprehensive trust and safety program from the ground up.'
      },
      'ai-ml-intelligence': {
        interestedIn: 'consultation',
        message: 'I\'m interested in AI/ML Risk Intelligence services. We want to modernize our risk detection capabilities with advanced machine learning and AI technologies.'
      },
      'fractional-leadership': {
        interestedIn: 'consultation',
        message: 'I\'d like to explore Fractional Leadership services. We need interim or part-time executive leadership for our trust and safety operations.'
      }
    };

    return presets[serviceType] || {};
  },

  // Generate contact form URL with pre-filled parameters
  generateContactUrl: (serviceType = null, inquiryType = null) => {
    const params = new URLSearchParams();
    if (serviceType) params.set('service', serviceType);
    if (inquiryType) params.set('inquiry', inquiryType);
    
    const queryString = params.toString();
    return queryString ? `#contact?${queryString}` : '#contact';
  },

  // Handle service-specific contact routing
  openServiceContact: (serviceType) => {
    const url = ContactService.generateContactUrl(serviceType, 'consultation');
    window.location.href = url;
    
    // Scroll to contact section after URL update
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  },

  // Track contact form interactions
  // Note: Analytics now handled by PostHog integrated in index.html
  trackContactInteraction: async (eventType, metadata = {}) => {
    // No-op: PostHog automatically tracks interactions
    return Promise.resolve();
  },

  // Validate form data
  validateFormData: (formData) => {
    const errors = [];

    if (!formData.firstName?.trim()) {
      errors.push('First name is required');
    }

    if (!formData.lastName?.trim()) {
      errors.push('Last name is required');
    }

    if (!formData.email?.trim()) {
      errors.push('Email is required');
    } else if (!formData.email.includes('@')) {
      errors.push('Please enter a valid email address');
    }

    if (!formData.company?.trim()) {
      errors.push('Company name is required');
    }

    if (!formData.message?.trim()) {
      errors.push('Message is required');
    } else if (formData.message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long');
    }

    return errors;
  }
};

export default ContactService;