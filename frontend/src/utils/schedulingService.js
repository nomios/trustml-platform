// Scheduling service for Calendly integration

import analyticsService from './analyticsService.js';
import errorHandlingService from './errorHandlingService.js';

export const SchedulingService = {
  // Calendly configuration
  calendlyConfig: {
    baseUrl: 'https://calendly.com/michael-trustml',
    defaultEvent: 'consultation',
    
    // Service-specific Calendly links
    serviceEvents: {
      'risk-strategy': 'risk-strategy-consultation',
      'program-build': 'program-build-consultation', 
      'ai-ml-intelligence': 'ai-ml-consultation',
      'fractional-leadership': 'fractional-leadership-consultation',
      'general': 'consultation'
    }
  },

  // Generate Calendly URL for specific service
  getCalendlyUrl: (serviceType = 'general', prefill = {}) => {
    const { baseUrl, serviceEvents } = SchedulingService.calendlyConfig;
    const eventType = serviceEvents[serviceType] || serviceEvents.general;
    
    let url = `${baseUrl}/${eventType}`;
    
    // Add prefill parameters if provided
    if (Object.keys(prefill).length > 0) {
      const params = new URLSearchParams();
      
      if (prefill.name) params.set('name', prefill.name);
      if (prefill.email) params.set('email', prefill.email);
      if (prefill.company) params.set('a1', prefill.company); // Custom field
      if (prefill.message) params.set('a2', prefill.message); // Custom field
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    return url;
  },

  // Open Calendly scheduling for specific service
  openScheduling: (serviceType = 'general', prefill = {}, trackingData = {}) => {
    try {
      const calendlyUrl = SchedulingService.getCalendlyUrl(serviceType, prefill);
      
      // Track scheduling button click
      SchedulingService.trackSchedulingClick(serviceType, trackingData);
      
      // Open Calendly in new tab
      const newWindow = window.open(calendlyUrl, '_blank', 'noopener,noreferrer');
      
      // Handle popup blocker
      if (!newWindow) {
        throw new Error('Popup blocked');
      }
    } catch (error) {
      // Handle scheduling errors with fallback options
      errorHandlingService.handleApiError(error, 'scheduling', {
        serviceType: serviceType,
        retryCallback: () => SchedulingService.openScheduling(serviceType, prefill, trackingData)
      });
    }
  },

  // Track scheduling interactions
  trackSchedulingClick: async (serviceType, metadata = {}) => {
    try {
      // Use the centralized analytics service
      await analyticsService.trackSchedulingInteraction(serviceType, 'click', metadata.source || 'button');
    } catch (error) {
      console.error('Error tracking scheduling click:', error);
    }
  },

  // Embed Calendly widget (for inline scheduling)
  embedCalendly: (containerId, serviceType = 'general', options = {}) => {
    if (typeof window !== 'undefined' && window.Calendly) {
      const calendlyUrl = SchedulingService.getCalendlyUrl(serviceType);
      
      window.Calendly.initInlineWidget({
        url: calendlyUrl,
        parentElement: document.getElementById(containerId),
        prefill: options.prefill || {},
        utm: options.utm || {}
      });
    } else {
      console.warn('Calendly widget not loaded. Make sure to include the Calendly script.');
    }
  },

  // Load Calendly script dynamically
  loadCalendlyScript: () => {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && window.Calendly) {
        resolve(window.Calendly);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      
      script.onload = () => {
        resolve(window.Calendly);
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Calendly script'));
      };

      document.head.appendChild(script);
    });
  },

  // Service type display names
  getServiceDisplayName: (serviceType) => {
    const displayNames = {
      'risk-strategy': 'Risk Strategy & Assessment',
      'program-build': 'Trust & Safety Program Build',
      'ai-ml-intelligence': 'AI/ML Risk Intelligence', 
      'fractional-leadership': 'Fractional Leadership',
      'general': 'General Consultation'
    };
    
    return displayNames[serviceType] || 'Consultation';
  },

  // Get consultation duration by service type
  getConsultationDuration: (serviceType) => {
    const durations = {
      'risk-strategy': 30,
      'program-build': 45,
      'ai-ml-intelligence': 30,
      'fractional-leadership': 60,
      'general': 30
    };
    
    return durations[serviceType] || 30;
  }
};

export default SchedulingService;