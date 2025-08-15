# Floating Islands Style Guide
## Fourmi Financial Glass Morphism Design System

### Design Philosophy

**Financial Trust Through Glass Morphism**
Our design system is built around the concept of "floating islands" - transparent, elevated UI elements that create a sense of depth and sophistication. This approach combines:

- **Professional Financial Aesthetics**: Glass morphism creates a modern, trustworthy appearance essential for financial applications
- **Visual Hierarchy**: Transparent layers with backdrop blur create clear information architecture
- **Accessibility**: High contrast elements ensure readability while maintaining visual appeal
- **Progressive Enhancement**: Subtle animations and hover states provide intuitive interactions

### Core Visual Principles

1. **Transparency as Trust**: Semi-transparent surfaces suggest openness and honesty
2. **Floating Elements**: All UI components appear to hover above the gradient background
3. **Green Financial Theme**: Emerald-based palette builds trust and suggests growth
4. **Depth Through Blur**: Backdrop blur creates natural visual hierarchy
5. **Subtle Interactions**: Gentle hover states and transitions feel responsive without distraction

---

## Color System

### Primary Palette

```typescript
// Financial Trust Theme - Green Based  
primary: {
  DEFAULT: "#10B981", // emerald-500 - Trust, growth, stability
  hover: "#059669",   // emerald-600 - Hover states
  light: "#34D399",   // emerald-400 - Accent highlights
  dark: "#047857",    // emerald-700 - Deep accents
}

// Financial Semantic Colors
financial: {
  success: "#10B981",  // Income, positive outcomes
  warning: "#F59E0B",  // Attention, caution
  danger: "#EF4444",   // Expenses, negative outcomes
  info: "#3B82F6",     // Informational content
}
```

### Glass Morphism Transparency System

```typescript
// Glass morphism layers - Core transparency values
glass: {
  light: "rgba(255, 255, 255, 0.05)",    // Subtle overlay
  medium: "rgba(255, 255, 255, 0.08)",   // Standard cards  
  dark: "rgba(0, 0, 0, 0.2)",            // Inner contrast elements
  darker: "rgba(0, 0, 0, 0.4)",          // High contrast overlays
  green: "rgba(16, 185, 129, 0.08)",     // Primary color overlay
  card: "rgba(255, 255, 255, 0.03)",     // Main card background
  hover: "rgba(255, 255, 255, 0.06)",    // Hover state
}
```

### Background Gradient System

```css
/* Progressive 5-stop gradient for depth */
.gradient-bg {
  background: linear-gradient(135deg, 
    #020617 0%,                    /* Pure dark slate */
    rgba(15, 23, 42, 0.98) 25%,   /* Slightly transparent slate-900 */
    rgba(30, 41, 59, 0.9) 50%,    /* Mid-transparency slate-800 */
    rgba(51, 65, 85, 0.85) 75%,   /* Higher transparency slate-700 */
    rgba(30, 41, 59, 0.95) 100%   /* Return to slate-800 with slight transparency */
  ) !important;
}
```

---

## Component Patterns

### 1. Floating Islands (Primary Pattern)

**Main Card Pattern**
```tsx
// Standard floating island component
<div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:bg-white/[0.05] shadow-xl">
  {/* Card content */}
</div>
```

**Usage Examples:**
- Dashboard cards (BalanceCard, IncomeCard, ExpensesCard, LoansCard)
- Chat interface containers
- Settings panels
- Modal dialogs

**Key Properties:**
- `bg-white/[0.03]`: Ultra-subtle transparency for floating effect
- `backdrop-blur-2xl`: Strong blur for glass morphism
- `rounded-3xl`: Generous border radius for soft, modern feel
- `hover:bg-white/[0.05]`: Subtle hover interaction
- `shadow-xl`: Elevated shadow for floating appearance

### 2. Inner Contrast Elements

**Pattern for Interior Components**
```tsx
// Inner elements that need more contrast
<div className="p-3 rounded-2xl bg-black/20 backdrop-blur">
  <div className="text-white/50 text-xs mb-1">Label</div>
  <div className="text-financial-success font-semibold">Content</div>
</div>
```

**Usage Examples:**
- Metric boxes within balance cards
- Input field backgrounds
- Nested content areas
- Sidebar sections

### 3. Navigation and Headers

**Floating Header Pattern**
```tsx
// Fixed floating header
<header className="fixed top-4 left-4 right-4 z-[100] bg-white/[0.03] backdrop-blur-2xl h-14 flex justify-between items-center rounded-2xl px-6 shadow-xl">
  {/* Header content */}
</header>
```

**Sidebar Pattern**
```tsx
// Floating sidebar container
<div className="h-full bg-white/[0.03] backdrop-blur-2xl m-4 rounded-3xl overflow-hidden">
  {/* Sidebar content */}
</div>
```

