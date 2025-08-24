/**
 * Tests for ExternalLinkService
 */

import externalLinkService from '../externalLinkService';
import analyticsService from '../analyticsService';

// Mock dependencies
jest.mock('../analyticsService');

describe('ExternalLinkService', () => {
  beforeEach(() => {
    analyticsService.trackLinkClick.mockClear();
    global.open = jest.fn();
  });

  describe('External Link Opening', () => {
    test('opens external link with proper security attributes', async () => {
      await externalLinkService.openExternalLink(
        'https://example.com',
        'test-link',
        'external',
        { source: 'footer' }
      );

      expect(global.open).toHaveBeenCalledWith(
        'https://example.com',
        '_blank',
        'noopener,noreferrer'
      );

      expect(analyticsService.trackLinkClick).toHaveBeenCalledWith(
        'test-link',
        'external',
        'https://example.com',
        { source: 'footer' }
      );
    });

    test('handles link opening errors gracefully', async () => {
      global.open.mockReturnValueOnce(null); // Simulate popup blocker

      await externalLinkService.openExternalLink(
        'https://example.com',
        'test-link',
        'external'
      );

      expect(console.warn).toHaveBeenCalledWith(
        'Failed to open external link (popup blocked?):',
        'https://example.com'
      );
    });

    test('validates URLs before opening', async () => {
      await externalLinkService.openExternalLink(
        'invalid-url',
        'test-link',
        'external'
      );

      expect(global.open).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        'Invalid URL provided:',
        'invalid-url'
      );
    });
  });

  describe('Social Media Links', () => {
    test('gets LinkedIn profile URL', () => {
      const url = externalLinkService.getSocialMediaUrl('linkedin');
      expect(url).toBe('https://linkedin.com/in/michaelpezely');
    });

    test('gets Twitter profile URL', () => {
      const url = externalLinkService.getSocialMediaUrl('twitter');
      expect(url).toBe('https://twitter.com/michaelpezely');
    });

    test('returns null for unknown social media platform', () => {
      const url = externalLinkService.getSocialMediaUrl('unknown');
      expect(url).toBeNull();
    });

    test('opens social media profile', async () => {
      await externalLinkService.openSocialMediaProfile('linkedin', 'footer');

      expect(global.open).toHaveBeenCalledWith(
        'https://linkedin.com/in/michaelpezely',
        '_blank',
        'noopener,noreferrer'
      );

      expect(analyticsService.trackLinkClick).toHaveBeenCalledWith(
        'social-linkedin',
        'social',
        'https://linkedin.com/in/michaelpezely',
        { platform: 'linkedin', source: 'footer' }
      );
    });

    test('handles unknown social media platform', async () => {
      await externalLinkService.openSocialMediaProfile('unknown', 'footer');

      expect(global.open).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        'Unknown social media platform:',
        'unknown'
      );
    });
  });

  describe('Company Links', () => {
    test('gets company website URL', () => {
      const ebayUrl = externalLinkService.getCompanyUrl('ebay');
      const offerupUrl = externalLinkService.getCompanyUrl('offerup');
      const signifydUrl = externalLinkService.getCompanyUrl('signifyd');

      expect(ebayUrl).toBe('https://www.ebay.com');
      expect(offerupUrl).toBe('https://www.offerup.com');
      expect(signifydUrl).toBe('https://www.signifyd.com');
    });

    test('returns null for unknown company', () => {
      const url = externalLinkService.getCompanyUrl('unknown');
      expect(url).toBeNull();
    });

    test('opens company website', async () => {
      await externalLinkService.openCompanyWebsite('ebay', 'experience-section');

      expect(global.open).toHaveBeenCalledWith(
        'https://www.ebay.com',
        '_blank',
        'noopener,noreferrer'
      );

      expect(analyticsService.trackLinkClick).toHaveBeenCalledWith(
        'company-ebay',
        'company',
        'https://www.ebay.com',
        { company: 'ebay', source: 'experience-section' }
      );
    });

    test('handles unknown company', async () => {
      await externalLinkService.openCompanyWebsite('unknown', 'test');

      expect(global.open).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        'Unknown company:',
        'unknown'
      );
    });
  });

  describe('External Resource Links', () => {
    test('opens external resource with tracking', async () => {
      await externalLinkService.openExternalResource(
        'https://docs.example.com/guide',
        'documentation',
        'resources-section'
      );

      expect(global.open).toHaveBeenCalledWith(
        'https://docs.example.com/guide',
        '_blank',
        'noopener,noreferrer'
      );

      expect(analyticsService.trackLinkClick).toHaveBeenCalledWith(
        'external-resource-documentation',
        'external-resource',
        'https://docs.example.com/guide',
        { resource_type: 'documentation', source: 'resources-section' }
      );
    });
  });

  describe('Link Props Generation', () => {
    test('generates external link props', () => {
      const props = externalLinkService.getExternalLinkProps(
        'https://example.com',
        'test-link',
        'external',
        { source: 'footer' }
      );

      expect(props).toMatchObject({
        href: 'https://example.com',
        target: '_blank',
        rel: 'noopener noreferrer',
        onClick: expect.any(Function)
      });
    });

    test('generates social media link props', () => {
      const props = externalLinkService.getSocialMediaLinkProps('linkedin', 'footer');

      expect(props).toMatchObject({
        href: 'https://linkedin.com/in/michaelpezely',
        target: '_blank',
        rel: 'noopener noreferrer',
        onClick: expect.any(Function)
      });
    });

    test('generates company link props', () => {
      const props = externalLinkService.getCompanyLinkProps('ebay', 'experience');

      expect(props).toMatchObject({
        href: 'https://www.ebay.com',
        target: '_blank',
        rel: 'noopener noreferrer',
        onClick: expect.any(Function)
      });
    });

    test('generates safe props for invalid URLs', () => {
      const props = externalLinkService.getExternalLinkProps(
        'invalid-url',
        'test-link',
        'external'
      );

      expect(props).toMatchObject({
        href: '#',
        onClick: expect.any(Function)
      });

      // Test the error handler
      const mockEvent = { preventDefault: jest.fn() };
      props.onClick(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Invalid URL provided:', 'invalid-url');
    });
  });

  describe('Click Handler Creation', () => {
    test('creates external link click handler', async () => {
      const handler = externalLinkService.createExternalLinkHandler(
        'https://example.com',
        'test-link',
        'external',
        { source: 'test' }
      );

      const mockEvent = { preventDefault: jest.fn() };
      await handler(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(global.open).toHaveBeenCalledWith(
        'https://example.com',
        '_blank',
        'noopener,noreferrer'
      );
    });

    test('creates social media click handler', async () => {
      const handler = externalLinkService.createSocialMediaHandler('linkedin', 'footer');

      const mockEvent = { preventDefault: jest.fn() };
      await handler(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(global.open).toHaveBeenCalledWith(
        'https://linkedin.com/in/michaelpezely',
        '_blank',
        'noopener,noreferrer'
      );
    });

    test('creates company website click handler', async () => {
      const handler = externalLinkService.createCompanyHandler('ebay', 'experience');

      const mockEvent = { preventDefault: jest.fn() };
      await handler(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(global.open).toHaveBeenCalledWith(
        'https://www.ebay.com',
        '_blank',
        'noopener,noreferrer'
      );
    });
  });

  describe('URL Validation', () => {
    test('validates URLs correctly', () => {
      expect(externalLinkService.isValidUrl('https://example.com')).toBe(true);
      expect(externalLinkService.isValidUrl('http://example.com')).toBe(true);
      expect(externalLinkService.isValidUrl('https://subdomain.example.com/path')).toBe(true);
      expect(externalLinkService.isValidUrl('invalid-url')).toBe(false);
      expect(externalLinkService.isValidUrl('')).toBe(false);
      expect(externalLinkService.isValidUrl('ftp://example.com')).toBe(false);
    });

    test('validates social media URLs', () => {
      expect(externalLinkService.isValidSocialMediaUrl('https://linkedin.com/in/user')).toBe(true);
      expect(externalLinkService.isValidSocialMediaUrl('https://twitter.com/user')).toBe(true);
      expect(externalLinkService.isValidSocialMediaUrl('https://example.com')).toBe(false);
    });
  });

  describe('Link Configuration', () => {
    test('gets all social media platforms', () => {
      const platforms = externalLinkService.getSocialMediaPlatforms();

      expect(platforms).toEqual(
        expect.arrayContaining(['linkedin', 'twitter'])
      );
    });

    test('gets all supported companies', () => {
      const companies = externalLinkService.getSupportedCompanies();

      expect(companies).toEqual(
        expect.arrayContaining(['ebay', 'offerup', 'signifyd'])
      );
    });

    test('checks if social media platform is supported', () => {
      expect(externalLinkService.isSocialMediaPlatformSupported('linkedin')).toBe(true);
      expect(externalLinkService.isSocialMediaPlatformSupported('facebook')).toBe(false);
    });

    test('checks if company is supported', () => {
      expect(externalLinkService.isCompanySupported('ebay')).toBe(true);
      expect(externalLinkService.isCompanySupported('unknown')).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('handles tracking errors gracefully', async () => {
      analyticsService.trackLinkClick.mockRejectedValueOnce(new Error('Tracking failed'));

      await externalLinkService.openExternalLink(
        'https://example.com',
        'test-link',
        'external'
      );

      // Should still open the link
      expect(global.open).toHaveBeenCalledWith(
        'https://example.com',
        '_blank',
        'noopener,noreferrer'
      );
    });

    test('handles window.open failures', async () => {
      global.open.mockImplementationOnce(() => {
        throw new Error('Window blocked');
      });

      await externalLinkService.openExternalLink(
        'https://example.com',
        'test-link',
        'external'
      );

      expect(console.warn).toHaveBeenCalledWith(
        'Failed to open external link:',
        expect.any(Error)
      );
    });
  });

  describe('Link Security', () => {
    test('always uses secure attributes for external links', async () => {
      await externalLinkService.openExternalLink(
        'https://example.com',
        'test-link',
        'external'
      );

      expect(global.open).toHaveBeenCalledWith(
        'https://example.com',
        '_blank',
        'noopener,noreferrer'
      );
    });

    test('includes security attributes in link props', () => {
      const props = externalLinkService.getExternalLinkProps(
        'https://example.com',
        'test-link',
        'external'
      );

      expect(props.target).toBe('_blank');
      expect(props.rel).toBe('noopener noreferrer');
    });
  });
});