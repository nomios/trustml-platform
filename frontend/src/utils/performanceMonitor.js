/**
 * Performance Monitor
 * Monitors and tracks performance metrics for optimization
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.isEnabled = process.env.NODE_ENV !== 'test';
    this.backendUrl = process.env.REACT_APP_BACKEND_URL || "";
    
    if (this.isEnabled) {
      this.initializeObservers();
      this.startPerformanceTracking();
    }
  }

  /**
   * Initialize performance observers
   */
  initializeObservers() {
    try {
      // Navigation timing observer
      if ('PerformanceObserver' in window) {
        const navObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordNavigationTiming(entry);
          }
        });
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.set('navigation', navObserver);

        // Resource timing observer
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordResourceTiming(entry);
          }
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.set('resource', resourceObserver);

        // Measure observer for custom metrics
        const measureObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordCustomMeasure(entry);
          }
        });
        measureObserver.observe({ entryTypes: ['measure'] });
        this.observers.set('measure', measureObserver);

        // Long task observer
        if ('PerformanceLongTaskTiming' in window) {
          const longTaskObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              this.recordLongTask(entry);
            }
          });
          longTaskObserver.observe({ entryTypes: ['longtask'] });
          this.observers.set('longtask', longTaskObserver);
        }
      }
    } catch (error) {
      console.warn('Failed to initialize performance observers:', error);
    }
  }

  /**
   * Start performance tracking
   */
  startPerformanceTracking() {
    // Track initial page load
    if (document.readyState === 'complete') {
      this.recordPageLoadMetrics();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.recordPageLoadMetrics(), 0);
      });
    }

    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      this.recordVisibilityChange();
    });

    // Track memory usage periodically
    if ('memory' in performance) {
      setInterval(() => {
        this.recordMemoryUsage();
      }, 30000); // Every 30 seconds
    }
  }

  /**
   * Record navigation timing metrics
   */
  recordNavigationTiming(entry) {
    const metrics = {
      dns_lookup: entry.domainLookupEnd - entry.domainLookupStart,
      tcp_connection: entry.connectEnd - entry.connectStart,
      ssl_negotiation: entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0,
      request_time: entry.responseStart - entry.requestStart,
      response_time: entry.responseEnd - entry.responseStart,
      dom_processing: entry.domContentLoadedEventStart - entry.responseEnd,
      dom_content_loaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      load_event: entry.loadEventEnd - entry.loadEventStart,
      total_load_time: entry.loadEventEnd - entry.navigationStart,
      first_paint: this.getFirstPaint(),
      first_contentful_paint: this.getFirstContentfulPaint(),
      largest_contentful_paint: this.getLargestContentfulPaint()
    };

    this.metrics.set('navigation', metrics);
    this.reportMetrics('navigation_timing', metrics);
  }

  /**
   * Record resource timing metrics
   */
  recordResourceTiming(entry) {
    const resourceMetrics = {
      name: entry.name,
      type: this.getResourceType(entry.name),
      duration: entry.duration,
      size: entry.transferSize || entry.encodedBodySize,
      cached: entry.transferSize === 0 && entry.encodedBodySize > 0,
      start_time: entry.startTime,
      dns_time: entry.domainLookupEnd - entry.domainLookupStart,
      connect_time: entry.connectEnd - entry.connectStart,
      request_time: entry.responseStart - entry.requestStart,
      response_time: entry.responseEnd - entry.responseStart
    };

    // Track slow resources
    if (entry.duration > 1000) { // Slower than 1 second
      this.recordSlowResource(resourceMetrics);
    }

    // Track large resources
    if (resourceMetrics.size > 1024 * 1024) { // Larger than 1MB
      this.recordLargeResource(resourceMetrics);
    }

    this.reportMetrics('resource_timing', resourceMetrics);
  }

  /**
   * Record custom performance measures
   */
  recordCustomMeasure(entry) {
    const measureMetrics = {
      name: entry.name,
      duration: entry.duration,
      start_time: entry.startTime,
      timestamp: Date.now()
    };

    this.metrics.set(`measure_${entry.name}`, measureMetrics);
    this.reportMetrics('custom_measure', measureMetrics);
  }

  /**
   * Record long tasks that block the main thread
   */
  recordLongTask(entry) {
    const longTaskMetrics = {
      duration: entry.duration,
      start_time: entry.startTime,
      attribution: entry.attribution ? entry.attribution.map(attr => ({
        name: attr.name,
        container_type: attr.containerType,
        container_src: attr.containerSrc,
        container_id: attr.containerId,
        container_name: attr.containerName
      })) : []
    };

    this.reportMetrics('long_task', longTaskMetrics);
    
    // Alert for very long tasks
    if (entry.duration > 100) {
      console.warn(`Long task detected: ${entry.duration}ms`, longTaskMetrics);
    }
  }

  /**
   * Record page load metrics
   */
  recordPageLoadMetrics() {
    const timing = performance.timing;
    const navigation = performance.getEntriesByType('navigation')[0];

    const loadMetrics = {
      page_load_time: timing.loadEventEnd - timing.navigationStart,
      dom_ready_time: timing.domContentLoadedEventEnd - timing.navigationStart,
      first_byte_time: timing.responseStart - timing.navigationStart,
      dom_processing_time: timing.domComplete - timing.domLoading,
      resource_load_time: timing.loadEventEnd - timing.domContentLoadedEventEnd,
      redirect_time: timing.redirectEnd - timing.redirectStart,
      cache_time: timing.domainLookupStart - timing.fetchStart,
      dns_time: timing.domainLookupEnd - timing.domainLookupStart,
      tcp_time: timing.connectEnd - timing.connectStart,
      request_time: timing.responseEnd - timing.requestStart,
      unload_time: timing.unloadEventEnd - timing.unloadEventStart,
      
      // Core Web Vitals
      first_contentful_paint: this.getFirstContentfulPaint(),
      largest_contentful_paint: this.getLargestContentfulPaint(),
      first_input_delay: this.getFirstInputDelay(),
      cumulative_layout_shift: this.getCumulativeLayoutShift(),
      
      // Additional metrics
      connection_type: this.getConnectionType(),
      device_memory: this.getDeviceMemory(),
      hardware_concurrency: navigator.hardwareConcurrency || 'unknown'
    };

    this.metrics.set('page_load', loadMetrics);
    this.reportMetrics('page_load', loadMetrics);
    
    // Check for performance issues
    this.analyzePerformanceIssues(loadMetrics);
  }

  /**
   * Record memory usage
   */
  recordMemoryUsage() {
    if ('memory' in performance) {
      const memoryMetrics = {
        used_js_heap_size: performance.memory.usedJSHeapSize,
        total_js_heap_size: performance.memory.totalJSHeapSize,
        js_heap_size_limit: performance.memory.jsHeapSizeLimit,
        memory_usage_percentage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100,
        timestamp: Date.now()
      };

      this.metrics.set('memory_usage', memoryMetrics);
      
      // Alert for high memory usage
      if (memoryMetrics.memory_usage_percentage > 80) {
        console.warn('High memory usage detected:', memoryMetrics);
        this.reportMetrics('memory_warning', memoryMetrics);
      }
    }
  }

  /**
   * Record visibility change
   */
  recordVisibilityChange() {
    const visibilityMetrics = {
      visibility_state: document.visibilityState,
      hidden: document.hidden,
      timestamp: Date.now()
    };

    this.reportMetrics('visibility_change', visibilityMetrics);
  }

  /**
   * Record slow resource
   */
  recordSlowResource(resourceMetrics) {
    console.warn('Slow resource detected:', resourceMetrics);
    this.reportMetrics('slow_resource', resourceMetrics);
  }

  /**
   * Record large resource
   */
  recordLargeResource(resourceMetrics) {
    console.warn('Large resource detected:', resourceMetrics);
    this.reportMetrics('large_resource', resourceMetrics);
  }

  /**
   * Get First Paint timing
   */
  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }

  /**
   * Get First Contentful Paint timing
   */
  getFirstContentfulPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : null;
  }

  /**
   * Get Largest Contentful Paint timing
   */
  getLargestContentfulPaint() {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry ? lastEntry.startTime : null);
          observer.disconnect();
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Timeout after 10 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(null);
        }, 10000);
      } else {
        resolve(null);
      }
    });
  }

  /**
   * Get First Input Delay
   */
  getFirstInputDelay() {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const firstInput = list.getEntries()[0];
          resolve(firstInput ? firstInput.processingStart - firstInput.startTime : null);
          observer.disconnect();
        });
        observer.observe({ entryTypes: ['first-input'] });
        
        // Timeout after 30 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(null);
        }, 30000);
      } else {
        resolve(null);
      }
    });
  }

  /**
   * Get Cumulative Layout Shift
   */
  getCumulativeLayoutShift() {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        });
        observer.observe({ entryTypes: ['layout-shift'] });
        
        // Resolve after 10 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 10000);
      } else {
        resolve(null);
      }
    });
  }

  /**
   * Get connection type
   */
  getConnectionType() {
    if ('connection' in navigator) {
      return {
        effective_type: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        save_data: navigator.connection.saveData
      };
    }
    return null;
  }

  /**
   * Get device memory
   */
  getDeviceMemory() {
    return navigator.deviceMemory || null;
  }

  /**
   * Get resource type from URL
   */
  getResourceType(url) {
    if (url.includes('.js')) return 'javascript';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return 'font';
    if (url.includes('/api/')) return 'api';
    return 'other';
  }

  /**
   * Analyze performance issues
   */
  analyzePerformanceIssues(metrics) {
    const issues = [];

    // Check page load time
    if (metrics.page_load_time > 3000) {
      issues.push({
        type: 'slow_page_load',
        severity: 'high',
        value: metrics.page_load_time,
        threshold: 3000,
        message: 'Page load time exceeds 3 seconds'
      });
    }

    // Check First Contentful Paint
    if (metrics.first_contentful_paint > 2500) {
      issues.push({
        type: 'slow_fcp',
        severity: 'medium',
        value: metrics.first_contentful_paint,
        threshold: 2500,
        message: 'First Contentful Paint is slower than 2.5 seconds'
      });
    }

    // Check Largest Contentful Paint
    if (metrics.largest_contentful_paint > 4000) {
      issues.push({
        type: 'slow_lcp',
        severity: 'high',
        value: metrics.largest_contentful_paint,
        threshold: 4000,
        message: 'Largest Contentful Paint is slower than 4 seconds'
      });
    }

    // Check DNS lookup time
    if (metrics.dns_time > 200) {
      issues.push({
        type: 'slow_dns',
        severity: 'medium',
        value: metrics.dns_time,
        threshold: 200,
        message: 'DNS lookup time is slower than 200ms'
      });
    }

    // Check request time
    if (metrics.request_time > 1000) {
      issues.push({
        type: 'slow_request',
        severity: 'high',
        value: metrics.request_time,
        threshold: 1000,
        message: 'Request time is slower than 1 second'
      });
    }

    if (issues.length > 0) {
      console.warn('Performance issues detected:', issues);
      this.reportMetrics('performance_issues', { issues });
    }
  }

  /**
   * Start custom performance measurement
   */
  startMeasure(name) {
    if (this.isEnabled && 'performance' in window) {
      performance.mark(`${name}_start`);
    }
  }

  /**
   * End custom performance measurement
   */
  endMeasure(name) {
    if (this.isEnabled && 'performance' in window) {
      try {
        performance.mark(`${name}_end`);
        performance.measure(name, `${name}_start`, `${name}_end`);
        
        // Clean up marks
        performance.clearMarks(`${name}_start`);
        performance.clearMarks(`${name}_end`);
      } catch (error) {
        console.warn(`Failed to measure ${name}:`, error);
      }
    }
  }

  /**
   * Measure function execution time
   */
  measureFunction(name, fn) {
    if (!this.isEnabled) {
      return fn();
    }

    this.startMeasure(name);
    const startTime = performance.now();
    
    try {
      const result = fn();
      
      // Handle async functions
      if (result && typeof result.then === 'function') {
        return result.finally(() => {
          const duration = performance.now() - startTime;
          this.endMeasure(name);
          this.reportMetrics('function_timing', {
            function_name: name,
            duration: duration,
            async: true
          });
        });
      } else {
        const duration = performance.now() - startTime;
        this.endMeasure(name);
        this.reportMetrics('function_timing', {
          function_name: name,
          duration: duration,
          async: false
        });
        return result;
      }
    } catch (error) {
      const duration = performance.now() - startTime;
      this.endMeasure(name);
      this.reportMetrics('function_error', {
        function_name: name,
        duration: duration,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Report metrics to backend
   */
  async reportMetrics(type, data) {
    if (!this.isEnabled || !this.backendUrl) {
      return;
    }

    try {
      const payload = {
        type: type,
        data: data,
        timestamp: Date.now(),
        user_agent: navigator.userAgent,
        url: window.location.href,
        session_id: this.getSessionId()
      };

      // Use sendBeacon for better reliability
      if ('sendBeacon' in navigator) {
        navigator.sendBeacon(
          `${this.backendUrl}/api/analytics/performance`,
          JSON.stringify(payload)
        );
      } else {
        // Fallback to fetch
        fetch(`${this.backendUrl}/api/analytics/performance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(error => {
          console.warn('Failed to report performance metrics:', error);
        });
      }
    } catch (error) {
      console.warn('Failed to report performance metrics:', error);
    }
  }

  /**
   * Get or generate session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('performance_session_id');
    if (!sessionId) {
      sessionId = `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('performance_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Get current performance metrics
   */
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    const metrics = this.getMetrics();
    const summary = {
      page_load_time: metrics.page_load?.page_load_time || null,
      first_contentful_paint: metrics.page_load?.first_contentful_paint || null,
      largest_contentful_paint: metrics.page_load?.largest_contentful_paint || null,
      memory_usage: metrics.memory_usage?.memory_usage_percentage || null,
      slow_resources: this.getSlowResourcesCount(),
      long_tasks: this.getLongTasksCount(),
      performance_score: this.calculatePerformanceScore()
    };

    return summary;
  }

  /**
   * Get count of slow resources
   */
  getSlowResourcesCount() {
    // This would be tracked in a real implementation
    return 0;
  }

  /**
   * Get count of long tasks
   */
  getLongTasksCount() {
    // This would be tracked in a real implementation
    return 0;
  }

  /**
   * Calculate overall performance score
   */
  calculatePerformanceScore() {
    const metrics = this.getMetrics();
    if (!metrics.page_load) return null;

    let score = 100;
    
    // Deduct points for slow metrics
    if (metrics.page_load.page_load_time > 3000) score -= 20;
    if (metrics.page_load.first_contentful_paint > 2500) score -= 15;
    if (metrics.page_load.largest_contentful_paint > 4000) score -= 20;
    if (metrics.memory_usage?.memory_usage_percentage > 80) score -= 10;

    return Math.max(0, score);
  }

  /**
   * Cleanup observers
   */
  cleanup() {
    for (const [name, observer] of this.observers) {
      try {
        observer.disconnect();
      } catch (error) {
        console.warn(`Failed to disconnect ${name} observer:`, error);
      }
    }
    this.observers.clear();
    this.metrics.clear();
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Export for use in other modules
export default performanceMonitor;