# Design System
## Fourmi Financial Copilot

### Design Philosophy

**Dark-First Financial Interface**
- Sophisticated, professional appearance suitable for financial data
- Reduced eye strain during extended analysis sessions
- High contrast for clear readability of numbers and calculations
- Inspired by Linear, Notion dark mode, and modern financial tools

### Color System

#### Primary Palette
```typescript
export const colors = {
  // Base colors (dark-first)
  background: {
    primary: "hsl(240 10% 3.9%)",    // #0B0B0F - Main app background
    secondary: "hsl(240 3.7% 15.9%)", // #262626 - Card backgrounds  
    tertiary: "hsl(240 4.9% 20%)",   // #333333 - Elevated surfaces
    muted: "hsl(240 4.9% 83.9%)",    // Light mode fallback
  },
  
  // Text colors
  foreground: {
    primary: "hsl(0 0% 98%)",        // #FAFAFA - Primary text
    secondary: "hsl(240 5% 84%)",    // #D4D4D8 - Secondary text
    muted: "hsl(240 3.8% 46.1%)",   // #737373 - Muted text
    disabled: "hsl(240 3.7% 15.9%)", // Disabled state
  },
  
  // Accent colors
  primary: "hsl(221 83% 53%)",       // #2563EB - Primary actions
  success: "hsl(142 76% 36%)",       // #16A34A - Positive outcomes
  warning: "hsl(38 92% 50%)",        // #F59E0B - Attention needed
  destructive: "hsl(0 62% 30%)",     // #DC2626 - Negative outcomes
  
  // Financial-specific colors
  profit: "hsl(142 76% 36%)",        // Green for positive cashflow
  loss: "hsl(0 62% 30%)",           // Red for negative cashflow
  neutral: "hsl(240 5% 64.9%)",     // Gray for neutral states
  
  // AI interaction colors  
  ai: "hsl(271 91% 65%)",           // #A855F7 - AI processing
  human: "hsl(221 83% 53%)",        // Blue for user input
} as const;
```

#### Semantic Color Usage
```css
/* ShadCN/ui CSS variable integration */
:root {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 3.7% 15.9%;
  --card-foreground: 0 0% 98%;
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary: 221 83% 53%;
  --primary-foreground: 210 20% 98%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62% 30%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 221 83% 53%;
  --radius: 0.75rem;
}
```

### Typography System

#### Font Stack
```css
:root {
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "Fira Code", "SF Mono", Consolas, monospace;
  --font-heading: "Inter", sans-serif;
}
```

#### Type Scale
```typescript
export const typography = {
  display: {
    fontSize: "2rem",      // 32px
    lineHeight: "2.5rem",  // 40px
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  title: {
    fontSize: "1.5rem",    // 24px  
    lineHeight: "2rem",    // 32px
    fontWeight: 600,
    letterSpacing: "-0.01em",
  },
  headline: {
    fontSize: "1.25rem",   // 20px
    lineHeight: "1.75rem", // 28px
    fontWeight: 600,
  },
  body: {
    fontSize: "1rem",      // 16px
    lineHeight: "1.5rem",  // 24px
    fontWeight: 400,
  },
  caption: {
    fontSize: "0.875rem",  // 14px
    lineHeight: "1.25rem", // 20px
    fontWeight: 500,
  },
  small: {
    fontSize: "0.75rem",   // 12px
    lineHeight: "1rem",    // 16px
    fontWeight: 400,
  },
} as const;
```

#### Financial Number Formatting
```typescript
export const formatters = {
  currency: (amount: number, currency = "EUR") => 
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount / 100), // Convert from cents
  
  percentage: (value: number, precision = 1) =>
    `${(value * 100).toFixed(precision)}%`,
    
  largeNumber: (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      notation: "compact",
      compactDisplay: "short",
    }).format(value),
};
```

### Spacing System

#### Base Scale (4px grid)
```typescript
export const spacing = {
  0: "0px",
  1: "4px",    // Micro spacing
  2: "8px",    // Small spacing  
  3: "12px",   // Medium spacing
  4: "16px",   // Standard spacing
  5: "20px",   // Large spacing
  6: "24px",   // Extra large spacing
  8: "32px",   // Section breaks
  10: "40px",  // Major sections
  12: "48px",  // Page sections
  16: "64px",  // Hero sections
} as const;
```

### Component Specifications

#### Metric Cards
```tsx
// Primary financial metric display
<Card className="metric-card">
  <CardHeader className="pb-2">
    <CardTitle className="text-sm font-medium text-muted-foreground">
      Monthly Cashflow
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-foreground">
      -210 €
    </div>
    <div className="flex items-center mt-1">
      <TrendingDown className="w-4 h-4 text-destructive mr-1" />
      <span className="text-xs text-muted-foreground">
        After all expenses
      </span>
    </div>
  </CardContent>
</Card>
```

