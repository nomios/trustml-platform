/**
 * Resource Service
 * Handles downloadable resources with tracking and analytics
 */

import analyticsService from './analyticsService.js';
import errorHandlingService from './errorHandlingService.js';

class ResourceService {
  // Resource metadata mapping
  static RESOURCES = {
    'ai-fraud-detection-guide': {
      id: 'ai-fraud-detection-guide',
      title: 'The Complete Guide to AI-Powered Fraud Detection',
      description: 'Comprehensive guide covering AI/ML approaches to fraud detection, implementation strategies, and best practices.',
      category: 'white-paper',
      filename: 'The Complete Guide to AI-Powered Fraud Detection.pdf',
      path: '/resources/white-papers/The Complete Guide to AI-Powered Fraud Detection.pdf',
      size: '374 KB',
      pages: 25,
      downloadCount: 0
    },
    'gameverse-case-study': {
      id: 'gameverse-case-study',
      title: 'GameVerse Trust & Safety Case Study',
      description: 'Detailed case study of implementing trust & safety systems for a gaming marketplace platform.',
      category: 'case-study',
      filename: 'gameverse-case-study.pdf',
      path: '/resources/case-studies/gameverse-case-study.pdf',
      size: '374 KB',
      pages: 25,
      downloadCount: 0
    },
    'marketplace-playbook': {
      id: 'marketplace-playbook',
      title: 'Marketplace Trust & Safety Playbook',
      description: 'Strategic playbook for building and scaling trust & safety operations in marketplace environments.',
      category: 'guide',
      filename: 'marketplace-trust-safety-playbook.pdf',
      path: '/resources/guides/marketplace-trust-safety-playbook.pdf',
      size: '374 KB',
      pages: 25,
      downloadCount: 0
    },
    'real-time-ml-guide': {
      id: 'real-time-ml-guide',
      title: 'Real-time ML Implementation Guide',
      description: 'Technical guide for implementing real-time machine learning systems for fraud detection.',
      category: 'guide',
      filename: 'real-time-ml-implementation-guide.pdf',
      path: '/resources/guides/real-time-ml-implementation-guide.pdf',
      size: '374 KB',
      pages: 25,
      downloadCount: 0
    },
    'fairness-in-ai-research': {
      id: 'fairness-in-ai-research',
      title: 'Fairness in AI Research Paper',
      description: 'Research paper exploring fairness considerations in AI-powered risk assessment systems.',
      category: 'research',
      filename: 'fairness-in-ai-research.pdf',
      path: '/resources/white-papers/fairness-in-ai-research.pdf',
      size: '374 KB',
      pages: 25,
      downloadCount: 0
    },
    'industry-benchmarks-2024': {
      id: 'industry-benchmarks-2024',
      title: 'Industry Benchmarks Report 2024',
      description: 'Annual report on trust & safety industry benchmarks, trends, and performance metrics.',
      category: 'report',
      filename: 'industry-benchmarks-2024.pdf',
      path: '/resources/white-papers/industry-benchmarks-2024.pdf',
      size: '374 KB',
      pages: 25,
      downloadCount: 0
    },
    'michael-pezely-resume': {
      id: 'michael-pezely-resume',
      title: 'Michael Pezely - Resume/CV',
      description: 'Comprehensive resume detailing 25+ years of experience in trust & safety, fraud prevention, and AI/ML systems.',
      category: 'resume',
      filename: 'michael-pezely-resume.pdf',
      path: '/resources/michael-pezely-resume.pdf',
      size: '374 KB',
      pages: 25,
      downloadCount: 0
    }
  };

  /**
   * Get resource metadata by ID
   * @param {string} resourceId - Resource identifier
   * @returns {Object|null} Resource metadata
   */
  static getResource(resourceId) {
    return this.RESOURCES[resourceId] || null;
  }

  /**
   * Get all resources
   * @returns {Array} Array of all resources
   */
  static getAllResources() {
    return Object.values(this.RESOURCES);
  }

  /**
   * Get resources by category
   * @param {string} category - Resource category
   * @returns {Array} Array of resources in category
   */
  static getResourcesByCategory(category) {
    return Object.values(this.RESOURCES).filter(resource => 
      resource.category === category
    );
  }