### 4. Interactive Elements

**Button Patterns**
```tsx
// Primary action button
<button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-financial">
  Action
</button>

// Secondary glass button
<button className="bg-white/[0.05] hover:bg-white/[0.08] text-white px-4 py-2 rounded-xl backdrop-blur transition-all duration-200">
  Secondary
</button>

// Danger action
<button className="bg-financial-danger/20 hover:bg-financial-danger/30 text-financial-danger px-4 py-2 rounded-xl transition-all duration-200">
  Delete
</button>
```

**Input Field Patterns**
```tsx
// Glass morphism input
<input className="w-full p-3 bg-black/20 backdrop-blur rounded-xl text-white placeholder-white/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
```

---

## Layout Specifications

### Spacing System

```typescript
// Bento-style spacing for floating islands
spacing: {
  "form-field": "16px",    // Standard form spacing
  section: "32px",         // Between major sections  
  bento: "24px",          // Between floating islands
}

// Padding inside floating islands
inner_padding: {
  mobile: "16px",         // p-4
  desktop: "24px",        // p-6
}
```

### Border Radius Scale

```typescript
borderRadius: {
  DEFAULT: "12px",        // Standard elements
  secondary: "8px",       // Small elements
  container: "16px",      // Form containers
  bento: "20px",         // Medium islands
  island: "24px",        // Large floating islands (rounded-3xl)
}
```

### Shadow System

```typescript
boxShadow: {
  glass: "0 8px 32px rgba(0, 0, 0, 0.1)",           // Standard floating
  "glass-hover": "0 16px 64px rgba(0, 0, 0, 0.15)", // Hover elevation
  "financial": "0 4px 20px rgba(16, 185, 129, 0.1)", // Primary color shadow
  "financial-hover": "0 8px 40px rgba(16, 185, 129, 0.15)", // Primary hover
}
```

---

## Typography in Glass Context

### Text Contrast on Glass

```css
/* Primary text on glass backgrounds */
.glass-primary-text {
  @apply text-white;
}

/* Secondary text for labels and metadata */
.glass-secondary-text {
  @apply text-white/50;
}

/* Muted text for descriptions */
.glass-muted-text {
  @apply text-white/30;
}

/* Financial color text */
.financial-success-text {
  @apply text-financial-success;
}

.financial-danger-text {
  @apply text-financial-danger;
}

.financial-warning-text {
  @apply text-financial-warning;
}
```

### Font Hierarchy

```typescript
// Optimized for glass morphism readability
typography: {
  display: {
    fontSize: "2rem",      // 32px - Main headings
    fontWeight: 700,
    color: "text-white",
  },
  title: {
    fontSize: "1.5rem",    // 24px - Card titles
    fontWeight: 600,
    color: "text-white",
  },
  body: {
    fontSize: "1rem",      // 16px - Body text
    fontWeight: 400,
    color: "text-white",
  },
  caption: {
    fontSize: "0.875rem",  // 14px - Labels
    fontWeight: 500,
    color: "text-white/50",
  },
  small: {
    fontSize: "0.75rem",   // 12px - Metadata
    fontWeight: 400,
    color: "text-white/30",
  }
}
```

---

## Interaction Patterns

### Hover States

```css
/* Standard glass morphism hover */
.glass-hover {
  @apply transition-all duration-300 hover:bg-white/[0.05] hover:shadow-glass-hover;
}

/* Enhanced hover for primary actions */
.primary-hover {
  @apply transition-all duration-200 hover:scale-[1.02] hover:shadow-financial-hover;
}

/* Subtle hover for secondary elements */
.secondary-hover {
  @apply transition-all duration-200 hover:bg-white/[0.02];
}
```

### Focus States

```css
/* Accessible focus rings on glass */
.glass-focus {
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent;
}
```

### Loading States

```css
/* Glass-compatible loading spinner */
.glass-loading {
  @apply animate-spin rounded-full border-2 border-primary border-t-transparent;
}
```

---

## Z-Index Hierarchy

```typescript
// Proper layering for floating elements
z_index: {
  navbar: 100,           // Fixed header
  hamburger: 90,         // Mobile menu trigger  
  sidebar: 80,           // Navigation sidebar
  backdrop: 70,          // Modal backdrops
  modal: 60,             // Modal content
  tooltip: 50,           // Tooltips and popovers
  dropdown: 40,          // Dropdown menus
  sticky: 30,            // Sticky elements
  card: 10,              // Floating cards
  base: 1,               // Base content
}
```

---

## Responsive Behavior

### Mobile Adaptations

