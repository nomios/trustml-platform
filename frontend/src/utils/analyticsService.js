/**
 * Analytics Service
 * Comprehensive tracking system for all user interactions, link clicks, downloads, and form submissions
 */

class AnalyticsService {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.pageLoadTime = Date.now();
    this.interactions = [];
    this.isEnabled = true;
    this.backendUrl = process.env.REACT_APP_BACKEND_URL || "";
    
    // Initialize session tracking
    this.initializeSession();
    
    // Track page load
    this.trackPageLoad();
    
    // Set up beforeunload tracking
    this.setupBeforeUnloadTracking();
  }

  /**
   * Generate unique session ID
   * @returns {string} Session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize session tracking
   */
  initializeSession() {
    try {
      // Store session info in sessionStorage
      sessionStorage.setItem('analytics_session_id', this.sessionId);
      sessionStorage.setItem('analytics_session_start', this.pageLoadTime.toString());
      
      // Track session start
      this.trackEvent('session_start', 'session', {
        session_id: this.sessionId,
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        referrer: document.referrer
      });
    } catch (error) {
      console.warn('Failed to initialize analytics session:', error);
    }
  }

  /**
   * Track page load event
   */
  trackPageLoad() {
    this.trackEvent('page_load', 'navigation', {
      url: window.location.href,
      path: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      title: document.title,
      load_time: Date.now() - this.pageLoadTime
    });
  }

  /**
   * Set up tracking for page unload
   */
  setupBeforeUnloadTracking() {
    window.addEventListener('beforeunload', () => {
      const sessionDuration = Date.now() - this.pageLoadTime;
      this.trackEvent('session_end', 'session', {
        session_duration: sessionDuration,
        interactions_count: this.interactions.length,
        page_url: window.location.href
      }, true); // Send immediately
    });
  }

  /**
   * Track general analytics event
   * @param {string} eventType - Type of event
   * @param {string} elementId - Element identifier
   * @param {Object} metadata - Additional event data
   * @param {boolean} immediate - Send immediately (for critical events)
   */
  async trackEvent(eventType, elementId, metadata = {}, immediate = false) {
    if (!this.isEnabled) return;

    const event = {
      event_type: eventType,
      element_id: elementId,
      session_id: this.sessionId,
      page_url: window.location.href,
      timestamp: new Date().toISOString(),
      metadata: {
        ...metadata,
        user_agent: navigator.userAgent,
        referrer: document.referrer
      }
    };

    // Store interaction locally
    this.interactions.push(event);

    try {
      if (this.backendUrl) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(`${this.backendUrl}/api/analytics/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
          signal: controller.signal,
          ...(immediate && { keepalive: true })
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Analytics request failed: ${response.status}`);
        }
      }

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics Event:', event);
      }
    } catch (error) {
      // Silently handle analytics errors - don't disrupt user experience
      if (error.name !== 'AbortError') {
        console.warn('Failed to track analytics event:', error);
      }
      
      // Store failed events for retry
      this.storeFailedEvent(event);
    }
  }

  /**
   * Track link click interactions
   * @param {string} linkId - Unique link identifier
   * @param {string} category - Link category
   * @param {string} url - Target URL
   * @param {Object} metadata - Additional link data
   */
  async trackLinkClick(linkId, category, url, metadata = {}) {
    const linkData = {
      link_id: linkId,
      link_category: category,
      url: url,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      metadata: {
        ...metadata,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        referrer: document.referrer
      }
    };

    try {
      if (this.backendUrl) {
        await fetch(`${this.backendUrl}/api/analytics/link-click`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(linkData)
        });
      }

      // Also track as general event
      await this.trackEvent('link_click', linkId, {
        category: category,
        url: url,
        ...metadata
      });
    } catch (error) {
      console.warn('Failed to track link click:', error);
    }
  }

  /**
   * Track button clicks
   * @param {string} buttonId - Button identifier
   * @param {string} buttonText - Button text content
   * @param {string} category - Button category
   * @param {Object} metadata - Additional button data
   */
  async trackButtonClick(buttonId, buttonText, category = 'button', metadata = {}) {
    await this.trackEvent('button_click', buttonId, {
      button_text: buttonText,
      category: category,
      ...metadata
    });
  }

  /**
   * Track form submissions
   * @param {string} formId - Form identifier
   * @param {Object} formData - Form data (sanitized)
   * @param {string} result - Submission result (success/error)
   */
  async trackFormSubmission(formId, formData = {}, result = 'success') {
    // Sanitize form data - remove sensitive information
    const sanitizedData = {
      form_fields: Object.keys(formData),
      field_count: Object.keys(formData).length,
      has_email: !!formData.email,
      has_phone: !!formData.phone,
      message_length: formData.message ? formData.message.length : 0,
      service_type: formData.service_type || formData.interested_in,
      result: result
    };

    await this.trackEvent('form_submission', formId, sanitizedData);
  }

  /**
   * Track resource downloads
   * @param {string} resourceId - Resource identifier
   * @param {string} resourceTitle - Resource title
   * @param {string} category - Resource category
   * @param {string} source - Download source/location
   */
  async trackResourceDownload(resourceId, resourceTitle, category, source = 'direct') {
    await this.trackEvent('resource_download', `download-${resourceId}`, {
      resource_id: resourceId,
      resource_title: resourceTitle,
      resource_category: category,
      download_source: source
    });
  }

  /**
   * Track scheduling interactions
   * @param {string} serviceType - Type of service being scheduled
   * @param {string} action - Action taken (click, open, etc.)
   * @param {string} source - Source of the scheduling action
   */
  async trackSchedulingInteraction(serviceType, action = 'click', source = 'button') {
    await this.trackEvent('scheduling_interaction', `schedule-${serviceType}`, {
      service_type: serviceType,
      action: action,
      source: source
    });
  }

  /**
   * Track contact method interactions
   * @param {string} method - Contact method (email, phone)
   * @param {string} target - Target email/phone
   * @param {string} context - Context of the interaction
   */
  async trackContactMethodInteraction(method, target, context = 'direct') {
    await this.trackEvent('contact_method_interaction', `contact-${method}`, {
      contact_method: method,
      target: target,
      context: context
    });
  }

  /**
   * Track navigation interactions
   * @param {string} targetSection - Target section or page
   * @param {string} source - Source of navigation
   * @param {string} method - Navigation method (click, scroll, etc.)
   */
  async trackNavigation(targetSection, source = 'menu', method = 'click') {
    await this.trackEvent('navigation', `nav-${targetSection}`, {
      target_section: targetSection,
      navigation_source: source,
      navigation_method: method
    });
  }

  /**
   * Track scroll depth
   * @param {number} percentage - Scroll percentage
   * @param {string} section - Current section
   */
  async trackScrollDepth(percentage, section = 'unknown') {
    // Only track at certain milestones to avoid spam
    const milestones = [25, 50, 75, 90, 100];
    if (milestones.includes(Math.floor(percentage))) {
      await this.trackEvent('scroll_depth', `scroll-${Math.floor(percentage)}`, {
        scroll_percentage: percentage,
        current_section: section,
        page_height: document.body.scrollHeight,
        viewport_height: window.innerHeight
      });
    }
  }

  /**
   * Track errors and exceptions
   * @param {string} errorType - Type of error
   * @param {string} errorMessage - Error message
   * @param {string} context - Context where error occurred
   */
  async trackError(errorType, errorMessage, context = 'unknown') {
    await this.trackEvent('error', `error-${errorType}`, {
      error_type: errorType,
      error_message: errorMessage,
      error_context: context,
      stack_trace: new Error().stack
    });
  }

  /**
   * Track user journey milestones
   * @param {string} milestone - Milestone identifier
   * @param {Object} metadata - Additional milestone data
   */
  async trackMilestone(milestone, metadata = {}) {
    await this.trackEvent('milestone', `milestone-${milestone}`, {
      milestone: milestone,
      session_duration: Date.now() - this.pageLoadTime,
      interactions_so_far: this.interactions.length,
      ...metadata
    });
  }

  /**
   * Store failed events for retry
   * @param {Object} event - Failed event data
   */
  storeFailedEvent(event) {
    try {
      const failedEvents = JSON.parse(localStorage.getItem('analytics_failed_events') || '[]');
      failedEvents.push(event);
      
      // Keep only last 50 failed events
      if (failedEvents.length > 50) {
        failedEvents.splice(0, failedEvents.length - 50);
      }
      
      localStorage.setItem('analytics_failed_events', JSON.stringify(failedEvents));
    } catch (error) {
      console.warn('Failed to store failed analytics event:', error);
    }
  }

  /**
   * Retry failed events
   */
  async retryFailedEvents() {
    try {
      const failedEvents = JSON.parse(localStorage.getItem('analytics_failed_events') || '[]');
      if (failedEvents.length === 0) return;

      const retryPromises = failedEvents.map(event => 
        fetch(`${this.backendUrl}/api/analytics/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event)
        }).catch(() => null) // Ignore retry failures
      );

      await Promise.all(retryPromises);
      
      // Clear failed events on successful retry
      localStorage.removeItem('analytics_failed_events');
    } catch (error) {
      console.warn('Failed to retry analytics events:', error);
    }
  }

  /**
   * Get session analytics summary
   * @returns {Object} Session summary
   */
  getSessionSummary() {
    return {
      session_id: this.sessionId,
      session_duration: Date.now() - this.pageLoadTime,
      interactions_count: this.interactions.length,
      page_url: window.location.href,
      user_agent: navigator.userAgent
    };
  }

  /**
   * Enable/disable analytics tracking
   * @param {boolean} enabled - Whether to enable tracking
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
    if (enabled) {
      this.trackEvent('analytics_enabled', 'system');
    }
  }

  /**
   * Create click handler with analytics tracking
   * @param {string} elementId - Element identifier
   * @param {string} category - Element category
   * @param {Function} originalHandler - Original click handler
   * @param {Object} metadata - Additional tracking data
   * @returns {Function} Enhanced click handler
   */
  createTrackedClickHandler(elementId, category, originalHandler = null, metadata = {}) {
    return async (event) => {
      // Track the click
      await this.trackEvent('element_click', elementId, {
        category: category,
        element_type: event.target.tagName.toLowerCase(),
        element_text: event.target.textContent?.trim().substring(0, 100),
        ...metadata
      });

      // Execute original handler if provided
      if (originalHandler) {
        return originalHandler(event);
      }
    };
  }

  /**
   * Set up automatic scroll tracking
   */
  setupScrollTracking() {
    let lastScrollPercentage = 0;
    let scrollTimeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);

        if (scrollPercentage > lastScrollPercentage + 10) {
          this.trackScrollDepth(scrollPercentage);
          lastScrollPercentage = scrollPercentage;
        }
      }, 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Set up automatic error tracking
   */
  setupErrorTracking() {
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError('javascript_error', event.message, event.filename);
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('unhandled_promise_rejection', event.reason?.toString(), 'promise');
    });
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

// Set up automatic tracking
analyticsService.setupScrollTracking();
analyticsService.setupErrorTracking();

// Retry failed events on page load
analyticsService.retryFailedEvents();

export default analyticsService;