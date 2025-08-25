/**
 * Error Monitor
 * Monitors and reports errors for debugging and optimization
 */

import analyticsService from './analyticsService';

class ErrorMonitor {
  constructor() {
    this.isEnabled = process.env.NODE_ENV !== 'test';
    this.backendUrl = process.env.REACT_APP_BACKEND_URL || "";
    this.errorQueue = [];
    this.maxQueueSize = 50;
    this.flushInterval = 30000; // 30 seconds
    this.errorCounts = new Map();
    this.rateLimits = new Map();
    
    if (this.isEnabled) {
      this.initializeErrorHandlers();
      this.startErrorReporting();
    }
  }

  /**
   * Initialize global error handlers
   */
  initializeErrorHandlers() {
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleJavaScriptError(event);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleUnhandledRejection(event);
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleResourceError(event);
      }
    }, true);

    // Handle network errors
    this.interceptFetch();
    this.interceptXHR();
  }

  /**
   * Handle JavaScript errors
   */
  handleJavaScriptError(event) {
    const error = {
      type: 'javascript_error',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error ? event.error.stack : null,
      timestamp: Date.now(),
      url: window.location.href,
      user_agent: navigator.userAgent,
      severity: this.determineSeverity(event.message, event.filename)
    };

    this.reportError(error);
  }

  /**
   * Handle unhandled promise rejections
   */
  handleUnhandledRejection(event) {
    const error = {
      type: 'unhandled_rejection',
      message: event.reason ? event.reason.toString() : 'Unknown rejection',
      stack: event.reason && event.reason.stack ? event.reason.stack : null,
      timestamp: Date.now(),
      url: window.location.href,
      user_agent: navigator.userAgent,
      severity: 'high'
    };

    this.reportError(error);
  }

  /**
   * Handle resource loading errors
   */
  handleResourceError(event) {
    const target = event.target;
    const error = {
      type: 'resource_error',
      message: `Failed to load resource: ${target.src || target.href}`,
      resource_type: target.tagName.toLowerCase(),
      resource_url: target.src || target.href,
      timestamp: Date.now(),
      url: window.location.href,
      severity: this.determineResourceErrorSeverity(target)
    };

    this.reportError(error);
  }

  /**
   * Intercept fetch requests to monitor network errors
   */
  interceptFetch() {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const startTime = performance.now();
      
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;
        
        // Monitor slow requests
        if (duration > 5000) { // Slower than 5 seconds
          this.reportSlowRequest(args[0], duration, 'fetch');
        }
        
        // Monitor failed requests
        if (!response.ok) {
          this.reportFailedRequest(args[0], response.status, response.statusText, 'fetch');
        }
        
        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        this.reportNetworkError(args[0], error, duration, 'fetch');
        throw error;
      }
    };
  }

  /**
   * Intercept XMLHttpRequest to monitor network errors
   */
  interceptXHR() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      this._errorMonitor = {
        method: method,
        url: url,
        startTime: null
      };
      return originalOpen.call(this, method, url, ...args);
    };
    
    XMLHttpRequest.prototype.send = function(...args) {
      if (this._errorMonitor) {
        this._errorMonitor.startTime = performance.now();
        
        this.addEventListener('loadend', () => {
          const duration = performance.now() - this._errorMonitor.startTime;
          
          if (this.status === 0 || this.status >= 400) {
            errorMonitor.reportFailedRequest(
              this._errorMonitor.url,
              this.status,
              this.statusText,
              'xhr'
            );
          }
          
          if (duration > 5000) {
            errorMonitor.reportSlowRequest(
              this._errorMonitor.url,
              duration,
              'xhr'
            );
          }
        });
        
        this.addEventListener('error', () => {
          const duration = performance.now() - this._errorMonitor.startTime;
          errorMonitor.reportNetworkError(
            this._errorMonitor.url,
            new Error('XMLHttpRequest failed'),
            duration,
            'xhr'
          );
        });
      }
      
      return originalSend.call(this, ...args);
    };
  }

  /**
   * Report network error
   */
  reportNetworkError(url, error, duration, requestType) {
    const errorReport = {
      type: 'network_error',
      message: error.message,
      url: url,
      duration: duration,
      request_type: requestType,
      timestamp: Date.now(),
      page_url: window.location.href,
      severity: 'high'
    };

    this.reportError(errorReport);
  }

  /**
   * Report failed request
   */
  reportFailedRequest(url, status, statusText, requestType) {
    const errorReport = {
      type: 'failed_request',
      message: `Request failed: ${status} ${statusText}`,
      url: url,
      status: status,
      status_text: statusText,
      request_type: requestType,
      timestamp: Date.now(),
      page_url: window.location.href,
      severity: status >= 500 ? 'high' : 'medium'
    };

    this.reportError(errorReport);
  }

  /**
   * Report slow request
   */
  reportSlowRequest(url, duration, requestType) {
    const errorReport = {
      type: 'slow_request',
      message: `Slow request: ${duration}ms`,
      url: url,
      duration: duration,
      request_type: requestType,
      timestamp: Date.now(),
      page_url: window.location.href,
      severity: duration > 10000 ? 'high' : 'medium'
    };

    this.reportError(errorReport);
  }

  /**
   * Report custom error
   */
  reportCustomError(error, context = {}) {
    const errorReport = {
      type: 'custom_error',
      message: error.message || error.toString(),
      stack: error.stack,
      context: context,
      timestamp: Date.now(),
      url: window.location.href,
      user_agent: navigator.userAgent,
      severity: context.severity || 'medium'
    };

    this.reportError(errorReport);
  }

  /**
   * Report error to queue
   */
  reportError(error) {
    if (!this.isEnabled) return;

    try {
      // Rate limiting to prevent spam
      const errorKey = `${error.type}_${error.message}`;
      if (this.isRateLimited(errorKey)) {
        return;
      }

      // Add error to queue
      this.errorQueue.push({
        ...error,
        id: this.generateErrorId(),
        session_id: this.getSessionId()
      });

      // Maintain queue size
      if (this.errorQueue.length > this.maxQueueSize) {
        this.errorQueue.shift();
      }

      // Track error counts
      this.incrementErrorCount(errorKey);

      // Report to analytics
      analyticsService.trackError(error.type, error.message, error.context || 'unknown');

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error monitored:', error);
      }

      // Immediate reporting for critical errors
      if (error.severity === 'critical') {
        this.flushErrors();
      }
    } catch (reportError) {
      console.warn('Failed to report error:', reportError);
    }
  }

  /**
   * Check if error is rate limited
   */
  isRateLimited(errorKey) {
    const now = Date.now();
    const limit = this.rateLimits.get(errorKey);
    
    if (!limit) {
      this.rateLimits.set(errorKey, { count: 1, resetTime: now + 60000 }); // 1 minute window
      return false;
    }
    
    if (now > limit.resetTime) {
      this.rateLimits.set(errorKey, { count: 1, resetTime: now + 60000 });
      return false;
    }
    
    if (limit.count >= 10) { // Max 10 errors per minute per type
      return true;
    }
    
    limit.count++;
    return false;
  }

  /**
   * Increment error count
   */
  incrementErrorCount(errorKey) {
    const count = this.errorCounts.get(errorKey) || 0;
    this.errorCounts.set(errorKey, count + 1);
  }

  /**
   * Start error reporting interval
   */
  startErrorReporting() {
    setInterval(() => {
      this.flushErrors();
    }, this.flushInterval);

    // Flush errors on page unload
    window.addEventListener('beforeunload', () => {
      this.flushErrors(true);
    });

    // Flush errors on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.flushErrors(true);
      }
    });
  }

  /**
   * Flush errors to backend
   */
  async flushErrors(immediate = false) {
    if (this.errorQueue.length === 0) return;

    const errorsToSend = [...this.errorQueue];
    this.errorQueue = [];

    try {
      const payload = {
        errors: errorsToSend,
        timestamp: Date.now(),
        session_id: this.getSessionId(),
        page_url: window.location.href,
        user_agent: navigator.userAgent
      };

      if (immediate && 'sendBeacon' in navigator) {
        // Use sendBeacon for immediate/unload scenarios
        navigator.sendBeacon(
          `${this.backendUrl}/api/errors/batch`,
          JSON.stringify(payload)
        );
      } else {
        // Use fetch for regular reporting
        await fetch(`${this.backendUrl}/api/errors/batch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
          keepalive: immediate
        });
      }
    } catch (error) {
      console.warn('Failed to flush errors to backend:', error);
      // Re-add errors to queue for retry
      this.errorQueue.unshift(...errorsToSend.slice(0, this.maxQueueSize - this.errorQueue.length));
    }
  }

  /**
   * Determine error severity
   */
  determineSeverity(message, filename) {
    // Critical errors
    if (message.includes('ChunkLoadError') || 
        message.includes('Loading chunk') ||
        message.includes('Script error')) {
      return 'critical';
    }

    // High severity errors
    if (message.includes('TypeError') ||
        message.includes('ReferenceError') ||
        message.includes('SyntaxError')) {
      return 'high';
    }

    // Medium severity for third-party scripts
    if (filename && (filename.includes('google') || 
                     filename.includes('facebook') ||
                     filename.includes('twitter'))) {
      return 'low';
    }

    return 'medium';
  }

  /**
   * Determine resource error severity
   */
  determineResourceErrorSeverity(element) {
    const tagName = element.tagName.toLowerCase();
    
    if (tagName === 'script') {
      return 'high';
    } else if (tagName === 'link' && element.rel === 'stylesheet') {
      return 'medium';
    } else if (tagName === 'img') {
      return 'low';
    }
    
    return 'medium';
  }

  /**
   * Generate unique error ID
   */
  generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('error_monitor_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('error_monitor_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const stats = {
      total_errors: Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0),
      error_types: Object.fromEntries(this.errorCounts),
      queue_size: this.errorQueue.length,
      rate_limited_errors: this.rateLimits.size
    };

    return stats;
  }

  /**
   * Clear error statistics
   */
  clearStats() {
    this.errorCounts.clear();
    this.rateLimits.clear();
    this.errorQueue = [];
  }

  /**
   * Set error reporting configuration
   */
  configure(config) {
    if (config.maxQueueSize) this.maxQueueSize = config.maxQueueSize;
    if (config.flushInterval) this.flushInterval = config.flushInterval;
    if (config.backendUrl) this.backendUrl = config.backendUrl;
  }

  /**
   * Enable/disable error monitoring
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  /**
   * Create error boundary for React components
   */
  createErrorBoundary() {
    const errorMonitor = this;
    
    return class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }

      componentDidCatch(error, errorInfo) {
        errorMonitor.reportCustomError(error, {
          component_stack: errorInfo.componentStack,
          error_boundary: true,
          severity: 'high'
        });
      }

      render() {
        if (this.state.hasError) {
          return this.props.fallback || React.createElement('div', {
            style: { padding: '20px', textAlign: 'center' }
          }, 'Something went wrong. Please refresh the page.');
        }

        return this.props.children;
      }
    };
  }

  /**
   * Wrap function with error monitoring
   */
  wrapFunction(fn, context = {}) {
    return (...args) => {
      try {
        const result = fn.apply(this, args);
        
        // Handle async functions
        if (result && typeof result.then === 'function') {
          return result.catch(error => {
            this.reportCustomError(error, {
              ...context,
              function_name: fn.name,
              async: true
            });
            throw error;
          });
        }
        
        return result;
      } catch (error) {
        this.reportCustomError(error, {
          ...context,
          function_name: fn.name,
          async: false
        });
        throw error;
      }
    };
  }
}

// Create singleton instance
const errorMonitor = new ErrorMonitor();

export default errorMonitor;