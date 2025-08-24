/**
 * Tests for ContactFormService
 */

import contactFormService from '../contactFormService';
import analyticsService from '../analyticsService';
import errorHandlingService from '../errorHandlingService';

// Mock dependencies
jest.mock('../analyticsService');
jest.mock('../errorHandlingService');

describe('ContactFormService', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
    analyticsService.trackFormSubmission.mockClear();
    errorHandlingService.showUserFriendlyError.mockClear();
    errorHandlingService.handleApiError.mockClear();
  });

  describe('Form Validation', () => {
    test('validates required fields correctly', () => {
      const validData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        company: 'Test Corp',
        interested_in: 'Risk Strategy',
        message: 'This is a test message with enough characters'
      };

      const result = contactFormService.validateFormData(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('identifies missing required fields', () => {
      const invalidData = {
        first_name: '',
        last_name: 'Doe',
        email: 'invalid-email',
        company: '',
        interested_in: '',
        message: 'Short'
      };

      const result = contactFormService.validateFormData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('First name is required');
      expect(result.errors).toContain('Please enter a valid email address');
      expect(result.errors).toContain('Company name is required');
      expect(result.errors).toContain('Please select what you\'re interested in');
      expect(result.errors).toContain('Message must be at least 10 characters long');
    });

    test('validates email format', () => {
      expect(contactFormService.isValidEmail('test@example.com')).toBe(true);
      expect(contactFormService.isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(contactFormService.isValidEmail('invalid-email')).toBe(false);
      expect(contactFormService.isValidEmail('test@')).toBe(false);
      expect(contactFormService.isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('Form Submission', () => {
    const validFormData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      company: 'Test Corp',
      interested_in: 'Risk Strategy',
      message: 'This is a test message with enough characters'
    };

    test('submits form successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'form-123', status: 'submitted' })
      });

      const result = await contactFormService.submitContactForm(validFormData);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/contact',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validFormData)
        })
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: 'form-123', status: 'submitted' });
      expect(analyticsService.trackFormSubmission).toHaveBeenCalledWith(
        'contact-form',
        validFormData,
        'success'
      );
    });

    test('handles validation errors', async () => {
      const invalidData = { ...validFormData, email: 'invalid-email' };

      const result = await contactFormService.submitContactForm(invalidData);

      expect(fetch).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(analyticsService.trackFormSubmission).toHaveBeenCalledWith(
        'contact-form',
        invalidData,
        'error'
      );
    });

    test('handles server errors with retry', async () => {
      fetch
        .mockRejectedValueOnce(new Error('NetworkError'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 'form-123', status: 'submitted' })
        });

      const result = await contactFormService.submitContactForm(validFormData);

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(result.success).toBe(true);
    });

    test('handles persistent errors with fallback', async () => {
      const networkError = new Error('NetworkError');
      fetch.mockRejectedValue(networkError);

      errorHandlingService.handleApiError.mockResolvedValueOnce({
        success: false,
        message: 'Network error occurred'
      });

      const result = await contactFormService.submitContactForm(validFormData);

      expect(fetch).toHaveBeenCalledTimes(3); // Initial + 2 retries
      expect(errorHandlingService.handleApiError).toHaveBeenCalledWith(
        networkError,
        'contact_form',
        expect.objectContaining({
          formData: validFormData,
          retryCallback: expect.any(Function)
        })
      );
    });

    test('tracks submission attempts and results', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'form-123' })
      });

      await contactFormService.submitContactForm(validFormData);

      expect(analyticsService.trackFormSubmission).toHaveBeenCalledWith(
        'contact-form',
        validFormData,
        'attempt'
      );
      expect(analyticsService.trackFormSubmission).toHaveBeenCalledWith(
        'contact-form',
        validFormData,
        'success'
      );
    });

    test('shows success message by default', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'form-123' })
      });

      await contactFormService.submitContactForm(validFormData);

      expect(errorHandlingService.showUserFriendlyError).toHaveBeenCalledWith(
        'Thank you for your message! We\'ll get back to you within 24 hours.',
        'success',
        true,
        5000
      );
    });

    test('can disable success message', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'form-123' })
      });

      await contactFormService.submitContactForm(validFormData, {
        showSuccessMessage: false
      });

      expect(errorHandlingService.showUserFriendlyError).not.toHaveBeenCalled();
    });
  });

  describe('Retry Logic', () => {
    test('determines retryable errors correctly', () => {
      expect(contactFormService.shouldRetry(new Error('NetworkError'))).toBe(true);
      expect(contactFormService.shouldRetry(new Error('Failed to fetch'))).toBe(true);
      expect(contactFormService.shouldRetry(new Error('Server error: 500'))).toBe(true);
      expect(contactFormService.shouldRetry(new Error('Validation error'))).toBe(false);
      expect(contactFormService.shouldRetry(new Error('Bad request'))).toBe(false);
    });

    test('respects maximum retry count', async () => {
      const networkError = new Error('NetworkError');
      fetch.mockRejectedValue(networkError);

      errorHandlingService.handleApiError.mockResolvedValueOnce({
        success: false,
        message: 'Max retries exceeded'
      });

      const validData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        company: 'Test Corp',
        interested_in: 'Risk Strategy',
        message: 'This is a test message'
      };

      await contactFormService.submitContactForm(validData);

      expect(fetch).toHaveBeenCalledTimes(3); // Initial + 2 retries (maxRetries = 3)
    });
  });

  describe('Form Data Management', () => {
    test('prefills form data based on service type', () => {
      const existingData = {
        first_name: 'John',
        email: 'john@example.com'
      };

      const prefilledData = contactFormService.prefilFormData('risk-strategy', existingData);

      expect(prefilledData).toMatchObject({
        first_name: 'John',
        email: 'john@example.com',
        interested_in: 'Risk Strategy & Assessment',
        service_type: 'risk-strategy',
        message: expect.stringContaining('risk strategy')
      });
    });

    test('saves form data to localStorage', () => {
      const formData = {
        first_name: 'John',
        email: 'john@example.com'
      };

      contactFormService.saveFormDataLocally(formData);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'contact_form_draft',
        expect.stringContaining('John')
      );
    });

    test('loads saved form data from localStorage', () => {
      const savedData = {
        first_name: 'John',
        email: 'john@example.com',
        saved_at: new Date().toISOString()
      };

      localStorage.getItem.mockReturnValueOnce(JSON.stringify(savedData));

      const loadedData = contactFormService.loadSavedFormData();

      expect(loadedData).toMatchObject({
        first_name: 'John',
        email: 'john@example.com'
      });
      expect(loadedData.saved_at).toBeUndefined();
    });

    test('ignores old saved data', () => {
      const oldData = {
        first_name: 'John',
        saved_at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString() // 25 hours ago
      };

      localStorage.getItem.mockReturnValueOnce(JSON.stringify(oldData));

      const loadedData = contactFormService.loadSavedFormData();

      expect(loadedData).toBeNull();
      expect(localStorage.removeItem).toHaveBeenCalledWith('contact_form_draft');
    });

    test('clears saved form data', () => {
      contactFormService.clearSavedFormData();

      expect(localStorage.removeItem).toHaveBeenCalledWith('contact_form_draft');
    });
  });

  describe('Field Validation', () => {
    test('validates individual fields correctly', () => {
      expect(contactFormService.getFieldValidation('first_name', 'John')).toMatchObject({
        isValid: true,
        message: ''
      });

      expect(contactFormService.getFieldValidation('first_name', '')).toMatchObject({
        isValid: false,
        message: 'First name is required'
      });

      expect(contactFormService.getFieldValidation('email', 'john@example.com')).toMatchObject({
        isValid: true,
        message: ''
      });

      expect(contactFormService.getFieldValidation('email', 'invalid')).toMatchObject({
        isValid: false,
        message: 'Please enter a valid email address'
      });

      expect(contactFormService.getFieldValidation('message', 'This is a long enough message')).toMatchObject({
        isValid: true,
        message: ''
      });

      expect(contactFormService.getFieldValidation('message', 'Short')).toMatchObject({
        isValid: false,
        message: 'Message must be at least 10 characters long'
      });
    });
  });

  describe('Service Options', () => {
    test('returns correct service options', () => {
      const options = contactFormService.getServiceOptions();

      expect(options).toEqual(
        expect.arrayContaining([
          { value: 'risk-strategy', label: 'Risk Strategy & Assessment' },
          { value: 'program-build', label: 'Trust & Safety Program Build' },
          { value: 'ai-ml-intelligence', label: 'AI/ML Risk Intelligence' },
          { value: 'fractional-leadership', label: 'Fractional Leadership' },
          { value: 'general', label: 'General Consultation' },
          { value: 'other', label: 'Other' }
        ])
      );
    });

    test('returns correct urgency options', () => {
      const options = contactFormService.getUrgencyOptions();

      expect(options).toEqual(
        expect.arrayContaining([
          { value: 'low', label: 'Low - General inquiry' },
          { value: 'normal', label: 'Normal - Within a week' },
          { value: 'high', label: 'High - Within 2-3 days' },
          { value: 'urgent', label: 'Urgent - ASAP' }
        ])
      );
    });
  });

  describe('Form Interaction Tracking', () => {
    test('tracks form interactions', async () => {
      await contactFormService.trackFormInteraction('focus', 'email', { source: 'form' });

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'form_interaction',
        'contact-form-email',
        {
          action: 'focus',
          field: 'email',
          source: 'form'
        }
      );
    });
  });

  describe('Submission Handler Creation', () => {
    test('creates submission handler with options', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'form-123' })
      });

      const handler = contactFormService.createSubmissionHandler({
        showSuccessMessage: false,
        trackSubmission: false
      });

      const validData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        company: 'Test Corp',
        interested_in: 'Risk Strategy',
        message: 'This is a test message'
      };

      const result = await handler(validData);

      expect(result.success).toBe(true);
      expect(errorHandlingService.showUserFriendlyError).not.toHaveBeenCalled();
      expect(analyticsService.trackFormSubmission).not.toHaveBeenCalled();
    });
  });
});