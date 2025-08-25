/**
 * Error Handling Service
 * Provides graceful error handling, fallback systems, and user-friendly error messages
 */

import analyticsService from './analyticsService.js';

class ErrorHandlingService {
  constructor() {
    this.errorQueue = [];
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
    this.fallbackContactInfo = {
      email: 'michael@trustml.studio',
      phone: '+15551234567',
      phoneDisplay: '+1 (555) 123-4567'
    };
    
    // Set up global error handlers
    this.setupGlobalErrorHandlers();
  }

  /**
   * Set up global error handlers
   */
  setupGlobalErrorHandlers() {
    // Handle uncaught JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleJavaScriptError(event);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handlePromiseRejection(event);
    });

    // Handle network errors
    window.addEventListener('offline', () => {
      this.handleNetworkError('offline');
    });

    window.addEventListener('online', () => {
      this.handleNetworkError('online');
    });
  }

  /**
   * Handle JavaScript errors
   * @param {ErrorEvent} event - Error event
   */
  handleJavaScriptError(event) {
    const errorInfo = {
      type: 'javascript_error',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    };

    this.logError(errorInfo);
    
    // Don't show user notification for minor errors
    if (!this.isMinorError(errorInfo)) {
      this.showUserFriendlyError('An unexpected error occurred. Please try refreshing the page.');
    }
  }

  /**
   * Handle promise rejections
   * @param {PromiseRejectionEvent} event - Promise rejection event
   */
  handlePromiseRejection(event) {
    const errorInfo = {
      type: 'promise_rejection',
      message: event.reason?.toString() || 'Unknown promise rejection',
      stack: event.reason?.stack
    };

    this.logError(errorInfo);
    
    // Prevent default browser behavior
    event.preventDefault();
  }

  /**
   * Handle network errors
   * @param {string} status - Network status (online/offline)
   */
  handleNetworkError(status) {
    if (status === 'offline') {
      this.showUserFriendlyError(
        'You appear to be offline. Some features may not work properly.',
        'warning',
        false // Don't auto-dismiss
      );
    } else {
      this.showUserFriendlyError(
        'Connection restored. All features should now work normally.',
        'success',
        true,
        3000
      );
    }

    analyticsService.trackError('network_error', `Network ${status}`, 'connectivity');
  }

  /**
   * Handle API errors with fallback options
   * @param {Error} error - API error
   * @param {string} context - Context where error occurred
   * @param {Object} fallbackOptions - Fallback options
   */
  async handleApiError(error, context, fallbackOptions = {}) {
    const errorInfo = {
      type: 'api_error',
      message: error.message,
      context: context,
      status: error.status || 'unknown',
      stack: error.stack
    };

    this.logError(errorInfo);

    // Determine appropriate fallback based on context
    switch (context) {
      case 'contact_form':
        return this.handleContactFormError(error, fallbackOptions);
      
      case 'resource_download':
        return this.handleResourceDownloadError(error, fallbackOptions);
      
      case 'scheduling':
        return this.handleSchedulingError(error, fallbackOptions);
      
      case 'analytics':
        return this.handleAnalyticsError(error, fallbackOptions);
      
      default:
        return this.handleGenericApiError(error, fallbackOptions);
    }
  }

  /**
   * Handle contact form submission errors
   * @param {Error} error - Form submission error
   * @param {Object} fallbackOptions - Fallback options
   */
  handleContactFormError(error, fallbackOptions = {}) {
    const { formData } = fallbackOptions;

    // Show user-friendly error message
    this.showUserFriendlyError(
      'There was an issue submitting your message. Please try one of the alternative contact methods below.',
      'error'
    );

    // Provide fallback contact options
    const fallbackMessage = this.createFallbackContactMessage(formData);
    
    return {
      success: false,
      error: error.message,
      fallback: {
        type: 'contact_methods',
        message: fallbackMessage,
        options: [
          {
            type: 'email',
            label: 'Send Email Directly',
            action: () => this.openEmailFallback(formData),
            primary: true
          },
          {
            type: 'phone',
            label: 'Call Directly',
            action: () => this.openPhoneFallback(),
            primary: false
          },
          {
            type: 'retry',
            label: 'Try Again',
            action: () => fallbackOptions.retryCallback?.(),
            primary: false
          }
        ]
      }
    };
  }

  /**
   * Handle resource download errors
   * @param {Error} error - Download error
   * @param {Object} fallbackOptions - Fallback options
   */
  handleResourceDownloadError(error, fallbackOptions = {}) {
    const { resourceId, resourceTitle } = fallbackOptions;

    // Show user-friendly error message
    this.showUserFriendlyError(
      'The resource is temporarily unavailable. Please try again or contact us for assistance.',
      'error'
    );

    return {
      success: false,
      error: error.message,
      fallback: {
        type: 'resource_unavailable',
        message: `The resource "${resourceTitle}" is currently unavailable.`,
        options: [
          {
            type: 'retry',
            label: 'Try Again',
            action: () => fallbackOptions.retryCallback?.(),
            primary: true
          },
          {
            type: 'contact',
            label: 'Request via Email',
            action: () => this.requestResourceViaEmail(resourceId, resourceTitle),
            primary: false
          },
          {
            type: 'alternative',
            label: 'Browse Other Resources',
            action: () => fallbackOptions.alternativeCallback?.(),
            primary: false
          }
        ]
      }
    };
  }

  /**
   * Handle scheduling errors
   * @param {Error} error - Scheduling error
   * @param {Object} fallbackOptions - Fallback options
   */
  handleSchedulingError(error, fallbackOptions = {}) {
    const { serviceType } = fallbackOptions;

    // Show user-friendly error message
    this.showUserFriendlyError(
      'Unable to open the scheduling system. Please use an alternative booking method.',
      'error'
    );

    return {
      success: false,
      error: error.message,
      fallback: {
        type: 'scheduling_unavailable',
        message: 'The scheduling system is temporarily unavailable.',
        options: [
          {
            type: 'email',
            label: 'Schedule via Email',
            action: () => this.scheduleViaEmail(serviceType),
            primary: true
          },
          {
            type: 'phone',
            label: 'Call to Schedule',
            action: () => this.openPhoneFallback(),
            primary: false
          },
          {
            type: 'retry',
            label: 'Try Again',
            action: () => fallbackOptions.retryCallback?.(),
            primary: false
          }
        ]
      }
    };
  }

  /**
   * Handle analytics errors (silent failures)
   * @param {Error} error - Analytics error
   * @param {Object} fallbackOptions - Fallback options
   */
  handleAnalyticsError(error, fallbackOptions = {}) {
    // Analytics errors should be silent to users
    this.logError({
      type: 'analytics_error',
      message: error.message,
      context: 'analytics_tracking',
      stack: error.stack
    });

    // Store failed analytics events for retry
    if (fallbackOptions.eventData) {
      this.queueFailedAnalyticsEvent(fallbackOptions.eventData);
    }

    return {
      success: false,
      error: error.message,
      silent: true // Don't show user notification
    };
  }

  /**
   * Handle generic API errors
   * @param {Error} error - Generic API error
   * @param {Object} fallbackOptions - Fallback options
   */
  handleGenericApiError(error, fallbackOptions = {}) {
    let userMessage = 'A service is temporarily unavailable. Please try again later.';
    
    // Customize message based on error type
    if (error.status === 404) {
      userMessage = 'The requested resource was not found.';
    } else if (error.status === 500) {
      userMessage = 'A server error occurred. Please try again later.';
    } else if (error.status === 429) {
      userMessage = 'Too many requests. Please wait a moment and try again.';
    }

    this.showUserFriendlyError(userMessage, 'error');

    return {
      success: false,
      error: error.message,
      fallback: {
        type: 'generic_error',
        message: userMessage,
        options: [
          {
            type: 'retry',
            label: 'Try Again',
            action: () => fallbackOptions.retryCallback?.(),
            primary: true
          },
          {
            type: 'contact',
            label: 'Contact Support',
            action: () => this.openSupportContact(),
            primary: false
          }
        ]
      }
    };
  }

  /**
   * Create fallback contact message
   * @param {Object} formData - Original form data
   * @returns {string} Formatted message
   */
  createFallbackContactMessage(formData) {
    if (!formData) return '';

    const { first_name, last_name, company, interested_in, message } = formData;
    
    return `Hi,

My name is ${first_name} ${last_name} from ${company}.

I'm interested in ${interested_in}.

${message}

Best regards,
${first_name} ${last_name}`;
  }

  /**
   * Open email fallback with pre-filled content
   * @param {Object} formData - Form data to include
   */
  openEmailFallback(formData) {
    const subject = formData?.interested_in 
      ? `Inquiry about ${formData.interested_in}` 
      : 'General Inquiry';
    
    const body = this.createFallbackContactMessage(formData);
    
    const mailtoUrl = `mailto:${this.fallbackContactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoUrl;
    
    analyticsService.trackEvent('fallback_contact', 'email', {
      original_context: 'contact_form_error',
      has_form_data: !!formData
    });
  }

  /**
   * Open phone fallback
   */
  openPhoneFallback() {
    window.location.href = `tel:${this.fallbackContactInfo.phone}`;
    
    analyticsService.trackEvent('fallback_contact', 'phone', {
      original_context: 'contact_form_error'
    });
  }

  /**
   * Request resource via email
   * @param {string} resourceId - Resource identifier
   * @param {string} resourceTitle - Resource title
   */
  requestResourceViaEmail(resourceId, resourceTitle) {
    const subject = `Resource Request: ${resourceTitle}`;
    const body = `Hi,

I was trying to download the resource "${resourceTitle}" from your website, but encountered an issue.

Could you please send me this resource directly?

Thank you,`;

    const mailtoUrl = `mailto:${this.fallbackContactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoUrl;
    
    analyticsService.trackEvent('fallback_resource_request', 'email', {
      resource_id: resourceId,
      resource_title: resourceTitle
    });
  }

  /**
   * Schedule via email
   * @param {string} serviceType - Service type
   */
  scheduleViaEmail(serviceType) {
    const subject = `Consultation Request: ${serviceType}`;
    const body = `Hi,

I would like to schedule a consultation for ${serviceType}.

Please let me know your availability.

Best regards,`;

    const mailtoUrl = `mailto:${this.fallbackContactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoUrl;
    
    analyticsService.trackEvent('fallback_scheduling', 'email', {
      service_type: serviceType
    });
  }

  /**
   * Open support contact
   */
  openSupportContact() {
    const subject = 'Technical Support Request';
    const body = `Hi,

I encountered an issue while using your website and need assistance.

Please contact me to help resolve this issue.

Thank you,`;

    const mailtoUrl = `mailto:${this.fallbackContactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoUrl;
    
    analyticsService.trackEvent('support_contact', 'email', {
      context: 'error_fallback'
    });
  }

  /**
   * Show user-friendly error message
   * @param {string} message - Error message
   * @param {string} type - Message type (error, warning, success)
   * @param {boolean} autoDismiss - Whether to auto-dismiss
   * @param {number} duration - Auto-dismiss duration
   */
  showUserFriendlyError(message, type = 'error', autoDismiss = true, duration = 5000) {
    // Create error notification element
    const notification = document.createElement('div');
    notification.className = `error-notification error-notification--${type}`;
    notification.innerHTML = `
      <div class="error-notification__content">
        <div class="error-notification__icon">
          ${this.getNotificationIcon(type)}
        </div>
        <div class="error-notification__message">${message}</div>
        <button class="error-notification__close" onclick="this.parentElement.parentElement.remove()">
          ×
        </button>
      </div>
    `;

    // Add styles if not already present
    this.addNotificationStyles();

    // Add to page
    document.body.appendChild(notification);

    // Auto-dismiss if requested
    if (autoDismiss) {
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, duration);
    }

    // Track error notification
    analyticsService.trackEvent('error_notification_shown', 'error-handling', {
      message_type: type,
      auto_dismiss: autoDismiss,
      duration: duration
    });
  }

  /**
   * Get notification icon based on type
   * @param {string} type - Notification type
   * @returns {string} Icon HTML
   */
  getNotificationIcon(type) {
    const icons = {
      error: '⚠️',
      warning: '⚠️',
      success: '✅',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  }

  /**
   * Add notification styles to page
   */
  addNotificationStyles() {
    if (document.getElementById('error-notification-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'error-notification-styles';
    styles.textContent = `
      .error-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
      }
      
      .error-notification--error {
        border-left: 4px solid #ef4444;
      }
      
      .error-notification--warning {
        border-left: 4px solid #f59e0b;
      }
      
      .error-notification--success {
        border-left: 4px solid #10b981;
      }
      
      .error-notification--info {
        border-left: 4px solid #3b82f6;
      }
      
      .error-notification__content {
        display: flex;
        align-items: flex-start;
        padding: 16px;
        gap: 12px;
      }
      
      .error-notification__icon {
        font-size: 20px;
        flex-shrink: 0;
      }
      
      .error-notification__message {
        flex: 1;
        font-size: 14px;
        line-height: 1.4;
        color: #374151;
      }
      
      .error-notification__close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #9ca3af;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      
      .error-notification__close:hover {
        color: #374151;
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }

  /**
   * Log error for debugging and analytics
   * @param {Object} errorInfo - Error information
   */
  logError(errorInfo) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorInfo);
    }

    // Track error in analytics
    analyticsService.trackError(
      errorInfo.type,
      errorInfo.message,
      errorInfo.context || 'unknown'
    );

    // Store error for potential retry or debugging
    this.errorQueue.push({
      ...errorInfo,
      timestamp: new Date().toISOString()
    });

    // Keep only last 50 errors
    if (this.errorQueue.length > 50) {
      this.errorQueue.shift();
    }
  }

  /**
   * Queue failed analytics event for retry
   * @param {Object} eventData - Analytics event data
   */
  queueFailedAnalyticsEvent(eventData) {
    try {
      const failedEvents = JSON.parse(localStorage.getItem('failed_analytics_events') || '[]');
      failedEvents.push({
        ...eventData,
        failed_at: new Date().toISOString()
      });
      
      // Keep only last 100 failed events
      if (failedEvents.length > 100) {
        failedEvents.splice(0, failedEvents.length - 100);
      }
      
      localStorage.setItem('failed_analytics_events', JSON.stringify(failedEvents));
    } catch (error) {
      console.warn('Failed to queue analytics event:', error);
    }
  }

  /**
   * Check if error is minor (shouldn't show user notification)
   * @param {Object} errorInfo - Error information
   * @returns {boolean} Whether error is minor
   */
  isMinorError(errorInfo) {
    const minorErrors = [
      'Script error',
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded'
    ];
    
    return minorErrors.some(minor => 
      errorInfo.message?.includes(minor)
    );
  }

  /**
   * Get error summary for debugging
   * @returns {Object} Error summary
   */
  getErrorSummary() {
    return {
      total_errors: this.errorQueue.length,
      recent_errors: this.errorQueue.slice(-10),
      error_types: this.errorQueue.reduce((acc, error) => {
        acc[error.type] = (acc[error.type] || 0) + 1;
        return acc;
      }, {})
    };
  }

  /**
   * Clear error queue
   */
  clearErrorQueue() {
    this.errorQueue = [];
  }
}

// Create singleton instance
const errorHandlingService = new ErrorHandlingService();

export default errorHandlingService;