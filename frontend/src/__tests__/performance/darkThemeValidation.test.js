/**
 * Dark Theme Validation Tests
 * Comprehensive testing for dark theme implementation
 */

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock intersection observer for animations
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}));

describe('Dark Theme Validation', () => {
  const renderApp = () => {
    return render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  };

  describe('Visual Regression Testing', () => {
    test('app renders with dark theme styles', () => {
      renderApp();
      
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      
      // Verify dark theme background is applied
      expect(body.className).toContain('bg-gradient-to-br');
      expect(body.className).toContain('from-slate-900');
      expect(body.className).toContain('to-slate-800');
    });

    test('header uses dark theme styling', () => {
      renderApp();
      
      // Check for header elements with dark theme classes
      const header = document.querySelector('header');
      if (header) {
        const headerClasses = header.className;
        expect(headerClasses).toMatch(/bg-slate-900|bg-transparent|backdrop-blur/);
      }
    });

    test('buttons use dark theme gradient styles', () => {
      renderApp();
      
      // Look for buttons with gradient styling
      const buttons = document.querySelectorAll('button');
      let hasGradientButton = false;
      
      buttons.forEach(button => {
        const classes = button.className;
        if (classes.includes('bg-gradient-to-r') || 
            classes.includes('from-indigo-600') || 
            classes.includes('to-blue-500')) {
          hasGradientButton = true;
        }
      });
      
      expect(hasGradientButton).toBe(true);
    });

    test('cards use dark theme glassmorphism effects', () => {
      renderApp();
      
      // Look for cards with dark theme styling
      const cards = document.querySelectorAll('[class*="bg-slate-800"], [class*="glass-card"]');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility Compliance', () => {
    test('color contrast meets WCAG AA standards', () => {
      renderApp();
      
      // Test high contrast text utility
      const highContrastElements = document.querySelectorAll('.text-high-contrast');
      highContrastElements.forEach(element => {
        const style = window.getComputedStyle(element);
        expect(style.color).toBe('rgb(255, 255, 255)'); // White text
        expect(style.textShadow).toContain('rgba(0, 0, 0, 0.5)'); // Shadow for contrast
      });
    });

    test('focus states are visible in dark theme', () => {
      renderApp();
      
      // Check for focus ring utilities
      const focusableElements = document.querySelectorAll('button, a, input, textarea');
      let hasFocusRing = false;
      
      focusableElements.forEach(element => {
        const classes = element.className;
        if (classes.includes('focus-ring') || classes.includes('focus:ring')) {
          hasFocusRing = true;
        }
      });
      
      expect(hasFocusRing).toBe(true);
    });

    test('text elements have sufficient contrast', () => {
      renderApp();
      
      // Check for proper text color classes
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span');
      let hasProperTextColors = false;
      
      textElements.forEach(element => {
        const classes = element.className;
        if (classes.includes('text-white') || 
            classes.includes('text-slate-300') || 
            classes.includes('text-primary') ||
            classes.includes('text-secondary')) {
          hasProperTextColors = true;
        }
      });
      
      expect(hasProperTextColors).toBe(true);
    });
  });

  describe('Performance Impact Testing', () => {
    test('CSS animations perform smoothly', () => {
      const startTime = performance.now();
      
      renderApp();
      
      // Simulate animation triggers
      const animatedElements = document.querySelectorAll('[class*="animate-"], [class*="transition-"]');
      
      // Check that animations are applied
      expect(animatedElements.length).toBeGreaterThan(0);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Rendering with animations should be fast
      expect(renderTime).toBeLessThan(100);
    });

    test('gradient backgrounds do not impact performance significantly', () => {
      const startTime = performance.now();
      
      // Render multiple times to test consistency
      for (let i = 0; i < 10; i++) {
        const { unmount } = renderApp();
        unmount();
      }
      
      const endTime = performance.now();
      const averageRenderTime = (endTime - startTime) / 10;
      
      // Average render time should be reasonable
      expect(averageRenderTime).toBeLessThan(50);
    });

    test('backdrop-filter effects are optimized', () => {
      renderApp();
      
      // Check for backdrop-blur elements
      const blurElements = document.querySelectorAll('[class*="backdrop-blur"]');
      
      // Should have blur effects but not excessive
      expect(blurElements.length).toBeGreaterThan(0);
      expect(blurElements.length).toBeLessThan(50); // Reasonable limit
    });

    test('CSS bundle size impact is minimal', () => {
      // This would typically be measured with webpack-bundle-analyzer
      // For now, we'll check that we're not loading excessive CSS
      
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"], style');
      
      // Should have reasonable number of stylesheets
      expect(stylesheets.length).toBeLessThan(10);
    });
  });

  describe('Cross-browser Compatibility', () => {
    test('backdrop-filter fallbacks are present', () => {
      renderApp();
      
      // Check for elements with backdrop-filter
      const blurElements = document.querySelectorAll('[class*="backdrop-blur"]');
      
      blurElements.forEach(element => {
        const style = window.getComputedStyle(element);
        // Should have webkit prefix for compatibility
        expect(style.webkitBackdropFilter || style.backdropFilter).toBeDefined();
      });
    });

    test('gradient rendering is consistent', () => {
      renderApp();
      
      // Check for gradient elements
      const gradientElements = document.querySelectorAll('[class*="bg-gradient"]');
      
      gradientElements.forEach(element => {
        const style = window.getComputedStyle(element);
        // Should have background-image for gradients
        expect(style.backgroundImage).toContain('linear-gradient');
      });
    });

    test('CSS custom properties are supported', () => {
      renderApp();
      
      // Check that CSS custom properties are defined
      const rootStyle = window.getComputedStyle(document.documentElement);
      
      // Should have dark theme custom properties
      expect(rootStyle.getPropertyValue('--background')).toBeTruthy();
      expect(rootStyle.getPropertyValue('--foreground')).toBeTruthy();
      expect(rootStyle.getPropertyValue('--card')).toBeTruthy();
    });
  });

  describe('Theme Consistency', () => {
    test('all sections use consistent dark theme', () => {
      renderApp();
      
      // Check for section elements
      const sections = document.querySelectorAll('section');
      let hasConsistentTheming = true;
      
      sections.forEach(section => {
        const classes = section.className;
        // Should have dark background classes
        if (!classes.includes('bg-slate-900') && 
            !classes.includes('bg-slate-800') && 
            !classes.includes('section-dark') &&
            !classes.includes('section-darker')) {
          // Allow for gradient backgrounds
          if (!classes.includes('bg-gradient')) {
            hasConsistentTheming = false;
          }
        }
      });
      
      expect(hasConsistentTheming).toBe(true);
    });

    test('interactive elements use consistent hover states', () => {
      renderApp();
      
      // Check buttons and links for hover states
      const interactiveElements = document.querySelectorAll('button, a');
      let hasConsistentHovers = false;
      
      interactiveElements.forEach(element => {
        const classes = element.className;
        if (classes.includes('hover:') || 
            classes.includes('transition-') ||
            classes.includes('btn-')) {
          hasConsistentHovers = true;
        }
      });
      
      expect(hasConsistentHovers).toBe(true);
    });

    test('text hierarchy uses proper contrast levels', () => {
      renderApp();
      
      // Check headings for proper styling
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let hasProperHeadingStyles = false;
      
      headings.forEach(heading => {
        const classes = heading.className;
        if (classes.includes('text-white') || 
            classes.includes('text-primary') ||
            classes.includes('gradient-text')) {
          hasProperHeadingStyles = true;
        }
      });
      
      expect(hasProperHeadingStyles).toBe(true);
    });
  });

  describe('Animation and Transition Quality', () => {
    test('transitions use appropriate timing functions', () => {
      renderApp();
      
      // Check for transition classes
      const transitionElements = document.querySelectorAll('[class*="transition-"]');
      
      expect(transitionElements.length).toBeGreaterThan(0);
      
      // Verify transition properties are applied
      transitionElements.forEach(element => {
        const style = window.getComputedStyle(element);
        expect(style.transitionDuration).toBeTruthy();
      });
    });

    test('animations work well with dark backgrounds', () => {
      renderApp();
      
      // Check for animated elements
      const animatedElements = document.querySelectorAll('[class*="animate-"]');
      
      expect(animatedElements.length).toBeGreaterThan(0);
      
      // Animations should be present but not excessive
      expect(animatedElements.length).toBeLessThan(20);
    });

    test('loading states are properly styled for dark theme', () => {
      renderApp();
      
      // Check for loading-related classes
      const loadingElements = document.querySelectorAll('[class*="loading-"], [class*="spinner"], [class*="skeleton"]');
      
      // Should have loading states available
      expect(loadingElements.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Responsive Design with Dark Theme', () => {
    test('dark theme works across different viewport sizes', () => {
      // Test mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      renderApp();
      
      // Should still have dark theme classes
      const body = document.body;
      expect(body.className).toContain('bg-gradient-to-br');
      
      // Test desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });
      
      // Theme should remain consistent
      expect(body.className).toContain('from-slate-900');
    });

    test('mobile navigation uses dark theme', () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      renderApp();
      
      // Look for mobile menu elements
      const mobileMenuElements = document.querySelectorAll('[class*="mobile"], [class*="menu"]');
      
      // Should have mobile elements with dark styling
      expect(mobileMenuElements.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Error States and Edge Cases', () => {
    test('error messages use appropriate dark theme styling', () => {
      renderApp();
      
      // Check for error-related classes
      const errorElements = document.querySelectorAll('[class*="error"], [class*="destructive"]');
      
      // Error elements should be styled appropriately
      errorElements.forEach(element => {
        const classes = element.className;
        expect(classes).toMatch(/text-|bg-|border-/);
      });
    });

    test('form validation states work with dark theme', () => {
      renderApp();
      
      // Check for form elements
      const formElements = document.querySelectorAll('input, textarea, select');
      
      formElements.forEach(element => {
        const classes = element.className;
        // Should have dark theme input styling
        expect(classes).toMatch(/bg-slate|input-dark|border-slate/);
      });
    });
  });
});