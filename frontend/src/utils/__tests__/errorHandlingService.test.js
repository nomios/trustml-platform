/**
 * Tests for ErrorHandlingService
 */

import errorHandlingService from '../errorHandlingService';
import analyticsService from '../analyticsService';

// Mock dependencies
jest.mock('../analyticsService');

describe('ErrorHandlingService', () => {
  beforeEach(() => {
    analyticsService.trackError.mockClear();
    
    // Mock DOM methods
    document.createElement = jest.fn(() => ({
      className: '',
      textContent: '',
      style: {},
      addEventListener: jest.fn(),
      remove: jest.fn()
    }));
    
    document.body.appendChild = jest.fn();
    
    // Mock setTimeout
    global.setTimeout = jest.fn((callback, delay) => {
      callback();
      return 'timeout-id';
    });
    
    global.clearTimeout = jest.fn();
  });

  describe('User-Friendly Error Display', () => {
    test('shows error message with default settings', () => {
      const mockElement = {
        className: '',
        textContent: '',
        style: {},
        addEventListener: jest.fn(),
        remove: jest.fn()
      };
      
      document.createElement.mockReturnValueOnce(mockElement);

      errorHandlingService.showUserFriendlyError('Test error message');

      expect(document.createElement).toHaveBeenCalledWith('div');
      expect(mockElement.textContent).toBe('Test error message');
      expect(mockElement.className).toContain('error-toast');
      expect(document.body.appendChild).toHaveBeenCalledWith(mockElement);
    });

    test('shows success message with custom styling', () => {
      const mockElement = {
        className: '',
        textContent: '',
        style: {},
        addEventListener: jest.fn(),
        remove: jest.fn()
      };
      
      document.createElement.mockReturnValueOnce(mockElement);

      errorHandlingService.showUserFriendlyError(
        'Success message',
        'success',
        true,
        3000
      );

      expect(mockElement.className).toContain('success-toast');
      expect(mockElement.textContent).toBe('Success message');
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);
    });

    test('shows warning message', () => {
      const mockElement = {
        className: '',
        textContent: '',
        style: {},
        addEventListener: jest.fn(),
        remove: jest.fn()
      };
      
      document.createElement.mockReturnValueOnce(mockElement);

      errorHandlingService.showUserFriendlyError('Warning message', 'warning');

      expect(mockElement.className).toContain('warning-toast');
    });

    test('handles click to dismiss', () => {
      const mockElement = {
        className: '',
        textContent: '',
        style: {},
        addEventListener: jest.fn(),
        remove: jest.fn()
      };
      
      document.createElement.mockReturnValueOnce(mockElement);

      errorHandlingService.showUserFriendlyError('Test message', 'error', true);

      expect(mockElement.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
      
      // Simulate click
      const clickHandler = mockElement.addEventListener.mock.calls[0][1];
      clickHandler();
      
      expect(mockElement.remove).toHaveBeenCalled();
    });

    test('auto-removes message after timeout', () => {
      const mockElement = {
        className: '',
        textContent: '',
        style: {},
        addEventListener: jest.fn(),
        remove: jest.fn()
      };
      
      document.createElement.mockReturnValueOnce(mockElement);

      errorHandlingService.showUserFriendlyError('Test message', 'error', false, 2000);

      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 2000);
      expect(mockElement.remove).toHaveBeenCalled();
    });
  });

  describe('API Error Handling', () => {
    test('handles network errors with fallback options', async () => {
      const networkError = new Error('Failed to fetch');
      const retryCallback = jest.fn().mockResolvedValueOnce({ success: true });
      
      const result = await errorHandlingService.handleApiError(networkError, 'test_context', {
        retryCallback: retryCallback,
        showUserMessage: true
      });

      expect(analyticsService.trackError).toHaveBeenCalledWith(
        'api_error',
        'Failed to fetch',
        'test_context'
      );

      expect(result).toMatchObject({
        success: false,
        error: networkError,
        context: 'test_context',
        userMessage: expect.stringContaining('network')
      });
    });

    test('handles server errors', async () => {
      const serverError = new Error('Server error: 500 Internal Server Error');
      
      const result = await errorHandlingService.handleApiError(serverError, 'contact_form');

      expect(result.userMessage).toContain('server');
      expect(result.success).toBe(false);
    });

    test('handles validation errors', async () => {
      const validationError = new Error('Validation failed: Email is required');
      
      const result = await errorHandlingService.handleApiError(validationError, 'form_validation');

      expect(result.userMessage).toContain('information');
      expect(result.success).toBe(false);
    });

    test('provides retry functionality', async () => {
      const error = new Error('Temporary error');
      const retryCallback = jest.fn().mockResolvedValueOnce({ success: true, data: 'retry-result' });
      
      const result = await errorHandlingService.handleApiError(error, 'test_context', {
        retryCallback: retryCallback,
        showRetryOption: true
      });

      expect(result.retryCallback).toBe(retryCallback);
      expect(typeof result.retryCallback).toBe('function');
    });

    test('provides alternative actions', async () => {
      const error = new Error('Service unavailable');
      const alternativeCallback = jest.fn();
      
      const result = await errorHandlingService.handleApiError(error, 'scheduling', {
        alternativeCallback: alternativeCallback,
        alternativeText: 'Contact us directly'
      });

      expect(result.alternativeCallback).toBe(alternativeCallback);
      expect(result.alternativeText).toBe('Contact us directly');
    });

    test('shows user message by default', async () => {
      const mockElement = {
        className: '',
        textContent: '',
        style: {},
        addEventListener: jest.fn(),
        remove: jest.fn()
      };
      
      document.createElement.mockReturnValueOnce(mockElement);

      const error = new Error('Test error');
      
      await errorHandlingService.handleApiError(error, 'test_context', {
        showUserMessage: true
      });

      expect(document.createElement).toHaveBeenCalledWith('div');
      expect(mockElement.textContent).toContain('error');
    });

    test('can disable user message display', async () => {
      const error = new Error('Test error');
      
      await errorHandlingService.handleApiError(error, 'test_context', {
        showUserMessage: false
      });

      expect(document.createElement).not.toHaveBeenCalled();
    });
  });

  describe('Error Classification', () => {
    test('classifies network errors correctly', async () => {
      const networkErrors = [
        new Error('Failed to fetch'),
        new Error('NetworkError'),
        new Error('Network request failed'),
        new Error('ERR_NETWORK')
      ];

      for (const error of networkErrors) {
        const result = await errorHandlingService.handleApiError(error, 'test');
        expect(result.userMessage).toContain('network');
      }
    });

    test('classifies server errors correctly', async () => {
      const serverErrors = [
        new Error('Server error: 500'),
        new Error('Internal Server Error'),
        new Error('Service Unavailable'),
        new Error('502 Bad Gateway')
      ];

      for (const error of serverErrors) {
        const result = await errorHandlingService.handleApiError(error, 'test');
        expect(result.userMessage).toContain('server');
      }
    });

    test('classifies validation errors correctly', async () => {
      const validationErrors = [
        new Error('Validation failed'),
        new Error('Invalid email format'),
        new Error('Required field missing'),
        new Error('400 Bad Request')
      ];

      for (const error of validationErrors) {
        const result = await errorHandlingService.handleApiError(error, 'test');
        expect(result.userMessage).toContain('information');
      }
    });

    test('provides generic message for unknown errors', async () => {
      const unknownError = new Error('Some random error');
      
      const result = await errorHandlingService.handleApiError(unknownError, 'test');
      
      expect(result.userMessage).toContain('unexpected');
    });
  });

  describe('Context-Specific Error Handling', () => {
    test('provides context-specific messages for contact forms', async () => {
      const error = new Error('Network error');
      
      const result = await errorHandlingService.handleApiError(error, 'contact_form');
      
      expect(result.userMessage).toContain('contact');
    });

    test('provides context-specific messages for resource downloads', async () => {
      const error = new Error('File not found');
      
      const result = await errorHandlingService.handleApiError(error, 'resource_download');
      
      expect(result.userMessage).toContain('resource');
    });

    test('provides context-specific messages for scheduling', async () => {
      const error = new Error('Service unavailable');
      
      const result = await errorHandlingService.handleApiError(error, 'scheduling');
      
      expect(result.userMessage).toContain('scheduling');
    });
  });

  describe('Error Recovery Options', () => {
    test('provides appropriate recovery options for different contexts', async () => {
      const error = new Error('Network error');
      
      // Contact form context
      const contactResult = await errorHandlingService.handleApiError(error, 'contact_form');
      expect(contactResult.alternativeText).toContain('email');
      
      // Resource download context
      const resourceResult = await errorHandlingService.handleApiError(error, 'resource_download');
      expect(resourceResult.alternativeText).toContain('Resources');
      
      // Scheduling context
      const schedulingResult = await errorHandlingService.handleApiError(error, 'scheduling');
      expect(schedulingResult.alternativeText).toContain('contact');
    });

    test('tracks all errors for monitoring', async () => {
      const error = new Error('Test error');
      
      await errorHandlingService.handleApiError(error, 'test_context');
      
      expect(analyticsService.trackError).toHaveBeenCalledWith(
        'api_error',
        'Test error',
        'test_context'
      );
    });
  });

  describe('Error Message Customization', () => {
    test('allows custom error messages', async () => {
      const mockElement = {
        className: '',
        textContent: '',
        style: {},
        addEventListener: jest.fn(),
        remove: jest.fn()
      };
      
      document.createElement.mockReturnValueOnce(mockElement);

      const error = new Error('Test error');
      
      await errorHandlingService.handleApiError(error, 'test_context', {
        customMessage: 'Custom error message for user',
        showUserMessage: true
      });

      expect(mockElement.textContent).toBe('Custom error message for user');
    });

    test('falls back to generated message when custom message not provided', async () => {
      const mockElement = {
        className: '',
        textContent: '',
        style: {},
        addEventListener: jest.fn(),
        remove: jest.fn()
      };
      
      document.createElement.mockReturnValueOnce(mockElement);

      const error = new Error('Network error');
      
      await errorHandlingService.handleApiError(error, 'test_context', {
        showUserMessage: true
      });

      expect(mockElement.textContent).toContain('network');
      expect(mockElement.textContent).not.toBe('Custom error message for user');
    });
  });
});