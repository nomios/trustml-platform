/**
 * Contact Form Service
 * Handles contact form submissions with error handling and fallback systems
 */

import analyticsService from './analyticsService.js';
import errorHandlingService from './errorHandlingService.js';

class ContactFormService {
  constructor() {
    this.web3formsUrl = 'https://api.web3forms.com/submit';
    this.web3formsAccessKey = process.env.REACT_APP_WEB3FORMS_ACCESS_KEY || '64a4d871-b84c-4c19-ae0b-4592b5d683bb';
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }

  /**
   * Submit contact form with error handling and fallbacks
   * @param {Object} formData - Form data
   * @param {Object} options - Submission options
   * @returns {Promise<Object>} Submission result
   */
  async submitContactForm(formData, options = {}) {
    const {
      retryCount = 0,
      showSuccessMessage = true,
      trackSubmission = true
    } = options;

    try {
      // Validate form data
      const validationResult = this.validateFormData(formData);
      if (!validationResult.isValid) {
        throw new Error(validationResult.message);
      }

      // Track form submission attempt
      if (trackSubmission) {
        await analyticsService.trackFormSubmission('contact-form', formData, 'attempt');
      }

      // Submit via Web3Forms
      const response = await this.submitToBackend(formData);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      // Track successful submission
      if (trackSubmission) {
        await analyticsService.trackFormSubmission('contact-form', formData, 'success');
      }

      // Show success message
      if (showSuccessMessage) {
        errorHandlingService.showUserFriendlyError(
          'Thank you for your message! We\'ll get back to you within 24 hours.',
          'success',
          true,
          5000
        );
      }

      return {
        success: true,
        data: result,
        message: 'Form submitted successfully'
      };

    } catch (error) {
      // Track failed submission
      if (trackSubmission) {
        await analyticsService.trackFormSubmission('contact-form', formData, 'error');
      }

      // Handle submission error with fallbacks
      return await this.handleSubmissionError(error, formData, options);
    }
  }

  /**
   * Submit form data to Web3Forms
   * @param {Object} formData - Form data
   * @returns {Promise<Response>} Fetch response
   */
  async submitToBackend(formData) {
    if (!this.web3formsAccessKey) {
      throw new Error('Web3Forms access key not configured');
    }

    const payload = {
      access_key: this.web3formsAccessKey,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      company: formData.company,
      role: formData.role,
      interested_in: formData.interested_in,
      service_type: formData.service_type,
      urgency: formData.urgency,
      message: formData.message,
      name: `${formData.first_name || ''} ${formData.last_name || ''}`.trim(),
      subject: `New Contact Request - ${formData.service_type || formData.interested_in || 'General'}`
    };

    const response = await fetch(this.web3formsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return response;
  }

  /**
   * Validate form data
   * @param {Object} formData - Form data to validate
   * @returns {Object} Validation result
   */
  validateFormData(formData) {
    const errors = [];

    // Required fields
    if (!formData.first_name?.trim()) {
      errors.push('First name is required');
    }

    if (!formData.last_name?.trim()) {
      errors.push('Last name is required');
    }

    if (!formData.email?.trim()) {
      errors.push('Email address is required');
    } else if (!this.isValidEmail(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!formData.company?.trim()) {
      errors.push('Company name is required');
    }

    if (!formData.interested_in?.trim()) {
      errors.push('Please select what you\'re interested in');
    }

    if (!formData.message?.trim()) {
      errors.push('Message is required');
    } else if (formData.message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      message: errors.length > 0 ? errors.join(', ') : null
    };
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Whether email is valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Handle form submission errors
   * @param {Error} error - Submission error
   * @param {Object} formData - Original form data
   * @param {Object} options - Submission options
   * @returns {Promise<Object>} Error handling result
   */
  async handleSubmissionError(error, formData, options = {}) {
    const { retryCount = 0 } = options;

    // Check if we should retry
    if (retryCount < this.maxRetries && this.shouldRetry(error)) {
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retryCount + 1)));
      
      // Retry submission
      return await this.submitContactForm(formData, {
        ...options,
        retryCount: retryCount + 1,
        showSuccessMessage: true,
        trackSubmission: false // Don't double-track retries
      });
    }

    // Handle error with fallback options
    const fallbackResult = await errorHandlingService.handleApiError(error, 'contact_form', {
      formData: formData,
      retryCallback: () => this.submitContactForm(formData, {
        ...options,
        retryCount: 0,
        showSuccessMessage: true,
        trackSubmission: true
      })
    });

    return fallbackResult;
  }

  /**
   * Determine if error should trigger a retry
   * @param {Error} error - Error to check
   * @returns {boolean} Whether to retry
   */
  shouldRetry(error) {
    // Retry on network errors, timeouts, and 5xx server errors
    const retryableErrors = [
      'NetworkError',
      'TimeoutError',
      'Failed to fetch',
      'Server error: 5'
    ];

    return retryableErrors.some(retryable => 
      error.message.includes(retryable)
    );
  }

  /**
   * Create form submission handler
   * @param {Object} options - Handler options
   * @returns {Function} Form submission handler
   */
  createSubmissionHandler(options = {}) {
    return async (formData) => {
      return await this.submitContactForm(formData, options);
    };
  }