  /**
   * Download resource with tracking
   * @param {string} resourceId - Resource identifier
   * @param {Object} options - Download options
   */
  static async downloadResource(resourceId, options = {}) {
    const {
      trackingSource = 'direct',
      userInfo = null
    } = options;

    const resource = this.getResource(resourceId);
    if (!resource) {
      errorHandlingService.showUserFriendlyError(
        'The requested resource was not found.',
        'error'
      );
      return false;
    }

    try {
      // Track the download
      await this.trackResourceDownload(resourceId, trackingSource, userInfo);

      // Trigger download
      const link = document.createElement('a');
      link.href = resource.path;
      link.download = resource.filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Add to DOM temporarily and click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return true;
    } catch (error) {
      // Handle download errors with fallback options
      const fallbackResult = await errorHandlingService.handleApiError(error, 'resource_download', {
        resourceId: resourceId,
        resourceTitle: resource.title,
        retryCallback: () => this.downloadResource(resourceId, options),
        alternativeCallback: () => {
          // Navigate to resources section
          if (window.navigationService) {
            window.navigationService.scrollToSection('resources', 0, 'error-fallback');
          }
        }
      });

      return fallbackResult.success;
    }
  }

  /**
   * Create download handler for React components
   * @param {string} resourceId - Resource identifier
   * @param {Object} options - Download options
   * @returns {Function} Click handler function
   */
  static createDownloadHandler(resourceId, options = {}) {
    return async (e) => {
      e.preventDefault();
      await this.downloadResource(resourceId, options);
    };
  }

  /**
   * Track resource download for analytics
   * @param {string} resourceId - Resource identifier
   * @param {string} source - Download source/location
   * @param {Object} userInfo - User information if available
   */
  static async trackResourceDownload(resourceId, source, userInfo) {
    try {
      const resource = this.getResource(resourceId);
      if (!resource) return;

      // Use the centralized analytics service
      await analyticsService.trackResourceDownload(
        resourceId, 
        resource.title, 
        resource.category, 
        source
      );

      // Update local download count
      this.RESOURCES[resourceId].downloadCount += 1;
    } catch (error) {
      console.warn('Error tracking resource download:', error);
    }
  }

  /**
   * Get download link props for React components
   * @param {string} resourceId - Resource identifier
   * @param {Object} options - Download options
   * @returns {Object} Props object for download links
   */
  static getDownloadLinkProps(resourceId, options = {}) {
    const resource = this.getResource(resourceId);
    if (!resource) {
      return {
        href: '#',
        onClick: (e) => {
          e.preventDefault();
          console.error('Resource not found:', resourceId);
        }
      };
    }

    return {
      href: resource.path,
      download: resource.filename,
      target: '_blank',
      rel: 'noopener noreferrer',
      onClick: this.createDownloadHandler(resourceId, options)
    };
  }

  /**
   * Check if resource exists
   * @param {string} resourceId - Resource identifier
   * @returns {boolean} Whether resource exists
   */
  static resourceExists(resourceId) {
    return !!this.getResource(resourceId);
  }

  /**
   * Get resource file size in human readable format
   * @param {string} resourceId - Resource identifier
   * @returns {string} File size string
   */
  static getResourceSize(resourceId) {
    const resource = this.getResource(resourceId);
    return resource ? resource.size : 'Unknown';
  }

  /**
   * Get resource download count
   * @param {string} resourceId - Resource identifier
   * @returns {number} Download count
   */
  static getDownloadCount(resourceId) {
    const resource = this.getResource(resourceId);
    return resource ? resource.downloadCount : 0;
  }

  /**
   * Search resources by title or description
   * @param {string} query - Search query
   * @returns {Array} Array of matching resources
   */
  static searchResources(query) {
    const searchTerm = query.toLowerCase();
    return Object.values(this.RESOURCES).filter(resource =>
      resource.title.toLowerCase().includes(searchTerm) ||
      resource.description.toLowerCase().includes(searchTerm)
    );
  }
}

export default ResourceService;