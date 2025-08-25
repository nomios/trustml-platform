// Tests for SchedulingService

import SchedulingService from '../schedulingService';
import analyticsService from '../analyticsService';

jest.mock('../analyticsService');

// Mock fetch for testing
global.fetch = jest.fn();

describe('SchedulingService', () => {
  beforeEach(() => {
    fetch.mockClear();
    analyticsService.trackSchedulingInteraction.mockClear();
    delete window.location;
    window.location = { href: 'http://localhost:3000' };
  });

  describe('getCalendlyUrl', () => {
    test('generates correct URL for general consultation', () => {
      const url = SchedulingService.getCalendlyUrl('general');
      expect(url).toBe('https://calendly.com/michael-trustml');
    });

    test('generates correct URL for specific service', () => {
      const url = SchedulingService.getCalendlyUrl('risk-strategy');
      expect(url).toBe('https://calendly.com/michael-trustml');
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
    test('tracks via analytics service, not backend', async () => {
      analyticsService.trackSchedulingInteraction.mockResolvedValueOnce({ status: 'noop' });

      await SchedulingService.trackSchedulingClick('risk-strategy', { source: 'test' });

      expect(analyticsService.trackSchedulingInteraction).toHaveBeenCalledWith('risk-strategy', 'click', 'test');
      expect(fetch).not.toHaveBeenCalled();
    });

    test('handles tracking errors gracefully', async () => {
      analyticsService.trackSchedulingInteraction.mockRejectedValueOnce(new Error('Network error'));
      await expect(SchedulingService.trackSchedulingClick('general')).resolves.toBeUndefined();
    });
  });
});