/**
 * Analytics Service Tests (Stub)
 * These tests verify the analytics stub behaves as expected (no-ops)
 */

import analyticsService from '../analyticsService';

describe('AnalyticsService (Stub)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be disabled by default', () => {
    expect(analyticsService.isEnabled).toBe(false);
  });

  it('should return noop status for all tracking methods', async () => {
    const result1 = await analyticsService.trackEvent('test', 'test');
    expect(result1).toEqual({ status: 'noop' });

    const result2 = await analyticsService.trackButtonClick('button', 'test');
    expect(result2).toEqual({ status: 'noop' });

    const result3 = await analyticsService.trackFormSubmission('form', {}, 'submit');
    expect(result3).toEqual({ status: 'noop' });

    const result4 = await analyticsService.trackError('error', 'message', 'context');
    expect(result4).toEqual({ status: 'noop' });
  });

  it('should provide safe stub values', () => {
    const sessionId = analyticsService.generateSessionId();
    expect(sessionId).toBe('stub-session');

    const summary = analyticsService.getSessionSummary();
    expect(summary).toEqual({
      sessionId: 'stub-session',
      totalEvents: 0,
      duration: 0,
      interactions: []
    });
  });

  it('should pass through handlers without modification', () => {
    const originalHandler = jest.fn();
    const trackedHandler = analyticsService.createTrackedClickHandler(originalHandler);
    
    // The tracked handler should be the same as the original
    expect(trackedHandler).toBe(originalHandler);
  });

  it('should have no side effects when calling setup methods', () => {
    expect(() => analyticsService.setupScrollTracking()).not.toThrow();
    expect(() => analyticsService.setupErrorTracking()).not.toThrow();
    expect(() => analyticsService.initializeSession()).not.toThrow();
    expect(() => analyticsService.setEnabled(true)).not.toThrow();
  });
});