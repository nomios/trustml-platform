# Design Document

## Overview

This design document outlines the systematic adoption of the modern dark theme from the new landing design across the entire TrustML.Studio website. The design focuses on creating a cohesive, sophisticated visual experience using dark gradients, strategic color accents, and improved visual hierarchy while maintaining accessibility and brand consistency.

## Architecture

### Color System Architecture

The new color system is built around a dark foundation with strategic accent colors:

**Primary Background Colors:**
- Main gradient: `from-slate-900 to-slate-800`
- Card backgrounds: `slate-800/70` with backdrop blur
- Section alternates: `slate-900`, `slate-800`

**Accent Color Palette:**
- Primary: Indigo (`indigo-600`, `indigo-500`, `indigo-400`)
- Secondary: Cyan (`cyan-400`, `cyan-500`)
- Supporting: Blue, Purple, Green (for specific use cases)

**Text Hierarchy:**
- Primary text: `text-white`
- Secondary text: `text-slate-300`
- Muted text: `text-slate-400`
- Accent text: `text-indigo-300`, `text-cyan-400`

### Component Architecture

The design follows a modular approach where each component type has specific styling patterns:

1. **Layout Components**: Header, Footer, Container
2. **Content Components**: Cards, Sections, Text blocks
3. **Interactive Components**: Buttons, Forms, Navigation
4. **Specialty Components**: Hero sections, Stats, Testimonials

## Components and Interfaces

### Header Component Design

```css
Background: Transparent → bg-slate-900/95 with backdrop-blur-lg on scroll
Logo: White text with gradient accent
Navigation: text-slate-300 hover:text-cyan-400
CTA Buttons: Gradient from indigo-600 to blue-500
Mobile Menu: bg-slate-900 with border-slate-700
```

### Button System Design

**Primary Buttons:**
```css
bg-gradient-to-r from-indigo-600 to-blue-500
hover:from-indigo-500 hover:to-blue-400
text-white
shadow-lg shadow-indigo-500/30
```

**Secondary Buttons:**
```css
bg-indigo-900/30 hover:bg-indigo-900/50
border border-indigo-700/50
text-indigo-300
backdrop-blur-sm
```

**Outline Buttons:**
```css
border-2 border-indigo-600
text-indigo-400 hover:text-white
hover:bg-indigo-600
```

### Card System Design

**Service Cards:**
```css
bg-slate-800/70 backdrop-blur-sm
border border-slate-700/70
rounded-2xl
shadow-2xl
Hover: transform translateY(-2px)
```

**Feature Cards:**
```css
bg-gradient-to-br from-[color]-900/50 to-[color]-800/50
border border-[color]-700/30
rounded-lg
Accent colors: indigo, cyan, blue, purple
```

### Section Layout Design

**Hero Section:**
```css
bg-gradient-to-br from-slate-900 to-slate-800
min-h-screen
Overlay patterns and blur effects
```

**Content Sections:**
```css
Alternating: bg-slate-900, bg-slate-800
py-20 spacing
Container max-width: max-w-7xl
```

**Stats/Metrics Sections:**
```css
bg-slate-900
Grid layouts with centered content
Icon backgrounds: bg-indigo-600, bg-cyan-500
```

## Data Models

### Theme Configuration Model

```javascript
const themeConfig = {
  colors: {
    background: {
      primary: 'from-slate-900 to-slate-800',
      secondary: 'slate-900',
      tertiary: 'slate-800',
      card: 'slate-800/70',
      overlay: 'slate-900/95'
    },
    text: {
      primary: 'white',
      secondary: 'slate-300',
      muted: 'slate-400',
      accent: 'indigo-300'
    },
    accent: {
      primary: 'indigo-600',
      secondary: 'cyan-400',
      gradients: {
        primary: 'from-indigo-600 to-blue-500',
        secondary: 'from-cyan-400 to-indigo-500'
      }
    },
    borders: {
      default: 'slate-700/70',
      accent: 'indigo-700/50'
    }
  },
  effects: {
    blur: 'backdrop-blur-sm',
    shadows: {
      card: 'shadow-2xl',
      button: 'shadow-lg shadow-indigo-500/30'
    }
  }
}
```

### Component Mapping Model

```javascript
const componentMappings = {
  'Header': {
    background: 'transparent → slate-900/95',
    text: 'white',
    navigation: 'slate-300 hover:cyan-400'
  },
  'Button': {
    primary: 'gradient indigo-600 to blue-500',
    secondary: 'indigo-900/30 border indigo-700/50',
    outline: 'border indigo-600 text indigo-400'
  },
  'Card': {
    background: 'slate-800/70',
    border: 'slate-700/70',
    text: 'white'
  },
  'Section': {
    background: 'alternating slate-900/slate-800',
    text: 'white/slate-300'
  }
}
```

## Error Handling

### Color Contrast Validation

- All text/background combinations must meet WCAG AA standards (4.5:1 ratio minimum)
- Fallback colors defined for accessibility tools
- High contrast mode support through CSS custom properties

### Browser Compatibility

- Gradient fallbacks for older browsers
- Backdrop-filter fallbacks using solid colors
- CSS custom property fallbacks for unsupported browsers

### Theme Transition Handling

- Smooth transitions between light and dark elements during migration
- Graceful degradation for components not yet updated
- Consistent behavior across different viewport sizes

## Testing Strategy

### Visual Regression Testing

1. **Component-level testing**: Each component rendered in isolation with new theme
2. **Page-level testing**: Full page screenshots comparing before/after
3. **Responsive testing**: Theme consistency across mobile, tablet, desktop
4. **Browser testing**: Cross-browser compatibility for gradients and effects

### Accessibility Testing

1. **Color contrast validation**: Automated testing with tools like axe-core
2. **Screen reader testing**: Ensure theme changes don't affect screen reader navigation
3. **Keyboard navigation**: Verify focus states are visible in dark theme
4. **High contrast mode**: Test compatibility with system high contrast settings

### User Experience Testing

1. **Loading performance**: Measure impact of gradients and effects on performance
2. **Animation smoothness**: Verify transitions and hover effects perform well
3. **Mobile experience**: Touch targets and readability on mobile devices
4. **Cross-section consistency**: Ensure seamless experience when scrolling between sections

### Implementation Testing

1. **CSS specificity**: Ensure new styles properly override existing ones
2. **Component isolation**: Verify changes don't break unrelated components
3. **Build process**: Confirm Tailwind compilation includes all new classes
4. **Asset optimization**: Verify gradients and effects don't impact bundle size significantly

## Implementation Phases

### Phase 1: Foundation
- Update Tailwind configuration
- Implement base color system
- Update CSS custom properties

### Phase 2: Core Components
- Header and navigation
- Button system
- Basic card components

### Phase 3: Content Sections
- Hero section
- Service sections
- About section

### Phase 4: Specialty Components
- Stats sections
- Testimonials
- Footer

### Phase 5: Polish and Testing
- Accessibility validation
- Performance optimization
- Cross-browser testing