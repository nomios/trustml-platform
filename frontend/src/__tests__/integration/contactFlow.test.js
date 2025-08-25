/**
 * Integration Tests for Contact Flow
 * Tests the complete user journey from contact form to submission
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import contactFormService from '../../utils/contactFormService';
import analyticsService from '../../utils/analyticsService';
import errorHandlingService from '../../utils/errorHandlingService';

// Mock dependencies
jest.mock('../../utils/analyticsService');
jest.mock('../../utils/errorHandlingService');

// Mock Contact component
const MockContactForm = ({ onSubmit, prefilledData = {} }) => {
  const [formData, setFormData] = React.useState({
    first_name: '',
    last_name: '',
    email: '',
    company: '',
    interested_in: '',
    service_type: '',
    message: '',
    ...prefilledData
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} data-testid="contact-form">
      <input
        data-testid="first-name"
        value={formData.first_name}
        onChange={(e) => handleChange('first_name', e.target.value)}
        placeholder="First Name"
      />
      <input
        data-testid="last-name"
        value={formData.last_name}
        onChange={(e) => handleChange('last_name', e.target.value)}
        placeholder="Last Name"
      />
      <input
        data-testid="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Email"
      />
      <input
        data-testid="company"
        value={formData.company}
        onChange={(e) => handleChange('company', e.target.value)}
        placeholder="Company"
      />
      <select
        data-testid="interested-in"
        value={formData.interested_in}
        onChange={(e) => handleChange('interested_in', e.target.value)}
      >
        <option value="">Select Service</option>
        <option value="Risk Strategy & Assessment">Risk Strategy & Assessment</option>
        <option value="Trust & Safety Program Build">Trust & Safety Program Build</option>
      </select>
      <textarea
        data-testid="message"
        value={formData.message}
        onChange={(e) => handleChange('message', e.target.value)}
        placeholder="Message"
      />
      <button type="submit" data-testid="submit-button">
        Submit
      </button>
    </form>
  );
};

describe('Contact Flow Integration Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
    analyticsService.trackFormSubmission.mockClear();
    errorHandlingService.showUserFriendlyError.mockClear();
    errorHandlingService.handleApiError.mockClear();
  });

  describe('Successful Contact Form Submission', () => {
    test('completes full contact form submission flow', async () => {
      const user = userEvent.setup();
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'contact-123', status: 'submitted' })
      });

      const handleSubmit = jest.fn(async (formData) => {
        return await contactFormService.submitContactForm(formData);
      });

      render(<MockContactForm onSubmit={handleSubmit} />);

      // Fill out the form
      await user.type(screen.getByTestId('first-name'), 'John');
      await user.type(screen.getByTestId('last-name'), 'Doe');
      await user.type(screen.getByTestId('email'), 'john@example.com');
      await user.type(screen.getByTestId('company'), 'Test Corp');
      await user.selectOptions(screen.getByTestId('interested-in'), 'Risk Strategy & Assessment');
      await user.type(screen.getByTestId('message'), 'I am interested in your risk strategy services.');

      // Submit the form
      await user.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          company: 'Test Corp',
          interested_in: 'Risk Strategy & Assessment',
          service_type: '',
          message: 'I am interested in your risk strategy services.'
        });
      });

      // Verify API call
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/contact',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('john@example.com')
        })
      );

      // Verify analytics tracking
      expect(analyticsService.trackFormSubmission).toHaveBeenCalledWith(
        'contact-form',
        expect.objectContaining({
          email: 'john@example.com',
          interested_in: 'Risk Strategy & Assessment'
        }),
        'attempt'
      );

      expect(analyticsService.trackFormSubmission).toHaveBeenCalledWith(
        'contact-form',
        expect.objectContaining({
          email: 'john@example.com'
        }),
        'success'
      );

      // Verify success message
      expect(errorHandlingService.showUserFriendlyError).toHaveBeenCalledWith(
        'Thank you for your message! We\'ll get back to you within 24 hours.',
        'success',
        true,
        5000
      );
    });

    test('handles form prefilling for specific services', async () => {
      const user = userEvent.setup();
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'contact-123' })
      });

      const prefilledData = contactFormService.prefilFormData('risk-strategy', {
        first_name: 'Jane',
        email: 'jane@company.com'
      });

      const handleSubmit = jest.fn(async (formData) => {
        return await contactFormService.submitContactForm(formData);
      });

      render(<MockContactForm onSubmit={handleSubmit} prefilledData={prefilledData} />);

      // Verify prefilled data
      expect(screen.getByTestId('first-name')).toHaveValue('Jane');
      expect(screen.getByTestId('email')).toHaveValue('jane@company.com');
      expect(screen.getByTestId('message')).toHaveValue(
        expect.stringContaining('risk strategy')
      );

      // Complete remaining fields
      await user.type(screen.getByTestId('last-name'), 'Smith');
      await user.type(screen.getByTestId('company'), 'Company Inc');

      // Submit
      await user.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane@company.com',
            company: 'Company Inc',
            service_type: 'risk-strategy'
          })
        );
      });
    });
  });

  describe('Form Validation Integration', () => {
    test('handles validation errors in complete flow', async () => {
      const user = userEvent.setup();
      
      const handleSubmit = jest.fn(async (formData) => {
        return await contactFormService.submitContactForm(formData);
      });

      render(<MockContactForm onSubmit={handleSubmit} />);

      // Submit form with invalid data
      await user.type(screen.getByTestId('email'), 'invalid-email');
      await user.type(screen.getByTestId('message'), 'Short'); // Too short
      await user.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled();
      });

      // Should not make API call due to validation errors
      expect(fetch).not.toHaveBeenCalled();

      // Should track validation error
      expect(analyticsService.trackFormSubmission).toHaveBeenCalledWith(
        'contact-form',
        expect.objectContaining({
          email: 'invalid-email'
        }),
        'error'
      );
    });
  });

  describe('Error Handling Integration', () => {
    test('handles network errors with retry flow', async () => {
      const user = userEvent.setup();
      
      // First call fails, second succeeds
      fetch
        .mockRejectedValueOnce(new Error('NetworkError'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 'contact-123' })
        });

      const handleSubmit = jest.fn(async (formData) => {
        return await contactFormService.submitContactForm(formData);
      });

      render(<MockContactForm onSubmit={handleSubmit} />);

      // Fill valid form data
      await user.type(screen.getByTestId('first-name'), 'John');
      await user.type(screen.getByTestId('last-name'), 'Doe');
      await user.type(screen.getByTestId('email'), 'john@example.com');
      await user.type(screen.getByTestId('company'), 'Test Corp');
      await user.selectOptions(screen.getByTestId('interested-in'), 'Risk Strategy & Assessment');
      await user.type(screen.getByTestId('message'), 'Test message for retry flow.');

      await user.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(2); // Initial + retry
      });

      // Should eventually succeed
      expect(analyticsService.trackFormSubmission).toHaveBeenCalledWith(
        'contact-form',
        expect.any(Object),
        'success'
      );
    });

    test('handles persistent errors with fallback options', async () => {
      const user = userEvent.setup();
      
      const networkError = new Error('NetworkError');
      fetch.mockRejectedValue(networkError);

      errorHandlingService.handleApiError.mockResolvedValueOnce({
        success: false,
        message: 'Network error occurred',
        alternativeCallback: jest.fn(),
        alternativeText: 'Contact us directly'
      });

      const handleSubmit = jest.fn(async (formData) => {
        return await contactFormService.submitContactForm(formData);
      });

      render(<MockContactForm onSubmit={handleSubmit} />);

      // Fill valid form data
      await user.type(screen.getByTestId('first-name'), 'John');
      await user.type(screen.getByTestId('last-name'), 'Doe');
      await user.type(screen.getByTestId('email'), 'john@example.com');
      await user.type(screen.getByTestId('company'), 'Test Corp');
      await user.selectOptions(screen.getByTestId('interested-in'), 'Risk Strategy & Assessment');
      await user.type(screen.getByTestId('message'), 'Test message for error handling.');

      await user.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(3); // Initial + 2 retries
      });

      // Should call error handler after max retries
      expect(errorHandlingService.handleApiError).toHaveBeenCalledWith(
        networkError,
        'contact_form',
        expect.objectContaining({
          formData: expect.objectContaining({
            email: 'john@example.com'
          }),
          retryCallback: expect.any(Function)
        })
      );
    });
  });

  describe('Form Data Persistence Integration', () => {
    test('saves and loads form data across sessions', async () => {
      const user = userEvent.setup();
      
      // Mock localStorage
      const savedData = {
        first_name: 'John',
        email: 'john@example.com',
        company: 'Test Corp',
        saved_at: new Date().toISOString()
      };
      
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(savedData));

      const handleSubmit = jest.fn();
      render(<MockContactForm onSubmit={handleSubmit} />);

      // Simulate loading saved data
      const loadedData = contactFormService.loadSavedFormData();
      expect(loadedData).toMatchObject({
        first_name: 'John',
        email: 'john@example.com',
        company: 'Test Corp'
      });

      // Simulate saving new data
      const newFormData = {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        company: 'New Corp',
        message: 'Updated message'
      };

      contactFormService.saveFormDataLocally(newFormData);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'contact_form_draft',
        expect.stringContaining('jane@example.com')
      );
    });

    test('clears saved data after successful submission', async () => {
      const user = userEvent.setup();
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'contact-123' })
      });

      const handleSubmit = jest.fn(async (formData) => {
        const result = await contactFormService.submitContactForm(formData);
        if (result.success) {
          contactFormService.clearSavedFormData();
        }
        return result;
      });

      render(<MockContactForm onSubmit={handleSubmit} />);

      // Fill and submit form
      await user.type(screen.getByTestId('first-name'), 'John');
      await user.type(screen.getByTestId('last-name'), 'Doe');
      await user.type(screen.getByTestId('email'), 'john@example.com');
      await user.type(screen.getByTestId('company'), 'Test Corp');
      await user.selectOptions(screen.getByTestId('interested-in'), 'Risk Strategy & Assessment');
      await user.type(screen.getByTestId('message'), 'Test message');

      await user.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(localStorage.removeItem).toHaveBeenCalledWith('contact_form_draft');
      });
    });
  });

  describe('Analytics Integration', () => {
    test('tracks complete user journey through contact form', async () => {
      const user = userEvent.setup();
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'contact-123' })
      });

      const handleSubmit = jest.fn(async (formData) => {
        return await contactFormService.submitContactForm(formData);
      });

      render(<MockContactForm onSubmit={handleSubmit} />);

      // Simulate form interactions
      await contactFormService.trackFormInteraction('focus', 'first_name');
      await user.type(screen.getByTestId('first-name'), 'John');

      await contactFormService.trackFormInteraction('focus', 'email');
      await user.type(screen.getByTestId('email'), 'john@example.com');

      // Complete form and submit
      await user.type(screen.getByTestId('last-name'), 'Doe');
      await user.type(screen.getByTestId('company'), 'Test Corp');
      await user.selectOptions(screen.getByTestId('interested-in'), 'Risk Strategy & Assessment');
      await user.type(screen.getByTestId('message'), 'Complete journey test message');

      await user.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        // Verify all tracking calls
        expect(analyticsService.trackEvent).toHaveBeenCalledWith(
          'form_interaction',
          'contact-form-first_name',
          expect.objectContaining({
            action: 'focus',
            field: 'first_name'
          })
        );

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(
          'form_interaction',
          'contact-form-email',
          expect.objectContaining({
            action: 'focus',
            field: 'email'
          })
        );

        expect(analyticsService.trackFormSubmission).toHaveBeenCalledWith(
          'contact-form',
          expect.objectContaining({
            email: 'john@example.com'
          }),
          'attempt'
        );

        expect(analyticsService.trackFormSubmission).toHaveBeenCalledWith(
          'contact-form',
          expect.objectContaining({
            email: 'john@example.com'
          }),
          'success'
        );
      });
    });
  });
});