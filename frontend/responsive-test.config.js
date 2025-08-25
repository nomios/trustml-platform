/**
 * Responsive Design Test Configuration
 * Configuration for testing dark theme across different viewports and devices
 */

// Viewport configurations for comprehensive testing
export const viewportConfigs = {
  // Mobile devices
  mobile: {
    'iPhone SE': { width: 375, height: 667 },
    'iPhone 12': { width: 390, height: 844 },
    'iPhone 12 Pro Max': { width: 428, height: 926 },
    'Samsung Galaxy S21': { width: 360, height: 800 },
    'Google Pixel 5': { width: 393, height: 851 }
  },
  
  // Tablet devices
  tablet: {
    'iPad': { width: 768, height: 1024 },
    'iPad Air': { width: 820, height: 1180 },
    'iPad Pro 11"': { width: 834, height: 1194 },
    'iPad Pro 12.9"': { width: 1024, height: 1366 },
    'Samsung Galaxy Tab': { width: 800, height: 1280 }
  },
  
  // Desktop resolutions
  desktop: {
    'Laptop': { width: 1366, height: 768 },
    'Desktop HD': { width: 1920, height: 1080 },
    'Desktop QHD': { width: 2560, height: 1440 },
    'Desktop 4K': { width: 3840, height: 2160 },
    'Ultrawide': { width: 3440, height: 1440 }
  }
};

// Dark theme color palette for testing
export const darkThemeColors = {
  backgrounds: {
    primary: 'rgb(15, 23, 42)', // slate-900
    secondary: 'rgb(30, 41, 59)', // slate-800
    tertiary: 'rgb(51, 65, 85)', // slate-700
    card: 'rgba(30, 41, 59, 0.7)', // slate-800/70
    overlay: 'rgba(15, 23, 42, 0.95)' // slate-900/95
  },
  
  text: {
    primary: 'rgb(255, 255, 255)', // white
    secondary: 'rgb(203, 213, 225)', // slate-300
    muted: 'rgb(148, 163, 184)', // slate-400
    accent: 'rgb(165, 180, 252)' // indigo-300
  },
  
  accents: {
    primary: 'rgb(79, 70, 229)', // indigo-600
    secondary: 'rgb(99, 102, 241)', // indigo-500
    tertiary: 'rgb(129, 140, 248)', // indigo-400
    cyan: 'rgb(34, 211, 238)', // cyan-400
    blue: 'rgb(59, 130, 246)' // blue-500
  },
  
  borders: {
    default: 'rgba(148, 163, 184, 0.2)', // slate-400/20
    accent: 'rgba(79, 70, 229, 0.5)', // indigo-600/50
    focus: 'rgba(79, 70, 229, 0.3)' // indigo-600/30
  }
};

// Performance thresholds for different operations
export const performanceThresholds = {
  // Page load times (milliseconds)
  pageLoad: {
    mobile: 3000,
    tablet: 2500,
    desktop: 2000
  },
  
  // Style application times (milliseconds)
  styleApplication: {
    gradient: 5,
    backdropFilter: 8,
    transition: 16, // 60fps threshold
    animation: 16
  },
  
  // Layout operation times (milliseconds)
  layout: {
    viewportChange: 50,
    orientationChange: 30,
    gridRecalculation: 20
  },
  
  // Memory usage limits (bytes)
  memory: {
    gradientElements: 5 * 1024 * 1024, // 5MB
    backdropElements: 3 * 1024 * 1024, // 3MB
    totalIncrease: 10 * 1024 * 1024 // 10MB
  }
};

// Touch target requirements
export const touchTargetRequirements = {
  minimumSize: 44, // pixels
  recommendedSize: 48, // pixels
  minimumSpacing: 8, // pixels between targets
  
  // Element-specific requirements
  elements: {
    button: { minWidth: 44, minHeight: 44 },
    link: { minWidth: 44, minHeight: 44 },
    input: { minWidth: 44, minHeight: 44 },
    checkbox: { minWidth: 44, minHeight: 44 },
    radio: { minWidth: 44, minHeight: 44 }
  }
};

