/**
 * End-to-End Tests for Complete User Journeys
 * Tests complete user flows from landing to conversion
 */

import { test, expect } from '@playwright/test';

// Mock backend responses for E2E tests
const mockBackendResponses = {
  contactSubmission: {
    id: 'contact-123',
    status: 'submitted',
    timestamp: new Date().toISOString()
  },
  analyticsTracking: {
    status: 'tracked',
    event_id: 'event-123'
  },
  resourceDownload: {
    status: 'success',
    download_url: '/resources/test-resource.pdf'
  }
};

test.describe('Complete User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/contact', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockBackendResponses.contactSubmission)
      });
    });

    await page.route('**/api/analytics/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockBackendResponses.analyticsTracking)
      });
    });

    await page.route('**/api/resources/**/download', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        body: 'Mock PDF content'
      });
    });

    // Navigate to the application
    await page.goto('http://localhost:3000');
  });

  test('Complete consultation booking journey', async ({ page }) => {
    // 1. User lands on homepage
    await expect(page).toHaveTitle(/TrustML Studio/);

    // 2. User navigates to services section
    await page.click('nav a[href="#services"]');
    await expect(page.locator('#services')).toBeVisible();

    // 3. User clicks on a specific service
    await page.click('[data-testid="service-risk-strategy"]');

    // 4. User clicks "Schedule Consultation" button
    const scheduleButton = page.locator('[data-testid="schedule-consultation-risk-strategy"]');
    await expect(scheduleButton).toBeVisible();

    // Mock Calendly popup
    await page.evaluate(() => {
      window.open = (url, target, features) => {
        // Simulate successful Calendly opening
        console.log('Calendly opened:', url);
        return { closed: false };
      };
    });

    await scheduleButton.click();

    // 5. Analytics tracking removed - now handled by PostHog

    // 6. Verify success state (Calendly would open in new tab)
    // In a real test, we might check for success messaging or state changes
  });

  test('Complete contact form submission journey', async ({ page }) => {
    // 1. User navigates to contact section
    await page.click('nav a[href="#contact"]');
    await expect(page.locator('#contact')).toBeVisible();

    // 2. User fills out contact form
    await page.fill('[data-testid="contact-first-name"]', 'John');
    await page.fill('[data-testid="contact-last-name"]', 'Doe');
    await page.fill('[data-testid="contact-email"]', 'john@example.com');
    await page.fill('[data-testid="contact-company"]', 'Test Corporation');
    await page.selectOption('[data-testid="contact-interested-in"]', 'Risk Strategy & Assessment');
    await page.fill('[data-testid="contact-message"]', 'I am interested in learning more about your risk strategy services and how they can help our organization.');

    // 3. User submits form
    await page.click('[data-testid="contact-submit"]');

    // 4. Verify form submission request
    await page.waitForRequest(request =>
      request.url().includes('/api/contact') &&
      request.method() === 'POST'
    );

    // 5. Analytics tracking removed - now handled by PostHog

    // 6. Verify success message appears
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Thank you for your message');

    // 7. Verify form is reset or disabled after submission
    await expect(page.locator('[data-testid="contact-submit"]')).toBeDisabled();
  });

  test('Complete resource discovery and download journey', async ({ page }) => {
    // 1. User navigates to resources section
    await page.click('nav a[href="#resources"]');
    await expect(page.locator('#resources')).toBeVisible();

    // 2. User searches for specific resource
    await page.fill('[data-testid="resource-search"]', 'fraud detection');
    await page.waitForTimeout(500); // Wait for search debounce

    // 3. Verify search results
    await expect(page.locator('[data-testid="resource-ai-fraud-detection-guide"]')).toBeVisible();
    await expect(page.locator('[data-testid="resource-gameverse-case-study"]')).not.toBeVisible();

    // 4. User filters by category
    await page.selectOption('[data-testid="resource-category-filter"]', 'white-paper');

    // 5. User clicks download button
    const downloadButton = page.locator('[data-testid="download-ai-fraud-detection-guide"]');
    await expect(downloadButton).toBeVisible();

    // Mock download behavior
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();

    // 6. Analytics tracking removed - now handled by PostHog

    // 7. Verify download initiated
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('fraud-detection');

    // 8. Verify download count updated
    await expect(page.locator('[data-testid="download-count-ai-fraud-detection-guide"]')).toContainText('1 download');
  });

  test('Complete navigation and exploration journey', async ({ page }) => {
    // 1. User explores main navigation
    const navItems = ['about', 'services', 'expertise', 'resources', 'contact'];

    for (const item of navItems) {
      await page.click(`nav a[href="#${item}"]`);
      await expect(page.locator(`#${item}`)).toBeVisible();

      // Analytics tracking removed - now handled by PostHog
    }

    // 2. User explores external links
    await page.click('[data-testid="linkedin-link"]');

    // Verify external link tracking
    await page.waitForRequest(request =>
      request.url().includes('/api/analytics/link-click') &&
      request.postDataJSON()?.link_category === 'social'
    );

    // 3. User explores company experience links
    await page.click('[data-testid="company-ebay-link"]');

    // Verify company link tracking
    await page.waitForRequest(request =>
      request.url().includes('/api/analytics/link-click') &&
      request.postDataJSON()?.link_category === 'company'
    );

    // 4. User checks footer links
    await page.click('[data-testid="privacy-policy-link"]');
    await expect(page.locator('[data-testid="privacy-policy-content"]')).toBeVisible();

    await page.click('[data-testid="terms-of-service-link"]');
    await expect(page.locator('[data-testid="terms-of-service-content"]')).toBeVisible();
  });

  test('Mobile user journey', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // 1. User opens mobile menu
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

    // 2. User navigates via mobile menu
    await page.click('[data-testid="mobile-menu-services"]');
    await expect(page.locator('#services')).toBeVisible();
    await expect(page.locator('[data-testid="mobile-menu"]')).not.toBeVisible();

    // 3. User interacts with mobile-optimized contact methods
    await page.click('[data-testid="mobile-phone-link"]');

    // Analytics tracking removed - now handled by PostHog

    // 4. User fills out contact form on mobile
    await page.click('nav a[href="#contact"]');
    await page.fill('[data-testid="contact-first-name"]', 'Jane');
    await page.fill('[data-testid="contact-last-name"]', 'Smith');
    await page.fill('[data-testid="contact-email"]', 'jane@example.com');
    await page.fill('[data-testid="contact-company"]', 'Mobile Corp');
    await page.selectOption('[data-testid="contact-interested-in"]', 'General Consultation');
    await page.fill('[data-testid="contact-message"]', 'Mobile contact form submission test message.');

    await page.click('[data-testid="contact-submit"]');

    // Verify mobile form submission
    await page.waitForRequest(request =>
      request.url().includes('/api/contact') &&
      request.method() === 'POST'
    );

    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  test('Error handling and recovery journey', async ({ page }) => {
    // 1. Simulate network error for contact form
    await page.route('**/api/contact', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    // 2. User attempts to submit contact form
    await page.click('nav a[href="#contact"]');
    await page.fill('[data-testid="contact-first-name"]', 'Error');
    await page.fill('[data-testid="contact-last-name"]', 'Test');
    await page.fill('[data-testid="contact-email"]', 'error@example.com');
    await page.fill('[data-testid="contact-company"]', 'Error Corp');
    await page.selectOption('[data-testid="contact-interested-in"]', 'Risk Strategy & Assessment');
    await page.fill('[data-testid="contact-message"]', 'Testing error handling in contact form.');

    await page.click('[data-testid="contact-submit"]');

    // 3. Verify error message appears
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('error');

    // 4. Verify retry option is available
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();

    // 5. Fix the API and retry
    await page.route('**/api/contact', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockBackendResponses.contactSubmission)
      });
    });

    await page.click('[data-testid="retry-button"]');

    // 6. Verify successful retry
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();

    // 7. Test resource download error handling
    await page.route('**/api/resources/**/download', async route => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Resource not found' })
      });
    });

    await page.click('nav a[href="#resources"]');
    await page.click('[data-testid="download-ai-fraud-detection-guide"]');

    // 8. Verify resource error handling
    await expect(page.locator('[data-testid="resource-error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="alternative-action-button"]')).toBeVisible();
  });

  test('Analytics tracking throughout user session', async ({ page }) => {
    const trackedEvents = [];

    // Capture all analytics requests
    page.on('request', request => {
      if (request.url().includes('/api/analytics/')) {
        trackedEvents.push({
          url: request.url(),
          method: request.method(),
          postData: request.postDataJSON()
        });
      }
    });

    // 1. Page load tracking
    await page.waitForLoadState('networkidle');
    expect(trackedEvents.some(e => e.postData?.event_type === 'page_load')).toBeTruthy();

    // 2. Navigation tracking
    await page.click('nav a[href="#services"]');
    await page.waitForTimeout(500);
    expect(trackedEvents.some(e => e.postData?.event_type === 'navigation')).toBeTruthy();

    // 3. Button click tracking
    await page.click('[data-testid="schedule-consultation-risk-strategy"]');
    await page.waitForTimeout(500);
    expect(trackedEvents.some(e => e.postData?.event_type === 'scheduling_interaction')).toBeTruthy();

    // 4. Form interaction tracking
    await page.click('nav a[href="#contact"]');
    await page.click('[data-testid="contact-first-name"]');
    await page.waitForTimeout(500);
    expect(trackedEvents.some(e => e.postData?.event_type === 'form_interaction')).toBeTruthy();

    // 5. Scroll tracking
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight * 0.5);
    });
    await page.waitForTimeout(1000);
    expect(trackedEvents.some(e => e.postData?.event_type === 'scroll_depth')).toBeTruthy();

    // 6. Resource download tracking
    await page.click('nav a[href="#resources"]');
    await page.click('[data-testid="download-ai-fraud-detection-guide"]');
    await page.waitForTimeout(500);
    expect(trackedEvents.some(e => e.postData?.event_type === 'resource_download')).toBeTruthy();

    // Verify comprehensive tracking coverage
    expect(trackedEvents.length).toBeGreaterThan(5);
  });

  test('Accessibility and keyboard navigation journey', async ({ page }) => {
    // 1. Test keyboard navigation
    await page.keyboard.press('Tab'); // Focus first interactive element
    await page.keyboard.press('Enter'); // Activate focused element

    // 2. Test skip links
    await page.keyboard.press('Tab');
    const skipLink = page.locator('[data-testid="skip-to-main"]');
    if (await skipLink.isVisible()) {
      await skipLink.click();
      await expect(page.locator('#main-content')).toBeFocused();
    }

    // 3. Test form accessibility
    await page.click('nav a[href="#contact"]');

    // Verify form labels and ARIA attributes
    await expect(page.locator('label[for="contact-first-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="contact-first-name"]')).toHaveAttribute('aria-required', 'true');

    // 4. Test error message accessibility
    await page.click('[data-testid="contact-submit"]'); // Submit empty form

    const errorMessage = page.locator('[data-testid="validation-error"]');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toHaveAttribute('role', 'alert');
      await expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    }

    // 5. Test focus management
    await page.fill('[data-testid="contact-first-name"]', 'Accessibility');
    await page.fill('[data-testid="contact-last-name"]', 'Test');
    await page.fill('[data-testid="contact-email"]', 'accessibility@example.com');
    await page.fill('[data-testid="contact-company"]', 'A11y Corp');
    await page.selectOption('[data-testid="contact-interested-in"]', 'General Consultation');
    await page.fill('[data-testid="contact-message"]', 'Testing accessibility features in the contact form.');

    await page.click('[data-testid="contact-submit"]');

    // Verify focus moves to success message
    await expect(page.locator('[data-testid="success-message"]')).toBeFocused();
  });
});