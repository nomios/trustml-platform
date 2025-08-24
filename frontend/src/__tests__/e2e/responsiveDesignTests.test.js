/**
 * Responsive Design Tests for Dark Theme
 * Tests dark theme implementation across different viewport sizes and devices
 */

import { test, expect } from '@playwright/test';

// Define viewport configurations for testing
const viewports = {
  mobile: { width: 375, height: 667 },
  mobileLandscape: { width: 667, height: 375 },
  tablet: { width: 768, height: 1024 },
  tabletLandscape: { width: 1024, height: 768 },
  desktop: { width: 1280, height: 720 },
  desktopLarge: { width: 1920, height: 1080 }
};

// Dark theme color expectations
const darkThemeColors = {
  background: {
    primary: 'rgb(15, 23, 42)', // slate-900
    secondary: 'rgb(30, 41, 59)', // slate-800
    card: 'rgba(30, 41, 59, 0.7)' // slate-800/70
  },
  text: {
    primary: 'rgb(255, 255, 255)', // white
    secondary: 'rgb(203, 213, 225)', // slate-300
    muted: 'rgb(148, 163, 184)' // slate-400
  },
  accent: {
    indigo: 'rgb(79, 70, 229)', // indigo-600
    cyan: 'rgb(34, 211, 238)' // cyan-400
  }
};

