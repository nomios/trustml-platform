/**
 * Analytics Service Stub
 * This is a no-op stub that replaces the custom analytics implementation.
 * All analytics are now handled by PostHog which is already integrated in index.html
 */

class AnalyticsServiceStub {
  constructor() {
    this.isEnabled = false;
    this.interactions = [];
  }

  // All methods are no-ops that return resolved promises or safe values
  async trackEvent() { return { status: 'noop' }; }
  async trackButtonClick() { return { status: 'noop' }; }
  async trackLinkClick() { return { status: 'noop' }; }
  async trackFormSubmission() { return { status: 'noop' }; }
  async trackResourceDownload() { return { status: 'noop' }; }
  async trackSchedulingInteraction() { return { status: 'noop' }; }
  async trackContactMethodInteraction() { return { status: 'noop' }; }
  async trackNavigation() { return { status: 'noop' }; }
  async trackScrollDepth() { return { status: 'noop' }; }
  async trackError() { return { status: 'noop' }; }
  async trackMilestone() { return { status: 'noop' }; }
  
  async sendEventToBackend() { return { status: 'noop' }; }
  async retryFailedEvents() { return { status: 'noop' }; }
  
  setupScrollTracking() { }
  setupErrorTracking() { }
  setEnabled() { }
  initializeSession() { }
  generateSessionId() { return 'stub-session'; }
  getSessionSummary() { 
    return { 
      sessionId: 'stub-session',
      totalEvents: 0,
      duration: 0,
      interactions: []
    };
  }
  
  createTrackedClickHandler(handler) {
    // Just return the original handler without tracking
    return handler;
  }
}

// Export a singleton instance
const analyticsService = new AnalyticsServiceStub();
export default analyticsService;