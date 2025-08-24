/**
 * Tests for Service Integration
 * Tests how all services work together
 */

import serviceIntegration from '../serviceIntegration';
import analyticsService from '../analyticsService';
import contactFormService from '../contactFormService';
import ResourceService from '../resourceService';
import schedulingService from '../schedulingService';
import errorHandlingService from '../errorHandlingService';

// Mock all services
jest.mock('../analyticsService');
jest.mock('../contactFormService');
jest.mock('../resourceService');
jest.mock('../schedulingService');
jest.mock('../errorHandlingService');

describe('Service Integration Tests', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset service states
    analyticsService.trackEvent.mockResolvedValue({ status: 'tracked' });
    analyticsService.trackFormSubmission.mockResolvedValue({ status: 'tracked' });
    analyticsService.trackResourceDownload.mockResolvedValue({ status: 'tracked' });
    analyticsService.trackSchedulingInteraction.mockResolvedValue({ status: 'tracked' });
    
    contactFormService.submitContactForm.mockResolvedValue({ success: true });
    contactFormService.validateFormData.mockReturnValue({ isValid: true, errors: [] });
    
    ResourceService.downloadResource.mockResolvedValue(true);
    ResourceService.getResource.mockReturnValue({ id: 'test', title: 'Test Resource' });
    
    schedulingService.openScheduling.mockResolvedValue(true);
    
    errorHandlingService.handleApiError.mockResolvedValue({ success: false });
  });

  describe('Contact Form Integration', () => {
    test('integrates contact form with analytics and error handling', async () => {
      const formData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        company: 'Test Corp',
        interested_in: 'Risk Strategy',
        message: 'Integration test message'
      };

      // Simulate successful form submission flow
      contactFormService.validateFormData.mockReturnValueOnce({ isValid: true, errors: [] });
      contactFormService.submitContactForm.mockResolvedValueOnce({ success: true, data: { id: 'form-123' } });

      const result = await serviceIntegration.submitContactFormWithTracking(formData, {
        source: 'integration-test',
        trackInteractions: true
      });

      expect(result.success).toBe(true);
      
      // Verify analytics integration
      expect(analyticsService.trackFormSubmission).toHaveBeenCalledWith(
        'contact-form',
        formData,
        'attempt'
      );
      
      expect(analyticsService.trackFormSubmission).toHaveBeenCalledWith(
        'contact-form',
        formData,
        'success'
      );

      // Verify contact form service called
      expect(contactFormService.submitContactForm).toHaveBeenCalledWith(
        formData,
        expect.objectContaining({
          trackSubmission: true
        })
      );
    });

    test('handles contact form errors with integrated error handling', async () => {
      const formData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        company: 'Test Corp',
        interested_in: 'Risk Strategy',
        message: 'Error test message'
      };

      const error = new Error('Network error');
      contactFormService.submitContactForm.mockRejectedValueOnce(error);
      errorHandlingService.handleApiError.mockResolvedValueOnce({
        success: false,
        error: error,
        userMessage: 'Network error occurred'
      });

      const result = await serviceIntegration.submitContactFormWithTracking(formData);

      expect(result.success).toBe(false);
      
      // Verify error handling integration
      expect(errorHandlingService.handleApiError).toHaveBeenCalledWith(
        error,
        'contact_form',
        expect.objectContaining({
          formData: formData
        })
      );

      // Verify error analytics
      expect(analyticsService.trackFormSubmission).toHaveBeenCalledWith(
        'contact-form',
        formData,
        'error'
      );
    });
  });

  describe('Resource Download Integration', () => {
    test('integrates resource download with analytics and error handling', async () => {
      ResourceService.downloadResource.mockResolvedValueOnce(true);
      ResourceService.getResource.mockReturnValueOnce({
        id: 'ai-guide',
        title: 'AI Guide',
        category: 'whitepaper'
      });

      const result = await serviceIntegration.downloadResourceWithTracking('ai-guide', {
        source: 'integration-test',
        userInfo: { session: 'test-session' }
      });

      expect(result.success).toBe(true);

      // Verify resource service integration
      expect(ResourceService.downloadResource).toHaveBeenCalledWith('ai-guide', {
        trackingSource: 'integration-test',
        userInfo: { session: 'test-session' }
      });

      // Verify analytics integration
      expect(analyticsService.trackResourceDownload).toHaveBeenCalledWith(
        'ai-guide',
        'AI Guide',
        'whitepaper',
        'integration-test'
      );
    });

    test('handles resource download errors with integrated error handling', async () => {
      const error = new Error('Resource not found');
      ResourceService.downloadResource.mockRejectedValueOnce(error);
      errorHandlingService.handleApiError.mockResolvedValueOnce({
        success: false,
        error: error,
        userMessage: 'Resource not available'
      });

      const result = await serviceIntegration.downloadResourceWithTracking('non-existent');

      expect(result.success).toBe(false);

      // Verify error handling integration
      expect(errorHandlingService.handleApiError).toHaveBeenCalledWith(
        error,
        'resource_download',
        expect.objectContaining({
          resourceId: 'non-existent'
        })
      );
    });
  });

  describe('Scheduling Integration', () => {
    test('integrates scheduling with analytics tracking', async () => {
      schedulingService.openScheduling.mockResolvedValueOnce(true);

      const result = await serviceIntegration.openSchedulingWithTracking('risk-strategy', {
        source: 'integration-test',
        prefill: { name: 'John Doe', email: 'john@example.com' }
      });

      expect(result.success).toBe(true);

      // Verify scheduling service integration
      expect(schedulingService.openScheduling).toHaveBeenCalledWith(
        'risk-strategy',
        { name: 'John Doe', email: 'john@example.com' },
        { source: 'integration-test' }
      );

      // Verify analytics integration
      expect(analyticsService.trackSchedulingInteraction).toHaveBeenCalledWith(
        'risk-strategy',
        'click',
        'integration-test'
      );
    });

    test('handles scheduling errors with integrated error handling', async () => {
      const error = new Error('Popup blocked');
      schedulingService.openScheduling.mockRejectedValueOnce(error);
      errorHandlingService.handleApiError.mockResolvedValueOnce({
        success: false,
        error: error,
        userMessage: 'Please allow popups'
      });

      const result = await serviceIntegration.openSchedulingWithTracking('risk-strategy');

      expect(result.success).toBe(false);

      // Verify error handling integration
      expect(errorHandlingService.handleApiError).toHaveBeenCalledWith(
        error,
        'scheduling',
        expect.objectContaining({
          serviceType: 'risk-strategy'
        })
      );
    });
  });

  describe('Cross-Service Analytics Integration', () => {
    test('tracks complete user journey across services', async () => {
      // Simulate complete user journey
      await serviceIntegration.trackUserJourney('complete-consultation-flow', {
        steps: [
          { action: 'page_load', section: 'homepage' },
          { action: 'navigation', target: 'services' },
          { action: 'service_view', service: 'risk-strategy' },
          { action: 'scheduling_click', service: 'risk-strategy' },
          { action: 'form_view', form: 'contact' },
          { action: 'form_submit', form: 'contact' },
          { action: 'resource_download', resource: 'ai-guide' }
        ]
      });

      // Verify comprehensive analytics tracking
      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(7);
      
      // Verify journey milestone tracking
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'user_journey',
        'complete-consultation-flow',
        expect.objectContaining({
          steps: expect.any(Array),
          journey_duration: expect.any(Number)
        })
      );
    });

    test('handles analytics failures gracefully across services', async () => {
      analyticsService.trackEvent.mockRejectedValue(new Error('Analytics service down'));

      // Services should continue working even if analytics fails
      const formResult = await serviceIntegration.submitContactFormWithTracking({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        company: 'Test Corp',
        interested_in: 'Risk Strategy',
        message: 'Test message'
      });

      const resourceResult = await serviceIntegration.downloadResourceWithTracking('ai-guide');
      const schedulingResult = await serviceIntegration.openSchedulingWithTracking('risk-strategy');

      // All services should still work
      expect(formResult.success).toBe(true);
      expect(resourceResult.success).toBe(true);
      expect(schedulingResult.success).toBe(true);

      // Verify services were called despite analytics failure
      expect(contactFormService.submitContactForm).toHaveBeenCalled();
      expect(ResourceService.downloadResource).toHaveBeenCalled();
      expect(schedulingService.openScheduling).toHaveBeenCalled();
    });
  });

  describe('Error Recovery Integration', () => {
    test('provides integrated error recovery across services', async () => {
      const networkError = new Error('Network error');
      
      // Mock retry functionality
      contactFormService.submitContactForm
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce({ success: true, data: { id: 'retry-success' } });

      errorHandlingService.handleApiError.mockImplementationOnce(async (error, context, options) => {
        // Simulate retry
        if (options.retryCallback) {
          const retryResult = await options.retryCallback();
          return retryResult;
        }
        return { success: false, error };
      });

      const result = await serviceIntegration.submitContactFormWithTracking({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        company: 'Test Corp',
        interested_in: 'Risk Strategy',
        message: 'Retry test message'
      });

      expect(result.success).toBe(true);
      expect(contactFormService.submitContactForm).toHaveBeenCalledTimes(2); // Initial + retry
    });
  });

  describe('Performance Integration', () => {
    test('maintains performance across integrated services', async () => {
      const startTime = Date.now();

      // Run multiple integrated operations
      const operations = [
        serviceIntegration.submitContactFormWithTracking({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          company: 'Test Corp',
          interested_in: 'Risk Strategy',
          message: 'Performance test message'
        }),
        serviceIntegration.downloadResourceWithTracking('ai-guide'),
        serviceIntegration.openSchedulingWithTracking('risk-strategy'),
        serviceIntegration.trackUserJourney('performance-test', { steps: [] })
      ];

      await Promise.all(operations);

      const duration = Date.now() - startTime;

      // All integrated operations should complete quickly
      expect(duration).toBeLessThan(1000);

      // Verify all services were called
      expect(contactFormService.submitContactForm).toHaveBeenCalled();
      expect(ResourceService.downloadResource).toHaveBeenCalled();
      expect(schedulingService.openScheduling).toHaveBeenCalled();
      expect(analyticsService.trackEvent).toHaveBeenCalled();
    });
  });

  describe('Configuration Integration', () => {
    test('respects global configuration across services', async () => {
      // Set global configuration
      serviceIntegration.configure({
        analyticsEnabled: false,
        errorReportingEnabled: true,
        performanceMonitoring: true
      });

      await serviceIntegration.submitContactFormWithTracking({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        company: 'Test Corp',
        interested_in: 'Risk Strategy',
        message: 'Config test message'
      });

      // Analytics should be disabled
      expect(analyticsService.trackFormSubmission).not.toHaveBeenCalled();

      // But form submission should still work
      expect(contactFormService.submitContactForm).toHaveBeenCalled();
    });
  });
});