test.describe('Dark Theme Responsive Design Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Mobile Viewport Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
    });

    test('Header displays correctly on mobile with dark theme', async ({ page }) => {
      const header = page.locator('header');
      
      // Test header background and transparency
      await expect(header).toBeVisible();
      
      // Test mobile menu button styling
      const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
      await expect(mobileMenuButton).toBeVisible();
      
      // Verify button has proper dark theme colors
      const buttonStyles = await mobileMenuButton.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          color: styles.color,
          backgroundColor: styles.backgroundColor
        };
      });
      
      expect(buttonStyles.color).toBe(darkThemeColors.text.secondary);
      
      // Test mobile menu opens with dark theme
      await mobileMenuButton.click();
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      await expect(mobileMenu).toBeVisible();
      
      const menuStyles = await mobileMenu.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          backdropFilter: styles.backdropFilter
        };
      });
      
      expect(menuStyles.backgroundColor).toContain('15, 23, 42'); // slate-900
      expect(menuStyles.backdropFilter).toContain('blur');
    });

    test('Hero section adapts to mobile with dark theme', async ({ page }) => {
      const heroSection = page.locator('[data-testid="hero-section"]');
      await expect(heroSection).toBeVisible();
      
      // Test background gradient on mobile
      const heroStyles = await heroSection.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundImage: styles.backgroundImage,
          minHeight: styles.minHeight
        };
      });
      
      expect(heroStyles.backgroundImage).toContain('gradient');
      expect(heroStyles.minHeight).toBe('100vh');
      
      // Test hero text readability on mobile
      const heroTitle = page.locator('[data-testid="hero-title"]');
      const heroSubtitle = page.locator('[data-testid="hero-subtitle"]');
      
      await expect(heroTitle).toBeVisible();
      await expect(heroSubtitle).toBeVisible();
      
      const titleStyles = await heroTitle.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          color: styles.color,
          fontSize: styles.fontSize
        };
      });
      
      expect(titleStyles.color).toBe(darkThemeColors.text.primary);
      
      // Test CTA buttons on mobile
      const ctaButton = page.locator('[data-testid="hero-cta-primary"]');
      await expect(ctaButton).toBeVisible();
      
      const buttonStyles = await ctaButton.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundImage: styles.backgroundImage,
          padding: styles.padding
        };
      });
      
      expect(buttonStyles.backgroundImage).toContain('gradient');
    });

    test('Service cards stack properly on mobile with dark theme', async ({ page }) => {
      await page.click('nav a[href="#services"]');
      const servicesSection = page.locator('#services');
      await expect(servicesSection).toBeVisible();
      
      const serviceCards = page.locator('[data-testid^="service-card-"]');
      const cardCount = await serviceCards.count();
      expect(cardCount).toBeGreaterThan(0);
      
      // Test each service card on mobile
      for (let i = 0; i < cardCount; i++) {
        const card = serviceCards.nth(i);
        await expect(card).toBeVisible();
        
        const cardStyles = await card.evaluate(el => {
          const styles = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return {
            backgroundColor: styles.backgroundColor,
            borderColor: styles.borderColor,
            backdropFilter: styles.backdropFilter,
            width: rect.width,
            marginBottom: styles.marginBottom
          };
        });
        
        // Verify dark theme card styling
        expect(cardStyles.backgroundColor).toContain('30, 41, 59'); // slate-800
        expect(cardStyles.backdropFilter).toContain('blur');
        
        // Verify cards stack vertically on mobile (full width)
        expect(cardStyles.width).toBeGreaterThan(300);
      }
    });

    test('Contact form is usable on mobile with dark theme', async ({ page }) => {
      await page.click('nav a[href="#contact"]');
      const contactSection = page.locator('#contact');
      await expect(contactSection).toBeVisible();
      
      // Test form inputs on mobile
      const formInputs = [
        '[data-testid="contact-first-name"]',
        '[data-testid="contact-last-name"]',
        '[data-testid="contact-email"]',
        '[data-testid="contact-company"]',
        '[data-testid="contact-message"]'
      ];
      
      for (const inputSelector of formInputs) {
        const input = page.locator(inputSelector);
        await expect(input).toBeVisible();
        
        const inputStyles = await input.evaluate(el => {
          const styles = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return {
            backgroundColor: styles.backgroundColor,
            borderColor: styles.borderColor,
            color: styles.color,
            width: rect.width,
            height: rect.height
          };
        });
        
        // Verify dark theme input styling
        expect(inputStyles.backgroundColor).toContain('30, 41, 59'); // slate-800
        expect(inputStyles.color).toBe(darkThemeColors.text.primary);
        
        // Verify touch-friendly sizing (minimum 44px height)
        expect(inputStyles.height).toBeGreaterThanOrEqual(44);
      }
      
      // Test submit button touch target
      const submitButton = page.locator('[data-testid="contact-submit"]');
      const buttonRect = await submitButton.boundingBox();
      expect(buttonRect.height).toBeGreaterThanOrEqual(44);
      expect(buttonRect.width).toBeGreaterThanOrEqual(44);
    });

    test('Footer adapts to mobile with dark theme', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      
      const footerStyles = await footer.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundImage: styles.backgroundImage,
          padding: styles.padding
        };
      });
      
      expect(footerStyles.backgroundImage).toContain('gradient');
      
      // Test footer links are touch-friendly
      const footerLinks = page.locator('footer a');
      const linkCount = await footerLinks.count();
      
      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = footerLinks.nth(i);
        const linkRect = await link.boundingBox();
        if (linkRect) {
          expect(linkRect.height).toBeGreaterThanOrEqual(44);
        }
      }
    });
  });

  test.describe('Tablet Viewport Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.tablet);
    });

    test('Header navigation displays correctly on tablet', async ({ page }) => {
      const header = page.locator('header');
      const navigation = page.locator('nav');
      
      await expect(header).toBeVisible();
      await expect(navigation).toBeVisible();
      
      // Test navigation items are visible (not collapsed to mobile menu)
      const navItems = page.locator('nav a');
      const navCount = await navItems.count();
      expect(navCount).toBeGreaterThan(3);
      
      // Test hover states on tablet
      const firstNavItem = navItems.first();
      await firstNavItem.hover();
      
      const hoverStyles = await firstNavItem.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          color: styles.color
        };
      });
      
      expect(hoverStyles.color).toBe(darkThemeColors.accent.cyan);
    });

    test('Service cards display in grid on tablet', async ({ page }) => {
      await page.click('nav a[href="#services"]');
      const servicesSection = page.locator('#services');
      await expect(servicesSection).toBeVisible();
      
      const serviceCards = page.locator('[data-testid^="service-card-"]');
      const cardCount = await serviceCards.count();
      
      // Test grid layout on tablet (should be 2 columns)
      const firstCard = serviceCards.first();
      const secondCard = serviceCards.nth(1);
      
      const firstCardRect = await firstCard.boundingBox();
      const secondCardRect = await secondCard.boundingBox();
      
      // Cards should be side by side on tablet
      expect(Math.abs(firstCardRect.y - secondCardRect.y)).toBeLessThan(50);
      expect(firstCardRect.width).toBeLessThan(400); // Not full width
    });

    test('Gradient performance on tablet', async ({ page }) => {
      // Test gradient rendering performance
      const performanceEntries = await page.evaluate(() => {
        performance.mark('gradient-test-start');
        
        // Force repaint of gradient elements
        const gradientElements = document.querySelectorAll('[class*="gradient"], [style*="gradient"]');
        gradientElements.forEach(el => {
          el.style.transform = 'translateZ(0)'; // Force GPU acceleration
        });
        
        performance.mark('gradient-test-end');
        performance.measure('gradient-render', 'gradient-test-start', 'gradient-test-end');
        
        const measures = performance.getEntriesByType('measure');
        return measures.find(m => m.name === 'gradient-render')?.duration || 0;
      });
      
      // Gradient rendering should be fast (under 16ms for 60fps)
      expect(performanceEntries).toBeLessThan(16);
    });

    test('Backdrop filter performance on tablet', async ({ page }) => {
      // Test backdrop-filter performance
      const cards = page.locator('[class*="backdrop-blur"]');
      const cardCount = await cards.count();
      
      if (cardCount > 0) {
        const performanceMetrics = await page.evaluate(() => {
          performance.mark('backdrop-test-start');
          
          // Trigger backdrop-filter recalculation
          const backdropElements = document.querySelectorAll('[class*="backdrop-blur"]');
          backdropElements.forEach(el => {
            el.style.backdropFilter = 'blur(8px)';
          });
          
          performance.mark('backdrop-test-end');
          performance.measure('backdrop-render', 'backdrop-test-start', 'backdrop-test-end');
          
          const measures = performance.getEntriesByType('measure');
          return measures.find(m => m.name === 'backdrop-render')?.duration || 0;
        });
        
        // Backdrop filter should render efficiently
        expect(performanceMetrics).toBeLessThan(50);
      }
    });
  });

  test.describe('Desktop Viewport Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
    });

    test('Header with scroll effects on desktop', async ({ page }) => {
      const header = page.locator('header');
      
      // Test initial transparent state
      const initialStyles = await header.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          backdropFilter: styles.backdropFilter
        };
      });
      
      // Scroll to trigger header background change
      await page.evaluate(() => window.scrollTo(0, 100));
      await page.waitForTimeout(300); // Wait for scroll animation
      
      const scrolledStyles = await header.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          backdropFilter: styles.backdropFilter
        };
      });
      
      // Header should have backdrop blur when scrolled
      expect(scrolledStyles.backdropFilter).toContain('blur');
    });

    test('Service cards display in full grid on desktop', async ({ page }) => {
      await page.click('nav a[href="#services"]');
      const servicesSection = page.locator('#services');
      await expect(servicesSection).toBeVisible();
      
      const serviceCards = page.locator('[data-testid^="service-card-"]');
      const cardCount = await serviceCards.count();
      
      // Test grid layout on desktop (should be 3+ columns)
      if (cardCount >= 3) {
        const firstCard = serviceCards.first();
        const secondCard = serviceCards.nth(1);
        const thirdCard = serviceCards.nth(2);
        
        const firstRect = await firstCard.boundingBox();
        const secondRect = await secondCard.boundingBox();
        const thirdRect = await thirdCard.boundingBox();
        
        // All three cards should be on the same row
        expect(Math.abs(firstRect.y - secondRect.y)).toBeLessThan(50);
        expect(Math.abs(secondRect.y - thirdRect.y)).toBeLessThan(50);
        
        // Cards should have reasonable width (not too narrow)
        expect(firstRect.width).toBeGreaterThan(250);
      }
    });

    test('Hover effects work properly on desktop', async ({ page }) => {
      // Test button hover effects
      const ctaButton = page.locator('[data-testid="hero-cta-primary"]');
      await expect(ctaButton).toBeVisible();
      
      // Get initial button styles
      const initialStyles = await ctaButton.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundImage: styles.backgroundImage,
          transform: styles.transform
        };
      });
      
      // Hover over button
      await ctaButton.hover();
      await page.waitForTimeout(200); // Wait for hover transition
      
      const hoverStyles = await ctaButton.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundImage: styles.backgroundImage,
          transform: styles.transform
        };
      });
      
      // Hover should change gradient or transform
      expect(hoverStyles.backgroundImage !== initialStyles.backgroundImage || 
             hoverStyles.transform !== initialStyles.transform).toBeTruthy();
      
      // Test card hover effects
      await page.click('nav a[href="#services"]');
      const serviceCard = page.locator('[data-testid^="service-card-"]').first();
      
      const initialCardTransform = await serviceCard.evaluate(el => {
        return window.getComputedStyle(el).transform;
      });
      
      await serviceCard.hover();
      await page.waitForTimeout(200);
      
      const hoverCardTransform = await serviceCard.evaluate(el => {
        return window.getComputedStyle(el).transform;
      });
      
      // Card should have transform on hover
      expect(hoverCardTransform).not.toBe(initialCardTransform);
    });

    test('Large viewport layout optimization', async ({ page }) => {
      await page.setViewportSize(viewports.desktopLarge);
      
      // Test container max-width constraints
      const mainContainer = page.locator('.container, [class*="max-w-"]').first();
      const containerRect = await mainContainer.boundingBox();
      
      // Container should not exceed reasonable max-width
      expect(containerRect.width).toBeLessThan(1400);
      
      // Test content centering
      const viewportWidth = viewports.desktopLarge.width;
      const containerCenter = containerRect.x + containerRect.width / 2;
      const viewportCenter = viewportWidth / 2;
      
      expect(Math.abs(containerCenter - viewportCenter)).toBeLessThan(50);
    });
  });

  test.describe('Cross-Device Consistency Tests', () => {
    const testViewports = [viewports.mobile, viewports.tablet, viewports.desktop];
    
    for (const viewport of testViewports) {
      test(`Dark theme colors consistent on ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        
        // Test consistent background colors
        const body = page.locator('body');
        const bodyStyles = await body.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            color: styles.color
          };
        });
        
        // Body should have dark background
        expect(bodyStyles.backgroundColor).toContain('15, 23, 42'); // slate-900
        
        // Test header consistency
        const header = page.locator('header');
        const headerStyles = await header.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            color: styles.color
          };
        });
        
        expect(headerStyles.color).toBe(darkThemeColors.text.primary);
        
        // Test button consistency
        const primaryButton = page.locator('[data-testid="hero-cta-primary"]');
        if (await primaryButton.isVisible()) {
          const buttonStyles = await primaryButton.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              backgroundImage: styles.backgroundImage,
              color: styles.color
            };
          });
          
          expect(buttonStyles.backgroundImage).toContain('gradient');
          expect(buttonStyles.color).toBe(darkThemeColors.text.primary);
        }
      });
    }
  });

  test.describe('Touch Target and Accessibility Tests', () => {
    test('Touch targets meet minimum size requirements on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      
      // Test navigation touch targets
      const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
      const menuButtonRect = await mobileMenuButton.boundingBox();
      expect(menuButtonRect.width).toBeGreaterThanOrEqual(44);
      expect(menuButtonRect.height).toBeGreaterThanOrEqual(44);
      
      // Open mobile menu and test menu items
      await mobileMenuButton.click();
      const menuItems = page.locator('[data-testid="mobile-menu"] a');
      const menuItemCount = await menuItems.count();
      
      for (let i = 0; i < menuItemCount; i++) {
        const menuItem = menuItems.nth(i);
        const itemRect = await menuItem.boundingBox();
        expect(itemRect.height).toBeGreaterThanOrEqual(44);
      }
      
      // Test form input touch targets
      await page.click('nav a[href="#contact"]');
      const formInputs = page.locator('input, textarea, select, button');
      const inputCount = await formInputs.count();
      
      for (let i = 0; i < Math.min(inputCount, 10); i++) {
        const input = formInputs.nth(i);
        if (await input.isVisible()) {
          const inputRect = await input.boundingBox();
          expect(inputRect.height).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('Focus indicators visible in dark theme', async ({ page }) => {
      // Test keyboard navigation focus indicators
      await page.keyboard.press('Tab');
      
      const focusedElement = page.locator(':focus');
      const focusStyles = await focusedElement.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineColor: styles.outlineColor,
          boxShadow: styles.boxShadow
        };
      });
      
      // Focus should be visible (outline or box-shadow)
      expect(focusStyles.outline !== 'none' || focusStyles.boxShadow !== 'none').toBeTruthy();
    });

    test('Color contrast meets accessibility standards', async ({ page }) => {
      // Test text contrast ratios
      const textElements = page.locator('h1, h2, h3, p, a, button, label');
      const elementCount = await textElements.count();
      
      for (let i = 0; i < Math.min(elementCount, 20); i++) {
        const element = textElements.nth(i);
        if (await element.isVisible()) {
          const contrastInfo = await element.evaluate(el => {
            const styles = window.getComputedStyle(el);
            const color = styles.color;
            const backgroundColor = styles.backgroundColor;
            
            // Simple contrast check (would use actual contrast calculation in production)
            const isLightText = color.includes('255, 255, 255') || color.includes('203, 213, 225');
            const isDarkBackground = backgroundColor.includes('15, 23, 42') || backgroundColor.includes('30, 41, 59');
            
            return {
              color,
              backgroundColor,
              hasGoodContrast: isLightText && isDarkBackground
            };
          });
          
          // Most text should have good contrast in dark theme
          if (contrastInfo.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            expect(contrastInfo.hasGoodContrast).toBeTruthy();
          }
        }
      }
    });
  });

  test.describe('Performance Tests Across Viewports', () => {
    const performanceViewports = [viewports.mobile, viewports.tablet, viewports.desktop];
    
    for (const viewport of performanceViewports) {
      test(`Page load performance on ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        
        const startTime = Date.now();
        await page.goto('http://localhost:3000');
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;
        
        // Page should load within reasonable time
        expect(loadTime).toBeLessThan(5000);
        
        // Test CSS animation performance
        const animationPerformance = await page.evaluate(() => {
          performance.mark('animation-test-start');
          
          // Trigger animations
          const animatedElements = document.querySelectorAll('[class*="transition"], [class*="animate"]');
          animatedElements.forEach(el => {
            el.style.transform = 'translateX(10px)';
          });
          
          performance.mark('animation-test-end');
          performance.measure('animation-render', 'animation-test-start', 'animation-test-end');
          
          const measures = performance.getEntriesByType('measure');
          return measures.find(m => m.name === 'animation-render')?.duration || 0;
        });
        
        expect(animationPerformance).toBeLessThan(50);
      });
    }
  });

  test.describe('Orientation Change Tests', () => {
    test('Layout adapts to orientation changes', async ({ page }) => {
      // Start in portrait mobile
      await page.setViewportSize(viewports.mobile);
      
      // Test initial layout
      const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
      await expect(mobileMenuButton).toBeVisible();
      
      // Switch to landscape
      await page.setViewportSize(viewports.mobileLandscape);
      
      // Layout should adapt
      const navigation = page.locator('nav');
      const navItems = page.locator('nav a');
      const navCount = await navItems.count();
      
      // In landscape, navigation might be visible instead of collapsed
      if (navCount > 0) {
        await expect(navigation).toBeVisible();
      }
      
      // Test hero section in landscape
      const heroSection = page.locator('[data-testid="hero-section"]');
      const heroStyles = await heroSection.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          minHeight: styles.minHeight,
          padding: styles.padding
        };
      });
      
      // Hero should still be full height in landscape
      expect(heroStyles.minHeight).toBe('100vh');
    });
  });
});