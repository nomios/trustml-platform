/**
 * Contact Method Service
 * Handles email and phone links with proper formatting and tracking
 */

import analyticsService from './analyticsService.js';
import errorHandlingService from './errorHandlingService.js';

class ContactMethodService {
  // Contact information
  static CONTACT_INFO = {
    email: 'michael@trustml.studio',
    phone: '+15551234567', // E.164 format for tel: links
    phoneDisplay: '+1 (555) 123-4567' // Human-readable format
  };

  /**
   * Create mailto link
   * @param {string} email - Email address
   * @param {Object} options - Email options
   * @returns {string} Mailto URL
   */
  static createMailtoLink(email = null, options = {}) {
    const {
      subject = '',
      body = '',
      cc = '',
      bcc = ''
    } = options;

    const targetEmail = email || this.CONTACT_INFO.email;
    const params = new URLSearchParams();
    
    if (subject) params.append('subject', subject);
    if (body) params.append('body', body);
    if (cc) params.append('cc', cc);
    if (bcc) params.append('bcc', bcc);

    const queryString = params.toString();
    return `mailto:${targetEmail}${queryString ? '?' + queryString : ''}`;
  }

  /**
   * Create tel link
   * @param {string} phone - Phone number
   * @returns {string} Tel URL
   */
  static createTelLink(phone = null) {
    const targetPhone = phone || this.CONTACT_INFO.phone;
    return `tel:${targetPhone}`;
  }

  /**
   * Create email click handler
   * @param {string} email - Email address
   * @param {Object} options - Email options and tracking
   * @returns {Function} Click handler function
   */
  static createEmailHandler(email = null, options = {}) {
    const {
      subject = '',
      body = '',
      cc = '',
      bcc = '',
      trackingId = 'email-click',
      prefilledService = null
    } = options;

    return (e) => {
      e.preventDefault();
      
      try {
        // Track the email click
        this.trackContactMethodClick(trackingId, 'email', email || this.CONTACT_INFO.email);

        // Create subject and body based on service if provided
        let emailSubject = subject;
        let emailBody = body;

        if (prefilledService && !subject && !body) {
          emailSubject = `Inquiry about ${prefilledService} services`;
          emailBody = `Hi,\n\nI'm interested in learning more about your ${prefilledService} services. Could we schedule a time to discuss?\n\nBest regards,`;
        }

        const mailtoUrl = this.createMailtoLink(email, {
          subject: emailSubject,
          body: emailBody,
          cc,
          bcc
        });

        window.location.href = mailtoUrl;
      } catch (error) {
        // Handle email client errors
        errorHandlingService.showUserFriendlyError(
          'Unable to open email client. Please copy the email address and contact us manually.',
          'warning'
        );
        
        // Provide fallback - copy email to clipboard if possible
        if (navigator.clipboard) {
          navigator.clipboard.writeText(email || this.CONTACT_INFO.email).then(() => {
            errorHandlingService.showUserFriendlyError(
              'Email address copied to clipboard.',
              'success',
              true,
              2000
            );
          });
        }
      }
    };
  }

  /**
   * Create phone click handler
   * @param {string} phone - Phone number
   * @param {Object} options - Phone options and tracking
   * @returns {Function} Click handler function
   */
  static createPhoneHandler(phone = null, options = {}) {
    const {
      trackingId = 'phone-click'
    } = options;

    return (e) => {
      e.preventDefault();
      
      try {
        // Track the phone click
        this.trackContactMethodClick(trackingId, 'phone', phone || this.CONTACT_INFO.phone);

        const telUrl = this.createTelLink(phone);
        window.location.href = telUrl;
      } catch (error) {
        // Handle phone dialing errors
        const phoneNumber = phone || this.CONTACT_INFO.phoneDisplay;
        errorHandlingService.showUserFriendlyError(
          `Unable to initiate call. Please dial ${phoneNumber} manually.`,
          'warning'
        );
        
        // Provide fallback - copy phone to clipboard if possible
        if (navigator.clipboard) {
          navigator.clipboard.writeText(phoneNumber).then(() => {
            errorHandlingService.showUserFriendlyError(
              'Phone number copied to clipboard.',
              'success',
              true,
              2000
            );
          });
        }
      }
    };
  }

