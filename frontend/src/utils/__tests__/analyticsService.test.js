/**
 * Tests for AnalyticsService
 */

import analyticsService from '../analyticsService';

// Mock fetch for testing
global.fetch = jest.fn();

describe('AnalyticsService', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
    sessionStorage.clear();
    
    // Reset analytics service state
    analyticsService.interactions = [];
    analyticsService.isEnabled = true;
  });

  describe('Session Management', () => {
    test('generates unique session ID', () => {
      const sessionId1 = analyticsService.generateSessionId();
      const sessionId2 = analyticsService.generateSessionId();
      
      expect(sessionId1).toMatch(/^session_\d+_[a-z0-9]+$/);
      expect(sessionId2).toMatch(/^session_\d+_[a-z0-9]+$/);
      expect(sessionId1).not.toBe(sessionId2);
    });

    test('initializes session tracking', () => {
      analyticsService.initializeSession();
      
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'analytics_session_id',
        expect.any(String)
      );
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'analytics_session_start',
        expect.any(String)
      );
    });

    test('tracks session start event', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'tracked' })
      });

      await analyticsService.trackEvent('session_start', 'session');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/analytics/track',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('session_start')
        })
      );
    });
  });

  describe('Event Tracking', () => {
    test('tracks general events successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'tracked' })
      });

      await analyticsService.trackEvent('test_event', 'test_element', {
        custom_data: 'test_value'
      });

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/analytics/track',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('test_event')
        })
      );

      expect(analyticsService.interactions).toHaveLength(1);
      expect(analyticsService.interactions[0]).toMatchObject({
        event_type: 'test_event',
        element_id: 'test_element',
        metadata: expect.objectContaining({
          custom_data: 'test_value'
        })
      });
    });

    test('handles tracking errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await analyticsService.trackEvent('test_event', 'test_element');

      // Should not throw error
      expect(analyticsService.interactions).toHaveLength(1);
      expect(console.warn).toHaveBeenCalledWith(
        'Failed to track analytics event:',
        expect.any(Error)
      );
    });

    test('stores failed events for retry', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await analyticsService.trackEvent('test_event', 'test_element');

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'analytics_failed_events',
        expect.stringContaining('test_event')
      );
    });

    test('respects enabled/disabled state', async () => {
      analyticsService.setEnabled(false);

      await analyticsService.trackEvent('test_event', 'test_element');

      expect(fetch).not.toHaveBeenCalled();
      expect(analyticsService.interactions).toHaveLength(0);
    });
  });

  describe('Link Click Tracking', () => {
    test('tracks link clicks with proper data', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'tracked' })
      });

      await analyticsService.trackLinkClick(
        'test-link',
        'navigation',
        'https://example.com',
        { source: 'header' }
      );

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/analytics/link-click',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('test-link')
        })
      );
    });

    test('handles link click tracking errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await analyticsService.trackLinkClick('test-link', 'navigation', 'https://example.com');

      expect(console.warn).toHaveBeenCalledWith(
        'Failed to track link click:',
        expect.any(Error)
      );
    });
  });

  describe('Specialized Tracking Methods', () => {
    test('tracks button clicks', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'tracked' })
      });

      await analyticsService.trackButtonClick(
        'schedule-btn',
        'Schedule Consultation',
        'action',
        { service: 'risk-strategy' }
      );

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/analytics/track',
        expect.objectContaining({
          body: expect.stringContaining('button_click')
        })
      );
    });

    test('tracks form submissions', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'tracked' })
      });

      const formData = {
        email: 'test@example.com',
        message: 'Test message',
        service_type: 'risk-strategy'
      };

      await analyticsService.trackFormSubmission('contact-form', formData, 'success');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/analytics/track',
        expect.objectContaining({
          body: expect.stringContaining('form_submission')
        })
      );
    });

    test('tracks resource downloads', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'tracked' })
      });

      await analyticsService.trackResourceDownload(
        'ai-guide',
        'AI Fraud Detection Guide',
        'whitepaper',
        'resources-section'
      );

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/analytics/track',
        expect.objectContaining({
          body: expect.stringContaining('resource_download')
        })
      );
    });

    test('tracks scheduling interactions', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'tracked' })
      });

      await analyticsService.trackSchedulingInteraction('risk-strategy', 'click', 'button');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/analytics/track',
        expect.objectContaining({
          body: expect.stringContaining('scheduling_interaction')
        })
      );
    });

    test('tracks contact method interactions', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'tracked' })
      });

      await analyticsService.trackContactMethodInteraction(
        'email',
        'contact@trustml.studio',
        'footer'
      );

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/analytics/track',
        expect.objectContaining({
          body: expect.stringContaining('contact_method_interaction')
        })
      );
    });

    test('tracks navigation events', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'tracked' })
      });

      await analyticsService.trackNavigation('services', 'menu', 'click');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/analytics/track',
        expect.objectContaining({
          body: expect.stringContaining('navigation')
        })
      );
    });

    test('tracks scroll depth at milestones', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'tracked' })
      });

      await analyticsService.trackScrollDepth(50, 'services');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/analytics/track',
        expect.objectContaining({
          body: expect.stringContaining('scroll_depth')
        })
      );
    });

    test('does not track scroll depth for non-milestones', async () => {
      await analyticsService.trackScrollDepth(33, 'services');

      expect(fetch).not.toHaveBeenCalled();
    });

    test('tracks errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'tracked' })
      });

      await analyticsService.trackError('api_error', 'Failed to load data', 'contact_form');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/analytics/track',
        expect.objectContaining({
          body: expect.stringContaining('error')
        })
      );
    });

    test('tracks milestones', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'tracked' })
      });

      await analyticsService.trackMilestone('form_completed', { form_type: 'contact' });

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/analytics/track',
        expect.objectContaining({
          body: expect.stringContaining('milestone')
        })
      );
    });
  });

  describe('Failed Event Handling', () => {
    test('retries failed events successfully', async () => {
      // Set up failed events in localStorage
      const failedEvents = [
        { event_type: 'test_event', element_id: 'test' }
      ];
      localStorage.setItem('analytics_failed_events', JSON.stringify(failedEvents));

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'tracked' })
      });

      await analyticsService.retryFailedEvents();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/analytics/track',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('test_event')
        })
      );

      expect(localStorage.removeItem).toHaveBeenCalledWith('analytics_failed_events');
    });

    test('handles retry failures gracefully', async () => {
      const failedEvents = [
        { event_type: 'test_event', element_id: 'test' }
      ];
      localStorage.setItem('analytics_failed_events', JSON.stringify(failedEvents));

      fetch.mockRejectedValueOnce(new Error('Still failing'));

      await analyticsService.retryFailedEvents();

      // Should not throw error
      expect(console.warn).toHaveBeenCalledWith(
        'Failed to retry analytics events:',
        expect.any(Error)
      );
    });
  });

  describe('Utility Methods', () => {
    test('gets session summary', () => {
      const summary = analyticsService.getSessionSummary();

      expect(summary).toMatchObject({
        session_id: expect.any(String),
        session_duration: expect.any(Number),
        interactions_count: expect.any(Number),
        page_url: 'http://localhost:3000',
        user_agent: 'Mozilla/5.0 (Test Browser)'
      });
    });

    test('creates tracked click handler', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'tracked' })
      });

      const originalHandler = jest.fn();
      const trackedHandler = analyticsService.createTrackedClickHandler(
        'test-element',
        'button',
        originalHandler,
        { custom: 'data' }
      );

      const mockEvent = {
        target: {
          tagName: 'BUTTON',
          textContent: 'Click me'
        }
      };

      await trackedHandler(mockEvent);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/analytics/track',
        expect.objectContaining({
          body: expect.stringContaining('element_click')
        })
      );

      expect(originalHandler).toHaveBeenCalledWith(mockEvent);
    });

    test('enables and disables tracking', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'tracked' })
      });

      analyticsService.setEnabled(false);
      expect(analyticsService.isEnabled).toBe(false);

      await analyticsService.trackEvent('test', 'test');
      expect(fetch).not.toHaveBeenCalled();

      analyticsService.setEnabled(true);
      expect(analyticsService.isEnabled).toBe(true);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/analytics/track',
        expect.objectContaining({
          body: expect.stringContaining('analytics_enabled')
        })
      );
    });
  });

  describe('Timeout Handling', () => {
    test('handles request timeouts', async () => {
      // Mock AbortController
      const mockAbort = jest.fn();
      global.AbortController = jest.fn(() => ({
        abort: mockAbort,
        signal: 'mock-signal'
      }));

      // Mock setTimeout to immediately call the callback
      const originalSetTimeout = global.setTimeout;
      global.setTimeout = jest.fn((callback) => {
        callback();
        return 'timeout-id';
      });

      await analyticsService.trackEvent('test_event', 'test_element');

      expect(mockAbort).toHaveBeenCalled();

      // Restore original setTimeout
      global.setTimeout = originalSetTimeout;
    });
  });
});