  /**
   * Pre-fill form data based on service type
   * @param {string} serviceType - Service type
   * @param {Object} existingData - Existing form data
   * @returns {Object} Pre-filled form data
   */
  prefilFormData(serviceType, existingData = {}) {
    const serviceMessages = {
      'risk-strategy': 'I\'m interested in discussing risk strategy and assessment services for our organization.',
      'program-build': 'We\'re looking to build or enhance our trust & safety program and would like to explore your consulting services.',
      'ai-ml-intelligence': 'I\'m interested in your AI/ML risk intelligence services and how they can help our organization.',
      'fractional-leadership': 'We\'re exploring fractional leadership options for our trust & safety organization.'
    };

    const serviceSubjects = {
      'risk-strategy': 'Risk Strategy & Assessment',
      'program-build': 'Trust & Safety Program Build',
      'ai-ml-intelligence': 'AI/ML Risk Intelligence',
      'fractional-leadership': 'Fractional Leadership'
    };

    return {
      ...existingData,
      interested_in: serviceSubjects[serviceType] || existingData.interested_in || '',
      service_type: serviceType || existingData.service_type || '',
      message: existingData.message || serviceMessages[serviceType] || ''
    };
  }

  /**
   * Get form field validation state
   * @param {string} fieldName - Field name
   * @param {*} value - Field value
   * @param {Object} formData - Complete form data
   * @returns {Object} Validation state
   */
  getFieldValidation(fieldName, value, formData = {}) {
    const validation = { isValid: true, message: '' };

    switch (fieldName) {
      case 'first_name':
        if (!value?.trim()) {
          validation.isValid = false;
          validation.message = 'First name is required';
        }
        break;

      case 'last_name':
        if (!value?.trim()) {
          validation.isValid = false;
          validation.message = 'Last name is required';
        }
        break;

      case 'email':
        if (!value?.trim()) {
          validation.isValid = false;
          validation.message = 'Email address is required';
        } else if (!this.isValidEmail(value)) {
          validation.isValid = false;
          validation.message = 'Please enter a valid email address';
        }
        break;

      case 'company':
        if (!value?.trim()) {
          validation.isValid = false;
          validation.message = 'Company name is required';
        }
        break;

      case 'interested_in':
        if (!value?.trim()) {
          validation.isValid = false;
          validation.message = 'Please select what you\'re interested in';
        }
        break;

      case 'message':
        if (!value?.trim()) {
          validation.isValid = false;
          validation.message = 'Message is required';
        } else if (value.trim().length < 10) {
          validation.isValid = false;
          validation.message = 'Message must be at least 10 characters long';
        }
        break;
    }

    return validation;
  }

  /**
   * Get available service options
   * @returns {Array} Service options
   */
  getServiceOptions() {
    return [
      { value: 'risk-strategy', label: 'Risk Strategy & Assessment' },
      { value: 'program-build', label: 'Trust & Safety Program Build' },
      { value: 'ai-ml-intelligence', label: 'AI/ML Risk Intelligence' },
      { value: 'fractional-leadership', label: 'Fractional Leadership' },
      { value: 'general', label: 'General Consultation' },
      { value: 'other', label: 'Other' }
    ];
  }

  /**
   * Get urgency options
   * @returns {Array} Urgency options
   */
  getUrgencyOptions() {
    return [
      { value: 'low', label: 'Low - General inquiry' },
      { value: 'normal', label: 'Normal - Within a week' },
      { value: 'high', label: 'High - Within 2-3 days' },
      { value: 'urgent', label: 'Urgent - ASAP' }
    ];
  }

  /**
   * Track form interaction
   * @param {string} action - Action type
   * @param {string} field - Field name
   * @param {Object} metadata - Additional metadata
   */
  async trackFormInteraction(action, field, metadata = {}) {
    await analyticsService.trackEvent('form_interaction', `contact-form-${field}`, {
      action: action,
      field: field,
      ...metadata
    });
  }

  /**
   * Save form data to local storage (for recovery)
   * @param {Object} formData - Form data to save
   */
  saveFormDataLocally(formData) {
    try {
      const dataToSave = {
        ...formData,
        saved_at: new Date().toISOString()
      };
      localStorage.setItem('contact_form_draft', JSON.stringify(dataToSave));
    } catch (error) {
      console.warn('Failed to save form data locally:', error);
    }
  }

  /**
   * Load saved form data from local storage
   * @returns {Object|null} Saved form data
   */
  loadSavedFormData() {
    try {
      const savedData = localStorage.getItem('contact_form_draft');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        
        // Check if data is not too old (24 hours)
        const savedAt = new Date(parsed.saved_at);
        const now = new Date();
        const hoursDiff = (now - savedAt) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          delete parsed.saved_at;
          return parsed;
        } else {
          // Remove old data
          localStorage.removeItem('contact_form_draft');
        }
      }
    } catch (error) {
      console.warn('Failed to load saved form data:', error);
    }
    
    return null;
  }

  /**
   * Clear saved form data
   */
  clearSavedFormData() {
    try {
      localStorage.removeItem('contact_form_draft');
    } catch (error) {
      console.warn('Failed to clear saved form data:', error);
    }
  }
}

// Create singleton instance
const contactFormService = new ContactFormService();

export default contactFormService;