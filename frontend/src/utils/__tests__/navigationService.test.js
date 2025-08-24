/**
 * Tests for NavigationService
 */

import navigationService from '../navigationService';
import analyticsService from '../analyticsService';

// Mock dependencies
jest.mock('../analyticsService');

describe('NavigationService', () => {
  beforeEach(() => {
    analyticsService.trackNavigation.mockClear();
    
    // Mock DOM methods
    document.getElementById = jest.fn();
    document.querySelector = jest.fn();
    
    // Mock window methods
    window.scrollTo = jest.fn();
    window.history = {
      pushState: jest.fn(),
      replaceState: jest.fn()
    };
    
    // Mock element methods
    const mockElement = {
      scrollIntoView: jest.fn(),
      offsetTop: 100,
      getBoundingClientRect: () => ({ top: 100 })
    };
    
    document.getElementById.mockReturnValue(mockElement);
    document.querySelector.mockReturnValue(mockElement);
  });

  describe('Section Navigation', () => {
    test('scrolls to section by ID', async () => {
      await navigationService.scrollToSection('about', 0, 'menu');

      expect(document.getElementById).toHaveBeenCalledWith('about');
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 100,
        behavior: 'smooth'
      });
      expect(analyticsService.trackNavigation).toHaveBeenCalledWith(
        'about',
        'menu',
        'scroll'
      );
    });

    test('scrolls to section with offset', async () => {
      await navigationService.scrollToSection('services', 80, 'header');

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 20, // 100 - 80 offset
        behavior: 'smooth'
      });
    });

    test('handles missing section gracefully', async () => {
      document.getElementById.mockReturnValueOnce(null);

      await navigationService.scrollToSection('nonexistent', 0, 'menu');

      expect(console.warn).toHaveBeenCalledWith(
        'Section not found:',
        'nonexistent'
      );
      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    test('uses fallback scroll method when scrollTo fails', async () => {
      window.scrollTo.mockImplementationOnce(() => {
        throw new Error('ScrollTo failed');
      });

      const mockElement = {
        scrollIntoView: jest.fn(),
        offsetTop: 100,
        getBoundingClientRect: () => ({ top: 100 })
      };
      document.getElementById.mockReturnValueOnce(mockElement);

      await navigationService.scrollToSection('about', 0, 'menu');

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });

  describe('Navigation Handler Creation', () => {
    test('creates section navigation handler', async () => {
      const handler = navigationService.createSectionNavigationHandler(
        'services',
        80,
        'header'
      );

      const mockEvent = { preventDefault: jest.fn() };
      await handler(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(document.getElementById).toHaveBeenCalledWith('services');
      expect(analyticsService.trackNavigation).toHaveBeenCalledWith(
        'services',
        'header',
        'scroll'
      );
    });

    test('creates page navigation handler', async () => {
      const handler = navigationService.createPageNavigationHandler(
        '/about',
        'footer'
      );

      const mockEvent = { preventDefault: jest.fn() };
      await handler(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(window.history.pushState).toHaveBeenCalledWith(
        null,
        '',
        '/about'
      );
      expect(analyticsService.trackNavigation).toHaveBeenCalledWith(
        '/about',
        'footer',
        'navigate'
      );
    });
  });

  describe('Navigation Props Generation', () => {
    test('generates section navigation props', () => {
      const props = navigationService.getSectionNavigationProps(
        'contact',
        100,
        'menu'
      );

      expect(props).toMatchObject({
        href: '#contact',
        onClick: expect.any(Function)
      });
    });

    test('generates page navigation props', () => {
      const props = navigationService.getPageNavigationProps(
        '/privacy',
        'footer'
      );

      expect(props).toMatchObject({
        href: '/privacy',
        onClick: expect.any(Function)
      });
    });
  });

  describe('Section Detection', () => {
    test('gets current section based on scroll position', () => {
      // Mock multiple sections
      const sections = [
        { id: 'hero', offsetTop: 0, offsetHeight: 500 },
        { id: 'about', offsetTop: 500, offsetHeight: 400 },
        { id: 'services', offsetTop: 900, offsetHeight: 600 }
      ];

      document.querySelectorAll = jest.fn(() => sections);
      Object.defineProperty(window, 'pageYOffset', { value: 600, writable: true });

      const currentSection = navigationService.getCurrentSection();
      expect(currentSection).toBe('about');
    });

    test('returns null when no sections found', () => {
      document.querySelectorAll = jest.fn(() => []);

      const currentSection = navigationService.getCurrentSection();
      expect(currentSection).toBeNull();
    });

    test('gets all available sections', () => {
      const mockSections = [
        { id: 'hero' },
        { id: 'about' },
        { id: 'services' },
        { id: 'contact' }
      ];

      document.querySelectorAll = jest.fn(() => mockSections);

      const sections = navigationService.getAvailableSections();
      expect(sections).toEqual(['hero', 'about', 'services', 'contact']);
    });
  });

  describe('Navigation State Management', () => {
    test('checks if section exists', () => {
      document.getElementById.mockReturnValueOnce({ id: 'about' });
      expect(navigationService.sectionExists('about')).toBe(true);

      document.getElementById.mockReturnValueOnce(null);
      expect(navigationService.sectionExists('nonexistent')).toBe(false);
    });

    test('gets section offset with header compensation', () => {
      const mockElement = {
        offsetTop: 500,
        getBoundingClientRect: () => ({ top: 100 })
      };
      document.getElementById.mockReturnValueOnce(mockElement);

      const offset = navigationService.getSectionOffset('services', 80);
      expect(offset).toBe(420); // 500 - 80
    });

    test('returns 0 for missing section offset', () => {
      document.getElementById.mockReturnValueOnce(null);

      const offset = navigationService.getSectionOffset('nonexistent', 80);
      expect(offset).toBe(0);
    });
  });

  describe('Smooth Scrolling', () => {
    test('performs smooth scroll with custom duration', async () => {
      const startTime = Date.now();
      
      // Mock requestAnimationFrame
      global.requestAnimationFrame = jest.fn((callback) => {
        callback(startTime + 100);
        return 1;
      });

      Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });

      await navigationService.smoothScrollTo(500, 300);

      expect(global.requestAnimationFrame).toHaveBeenCalled();
    });

    test('falls back to instant scroll when smooth scroll unavailable', async () => {
      // Mock browser without smooth scroll support
      window.scrollTo = jest.fn((options) => {
        if (typeof options === 'object' && options.behavior === 'smooth') {
          throw new Error('Smooth scroll not supported');
        }
      });

      await navigationService.smoothScrollTo(500);

      expect(window.scrollTo).toHaveBeenCalledWith(0, 500);
    });
  });

  describe('Navigation Menu Integration', () => {
    test('gets navigation menu items', () => {
      const menuItems = navigationService.getNavigationMenuItems();

      expect(menuItems).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'about',
            label: 'About',
            href: '#about'
          }),
          expect.objectContaining({
            id: 'services',
            label: 'Services',
            href: '#services'
          }),
          expect.objectContaining({
            id: 'expertise',
            label: 'Expertise',
            href: '#expertise'
          }),
          expect.objectContaining({
            id: 'resources',
            label: 'Resources',
            href: '#resources'
          }),
          expect.objectContaining({
            id: 'contact',
            label: 'Contact',
            href: '#contact'
          })
        ])
      );
    });

    test('gets footer navigation items', () => {
      const footerItems = navigationService.getFooterNavigationItems();

      expect(footerItems).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'privacy',
            label: 'Privacy Policy',
            href: '/privacy'
          }),
          expect.objectContaining({
            id: 'terms',
            label: 'Terms of Service',
            href: '/terms'
          })
        ])
      );
    });
  });

  describe('Mobile Navigation', () => {
    test('handles mobile menu navigation', async () => {
      const closeMobileMenu = jest.fn();

      await navigationService.handleMobileNavigation(
        'services',
        80,
        'mobile-menu',
        closeMobileMenu
      );

      expect(closeMobileMenu).toHaveBeenCalled();
      expect(analyticsService.trackNavigation).toHaveBeenCalledWith(
        'services',
        'mobile-menu',
        'scroll'
      );
    });

    test('handles mobile menu navigation errors gracefully', async () => {
      const closeMobileMenu = jest.fn(() => {
        throw new Error('Close menu failed');
      });

      await navigationService.handleMobileNavigation(
        'services',
        80,
        'mobile-menu',
        closeMobileMenu
      );

      // Should still navigate even if menu close fails
      expect(document.getElementById).toHaveBeenCalledWith('services');
      expect(console.warn).toHaveBeenCalledWith(
        'Failed to close mobile menu:',
        expect.any(Error)
      );
    });
  });

  describe('URL Hash Management', () => {
    test('updates URL hash on navigation', async () => {
      await navigationService.scrollToSection('about', 0, 'menu', true);

      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        '#about'
      );
    });

    test('does not update URL hash when disabled', async () => {
      await navigationService.scrollToSection('about', 0, 'menu', false);

      expect(window.history.replaceState).not.toHaveBeenCalled();
    });

    test('handles hash navigation on page load', () => {
      Object.defineProperty(window.location, 'hash', {
        value: '#services',
        writable: true
      });

      navigationService.handleHashNavigation();

      expect(document.getElementById).toHaveBeenCalledWith('services');
    });
  });

  describe('Error Handling', () => {
    test('handles scroll errors gracefully', async () => {
      window.scrollTo.mockImplementationOnce(() => {
        throw new Error('Scroll failed');
      });

      const mockElement = {
        scrollIntoView: jest.fn(() => {
          throw new Error('ScrollIntoView also failed');
        }),
        offsetTop: 100,
        getBoundingClientRect: () => ({ top: 100 })
      };
      document.getElementById.mockReturnValueOnce(mockElement);

      await navigationService.scrollToSection('about', 0, 'menu');

      expect(console.error).toHaveBeenCalledWith(
        'Failed to scroll to section:',
        expect.any(Error)
      );
    });

    test('handles tracking errors gracefully', async () => {
      analyticsService.trackNavigation.mockRejectedValueOnce(
        new Error('Tracking failed')
      );

      await navigationService.scrollToSection('about', 0, 'menu');

      // Should still perform navigation
      expect(document.getElementById).toHaveBeenCalledWith('about');
    });
  });
});