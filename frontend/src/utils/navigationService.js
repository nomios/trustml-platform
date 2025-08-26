/**
 * Navigation Service
 * Handles smooth scrolling navigation and section management
 */

import analyticsService from './analyticsService.js';

class NavigationService {
  constructor() {
    this.sections = [
      'hero',
      'services', 
      'expertise',
      'case-studies',
      'about',
      'resources',
      'contact'
    ];
    
    // Offset for fixed header (computed at runtime for responsiveness)
    this.headerOffset = 80;
    this.updateHeaderOffset = this.updateHeaderOffset.bind(this);
  }

  /**
   * Compute header height as offset to avoid content overlap
   */
  updateHeaderOffset() {
    const header = document.querySelector('header');
    if (header) {
      this.headerOffset = Math.ceil(header.getBoundingClientRect().height);
    }
  }

  /**
   * Smooth scroll to a section by ID
   * @param {string} sectionId - The ID of the section to scroll to
   * @param {number} offset - Additional offset (optional)
   * @param {string} source - Source of navigation (menu, button, etc.)
   */
  scrollToSection(sectionId, offset = 0, source = 'direct') {
    const element = document.getElementById(sectionId);
    if (!element) {
      console.warn(`Section with ID "${sectionId}" not found`);
      // Track navigation error
      analyticsService.trackError('navigation_error', `Section "${sectionId}" not found`, 'navigation');
      return false;
    }

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - this.headerOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Update URL hash without triggering scroll
    if (sectionId !== 'hero') {
      history.replaceState(null, null, `#${sectionId}`);
    } else {
      history.replaceState(null, null, window.location.pathname);
    }

    // Track navigation
    analyticsService.trackNavigation(sectionId, source, 'scroll');

    return true;
  }

  /**
   * Scroll to top of page
   * @param {string} source - Source of navigation
   */
  scrollToTop(source = 'direct') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    history.replaceState(null, null, window.location.pathname);
    
    // Track navigation to top
    analyticsService.trackNavigation('hero', source, 'scroll');
  }

  /**
   * Get current active section based on scroll position
   */
  getCurrentSection() {
    const scrollPosition = window.scrollY + this.headerOffset + 100;
    
    for (let i = this.sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(this.sections[i]);
      if (section && section.offsetTop <= scrollPosition) {
        return this.sections[i];
      }
    }
    
    return 'hero';
  }

  /**
   * Initialize navigation on page load
   */
  initialize() {
    // Compute header offset on load and resize for accurate scrolling
    this.updateHeaderOffset();
    window.addEventListener('resize', this.updateHeaderOffset);

    // Handle initial hash in URL
    if (window.location.hash) {
      const sectionId = window.location.hash.substring(1);
      // Delay to ensure page is fully loaded
      setTimeout(() => {
        this.updateHeaderOffset();
        this.scrollToSection(sectionId);
      }, 100);
    }

    // Handle browser back/forward navigation
    window.addEventListener('popstate', (event) => {
      if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        this.updateHeaderOffset();
        this.scrollToSection(sectionId);
      } else {
        this.scrollToTop();
      }
    });
  }

  /**
   * Check if a section exists
   * @param {string} sectionId - The ID to check
   */
  sectionExists(sectionId) {
    return document.getElementById(sectionId) !== null;
  }

  /**
   * Get all available sections
   */
  getAvailableSections() {
    return this.sections.filter(sectionId => this.sectionExists(sectionId));
  }
}

// Create singleton instance
const navigationService = new NavigationService();

export default navigationService;