```css
/* Mobile-first floating islands */
@media (max-width: 768px) {
  .floating-island {
    @apply m-2 p-4 rounded-2xl; /* Smaller margins and padding */
  }
  
  .floating-header {
    @apply top-2 left-2 right-2 rounded-xl; /* Tighter mobile header */
  }
}

/* Desktop enhancements */
@media (min-width: 1024px) {
  .floating-island {
    @apply m-4 p-6 rounded-3xl; /* Full desktop spacing */
  }
  
  .floating-header {
    @apply top-4 left-4 right-4 rounded-2xl; /* Full desktop header */
  }
}
```

### Tablet Considerations

```css
/* Tablet-specific adjustments */
@media (min-width: 768px) and (max-width: 1023px) {
  .floating-island {
    @apply m-3 p-5 rounded-3xl; /* Intermediate sizing */
  }
}
```

---

## Accessibility Guidelines

### Color Contrast Requirements

- **Primary text on glass**: Minimum 7:1 ratio (white on glass backgrounds)
- **Secondary text**: Minimum 4.5:1 ratio (white/50 on glass)
- **Interactive elements**: Minimum 3:1 ratio with additional visual cues
- **Financial colors**: Always paired with icons for colorblind accessibility

### Focus Management

```css
/* High-visibility focus indicators */
.accessible-focus {
  @apply focus-visible:outline-none;
  @apply focus-visible:ring-2 focus-visible:ring-primary;
  @apply focus-visible:ring-offset-2 focus-visible:ring-offset-transparent;
  @apply focus-visible:shadow-lg;
}
```

### Motion Reduction

```css
/* Respect motion preferences */
@media (prefers-reduced-motion: reduce) {
  .glass-transition {
    @apply transition-none;
  }
  
  .glass-animation {
    @apply animate-none;
  }
}
```

---

## Implementation Best Practices

### CSS Architecture

```css
/* Layer organization for glass morphism */
@layer base {
  /* Global glass variables and reset */
}

@layer components {
  /* Floating island component classes */
}

@layer utilities {
  /* Glass morphism utility classes */
}
```

### Performance Considerations

1. **Backdrop Blur Optimization**: Use `backdrop-blur-2xl` sparingly; prefer `backdrop-blur` for nested elements
2. **Transparency Layers**: Limit nested transparency to 3 levels maximum
3. **Shadow Rendering**: Use CSS `will-change: transform` for frequently animated elements
4. **GPU Acceleration**: Apply `transform: translateZ(0)` to complex glass elements

### Browser Support

- **Modern Browsers**: Full glass morphism support (Chrome 76+, Firefox 103+, Safari 14+)
- **Fallback Strategy**: Solid backgrounds with reduced opacity for older browsers
- **Progressive Enhancement**: Core functionality works without backdrop-blur

---

## Common Patterns Quick Reference

### Standard Card
```tsx
<div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:bg-white/[0.05] shadow-xl">
```

### Inner Contrast Box
```tsx
<div className="p-3 rounded-2xl bg-black/20 backdrop-blur">
```

### Floating Header
```tsx
<header className="fixed top-4 left-4 right-4 z-[100] bg-white/[0.03] backdrop-blur-2xl h-14 rounded-2xl px-6 shadow-xl">
```

### Glass Button
```tsx
<button className="bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur px-4 py-2 rounded-xl transition-all duration-200">
```

### Financial Metric
```tsx
<div className="text-2xl font-bold text-financial-success">
  {formatCurrency(amount)}
</div>
```

---

## Maintenance Guidelines

### Design Consistency Checklist

- [ ] All cards use consistent transparency (`bg-white/[0.03]`)
- [ ] Backdrop blur is applied to all floating elements (`backdrop-blur-2xl`)
- [ ] Border radius follows the scale (12px, 16px, 20px, 24px)
- [ ] Hover states use subtle transparency increases
- [ ] Financial colors are semantically correct (green=income, red=expense)
- [ ] Z-index follows the established hierarchy
- [ ] Text contrast meets accessibility standards
- [ ] Focus states are visible and accessible

### Common Mistakes to Avoid

1. **Inconsistent Transparency**: Always use the predefined glass values
2. **Too Much Blur**: Stick to `backdrop-blur-2xl` for main elements, `backdrop-blur` for nested
3. **Poor Contrast**: Test text readability on all glass backgrounds
4. **Z-Index Conflicts**: Follow the established hierarchy
5. **Over-Animation**: Keep transitions subtle and purposeful

### Testing Requirements

- [ ] Visual contrast testing in dark environments
- [ ] Accessibility testing with screen readers
- [ ] Cross-browser compatibility (especially Safari backdrop-blur)
- [ ] Mobile responsiveness across device sizes
- [ ] Performance testing with multiple floating elements

---

*This style guide serves as the definitive reference for Fourmi Financial's Floating Islands design system. All UI development should adhere to these patterns to maintain consistency and trust in our financial application.*