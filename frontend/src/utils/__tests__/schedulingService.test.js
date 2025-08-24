// Tests for SchedulingService

import SchedulingService from '../schedulingService';

// Mock fetch for testing
global.fetch = jest.fn();

describe('SchedulingService', () => {
  beforeEach(() => {
    fetch.mockClear();
    delete window.location;
    window.location = { href: 'http://localhost:3000' };
  });

  describe('getCalendlyUrl', () => {
    test('generates correct URL for general consultation', () => {
      const url = SchedulingService.getCalendlyUrl('general');
      expect(url).toBe('https://calendly.com/michael-trustml/consultation');
    });

    test('generates correct URL for specific service', () => {
      const url = SchedulingService.getCalendlyUrl('risk-strategy');
      expect(url).toBe('https://calendly.com/michael-trustml/risk-strategy-consultation');
    });

    test('includes prefill parameters', () => {
      const prefill = {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Test Corp'
      };
      const url = SchedulingService.getCalendlyUrl('general', prefill);
      expect(url).toContain('name=John%20Doe');
      expect(url).toContain('email=john%40example.com');
      expect(url).toContain('a1=Test%20Corp');
    });
  });

  describe('getServiceDisplayName', () => {
    test('returns correct display names', () => {
      expect(SchedulingService.getServiceDisplayName('risk-strategy')).toBe('Risk Strategy & Assessment');
      expect(SchedulingService.getServiceDisplayName('fractional-leadership')).toBe('Fractional Leadership');
      expect(SchedulingService.getServiceDisplayName('unknown')).toBe('Consultation');
    });
  });

  describe('getConsultationDuration', () => {
    test('returns correct durations', () => {
      expect(SchedulingService.getConsultationDuration('fractional-leadership')).toBe(60);
      expect(SchedulingService.getConsultationDuration('general')).toBe(30);
      expect(SchedulingService.getConsultationDuration('unknown')).toBe(30);
    });
  });

  describe('trackSchedulingClick', () => {
    test('sends tracking request to backend', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'tracked' })
      });

      await SchedulingService.trackSchedulingClick('risk-strategy', { test: 'data' });

      expect(fetch).toHaveBeenCalledWith(
        '/api/analytics/link-click',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('risk-strategy')
        })
      );
    });

    test('handles tracking errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      // Should not throw
      await expect(SchedulingService.trackSchedulingClick('general')).resolves.toBeUndefined();
    });
  });
});