#### Chat Interface
```tsx
// Chat message styling
<div className="chat-message">
  <div className="flex gap-3">
    <Avatar className="w-8 h-8">
      <AvatarFallback className="bg-primary text-primary-foreground">
        AI
      </AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <div className="prose prose-invert max-w-none">
        {/* Markdown content */}
      </div>
      <div className="mt-4 space-y-4">
        {/* UI Blocks */}
      </div>
    </div>
  </div>
</div>
```

#### Comparison Tables
```tsx
<Table>
  <TableHeader>
    <TableRow className="border-border">
      <TableHead className="text-muted-foreground">Scenario</TableHead>
      <TableHead className="text-right text-muted-foreground">
        Monthly Cost
      </TableHead>
      <TableHead className="text-right text-muted-foreground">
        10-Year Total
      </TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium">Rent</TableCell>
      <TableCell className="text-right text-destructive">
        -800 €
      </TableCell>
      <TableCell className="text-right">96,000 €</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### Status Indicators
```tsx
// Simulation status badges
const statusVariants = {
  FRESH: "bg-success/10 text-success border-success/20",
  STALE: "bg-warning/10 text-warning border-warning/20", 
  LOCKED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
} as const;

<Badge variant="outline" className={statusVariants.FRESH}>
  <CheckCircle className="w-3 h-3 mr-1" />
  Fresh
</Badge>
```

### Animation System

#### Micro-Interactions
```css
/* Hover states */
.interactive-element {
  @apply transition-all duration-150 ease-out;
}

.interactive-element:hover {
  @apply scale-[1.02] shadow-lg;
}

/* Focus states */
.interactive-element:focus-visible {
  @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;
}

/* Loading states */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

#### Page Transitions
```css
/* View transitions */
.page-transition {
  animation: slideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Layout Patterns

#### Grid System
```css
/* Main application grid */
.app-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  grid-template-rows: 64px 1fr;
  height: 100vh;
}

.sidebar {
  grid-row: 1 / -1;
  border-right: 1px solid hsl(var(--border));
}

.header {
  grid-column: 2;
  border-bottom: 1px solid hsl(var(--border));
}

.main {
  grid-column: 2;
  overflow: auto;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .app-layout {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    display: none;
  }
}
```

#### Card Layouts
```tsx
// Metric card grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <MetricCard />
  <MetricCard />
  <MetricCard />
</div>

// Comparison layout
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <Card>
    <CardHeader>
      <CardTitle>Rent Scenario</CardTitle>
    </CardHeader>
    <CardContent>{/* Content */}</CardContent>
  </Card>
  
  <Card>
    <CardHeader>
      <CardTitle>Buy Scenario</CardTitle>
    </CardHeader>
    <CardContent>{/* Content */}</CardContent>
  </Card>
</div>
```

### Icon System

#### Primary Icon Set (Lucide React)
```typescript
export const icons = {
  // Navigation
  home: Home,
  settings: Settings,
  user: User,
  
  // Financial
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  dollarSign: DollarSign,
  calculator: Calculator,
  
  // Actions
  plus: Plus,
  edit: Edit,
  trash: Trash2,
  copy: Copy,
  
  // Status
  check: Check,
  x: X,
  alert: AlertTriangle,
  info: Info,
  
  // AI/Chat
  bot: Bot,
  messageSquare: MessageSquare,
  sparkles: Sparkles,
} as const;
```

### Accessibility Standards

#### Color Contrast Ratios
- Text on background: Minimum 7:1 (AAA level)
- Interactive elements: Minimum 4.5:1 (AA level)
- Status indicators: Minimum 3:1 with additional icons

#### Focus Management
```css
/* High contrast focus rings */
.focus-ring {
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2;
}

/* Skip links */
.skip-link {
  @apply sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50;
  @apply bg-background text-foreground px-4 py-2 rounded-md border;
}
```

### Development Guidelines

#### Component Structure
```tsx
// Standard component pattern
export interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "secondary" | "destructive";
  size?: "sm" | "md" | "lg";
}

export const Component = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "component-base",
          componentVariants({ variant, size }),
          className
        )}
        {...props}
      />
    );
  }
);
```

#### Style Organization
```
styles/
├── globals.css          # Base styles, CSS variables
├── components/          # Component-specific styles
├── utilities/           # Tailwind utilities
└── animations/          # Animation keyframes
```

### Quality Assurance

#### Visual Testing
- Screenshot testing with Chromatic
- Cross-browser compatibility checks
- Responsive design verification
- Dark mode consistency validation

#### Performance Standards
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1
- Time to Interactive: <3.5s