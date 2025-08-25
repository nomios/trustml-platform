/**
 * Tests for ContactMethodService
 */

import contactMethodService from '../contactMethodService';
import analyticsService from '../analyticsService';

// Mock dependencies
jest.mock('../analyticsService');

describe('ContactMethodService', () => {
  beforeEach(() => {
    analyticsService.trackContactMethodInteraction.mockClear();
    global.open = jest.fn();
  });

  describe('Email Handling', () => {
    test('creates mailto link correctly', () => {
      const link = contactMethodService.createEmailLink('test@example.com');
      expect(link).toBe('mailto:test@example.com');
    });

    test('creates mailto link with subject', () => {
      const link = contactMethodService.createEmailLink('test@example.com', 'Test Subject');
      expect(link).toBe('mailto:test@example.com?subject=Test%20Subject');
    });

    test('creates mailto link with subject and body', () => {
      const link = contactMethodService.createEmailLink(
        'test@example.com',
        'Test Subject',
        'Test message body'
      );
      expect(link).toBe('mailto:test@example.com?subject=Test%20Subject&body=Test%20message%20body');
    });

    test('handles email click with tracking', async () => {
      const handler = contactMethodService.createEmailClickHandler(
        'contact@trustml.studio',
        'General Inquiry',
        'footer'
      );

      const mockEvent = { preventDefault: jest.fn() };
      await handler(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(analyticsService.trackContactMethodInteraction).toHaveBeenCalledWith(
        'email',
        'contact@trustml.studio',
        'footer'
      );
      expect(global.open).toHaveBeenCalledWith(
        expect.stringContaining('mailto:contact@trustml.studio'),
        '_self'
      );
    });

    test('opens email client with proper parameters', async () => {
      await contactMethodService.openEmailClient(
        'test@example.com',
        'Test Subject',
        'Test Body',
        'button'
      );

      expect(analyticsService.trackContactMethodInteraction).toHaveBeenCalledWith(
        'email',
        'test@example.com',
        'button'
      );
      expect(global.open).toHaveBeenCalledWith(
        'mailto:test@example.com?subject=Test%20Subject&body=Test%20Body',
        '_self'
      );
    });
  });

  describe('Phone Handling', () => {
    test('creates tel link correctly', () => {
      const link = contactMethodService.createPhoneLink('+1-555-123-4567');
      expect(link).toBe('tel:+1-555-123-4567');
    });

    test('formats phone number for tel link', () => {
      const link = contactMethodService.createPhoneLink('(555) 123-4567');
      expect(link).toBe('tel:(555) 123-4567');
    });

    test('handles phone click with tracking', async () => {
      const handler = contactMethodService.createPhoneClickHandler(
        '+1-555-123-4567',
        'header'
      );

      const mockEvent = { preventDefault: jest.fn() };
      await handler(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(analyticsService.trackContactMethodInteraction).toHaveBeenCalledWith(
        'phone',
        '+1-555-123-4567',
        'header'
      );
      expect(global.open).toHaveBeenCalledWith('tel:+1-555-123-4567', '_self');
    });

    test('initiates phone call with tracking', async () => {
      await contactMethodService.initiatePhoneCall('+1-555-123-4567', 'contact-section');

      expect(analyticsService.trackContactMethodInteraction).toHaveBeenCalledWith(
        'phone',
        '+1-555-123-4567',
        'contact-section'
      );
      expect(global.open).toHaveBeenCalledWith('tel:+1-555-123-4567', '_self');
    });
  });

  describe('Contact Method Configuration', () => {
    test('gets primary contact methods', () => {
      const methods = contactMethodService.getPrimaryContactMethods();

      expect(methods).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'email',
            value: 'contact@trustml.studio',
            label: 'Email Us'
          }),
          expect.objectContaining({
            type: 'phone',
            value: '+1-555-TRUST-ML',
            label: 'Call Us'
          })
        ])
      );
    });

    test('gets social media links', () => {
      const socialLinks = contactMethodService.getSocialMediaLinks();

      expect(socialLinks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            platform: 'linkedin',
            url: 'https://linkedin.com/in/michaelpezely',
            label: 'LinkedIn Profile'
          })
        ])
      );
    });

    test('gets contact method by type', () => {
      const emailMethod = contactMethodService.getContactMethod('email');
      const phoneMethod = contactMethodService.getContactMethod('phone');

      expect(emailMethod).toMatchObject({
        type: 'email',
        value: 'contact@trustml.studio'
      });

      expect(phoneMethod).toMatchObject({
        type: 'phone',
        value: '+1-555-TRUST-ML'
      });
    });

    test('returns null for unknown contact method type', () => {
      const unknownMethod = contactMethodService.getContactMethod('unknown');
      expect(unknownMethod).toBeNull();
    });
  });

  describe('Service-Specific Contact Methods', () => {
    test('gets contact methods for specific service', () => {
      const riskStrategyMethods = contactMethodService.getServiceContactMethods('risk-strategy');

      expect(riskStrategyMethods).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'email',
            subject: expect.stringContaining('Risk Strategy')
          })
        ])
      );
    });

    test('gets default contact methods for unknown service', () => {
      const defaultMethods = contactMethodService.getServiceContactMethods('unknown-service');

      expect(defaultMethods).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'email',
            subject: 'General Inquiry'
          })
        ])
      );
    });
  });

  describe('Contact Link Props Generation', () => {
    test('generates email link props', () => {
      const props = contactMethodService.getContactLinkProps('email', {
        subject: 'Test Subject',
        context: 'footer'
      });

      expect(props).toMatchObject({
        href: expect.stringContaining('mailto:'),
        onClick: expect.any(Function)
      });
    });

    test('generates phone link props', () => {
      const props = contactMethodService.getContactLinkProps('phone', {
        context: 'header'
      });

      expect(props).toMatchObject({
        href: expect.stringContaining('tel:'),
        onClick: expect.any(Function)
      });
    });

    test('generates safe props for unknown contact method', () => {
      const props = contactMethodService.getContactLinkProps('unknown');

      expect(props).toMatchObject({
        href: '#',
        onClick: expect.any(Function)
      });

      // Test the error handler
      const mockEvent = { preventDefault: jest.fn() };
      props.onClick(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Unknown contact method:', 'unknown');
    });
  });

  describe('Contact Method Validation', () => {
    test('validates email addresses', () => {
      expect(contactMethodService.isValidEmail('test@example.com')).toBe(true);
      expect(contactMethodService.isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(contactMethodService.isValidEmail('invalid-email')).toBe(false);
      expect(contactMethodService.isValidEmail('')).toBe(false);
    });

    test('validates phone numbers', () => {
      expect(contactMethodService.isValidPhone('+1-555-123-4567')).toBe(true);
      expect(contactMethodService.isValidPhone('(555) 123-4567')).toBe(true);
      expect(contactMethodService.isValidPhone('555.123.4567')).toBe(true);
      expect(contactMethodService.isValidPhone('5551234567')).toBe(true);
      expect(contactMethodService.isValidPhone('invalid-phone')).toBe(false);
      expect(contactMethodService.isValidPhone('')).toBe(false);
    });
  });

  describe('Contact Method Formatting', () => {
    test('formats phone numbers for display', () => {
      expect(contactMethodService.formatPhoneForDisplay('+15551234567')).toBe('(555) 123-4567');
      expect(contactMethodService.formatPhoneForDisplay('5551234567')).toBe('(555) 123-4567');
      expect(contactMethodService.formatPhoneForDisplay('+1-555-TRUST-ML')).toBe('+1-555-TRUST-ML');
    });

    test('formats email addresses for display', () => {
      expect(contactMethodService.formatEmailForDisplay('test@example.com')).toBe('test@example.com');
      expect(contactMethodService.formatEmailForDisplay('UPPER@EXAMPLE.COM')).toBe('upper@example.com');
    });
  });

  describe('Error Handling', () => {
    test('handles email client errors gracefully', async () => {
      global.open.mockImplementationOnce(() => {
        throw new Error('Email client not available');
      });

      await contactMethodService.openEmailClient('test@example.com', 'Subject', 'Body', 'test');

      expect(console.warn).toHaveBeenCalledWith(
        'Failed to open email client:',
        expect.any(Error)
      );
    });

    test('handles phone call errors gracefully', async () => {
      global.open.mockImplementationOnce(() => {
        throw new Error('Phone app not available');
      });

      await contactMethodService.initiatePhoneCall('+1-555-123-4567', 'test');

      expect(console.warn).toHaveBeenCalledWith(
        'Failed to initiate phone call:',
        expect.any(Error)
      );
    });

    test('handles tracking errors gracefully', async () => {
      analyticsService.trackContactMethodInteraction.mockRejectedValueOnce(
        new Error('Tracking failed')
      );

      await contactMethodService.openEmailClient('test@example.com', 'Subject', 'Body', 'test');

      // Should not throw error
      expect(global.open).toHaveBeenCalled();
    });
  });

  describe('Contact Method Availability', () => {
    test('checks if contact method is available', () => {
      expect(contactMethodService.isContactMethodAvailable('email')).toBe(true);
      expect(contactMethodService.isContactMethodAvailable('phone')).toBe(true);
      expect(contactMethodService.isContactMethodAvailable('unknown')).toBe(false);
    });

    test('gets available contact methods', () => {
      const availableMethods = contactMethodService.getAvailableContactMethods();

      expect(availableMethods).toEqual(
        expect.arrayContaining(['email', 'phone'])
      );
    });
  });
});