// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

// Mock window.open
global.open = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
};

// Mock environment variables
process.env.NODE_ENV = 'test';

// Mock window properties
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: ''
  },
  writable: true
});

Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'Mozilla/5.0 (Test Browser)',
    language: 'en-US'
  },
  writable: true
});

Object.defineProperty(window, 'screen', {
  value: {
    width: 1920,
    height: 1080
  },
  writable: true
});

Object.defineProperty(window, 'innerWidth', {
  value: 1920,
  writable: true
});

Object.defineProperty(window, 'innerHeight', {
  value: 1080,
  writable: true
});

// Mock Intl.DateTimeFormat
Object.defineProperty(Intl, 'DateTimeFormat', {
  value: jest.fn(() => ({
    resolvedOptions: () => ({ timeZone: 'America/New_York' })
  })),
  writable: true
});

// Mock document properties
Object.defineProperty(document, 'referrer', {
  value: 'http://localhost:3000',
  writable: true
});

Object.defineProperty(document, 'title', {
  value: 'Test Page',
  writable: true
});

// Reset all mocks before each test
beforeEach(() => {
  fetch.mockClear();
  global.open.mockClear();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  sessionStorageMock.getItem.mockClear();
  sessionStorageMock.setItem.mockClear();
  sessionStorageMock.removeItem.mockClear();
  console.warn.mockClear();
  console.error.mockClear();
  console.log.mockClear();
});