  /**
   * Get email link props for React components
   * @param {string} email - Email address
   * @param {Object} options - Email options
   * @returns {Object} Props object for email links
   */
  static getEmailLinkProps(email = null, options = {}) {
    const {
      subject = '',
      body = '',
      cc = '',
      bcc = '',
      trackingId = 'email-click',
      prefilledService = null
    } = options;

    const mailtoUrl = this.createMailtoLink(email, { subject, body, cc, bcc });

    return {
      href: mailtoUrl,
      onClick: this.createEmailHandler(email, { 
        subject, 
        body, 
        cc, 
        bcc, 
        trackingId, 
        prefilledService 
      })
    };
  }

  /**
   * Get phone link props for React components
   * @param {string} phone - Phone number
   * @param {Object} options - Phone options
   * @returns {Object} Props object for phone links
   */
  static getPhoneLinkProps(phone = null, options = {}) {
    const {
      trackingId = 'phone-click'
    } = options;

    const telUrl = this.createTelLink(phone);

    return {
      href: telUrl,
      onClick: this.createPhoneHandler(phone, { trackingId })
    };
  }

  /**
   * Track contact method clicks for analytics
   * @param {string} trackingId - Unique identifier for the interaction
   * @param {string} method - Contact method (email, phone)
   * @param {string} target - The email address or phone number
   */
  static trackContactMethodClick(trackingId, method, target) {
    try {
      // Use the centralized analytics service
      analyticsService.trackContactMethodInteraction(method, target, trackingId);
    } catch (error) {
      console.warn('Error tracking contact method click:', error);
    }
  }

  /**
   * Format phone number for display
   * @param {string} phone - Phone number in E.164 format
   * @returns {string} Formatted phone number
   */
  static formatPhoneForDisplay(phone = null) {
    const targetPhone = phone || this.CONTACT_INFO.phone;
    
    // Convert +15551234567 to +1 (555) 123-4567
    if (targetPhone.startsWith('+1')) {
      const digits = targetPhone.slice(2);
      if (digits.length === 10) {
        return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      }
    }
    
    return targetPhone;
  }

  /**
   * Get default contact information
   * @returns {Object} Contact information object
   */
  static getContactInfo() {
    return {
      email: this.CONTACT_INFO.email,
      phone: this.CONTACT_INFO.phone,
      phoneDisplay: this.CONTACT_INFO.phoneDisplay
    };
  }

  /**
   * Create service-specific email handler
   * @param {string} serviceType - Type of service for pre-filled content
   * @param {Object} options - Additional options
   * @returns {Function} Click handler function
   */
  static createServiceEmailHandler(serviceType, options = {}) {
    const serviceSubjects = {
      'risk-strategy': 'Risk Strategy & Assessment Consultation',
      'program-build': 'Trust & Safety Program Build Consultation',
      'ai-ml-intelligence': 'AI/ML Risk Intelligence Consultation',
      'fractional-leadership': 'Fractional Leadership Discussion'
    };

    const serviceBodies = {
      'risk-strategy': 'Hi,\n\nI\'m interested in discussing risk strategy and assessment services for our organization. Could we schedule a consultation to explore how you can help?\n\nBest regards,',
      'program-build': 'Hi,\n\nWe\'re looking to build or enhance our trust & safety program and would like to discuss your consulting services. Could we set up a time to talk?\n\nBest regards,',
      'ai-ml-intelligence': 'Hi,\n\nI\'m interested in your AI/ML risk intelligence services and would like to learn more about how you can help our organization. Could we schedule a consultation?\n\nBest regards,',
      'fractional-leadership': 'Hi,\n\nWe\'re exploring fractional leadership options for our trust & safety organization. Could we discuss your availability and approach?\n\nBest regards,'
    };

    return this.createEmailHandler(null, {
      ...options,
      subject: serviceSubjects[serviceType] || `Inquiry about ${serviceType} services`,
      body: serviceBodies[serviceType] || `Hi,\n\nI'm interested in learning more about your ${serviceType} services. Could we schedule a time to discuss?\n\nBest regards,`,
      trackingId: `service-email-${serviceType}`,
      prefilledService: serviceType
    });
  }
}

export default ContactMethodService;