/**
 * Integration Tests for Resource Download Flow
 * Tests the complete user journey from resource discovery to download
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResourceService from '../../utils/resourceService';
import analyticsService from '../../utils/analyticsService';
import errorHandlingService from '../../utils/errorHandlingService';

// Mock dependencies
jest.mock('../../utils/analyticsService');
jest.mock('../../utils/errorHandlingService');

// Mock Resources component
const MockResourcesSection = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const allResources = ResourceService.getAllResources();
  const filteredResources = React.useMemo(() => {
    let resources = allResources;
    
    if (selectedCategory !== 'all') {
      resources = resources.filter(r => r.category === selectedCategory);
    }
    
    if (searchQuery) {
      resources = ResourceService.searchResources(searchQuery);
    }
    
    return resources;
  }, [selectedCategory, searchQuery, allResources]);

  const handleDownload = async (resourceId, source = 'resources-section') => {
    return await ResourceService.downloadResource(resourceId, {
      trackingSource: source
    });
  };

  return (
    <div data-testid="resources-section">
      <input
        data-testid="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search resources..."
      />
      
      <select
        data-testid="category-filter"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="all">All Categories</option>
        <option value="white-paper">White Papers</option>
        <option value="case-study">Case Studies</option>
        <option value="guide">Guides</option>
        <option value="resume">Resume</option>
      </select>

      <div data-testid="resources-list">
        {filteredResources.map(resource => (
          <div key={resource.id} data-testid={`resource-${resource.id}`}>
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
            <span data-testid={`category-${resource.id}`}>{resource.category}</span>
            <span data-testid={`size-${resource.id}`}>{resource.size}</span>
            <span data-testid={`downloads-${resource.id}`}>
              {ResourceService.getDownloadCount(resource.id)} downloads
            </span>
            <button
              data-testid={`download-${resource.id}`}
              onClick={() => handleDownload(resource.id)}
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

describe('Resource Download Flow Integration Tests', () => {
  beforeEach(() => {
    analyticsService.trackResourceDownload.mockClear();
    errorHandlingService.showUserFriendlyError.mockClear();
    errorHandlingService.handleApiError.mockClear();
    
    // Reset download counts
    Object.values(ResourceService.RESOURCES).forEach(resource => {
      resource.downloadCount = 0;
    });

    // Mock DOM methods for download
    document.createElement = jest.fn(() => ({
      href: '',
      download: '',
      target: '',
      rel: '',
      click: jest.fn()
    }));
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
  });

  describe('Successful Resource Discovery and Download', () => {
    test('completes full resource discovery and download flow', async () => {
      const user = userEvent.setup();
      
      render(<MockResourcesSection />);

      // Verify all resources are displayed initially
      const resourcesList = screen.getByTestId('resources-list');
      expect(resourcesList).toBeInTheDocument();

      // Verify specific resources exist
      expect(screen.getByTestId('resource-ai-fraud-detection-guide')).toBeInTheDocument();
      expect(screen.getByTestId('resource-gameverse-case-study')).toBeInTheDocument();

      // Test resource search
      await user.type(screen.getByTestId('search-input'), 'fraud detection');

      await waitFor(() => {
        expect(screen.getByTestId('resource-ai-fraud-detection-guide')).toBeInTheDocument();
        expect(screen.queryByTestId('resource-gameverse-case-study')).not.toBeInTheDocument();
      });

      // Clear search and test category filtering
      await user.clear(screen.getByTestId('search-input'));
      await user.selectOptions(screen.getByTestId('category-filter'), 'white-paper');

      await waitFor(() => {
        expect(screen.getByTestId('resource-ai-fraud-detection-guide')).toBeInTheDocument();
        expect(screen.queryByTestId('resource-gameverse-case-study')).not.toBeInTheDocument();
      });

      // Download a resource
      const mockLink = {
        href: '',
        download: '',
        target: '',
        rel: '',
        click: jest.fn()
      };
      document.createElement.mockReturnValueOnce(mockLink);

      await user.click(screen.getByTestId('download-ai-fraud-detection-guide'));

      await waitFor(() => {
        expect(mockLink.href).toBe('/resources/white-papers/The Complete Guide to AI-Powered Fraud Detection.pdf');
        expect(mockLink.download).toBe('The Complete Guide to AI-Powered Fraud Detection.pdf');
        expect(mockLink.target).toBe('_blank');
        expect(mockLink.rel).toBe('noopener noreferrer');
        expect(mockLink.click).toHaveBeenCalled();
      });

      // Verify analytics tracking
      expect(analyticsService.trackResourceDownload).toHaveBeenCalledWith(
        'ai-fraud-detection-guide',
        'The Complete Guide to AI-Powered Fraud Detection',
        'white-paper',
        'resources-section'
      );

      // Verify download count updated
      expect(ResourceService.getDownloadCount('ai-fraud-detection-guide')).toBe(1);
    });

    test('handles resource metadata display correctly', async () => {
      render(<MockResourcesSection />);

      // Check resource metadata display
      expect(screen.getByTestId('category-ai-fraud-detection-guide')).toHaveTextContent('white-paper');
      expect(screen.getByTestId('size-ai-fraud-detection-guide')).toHaveTextContent('374 KB');
      expect(screen.getByTestId('downloads-ai-fraud-detection-guide')).toHaveTextContent('0 downloads');

      // Simulate download to update count
      await ResourceService.trackResourceDownload('ai-fraud-detection-guide', 'test', null);

      // Re-render to see updated count
      render(<MockResourcesSection />);
      expect(screen.getByTestId('downloads-ai-fraud-detection-guide')).toHaveTextContent('1 downloads');
    });
  });

  describe('Resource Search and Filtering Integration', () => {
    test('handles complex search and filter combinations', async () => {
      const user = userEvent.setup();
      
      render(<MockResourcesSection />);

      // Test search functionality
      await user.type(screen.getByTestId('search-input'), 'marketplace');

      await waitFor(() => {
        expect(screen.getByTestId('resource-gameverse-case-study')).toBeInTheDocument();
        expect(screen.getByTestId('resource-marketplace-playbook')).toBeInTheDocument();
        expect(screen.queryByTestId('resource-ai-fraud-detection-guide')).not.toBeInTheDocument();
      });

      // Clear search and test category filtering
      await user.clear(screen.getByTestId('search-input'));
      await user.selectOptions(screen.getByTestId('category-filter'), 'case-study');

      await waitFor(() => {
        expect(screen.getByTestId('resource-gameverse-case-study')).toBeInTheDocument();
        expect(screen.queryByTestId('resource-marketplace-playbook')).not.toBeInTheDocument();
      });

      // Test "all" category
      await user.selectOptions(screen.getByTestId('category-filter'), 'all');

      await waitFor(() => {
        expect(screen.getByTestId('resource-gameverse-case-study')).toBeInTheDocument();
        expect(screen.getByTestId('resource-marketplace-playbook')).toBeInTheDocument();
        expect(screen.getByTestId('resource-ai-fraud-detection-guide')).toBeInTheDocument();
      });
    });

    test('handles empty search results gracefully', async () => {
      const user = userEvent.setup();
      
      render(<MockResourcesSection />);

      await user.type(screen.getByTestId('search-input'), 'nonexistent resource');

      await waitFor(() => {
        const resourcesList = screen.getByTestId('resources-list');
        expect(resourcesList).toBeEmptyDOMElement();
      });
    });
  });

  describe('Download Error Handling Integration', () => {
    test('handles download errors with fallback options', async () => {
      const user = userEvent.setup();
      
      // Mock download error
      document.createElement.mockImplementationOnce(() => {
        throw new Error('Download failed');
      });

      errorHandlingService.handleApiError.mockResolvedValueOnce({
        success: false,
        message: 'Download failed',
        alternativeCallback: jest.fn(),
        alternativeText: 'Visit Resources section'
      });

      render(<MockResourcesSection />);

      await user.click(screen.getByTestId('download-ai-fraud-detection-guide'));

      await waitFor(() => {
        expect(errorHandlingService.handleApiError).toHaveBeenCalledWith(
          expect.any(Error),
          'resource_download',
          expect.objectContaining({
            resourceId: 'ai-fraud-detection-guide',
            resourceTitle: 'The Complete Guide to AI-Powered Fraud Detection',
            retryCallback: expect.any(Function),
            alternativeCallback: expect.any(Function)
          })
        );
      });
    });

    test('handles non-existent resource download attempts', async () => {
      const user = userEvent.setup();
      
      // Mock a component that tries to download non-existent resource
      const MockInvalidDownload = () => (
        <button
          data-testid="invalid-download"
          onClick={() => ResourceService.downloadResource('non-existent')}
        >
          Download Invalid
        </button>
      );

      render(<MockInvalidDownload />);

      await user.click(screen.getByTestId('invalid-download'));

      await waitFor(() => {
        expect(errorHandlingService.showUserFriendlyError).toHaveBeenCalledWith(
          'The requested resource was not found.',
          'error'
        );
      });
    });
  });

  describe('Resource Link Props Integration', () => {
    test('generates correct download link properties', () => {
      const props = ResourceService.getDownloadLinkProps('ai-fraud-detection-guide', {
        trackingSource: 'test-component'
      });

      expect(props).toMatchObject({
        href: '/resources/white-papers/The Complete Guide to AI-Powered Fraud Detection.pdf',
        download: 'The Complete Guide to AI-Powered Fraud Detection.pdf',
        target: '_blank',
        rel: 'noopener noreferrer',
        onClick: expect.any(Function)
      });

      // Test click handler
      const mockEvent = { preventDefault: jest.fn() };
      const mockLink = {
        href: '',
        download: '',
        target: '',
        rel: '',
        click: jest.fn()
      };
      document.createElement.mockReturnValueOnce(mockLink);

      props.onClick(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(analyticsService.trackResourceDownload).toHaveBeenCalledWith(
        'ai-fraud-detection-guide',
        'The Complete Guide to AI-Powered Fraud Detection',
        'white-paper',
        'test-component'
      );
    });

    test('handles invalid resource link props safely', () => {
      const props = ResourceService.getDownloadLinkProps('non-existent');

      expect(props).toMatchObject({
        href: '#',
        onClick: expect.any(Function)
      });

      // Test error handling
      const mockEvent = { preventDefault: jest.fn() };
      props.onClick(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Resource not found:', 'non-existent');
    });
  });

  describe('Resource Categories Integration', () => {
    test('correctly categorizes and filters resources', async () => {
      const user = userEvent.setup();
      
      render(<MockResourcesSection />);

      // Test each category
      const categories = ['white-paper', 'case-study', 'guide', 'resume'];

      for (const category of categories) {
        await user.selectOptions(screen.getByTestId('category-filter'), category);

        await waitFor(() => {
          const categoryResources = ResourceService.getResourcesByCategory(category);
          
          // Verify only resources from selected category are shown
          categoryResources.forEach(resource => {
            expect(screen.getByTestId(`resource-${resource.id}`)).toBeInTheDocument();
            expect(screen.getByTestId(`category-${resource.id}`)).toHaveTextContent(category);
          });

          // Verify resources from other categories are not shown
          const otherResources = ResourceService.getAllResources()
            .filter(r => r.category !== category);
          
          otherResources.forEach(resource => {
            expect(screen.queryByTestId(`resource-${resource.id}`)).not.toBeInTheDocument();
          });
        });
      }
    });
  });

  describe('Download Tracking Integration', () => {
    test('tracks multiple downloads and updates counts', async () => {
      const user = userEvent.setup();
      
      render(<MockResourcesSection />);

      const mockLink = {
        href: '',
        download: '',
        target: '',
        rel: '',
        click: jest.fn()
      };

      // Download same resource multiple times
      for (let i = 0; i < 3; i++) {
        document.createElement.mockReturnValueOnce(mockLink);
        await user.click(screen.getByTestId('download-ai-fraud-detection-guide'));
      }

      await waitFor(() => {
        expect(analyticsService.trackResourceDownload).toHaveBeenCalledTimes(3);
        expect(ResourceService.getDownloadCount('ai-fraud-detection-guide')).toBe(3);
      });

      // Download different resource
      document.createElement.mockReturnValueOnce(mockLink);
      await user.click(screen.getByTestId('download-gameverse-case-study'));

      await waitFor(() => {
        expect(analyticsService.trackResourceDownload).toHaveBeenCalledTimes(4);
        expect(ResourceService.getDownloadCount('gameverse-case-study')).toBe(1);
        expect(ResourceService.getDownloadCount('ai-fraud-detection-guide')).toBe(3);
      });
    });

    test('handles tracking errors gracefully during downloads', async () => {
      const user = userEvent.setup();
      
      analyticsService.trackResourceDownload.mockRejectedValueOnce(
        new Error('Tracking failed')
      );

      const mockLink = {
        href: '',
        download: '',
        target: '',
        rel: '',
        click: jest.fn()
      };
      document.createElement.mockReturnValueOnce(mockLink);

      render(<MockResourcesSection />);

      await user.click(screen.getByTestId('download-ai-fraud-detection-guide'));

      await waitFor(() => {
        // Download should still work despite tracking error
        expect(mockLink.click).toHaveBeenCalled();
        expect(console.warn).toHaveBeenCalledWith(
          'Error tracking resource download:',
          expect.any(Error)
        );
      });
    });
  });
});