/**
 * External Link Service
 * Handles external links with proper security attributes and tracking
 */

import analyticsService from './analyticsService.js';
import errorHandlingService from './errorHandlingService.js';

class ExternalLinkService {
  // Company website URLs
  static COMPANY_URLS = {
    ebay: 'https://www.ebay.com',
    offerup: 'https://offerup.com',
    signifyd: 'https://www.signifyd.com'
  };

  // Social media URLs
  static SOCIAL_URLS = {
    linkedin: 'https://linkedin.com/in/mpezely',
    email: 'mailto:michael@trustml.studio',
    twitter: 'https://twitter.com/mpezely', // Placeholder - update with actual handle
    github: 'https://github.com/mpezely' // Placeholder - update with actual handle
  };

  /**
   * Open external link with proper security attributes
   * @param {string} url - The URL to open
   * @param {Object} options - Additional options
   */
  static openExternalLink(url, options = {}) {
    const {
      trackingId = null,
      category = 'external',
      newTab = true
    } = options;

    try {
      // Track the click if tracking is enabled
      if (trackingId) {
        this.trackExternalLinkClick(trackingId, url, category);
      }

      if (newTab) {
        // Open in new tab with security attributes
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        
        // Fallback for popup blockers
        if (!newWindow) {
          console.warn('Popup blocked. Redirecting in current tab.');
          errorHandlingService.showUserFriendlyError(
            'Popup blocked. The link will open in the current tab.',
            'warning',
            true,
            3000
          );
          window.location.href = url;
        }
      } else {
        window.location.href = url;
      }
    } catch (error) {
      // Handle link opening errors
      errorHandlingService.handleApiError(error, 'external_link', {
        url: url,
        category: category,
        retryCallback: () => this.openExternalLink(url, options)
      });
    }
  }

  /**
   * Get company website URL
   * @param {string} company - Company identifier (ebay, offerup, signifyd)
   * @returns {string} Company URL
   */
  static getCompanyUrl(company) {
    return this.COMPANY_URLS[company.toLowerCase()] || '#';
  }

  /**
   * Get social media URL
   * @param {string} platform - Social platform identifier
   * @returns {string} Social media URL
   */
  static getSocialUrl(platform) {
    return this.SOCIAL_URLS[platform.toLowerCase()] || '#';
  }

  /**
   * Create external link handler
   * @param {string} url - The URL to link to
   * @param {Object} options - Link options
   * @returns {Function} Click handler function
   */
  static createLinkHandler(url, options = {}) {
    return (e) => {
      e.preventDefault();
      this.openExternalLink(url, options);
    };
  }

  /**
   * Create company link handler
   * @param {string} company - Company identifier
   * @param {Object} options - Link options
   * @returns {Function} Click handler function
   */
  static createCompanyLinkHandler(company, options = {}) {
    const url = this.getCompanyUrl(company);
    return this.createLinkHandler(url, {
      ...options,
      trackingId: `company-${company}`,
      category: 'company'
    });
  }

  /**
   * Create social media link handler
   * @param {string} platform - Social platform identifier
   * @param {Object} options - Link options
   * @returns {Function} Click handler function
   */
  static createSocialLinkHandler(platform, options = {}) {
    const url = this.getSocialUrl(platform);
    return this.createLinkHandler(url, {
      ...options,
      trackingId: `social-${platform}`,
      category: 'social'
    });
  }

  /**
   * Track external link clicks for analytics
   * @param {string} linkId - Unique identifier for the link
   * @param {string} url - The URL being accessed
   * @param {string} category - Link category
   */
  static trackExternalLinkClick(linkId, url, category) {
    try {
      // Use the centralized analytics service
      analyticsService.trackLinkClick(linkId, category, url, {
        link_type: 'external',
        target_domain: new URL(url).hostname
      });
    } catch (error) {
      console.warn('Error tracking external link click:', error);
    }
  }

  /**
   * Get external link props for React components
   * @param {string} url - The URL to link to
   * @param {Object} options - Link options
   * @returns {Object} Props object for external links
   */
  static getExternalLinkProps(url, options = {}) {
    const {
      trackingId = null,
      category = 'external',
      newTab = true
    } = options;

    const props = {
      href: url,
      onClick: this.createLinkHandler(url, { trackingId, category, newTab })
    };

    if (newTab) {
      props.target = '_blank';
      props.rel = 'noopener noreferrer';
    }

    return props;
  }

  /**
   * Get company link props for React components
   * @param {string} company - Company identifier
   * @param {Object} options - Link options
   * @returns {Object} Props object for company links
   */
  static getCompanyLinkProps(company, options = {}) {
    const url = this.getCompanyUrl(company);
    return this.getExternalLinkProps(url, {
      ...options,
      trackingId: `company-${company}`,
      category: 'company'
    });
  }

  /**
   * Get social media link props for React components
   * @param {string} platform - Social platform identifier
   * @param {Object} options - Link options
   * @returns {Object} Props object for social links
   */
  static getSocialLinkProps(platform, options = {}) {
    const url = this.getSocialUrl(platform);
    return this.getExternalLinkProps(url, {
      ...options,
      trackingId: `social-${platform}`,
      category: 'social'
    });
  }
}

export default ExternalLinkService;