// Accessibility requirements
export const accessibilityRequirements = {
  contrast: {
    normal: 4.5, // WCAG AA
    large: 3.0, // WCAG AA for large text
    enhanced: 7.0 // WCAG AAA
  },
  
  focusIndicators: {
    minOutlineWidth: 2, // pixels
    minBoxShadowSpread: 2, // pixels
    requiredVisibility: true
  },
  
  textSizes: {
    minimum: 16, // pixels for body text
    touch: 18 // pixels for touch targets
  }
};

// Test selectors for different components
export const testSelectors = {
  layout: {
    header: 'header',
    navigation: 'nav',
    main: 'main',
    footer: 'footer',
    mobileMenu: '[data-testid="mobile-menu"]',
    mobileMenuButton: '[data-testid="mobile-menu-button"]'
  },
  
  sections: {
    hero: '[data-testid="hero-section"]',
    services: '#services',
    expertise: '#expertise',
    about: '#about',
    resources: '#resources',
    contact: '#contact'
  },
  
  components: {
    serviceCard: '[data-testid^="service-card-"]',
    expertiseCard: '[data-testid^="expertise-card-"]',
    resourceCard: '[data-testid^="resource-card-"]',
    contactForm: '[data-testid="contact-form"]',
    ctaButton: '[data-testid^="cta-"]',
    downloadButton: '[data-testid^="download-"]'
  },
  
  form: {
    firstName: '[data-testid="contact-first-name"]',
    lastName: '[data-testid="contact-last-name"]',
    email: '[data-testid="contact-email"]',
    company: '[data-testid="contact-company"]',
    interestedIn: '[data-testid="contact-interested-in"]',
    message: '[data-testid="contact-message"]',
    submit: '[data-testid="contact-submit"]'
  }
};

// CSS properties to test for dark theme compliance
export const cssPropertiesToTest = {
  background: [
    'background-color',
    'background-image',
    'background-gradient'
  ],
  
  text: [
    'color',
    'text-shadow'
  ],
  
  borders: [
    'border-color',
    'outline-color'
  ],
  
  effects: [
    'backdrop-filter',
    'box-shadow',
    'filter'
  ],
  
  layout: [
    'display',
    'flex-direction',
    'grid-template-columns',
    'width',
    'height',
    'padding',
    'margin'
  ]
};

// Browser-specific feature support
export const browserSupport = {
  backdropFilter: {
    chrome: 76,
    firefox: 103,
    safari: 9,
    edge: 79
  },
  
  cssGradients: {
    chrome: 26,
    firefox: 16,
    safari: 7,
    edge: 12
  },
  
  customProperties: {
    chrome: 49,
    firefox: 31,
    safari: 9.1,
    edge: 16
  },
  
  gridLayout: {
    chrome: 57,
    firefox: 52,
    safari: 10.1,
    edge: 16
  }
};

// Test scenarios for different user journeys
export const testScenarios = {
  navigation: {
    name: 'Navigation across viewports',
    steps: [
      'Load homepage',
      'Test mobile menu on small screens',
      'Test horizontal navigation on large screens',
      'Verify navigation styling consistency'
    ]
  },
  
  contentConsumption: {
    name: 'Content reading and interaction',
    steps: [
      'Scroll through all sections',
      'Test card hover effects',
      'Verify text readability',
      'Test button interactions'
    ]
  },
  
  formInteraction: {
    name: 'Form filling and submission',
    steps: [
      'Navigate to contact form',
      'Fill all form fields',
      'Test form validation',
      'Submit form and verify response'
    ]
  },
  
  resourceAccess: {
    name: 'Resource discovery and download',
    steps: [
      'Navigate to resources section',
      'Search for resources',
      'Filter by category',
      'Download resource'
    ]
  }
};

// Export default configuration
export default {
  viewportConfigs,
  darkThemeColors,
  performanceThresholds,
  touchTargetRequirements,
  accessibilityRequirements,
  testSelectors,
  cssPropertiesToTest,
  browserSupport,
  testScenarios
};