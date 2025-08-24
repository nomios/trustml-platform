/**
 * Service Integration Utility
 * Provides centralized integration and error boundary for all services
 */

import analyticsService from './analyticsService.js';
import errorHandlingService from './errorHandlingService.js';
import contactFormService from './contactFormService.js';
import resourceService from './resourceService.js';
import externalLinkService from './externalLinkService.js';
import contactMethodService from './contactMethodService.js';
import navigationService from './navigationService.js';
import schedulingService from './schedulingService.js';

class ServiceIntegration {
  constructor() {
    this.services = {
      analytics: analyticsService,
      errorHandling: errorHandlingService,
      contactForm: contactFormService,
      resource: resourceService,
      externalLink: externalLinkService,
      contactMethod: contactMethodService,
      navigation: navigationService,
      scheduling: schedulingService
    };

    this.initialized = false;
    this.initializationPromise = null;
  }

  /**
   * Initialize all services
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.initialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = this._performInitialization();
    await this.initializationPromise;
  }

  /**
   * Perform service initialization
   * @private
   */
  async _performInitialization() {
    try {
      // Initialize navigation service
      if (this.services.navigation.initialize) {
        this.services.navigation.initialize();
      }

      // Set up global error boundaries
      this.setupGlobalErrorBoundary();

      // Set up service health monitoring
      this.setupServiceHealthMonitoring();

      // Track initialization
      await this.services.analytics.trackMilestone('services_initialized', {
        services_count: Object.keys(this.services).length,
        initialization_time: Date.now()
      });

      this.initialized = true;
      console.log('Service integration initialized successfully');

    } catch (error) {
      console.error('Failed to initialize service integration:', error);
      this.services.errorHandling.showUserFriendlyError(
        'Some features may not work properly. Please refresh the page.',
        'warning'
      );
    }
  }

  /**
   * Set up global error boundary
   */
  setupGlobalErrorBoundary() {
    // Wrap critical service methods with error boundaries
    this.wrapServiceMethod('contactForm', 'submitContactForm');
    this.wrapServiceMethod('resource', 'downloadResource');
    this.wrapServiceMethod('scheduling', 'openScheduling');
    this.wrapServiceMethod('navigation', 'scrollToSection');
  }

  /**
   * Wrap service method with error boundary
   * @param {string} serviceName - Service name
   * @param {string} methodName - Method name
   */
  wrapServiceMethod(serviceName, methodName) {
    const service = this.services[serviceName];
    if (!service || !service[methodName]) return;

    const originalMethod = service[methodName];
    
    service[methodName] = async (...args) => {
      try {
        return await originalMethod.apply(service, args);
      } catch (error) {
        console.error(`Error in ${serviceName}.${methodName}:`, error);
        
        // Handle error based on service type
        return await this.services.errorHandling.handleApiError(
          error, 
          serviceName, 
          { 
            method: methodName,
            args: args,
            retryCallback: () => originalMethod.apply(service, args)
          }
        );
      }
    };
  }

  /**
   * Set up service health monitoring
   */
  setupServiceHealthMonitoring() {
    // Monitor backend connectivity
    this.monitorBackendHealth();

    // Monitor service performance
    this.monitorServicePerformance();

    // Set up periodic health checks
    setInterval(() => {
      this.performHealthCheck();
    }, 60000); // Every minute
  }

  /**
   * Monitor backend health
   */
  async monitorBackendHealth() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    if (!backendUrl) return;

