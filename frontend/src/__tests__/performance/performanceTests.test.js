/**
 * Performance Tests
 * Tests for performance monitoring and optimization
 */

import { performance } from 'perf_hooks';
import analyticsService from '../../utils/analyticsService';
import contactFormService from '../../utils/contactFormService';
import ResourceService from '../../utils/resourceService';

// Mock dependencies for performance testing
jest.mock('../../utils/analyticsService');

describe('Performance Tests', () => {
  beforeEach(() => {
    analyticsService.trackEvent.mockClear();
    analyticsService.trackResourceDownload.mockClear();
    
    // Mock performance.now for consistent testing
    global.performance = {
      now: jest.fn(() => Date.now()),
      mark: jest.fn(),
      measure: jest.fn(),
      getEntriesByType: jest.fn(() => []),
      getEntriesByName: jest.fn(() => [])
    };
  });

  describe('Service Performance', () => {
    test('analytics service tracks events within performance threshold', async () => {
      const startTime = performance.now();
      
      await analyticsService.trackEvent('test_event', 'test_element', {
        large_metadata: 'x'.repeat(1000) // Large metadata to test performance
      });
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Analytics tracking should complete within 100ms
      expect(duration).toBeLessThan(100);
    });

    test('contact form validation performs within threshold', () => {
      const formData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        company: 'Test Corp',
        interested_in: 'Risk Strategy',
        message: 'Test message with sufficient length for validation'
      };

      const startTime = performance.now();
      
      // Run validation multiple times to test performance
      for (let i = 0; i < 100; i++) {
        contactFormService.validateFormData(formData);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // 100 validations should complete within 50ms
      expect(duration).toBeLessThan(50);
    });

    test('resource service operations perform within threshold', () => {
      const startTime = performance.now();
      
      // Test multiple resource operations
      for (let i = 0; i < 50; i++) {
        ResourceService.getAllResources();
        ResourceService.getResourcesByCategory('white-paper');
        ResourceService.searchResources('fraud detection');
        ResourceService.getResource('ai-fraud-detection-guide');
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // 200 operations (50 * 4) should complete within 100ms
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Memory Usage', () => {
    test('analytics service does not leak memory', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Generate many analytics events
      const promises = [];
      for (let i = 0; i < 1000; i++) {
        promises.push(analyticsService.trackEvent(`event_${i}`, `element_${i}`, {
          index: i,
          data: 'x'.repeat(100)
        }));
      }
      
      await Promise.all(promises);
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });

    test('resource service caching works efficiently', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Access resources multiple times
      for (let i = 0; i < 1000; i++) {
        ResourceService.getAllResources();
        ResourceService.getResource('ai-fraud-detection-guide');
        ResourceService.getResourcesByCategory('white-paper');
      }
      
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be minimal due to caching
      expect(memoryIncrease).toBeLessThan(1024 * 1024); // Less than 1MB
    });
  });

  describe('Concurrent Operations', () => {
    test('handles concurrent analytics tracking', async () => {
      const startTime = performance.now();
      
      // Create many concurrent analytics requests
      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(analyticsService.trackEvent(`concurrent_event_${i}`, `element_${i}`));
      }
      
      await Promise.all(promises);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // 100 concurrent operations should complete within 500ms
      expect(duration).toBeLessThan(500);
      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(100);
    });

    test('handles concurrent form validations', () => {
      const formData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        company: 'Test Corp',
        interested_in: 'Risk Strategy',
        message: 'Test message'
      };

      const startTime = performance.now();
      
      // Run concurrent validations
      const promises = [];
      for (let i = 0; i < 50; i++) {
        promises.push(Promise.resolve(contactFormService.validateFormData({
          ...formData,
          email: `user${i}@example.com`
        })));
      }
      
      return Promise.all(promises).then(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // 50 concurrent validations should complete within 100ms
        expect(duration).toBeLessThan(100);
      });
    });
  });

  describe('Large Data Handling', () => {
    test('handles large analytics payloads efficiently', async () => {
      const largeMetadata = {
        user_journey: Array(1000).fill(0).map((_, i) => ({
          step: i,
          timestamp: Date.now() + i,
          action: `action_${i}`,
          data: 'x'.repeat(100)
        }))
      };

      const startTime = performance.now();
      
      await analyticsService.trackEvent('large_payload_event', 'test_element', largeMetadata);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Large payload should still process within 200ms
      expect(duration).toBeLessThan(200);
    });

    test('handles large resource lists efficiently', () => {
      // Create a large mock resource list
      const originalResources = ResourceService.RESOURCES;
      const largeResourceList = {};
      
      for (let i = 0; i < 1000; i++) {
        largeResourceList[`resource_${i}`] = {
          id: `resource_${i}`,
          title: `Resource ${i}`,
          description: `Description for resource ${i}`,
          category: ['white-paper', 'case-study', 'guide'][i % 3],
          filename: `resource_${i}.pdf`,
          path: `/resources/resource_${i}.pdf`,
          size: '1MB',
          downloadCount: i
        };
      }
      
      // Temporarily replace resources
      ResourceService.RESOURCES = largeResourceList;
      
      const startTime = performance.now();
      
      // Test operations on large dataset
      const allResources = ResourceService.getAllResources();
      const whitepapers = ResourceService.getResourcesByCategory('white-paper');
      const searchResults = ResourceService.searchResources('Resource 1');
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Operations on 1000 resources should complete within 50ms
      expect(duration).toBeLessThan(50);
      expect(allResources).toHaveLength(1000);
      expect(whitepapers.length).toBeGreaterThan(300);
      expect(searchResults.length).toBeGreaterThan(100);
      
      // Restore original resources
      ResourceService.RESOURCES = originalResources;
    });
  });

  describe('Error Handling Performance', () => {
    test('error handling does not significantly impact performance', async () => {
      // Mock fetch to always fail
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      
      const startTime = performance.now();
      
      // Generate many failed analytics requests
      const promises = [];
      for (let i = 0; i < 50; i++) {
        promises.push(analyticsService.trackEvent(`error_event_${i}`, `element_${i}`));
      }
      
      await Promise.all(promises);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Even with errors, should complete within reasonable time
      expect(duration).toBeLessThan(1000);
    });

    test('form validation errors are handled efficiently', () => {
      const invalidFormData = {
        first_name: '',
        last_name: '',
        email: 'invalid-email',
        company: '',
        interested_in: '',
        message: ''
      };

      const startTime = performance.now();
      
      // Run many validations with errors
      for (let i = 0; i < 100; i++) {
        const result = contactFormService.validateFormData(invalidFormData);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Error handling should not significantly slow down validation
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Caching and Optimization', () => {
    test('resource metadata is efficiently cached', () => {
      const startTime = performance.now();
      
      // Access same resource multiple times
      for (let i = 0; i < 1000; i++) {
        ResourceService.getResource('ai-fraud-detection-guide');
        ResourceService.getResourceSize('ai-fraud-detection-guide');
        ResourceService.getDownloadCount('ai-fraud-detection-guide');
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Cached access should be very fast
      expect(duration).toBeLessThan(50);
    });

    test('search operations are optimized', () => {
      const queries = [
        'fraud',
        'detection',
        'ai',
        'machine learning',
        'trust safety',
        'risk',
        'gameverse',
        'marketplace'
      ];

      const startTime = performance.now();
      
      // Run multiple search queries
      queries.forEach(query => {
        for (let i = 0; i < 50; i++) {
          ResourceService.searchResources(query);
        }
      });
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // 400 search operations should complete quickly
      expect(duration).toBeLessThan(200);
    });
  });

  describe('Bundle Size and Loading Performance', () => {
    test('service modules have reasonable size', () => {
      // This is a conceptual test - in practice you'd use webpack-bundle-analyzer
      // or similar tools to measure actual bundle sizes
      
      const analyticsServiceSize = JSON.stringify(analyticsService).length;
      const contactFormServiceSize = JSON.stringify(contactFormService).length;
      const resourceServiceSize = JSON.stringify(ResourceService).length;
      
      // Services should not be excessively large
      expect(analyticsServiceSize).toBeLessThan(50000); // 50KB
      expect(contactFormServiceSize).toBeLessThan(30000); // 30KB
      expect(resourceServiceSize).toBeLessThan(20000); // 20KB
    });

    test('lazy loading simulation performs well', async () => {
      const startTime = performance.now();
      
      // Simulate lazy loading of services
      const services = await Promise.all([
        import('../../utils/analyticsService'),
        import('../../utils/contactFormService'),
        import('../../utils/resourceService'),
        import('../../utils/errorHandlingService'),
        import('../../utils/navigationService')
      ]);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Lazy loading should complete quickly
      expect(duration).toBeLessThan(100);
      expect(services).toHaveLength(5);
    });
  });

  describe('Real-world Performance Scenarios', () => {
    test('typical user session performance', async () => {
      const startTime = performance.now();
      
      // Simulate typical user session
      await analyticsService.trackEvent('page_load', 'homepage');
      await analyticsService.trackNavigation('services', 'menu', 'click');
      await analyticsService.trackButtonClick('schedule-btn', 'Schedule Consultation');
      
      const formData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        company: 'Test Corp',
        interested_in: 'Risk Strategy',
        message: 'Interested in services'
      };
      
      contactFormService.validateFormData(formData);
      await analyticsService.trackFormSubmission('contact-form', formData, 'success');
      
      ResourceService.getAllResources();
      ResourceService.searchResources('fraud');
      await analyticsService.trackResourceDownload('ai-guide', 'AI Guide', 'whitepaper');
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Typical session should complete within 500ms
      expect(duration).toBeLessThan(500);
    });

    test('high-traffic scenario performance', async () => {
      const startTime = performance.now();
      
      // Simulate high traffic with concurrent operations
      const operations = [];
      
      for (let i = 0; i < 20; i++) {
        operations.push(analyticsService.trackEvent(`event_${i}`, `element_${i}`));
        operations.push(Promise.resolve(contactFormService.validateFormData({
          first_name: `User${i}`,
          last_name: 'Test',
          email: `user${i}@example.com`,
          company: 'Test Corp',
          interested_in: 'Risk Strategy',
          message: 'Test message'
        })));
        operations.push(Promise.resolve(ResourceService.searchResources(`query${i}`)));
      }
      
      await Promise.all(operations);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // High traffic scenario should handle well
      expect(duration).toBeLessThan(1000);
    });
  });
});