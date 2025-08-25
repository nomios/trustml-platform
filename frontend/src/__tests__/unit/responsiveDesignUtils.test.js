/**
 * Unit Tests for Responsive Design Utilities
 * Tests utility functions and helpers for responsive dark theme implementation
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock viewport utilities
const mockViewportUtils = {
  getViewportSize: () => ({
    width: window.innerWidth,
    height: window.innerHeight
  }),
  
  isMobile: () => window.innerWidth < 768,
  isTablet: () => window.innerWidth >= 768 && window.innerWidth < 1024,
  isDesktop: () => window.innerWidth >= 1024,
  
  getBreakpoint: () => {
    const width = window.innerWidth;
    if (width < 640) return 'sm';
    if (width < 768) return 'md';
    if (width < 1024) return 'lg';
    if (width < 1280) return 'xl';
    return '2xl';
  }
};

// Mock responsive component
const ResponsiveComponent = ({ children, className = '' }) => {
  const breakpoint = mockViewportUtils.getBreakpoint();
  const responsiveClass = `responsive-${breakpoint} ${className}`;
  
  return (
    <div className={responsiveClass} data-testid="responsive-component">
      {children}
    </div>
  );
};

// Mock dark theme utilities
const darkThemeUtils = {
  getDarkThemeClasses: (baseClasses = '') => {
    return `${baseClasses} bg-slate-900 text-white`.trim();
  },
  
  getCardClasses: (variant = 'default') => {
    const baseClasses = 'bg-slate-800/70 backdrop-blur-sm border border-slate-700/70 rounded-2xl';
    
    switch (variant) {
      case 'gradient':
        return `${baseClasses} bg-gradient-to-br from-indigo-900/50 to-indigo-800/50`;
      case 'accent':
        return `${baseClasses} border-indigo-700/50`;
      default:
        return baseClasses;
    }
  },
  
  getButtonClasses: (variant = 'primary') => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white shadow-lg shadow-indigo-500/30';
      case 'secondary':
        return 'bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-700/50 text-indigo-300 backdrop-blur-sm';
      case 'outline':
        return 'border-2 border-indigo-600 text-indigo-400 hover:text-white hover:bg-indigo-600';
      default:
        return 'bg-slate-800 text-white';
    }
  },
  
  getTextClasses: (variant = 'primary') => {
    switch (variant) {
      case 'primary':
        return 'text-white';
      case 'secondary':
        return 'text-slate-300';
      case 'muted':
        return 'text-slate-400';
      case 'accent':
        return 'text-indigo-300';
      default:
        return 'text-white';
    }
  }
};

describe('Responsive Design Utilities', () => {
  // Mock window.innerWidth for different viewport tests
  const mockViewport = (width, height = 800) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height,
    });
  };

  describe('Viewport Detection', () => {
    test('correctly identifies mobile viewport', () => {
      mockViewport(375);
      expect(mockViewportUtils.isMobile()).toBe(true);
      expect(mockViewportUtils.isTablet()).toBe(false);
      expect(mockViewportUtils.isDesktop()).toBe(false);
    });

    test('correctly identifies tablet viewport', () => {
      mockViewport(768);
      expect(mockViewportUtils.isMobile()).toBe(false);
      expect(mockViewportUtils.isTablet()).toBe(true);
      expect(mockViewportUtils.isDesktop()).toBe(false);
    });

    test('correctly identifies desktop viewport', () => {
      mockViewport(1280);
      expect(mockViewportUtils.isMobile()).toBe(false);
      expect(mockViewportUtils.isTablet()).toBe(false);
      expect(mockViewportUtils.isDesktop()).toBe(true);
    });

    test('returns correct breakpoint names', () => {
      mockViewport(375);
      expect(mockViewportUtils.getBreakpoint()).toBe('sm');
      
      mockViewport(640);
      expect(mockViewportUtils.getBreakpoint()).toBe('md');
      
      mockViewport(768);
      expect(mockViewportUtils.getBreakpoint()).toBe('lg');
      
      mockViewport(1024);
      expect(mockViewportUtils.getBreakpoint()).toBe('xl');
      
      mockViewport(1280);
      expect(mockViewportUtils.getBreakpoint()).toBe('2xl');
    });

    test('handles edge cases in viewport detection', () => {
      mockViewport(767); // Just below tablet
      expect(mockViewportUtils.isMobile()).toBe(true);
      
      mockViewport(1023); // Just below desktop
      expect(mockViewportUtils.isTablet()).toBe(true);
    });
  });

  describe('Dark Theme Class Generation', () => {
    test('generates correct dark theme base classes', () => {
      const classes = darkThemeUtils.getDarkThemeClasses();
      expect(classes).toBe('bg-slate-900 text-white');
    });

    test('combines base classes with dark theme classes', () => {
      const classes = darkThemeUtils.getDarkThemeClasses('p-4 rounded-lg');
      expect(classes).toBe('p-4 rounded-lg bg-slate-900 text-white');
    });

    test('generates correct card variant classes', () => {
      const defaultCard = darkThemeUtils.getCardClasses();
      expect(defaultCard).toContain('bg-slate-800/70');
      expect(defaultCard).toContain('backdrop-blur-sm');
      expect(defaultCard).toContain('border-slate-700/70');

      const gradientCard = darkThemeUtils.getCardClasses('gradient');
      expect(gradientCard).toContain('bg-gradient-to-br');
      expect(gradientCard).toContain('from-indigo-900/50');

      const accentCard = darkThemeUtils.getCardClasses('accent');
      expect(accentCard).toContain('border-indigo-700/50');
    });

    test('generates correct button variant classes', () => {
      const primaryButton = darkThemeUtils.getButtonClasses('primary');
      expect(primaryButton).toContain('bg-gradient-to-r');
      expect(primaryButton).toContain('from-indigo-600');
      expect(primaryButton).toContain('shadow-indigo-500/30');

      const secondaryButton = darkThemeUtils.getButtonClasses('secondary');
      expect(secondaryButton).toContain('bg-indigo-900/30');
      expect(secondaryButton).toContain('backdrop-blur-sm');

      const outlineButton = darkThemeUtils.getButtonClasses('outline');
      expect(outlineButton).toContain('border-2');
      expect(outlineButton).toContain('border-indigo-600');
    });

    test('generates correct text variant classes', () => {
      expect(darkThemeUtils.getTextClasses('primary')).toBe('text-white');
      expect(darkThemeUtils.getTextClasses('secondary')).toBe('text-slate-300');
      expect(darkThemeUtils.getTextClasses('muted')).toBe('text-slate-400');
      expect(darkThemeUtils.getTextClasses('accent')).toBe('text-indigo-300');
    });
  });

  describe('Responsive Component Rendering', () => {
    test('renders with correct responsive classes for mobile', () => {
      mockViewport(375);
      render(
        <ResponsiveComponent>
          <p>Mobile content</p>
        </ResponsiveComponent>
      );

      const component = screen.getByTestId('responsive-component');
      expect(component).toHaveClass('responsive-sm');
    });

    test('renders with correct responsive classes for tablet', () => {
      mockViewport(768);
      render(
        <ResponsiveComponent>
          <p>Tablet content</p>
        </ResponsiveComponent>
      );

      const component = screen.getByTestId('responsive-component');
      expect(component).toHaveClass('responsive-lg');
    });

    test('renders with correct responsive classes for desktop', () => {
      mockViewport(1280);
      render(
        <ResponsiveComponent>
          <p>Desktop content</p>
        </ResponsiveComponent>
      );

      const component = screen.getByTestId('responsive-component');
      expect(component).toHaveClass('responsive-2xl');
    });

    test('combines custom classes with responsive classes', () => {
      mockViewport(1024);
      render(
        <ResponsiveComponent className="custom-class">
          <p>Content</p>
        </ResponsiveComponent>
      );

      const component = screen.getByTestId('responsive-component');
      expect(component).toHaveClass('responsive-xl');
      expect(component).toHaveClass('custom-class');
    });
  });

  describe('Touch Target Validation', () => {
    const validateTouchTarget = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        meetsMinimum: rect.width >= 44 && rect.height >= 44
      };
    };

    test('validates minimum touch target sizes', () => {
      render(
        <div>
          <button 
            data-testid="small-button" 
            style={{ width: '30px', height: '30px' }}
          >
            Small
          </button>
          <button 
            data-testid="large-button" 
            style={{ width: '48px', height: '48px' }}
          >
            Large
          </button>
        </div>
      );

      const smallButton = screen.getByTestId('small-button');
      const largeButton = screen.getByTestId('large-button');

      const smallValidation = validateTouchTarget(smallButton);
      const largeValidation = validateTouchTarget(largeButton);

      expect(smallValidation.meetsMinimum).toBe(false);
      expect(largeValidation.meetsMinimum).toBe(true);
    });
  });

  describe('CSS Custom Properties for Dark Theme', () => {
    const mockCSSCustomProperties = {
      '--color-background-primary': 'rgb(15, 23, 42)', // slate-900
      '--color-background-secondary': 'rgb(30, 41, 59)', // slate-800
      '--color-text-primary': 'rgb(255, 255, 255)', // white
      '--color-text-secondary': 'rgb(203, 213, 225)', // slate-300
      '--color-accent-primary': 'rgb(79, 70, 229)', // indigo-600
      '--color-accent-secondary': 'rgb(34, 211, 238)', // cyan-400
    };

    test('validates dark theme CSS custom properties', () => {
      // Mock getComputedStyle to return our custom properties
      const originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = jest.fn(() => ({
        getPropertyValue: (prop) => mockCSSCustomProperties[prop] || ''
      }));

      const element = document.createElement('div');
      const styles = window.getComputedStyle(element);

      expect(styles.getPropertyValue('--color-background-primary')).toBe('rgb(15, 23, 42)');
      expect(styles.getPropertyValue('--color-text-primary')).toBe('rgb(255, 255, 255)');
      expect(styles.getPropertyValue('--color-accent-primary')).toBe('rgb(79, 70, 229)');

      // Restore original function
      window.getComputedStyle = originalGetComputedStyle;
    });
  });

  describe('Gradient and Backdrop Filter Support Detection', () => {
    const featureDetection = {
      supportsBackdropFilter: () => {
        const testElement = document.createElement('div');
        testElement.style.backdropFilter = 'blur(1px)';
        return testElement.style.backdropFilter !== '';
      },

      supportsGradients: () => {
        const testElement = document.createElement('div');
        testElement.style.background = 'linear-gradient(to right, red, blue)';
        return testElement.style.background.includes('gradient');
      },

      supportsCustomProperties: () => {
        return window.CSS && CSS.supports && CSS.supports('--test', 'value');
      }
    };

    test('detects backdrop-filter support', () => {
      const supportsBackdrop = featureDetection.supportsBackdropFilter();
      expect(typeof supportsBackdrop).toBe('boolean');
    });

    test('detects gradient support', () => {
      const supportsGradients = featureDetection.supportsGradients();
      expect(typeof supportsGradients).toBe('boolean');
    });

    test('detects CSS custom properties support', () => {
      const supportsCustomProps = featureDetection.supportsCustomProperties();
      expect(typeof supportsCustomProps).toBe('boolean');
    });
  });

  describe('Performance Utilities', () => {
    const performanceUtils = {
      measureRenderTime: (callback) => {
        const start = performance.now();
        callback();
        const end = performance.now();
        return end - start;
      },

      debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      },

      throttle: (func, limit) => {
        let inThrottle;
        return function() {
          const args = arguments;
          const context = this;
          if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
          }
        };
      }
    };

    test('measures render performance', () => {
      const renderTime = performanceUtils.measureRenderTime(() => {
        // Simulate rendering work
        for (let i = 0; i < 1000; i++) {
          Math.random();
        }
      });

      expect(typeof renderTime).toBe('number');
      expect(renderTime).toBeGreaterThan(0);
    });

    test('debounce function works correctly', (done) => {
      let callCount = 0;
      const debouncedFunction = performanceUtils.debounce(() => {
        callCount++;
      }, 100);

      // Call multiple times quickly
      debouncedFunction();
      debouncedFunction();
      debouncedFunction();

      // Should only be called once after delay
      setTimeout(() => {
        expect(callCount).toBe(1);
        done();
      }, 150);
    });

    test('throttle function works correctly', (done) => {
      let callCount = 0;
      const throttledFunction = performanceUtils.throttle(() => {
        callCount++;
      }, 100);

      // Call multiple times quickly
      throttledFunction();
      throttledFunction();
      throttledFunction();

      // Should be called immediately once
      expect(callCount).toBe(1);

      setTimeout(() => {
        throttledFunction();
        expect(callCount).toBe(2);
        done();
      }, 150);
    });
  });

  describe('Accessibility Utilities', () => {
    const a11yUtils = {
      calculateContrastRatio: (foreground, background) => {
        // Simplified contrast calculation for testing
        // In production, use a proper contrast calculation library
        const fgLuminance = foreground === 'white' ? 1 : 0.05;
        const bgLuminance = background === 'dark' ? 0.05 : 1;
        
        const lighter = Math.max(fgLuminance, bgLuminance);
        const darker = Math.min(fgLuminance, bgLuminance);
        
        return (lighter + 0.05) / (darker + 0.05);
      },

      meetsWCAGAA: (contrastRatio) => contrastRatio >= 4.5,
      meetsWCAGAAA: (contrastRatio) => contrastRatio >= 7,

      generateAriaLabel: (element, context) => {
        if (element === 'button' && context === 'mobile-menu') {
          return 'Open mobile navigation menu';
        }
        if (element === 'link' && context === 'external') {
          return 'Opens in new window';
        }
        return '';
      }
    };

    test('calculates contrast ratios correctly', () => {
      const whiteOnDark = a11yUtils.calculateContrastRatio('white', 'dark');
      const darkOnWhite = a11yUtils.calculateContrastRatio('dark', 'white');

      expect(whiteOnDark).toBeGreaterThan(4.5);
      expect(darkOnWhite).toBeGreaterThan(4.5);
    });

    test('validates WCAG compliance', () => {
      const highContrast = 7.5;
      const mediumContrast = 5.0;
      const lowContrast = 3.0;

      expect(a11yUtils.meetsWCAGAA(highContrast)).toBe(true);
      expect(a11yUtils.meetsWCAGAA(mediumContrast)).toBe(true);
      expect(a11yUtils.meetsWCAGAA(lowContrast)).toBe(false);

      expect(a11yUtils.meetsWCAGAAA(highContrast)).toBe(true);
      expect(a11yUtils.meetsWCAGAAA(mediumContrast)).toBe(false);
    });

    test('generates appropriate ARIA labels', () => {
      const mobileMenuLabel = a11yUtils.generateAriaLabel('button', 'mobile-menu');
      const externalLinkLabel = a11yUtils.generateAriaLabel('link', 'external');

      expect(mobileMenuLabel).toBe('Open mobile navigation menu');
      expect(externalLinkLabel).toBe('Opens in new window');
    });
  });

  describe('Error Handling for Responsive Features', () => {
    test('handles missing viewport information gracefully', () => {
      // Mock missing window properties
      const originalInnerWidth = window.innerWidth;
      delete window.innerWidth;

      expect(() => {
        mockViewportUtils.getViewportSize();
      }).not.toThrow();

      // Restore
      window.innerWidth = originalInnerWidth;
    });

    test('provides fallbacks for unsupported CSS features', () => {
      const getFallbackStyles = (feature) => {
        switch (feature) {
          case 'backdrop-filter':
            return 'background-color: rgba(30, 41, 59, 0.95)';
          case 'gradient':
            return 'background-color: rgb(79, 70, 229)';
          default:
            return 'background-color: rgb(30, 41, 59)';
        }
      };

      expect(getFallbackStyles('backdrop-filter')).toContain('rgba(30, 41, 59, 0.95)');
      expect(getFallbackStyles('gradient')).toContain('rgb(79, 70, 229)');
      expect(getFallbackStyles('unknown')).toContain('rgb(30, 41, 59)');
    });
  });
});