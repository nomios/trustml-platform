/**
 * Tests for ResourceService
 */

import ResourceService from '../resourceService';
import analyticsService from '../analyticsService';
import errorHandlingService from '../errorHandlingService';

// Mock dependencies
jest.mock('../analyticsService');
jest.mock('../errorHandlingService');

describe('ResourceService', () => {
  beforeEach(() => {
    analyticsService.trackResourceDownload.mockClear();
    errorHandlingService.showUserFriendlyError.mockClear();
    errorHandlingService.handleApiError.mockClear();
    
    // Reset download counts
    Object.values(ResourceService.RESOURCES).forEach(resource => {
      resource.downloadCount = 0;
    });
  });

  describe('Resource Metadata Management', () => {
    test('gets resource by ID', () => {
      const resource = ResourceService.getResource('ai-fraud-detection-guide');
      
      expect(resource).toMatchObject({
        id: 'ai-fraud-detection-guide',
        title: 'The Complete Guide to AI-Powered Fraud Detection',
        category: 'white-paper',
        filename: 'The Complete Guide to AI-Powered Fraud Detection.pdf'
      });
    });

    test('returns null for non-existent resource', () => {
      const resource = ResourceService.getResource('non-existent');
      expect(resource).toBeNull();
    });

    test('gets all resources', () => {
      const resources = ResourceService.getAllResources();
      
      expect(resources).toHaveLength(7);
      expect(resources[0]).toHaveProperty('id');
      expect(resources[0]).toHaveProperty('title');
      expect(resources[0]).toHaveProperty('category');
    });

    test('gets resources by category', () => {
      const whitepapers = ResourceService.getResourcesByCategory('white-paper');
      const caseStudies = ResourceService.getResourcesByCategory('case-study');
      
      expect(whitepapers).toHaveLength(1);
      expect(whitepapers[0].category).toBe('white-paper');
      
      expect(caseStudies).toHaveLength(1);
      expect(caseStudies[0].category).toBe('case-study');
    });

    test('checks if resource exists', () => {
      expect(ResourceService.resourceExists('ai-fraud-detection-guide')).toBe(true);
      expect(ResourceService.resourceExists('non-existent')).toBe(false);
    });

    test('gets resource size', () => {
      const size = ResourceService.getResourceSize('ai-fraud-detection-guide');
      expect(size).toBe('374 KB');
      
      const unknownSize = ResourceService.getResourceSize('non-existent');
      expect(unknownSize).toBe('Unknown');
    });

    test('gets download count', () => {
      const count = ResourceService.getDownloadCount('ai-fraud-detection-guide');
      expect(count).toBe(0);
      
      const unknownCount = ResourceService.getDownloadCount('non-existent');
      expect(unknownCount).toBe(0);
    });
  });

  describe('Resource Search', () => {
    test('searches resources by title', () => {
      const results = ResourceService.searchResources('fraud detection');
      
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('ai-fraud-detection-guide');
    });

    test('searches resources by description', () => {
      const results = ResourceService.searchResources('gaming marketplace');
      
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('gameverse-case-study');
    });

    test('returns empty array for no matches', () => {
      const results = ResourceService.searchResources('nonexistent topic');
      expect(results).toHaveLength(0);
    });

    test('search is case insensitive', () => {
      const results = ResourceService.searchResources('FRAUD DETECTION');
      expect(results).toHaveLength(1);
    });
  });

  describe('Resource Downloads', () => {
    test('downloads resource successfully', async () => {
      // Mock document.createElement and related methods
      const mockLink = {
        href: '',
        download: '',
        target: '',
        rel: '',
        click: jest.fn()
      };
      
      document.createElement = jest.fn(() => mockLink);
      document.body.appendChild = jest.fn();
      document.body.removeChild = jest.fn();

      const result = await ResourceService.downloadResource('ai-fraud-detection-guide', {
        trackingSource: 'resources-section'
      });

      expect(result).toBe(true);
      expect(mockLink.href).toBe('/resources/white-papers/The Complete Guide to AI-Powered Fraud Detection.pdf');
      expect(mockLink.download).toBe('The Complete Guide to AI-Powered Fraud Detection.pdf');
      expect(mockLink.target).toBe('_blank');
      expect(mockLink.rel).toBe('noopener noreferrer');
      expect(mockLink.click).toHaveBeenCalled();
      
      expect(analyticsService.trackResourceDownload).toHaveBeenCalledWith(
        'ai-fraud-detection-guide',
        'The Complete Guide to AI-Powered Fraud Detection',
        'white-paper',
        'resources-section'
      );
    });

    test('handles non-existent resource download', async () => {
      const result = await ResourceService.downloadResource('non-existent');

      expect(result).toBe(false);
      expect(errorHandlingService.showUserFriendlyError).toHaveBeenCalledWith(
        'The requested resource was not found.',
        'error'
      );
    });

    test('handles download errors with fallback', async () => {
      const mockError = new Error('Download failed');
      document.createElement = jest.fn(() => {
        throw mockError;
      });

      errorHandlingService.handleApiError.mockResolvedValueOnce({
        success: false
      });

      const result = await ResourceService.downloadResource('ai-fraud-detection-guide');

      expect(result).toBe(false);
      expect(errorHandlingService.handleApiError).toHaveBeenCalledWith(
        mockError,
        'resource_download',
        expect.objectContaining({
          resourceId: 'ai-fraud-detection-guide',
          resourceTitle: 'The Complete Guide to AI-Powered Fraud Detection',
          retryCallback: expect.any(Function),
          alternativeCallback: expect.any(Function)
        })
      );
    });

    test('tracks resource downloads', async () => {
      await ResourceService.trackResourceDownload('ai-fraud-detection-guide', 'button', null);

      expect(analyticsService.trackResourceDownload).toHaveBeenCalledWith(
        'ai-fraud-detection-guide',
        'The Complete Guide to AI-Powered Fraud Detection',
        'white-paper',
        'button'
      );

      expect(ResourceService.getDownloadCount('ai-fraud-detection-guide')).toBe(1);
    });

    test('handles tracking errors gracefully', async () => {
      analyticsService.trackResourceDownload.mockRejectedValueOnce(new Error('Tracking failed'));

      // Should not throw
      await ResourceService.trackResourceDownload('ai-fraud-detection-guide', 'button', null);

      expect(console.warn).toHaveBeenCalledWith(
        'Error tracking resource download:',
        expect.any(Error)
      );
    });
  });

  describe('Download Handler Creation', () => {
    test('creates download handler', async () => {
      const mockLink = {
        href: '',
        download: '',
        target: '',
        rel: '',
        click: jest.fn()
      };
      
      document.createElement = jest.fn(() => mockLink);
      document.body.appendChild = jest.fn();
      document.body.removeChild = jest.fn();

      const handler = ResourceService.createDownloadHandler('ai-fraud-detection-guide', {
        trackingSource: 'test-button'
      });

      const mockEvent = { preventDefault: jest.fn() };
      await handler(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(analyticsService.trackResourceDownload).toHaveBeenCalledWith(
        'ai-fraud-detection-guide',
        'The Complete Guide to AI-Powered Fraud Detection',
        'white-paper',
        'test-button'
      );
    });
  });

  describe('Download Link Props', () => {
    test('gets download link props for existing resource', () => {
      const props = ResourceService.getDownloadLinkProps('ai-fraud-detection-guide', {
        trackingSource: 'test'
      });

      expect(props).toMatchObject({
        href: '/resources/white-papers/The Complete Guide to AI-Powered Fraud Detection.pdf',
        download: 'The Complete Guide to AI-Powered Fraud Detection.pdf',
        target: '_blank',
        rel: 'noopener noreferrer',
        onClick: expect.any(Function)
      });
    });

    test('gets safe props for non-existent resource', () => {
      const props = ResourceService.getDownloadLinkProps('non-existent');

      expect(props).toMatchObject({
        href: '#',
        onClick: expect.any(Function)
      });

      // Test the error handler
      const mockEvent = { preventDefault: jest.fn() };
      props.onClick(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Resource not found:', 'non-existent');
    });
  });

  describe('Resource Categories', () => {
    test('categorizes resources correctly', () => {
      const whitepapers = ResourceService.getResourcesByCategory('white-paper');
      const caseStudies = ResourceService.getResourcesByCategory('case-study');
      const guides = ResourceService.getResourcesByCategory('guide');
      const resumes = ResourceService.getResourcesByCategory('resume');

      expect(whitepapers.length).toBeGreaterThan(0);
      expect(caseStudies.length).toBeGreaterThan(0);
      expect(guides.length).toBeGreaterThan(0);
      expect(resumes.length).toBeGreaterThan(0);

      whitepapers.forEach(resource => {
        expect(resource.category).toBe('white-paper');
      });

      caseStudies.forEach(resource => {
        expect(resource.category).toBe('case-study');
      });
    });
  });

  describe('Resource Metadata Validation', () => {
    test('all resources have required properties', () => {
      const resources = ResourceService.getAllResources();

      resources.forEach(resource => {
        expect(resource).toHaveProperty('id');
        expect(resource).toHaveProperty('title');
        expect(resource).toHaveProperty('description');
        expect(resource).toHaveProperty('category');
        expect(resource).toHaveProperty('filename');
        expect(resource).toHaveProperty('path');
        expect(resource).toHaveProperty('size');
        expect(resource).toHaveProperty('downloadCount');

        expect(typeof resource.id).toBe('string');
        expect(typeof resource.title).toBe('string');
        expect(typeof resource.description).toBe('string');
        expect(typeof resource.category).toBe('string');
        expect(typeof resource.filename).toBe('string');
        expect(typeof resource.path).toBe('string');
        expect(typeof resource.downloadCount).toBe('number');
      });
    });

    test('resource IDs are unique', () => {
      const resources = ResourceService.getAllResources();
      const ids = resources.map(r => r.id);
      const uniqueIds = [...new Set(ids)];

      expect(ids.length).toBe(uniqueIds.length);
    });

    test('resource paths are properly formatted', () => {
      const resources = ResourceService.getAllResources();

      resources.forEach(resource => {
        expect(resource.path).toMatch(/^\/resources\//);
        expect(resource.path).toContain(resource.filename);
      });
    });
  });
});