    try {
      const response = await fetch(`${backendUrl}/api/`, {
        method: 'GET',
        timeout: 5000
      });

      if (response.ok) {
        this.services.analytics.trackEvent('backend_health_check', 'system', {
          status: 'healthy',
          response_time: Date.now()
        });
      } else {
        throw new Error(`Backend unhealthy: ${response.status}`);
      }
    } catch (error) {
      this.services.analytics.trackEvent('backend_health_check', 'system', {
        status: 'unhealthy',
        error: error.message
      });

      // Show warning if backend is down
      this.services.errorHandling.showUserFriendlyError(
        'Some features may be limited due to connectivity issues.',
        'warning',
        true,
        10000
      );
    }
  }

  /**
   * Monitor service performance
   */
  monitorServicePerformance() {
    // Track page load performance
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      
      this.services.analytics.trackEvent('page_performance', 'system', {
        load_time: loadTime,
        dom_ready_time: timing.domContentLoadedEventEnd - timing.navigationStart,
        first_paint: timing.responseStart - timing.navigationStart
      });
    }

    // Monitor memory usage if available
    if (window.performance && window.performance.memory) {
      const memory = window.performance.memory;
      this.services.analytics.trackEvent('memory_usage', 'system', {
        used_js_heap_size: memory.usedJSHeapSize,
        total_js_heap_size: memory.totalJSHeapSize,
        js_heap_size_limit: memory.jsHeapSizeLimit
      });
    }
  }

  /**
   * Perform periodic health check
   */
  async performHealthCheck() {
    const healthStatus = {
      timestamp: new Date().toISOString(),
      services: {},
      overall_status: 'healthy'
    };

    // Check each service
    for (const [serviceName, service] of Object.entries(this.services)) {
      try {
        // Basic service availability check
        if (typeof service === 'object' && service !== null) {
          healthStatus.services[serviceName] = 'healthy';
        } else {
          healthStatus.services[serviceName] = 'unavailable';
          healthStatus.overall_status = 'degraded';
        }
      } catch (error) {
        healthStatus.services[serviceName] = 'error';
        healthStatus.overall_status = 'degraded';
      }
    }

    // Track health status
    this.services.analytics.trackEvent('health_check', 'system', healthStatus);

    // Alert if services are degraded
    if (healthStatus.overall_status === 'degraded') {
      console.warn('Service health degraded:', healthStatus);
    }
  }

  /**
   * Get service by name
   * @param {string} serviceName - Service name
   * @returns {Object|null} Service instance
   */
  getService(serviceName) {
    return this.services[serviceName] || null;
  }

  /**
   * Check if service is available
   * @param {string} serviceName - Service name
   * @returns {boolean} Whether service is available
   */
  isServiceAvailable(serviceName) {
    const service = this.services[serviceName];
    return service && typeof service === 'object';
  }

  /**
   * Execute service method safely
   * @param {string} serviceName - Service name
   * @param {string} methodName - Method name
   * @param {...any} args - Method arguments
   * @returns {Promise<any>} Method result
   */
  async executeServiceMethod(serviceName, methodName, ...args) {
    const service = this.getService(serviceName);
    
    if (!service) {
      throw new Error(`Service '${serviceName}' not available`);
    }

    if (!service[methodName] || typeof service[methodName] !== 'function') {
      throw new Error(`Method '${methodName}' not available on service '${serviceName}'`);
    }

    try {
      return await service[methodName](...args);
    } catch (error) {
      console.error(`Error executing ${serviceName}.${methodName}:`, error);
      throw error;
    }
  }

  /**
   * Create tracked event handler
   * @param {string} eventType - Event type
   * @param {string} elementId - Element ID
   * @param {Function} handler - Original handler
   * @param {Object} metadata - Additional metadata
   * @returns {Function} Tracked handler
   */
  createTrackedHandler(eventType, elementId, handler, metadata = {}) {
    return async (event) => {
      try {
        // Track the interaction
        await this.services.analytics.trackEvent(eventType, elementId, metadata);

        // Execute original handler
        if (handler) {
          return await handler(event);
        }
      } catch (error) {
        // Handle errors gracefully
        await this.services.errorHandling.handleApiError(error, 'event_handler', {
          event_type: eventType,
          element_id: elementId,
          retryCallback: () => handler?.(event)
        });
      }
    };
  }

  /**
   * Create form submission handler with full error handling
   * @param {Object} options - Handler options
   * @returns {Function} Form submission handler
   */
  createFormSubmissionHandler(options = {}) {
    return async (formData) => {
      try {
        return await this.services.contactForm.submitContactForm(formData, options);
      } catch (error) {
        return await this.services.errorHandling.handleApiError(error, 'contact_form', {
          formData: formData,
          retryCallback: () => this.services.contactForm.submitContactForm(formData, options)
        });
      }
    };
  }

  /**
   * Create resource download handler with error handling
   * @param {string} resourceId - Resource ID
   * @param {Object} options - Download options
   * @returns {Function} Download handler
   */
  createResourceDownloadHandler(resourceId, options = {}) {
    return async () => {
      try {
        return await this.services.resource.downloadResource(resourceId, options);
      } catch (error) {
        return await this.services.errorHandling.handleApiError(error, 'resource_download', {
          resourceId: resourceId,
          retryCallback: () => this.services.resource.downloadResource(resourceId, options)
        });
      }
    };
  }

  /**
   * Create scheduling handler with error handling
   * @param {string} serviceType - Service type
   * @param {Object} options - Scheduling options
   * @returns {Function} Scheduling handler
   */
  createSchedulingHandler(serviceType, options = {}) {
    return async () => {
      try {
        return this.services.scheduling.openScheduling(serviceType, options.prefill, options.tracking);
      } catch (error) {
        return await this.services.errorHandling.handleApiError(error, 'scheduling', {
          serviceType: serviceType,
          retryCallback: () => this.services.scheduling.openScheduling(serviceType, options.prefill, options.tracking)
        });
      }
    };
  }

  /**
   * Get service integration status
   * @returns {Object} Integration status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      services_available: Object.keys(this.services).length,
      services_healthy: Object.entries(this.services).filter(([name, service]) => 
        service && typeof service === 'object'
      ).length,
      backend_url: process.env.REACT_APP_BACKEND_URL || 'not configured'
    };
  }
}

// Create singleton instance
const serviceIntegration = new ServiceIntegration();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    serviceIntegration.initialize();
  });
} else {
  serviceIntegration.initialize();
}

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.serviceIntegration = serviceIntegration;
}

export default serviceIntegration;