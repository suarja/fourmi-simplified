# UI Layout Implementation - Visual Interface Only

## Your Task
Create the visual interface and layout for Fourmi. Focus ONLY on the UI components, styling, and layout structure. No business logic, no API calls, no complex state management - just beautiful, responsive UI.

## What You're Building
A modern financial application interface with:
- Clean, professional design
- Mobile-responsive layout
- Smooth transitions
- Clear visual hierarchy

## Design Inspiration - IMPORTANT
Study these design files carefully for visual direction:
- `/docs/design-inspiration/layout-inspiration.webp` - Main application layout with sidebar and content areas
- `/docs/design-inspiration/chat-resume-inspiration.webp` - Clean card-based interfaces and information hierarchy
- `/docs/design-inspiration/simulator-inspiration.webp` - Dashboard widgets and data visualization
- `/docs/design-inspiration/landing-chat-inspiration.webp` - Welcome screen and onboarding flow
- `/docs/design-inspiration/columns-inspiration.webp` - Multi-column responsive layouts
- `/docs/design-inspiration/gpt-inspiration.webp` - Clean, minimal interface patterns
- `/docs/design-inspiration/coding-assistant-inspiration.webp` - Form layouts and input patterns
- `/docs/design-inspiration/code-exuction-inspiration.webp` - Result displays and feedback states

**Key Visual Patterns from Images:**
- Clean white/light backgrounds with subtle shadows
- Card-based information grouping
- Clear visual hierarchy with proper spacing
- Sidebar navigation for desktop
- Minimal color palette with blue accents
- Rounded corners and soft edges
- Clear CTAs with proper contrast

## Available UI Components
You have ShadCN UI already installed in `/src/components/ui/`:
- Button, Card, Input, Label, Form
- Dialog, Sheet, Tabs, Accordion
- Table, Avatar, Badge, Progress
- Select, Calendar, Tooltip
- And more...

## Create These UI Pages

### 1. Main Application Shell
**Entry Path**: `/platform` is the entry point for the app UI

**File**: `/src/app/platform/layout.tsx`

Optional: Keep a minimal root layout in `/src/app/layout.tsx` and add a redirect from `/` to `/platform`.

```tsx
// Create a clean shell with:
- Top navigation bar with logo and user menu
- Mobile hamburger menu
- Main content area with proper padding
- Optional sidebar for desktop
```

Visual Structure:
```
┌─────────────────────────────────────┐
│  Logo    Navigation          User   │  <- Header
├─────────────────────────────────────┤
│  │                            │      │
│  │      Main Content         │ Side │  <- Body
│  │                            │ bar  │
│  │                            │      │
└─────────────────────────────────────┘
```

### 2. Landing/Dashboard Page
**File**: `/src/app/platform/page.tsx`

Create a dashboard with:
```tsx
// Visual elements only:
- Welcome message card
- Quick stats cards (3-4 metrics)
- Recent activity list
- Action buttons (Create Budget, View Reports)
- Empty states with nice illustrations
```

Example Layout:
```tsx
<div className="container mx-auto p-6 space-y-6">
  {/* Welcome Section */}
  <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
    <h1 className="text-2xl font-bold">Welcome back, User!</h1>
    <p className="text-gray-600">Here's your financial overview</p>
  </Card>

  {/* Stats Grid */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card className="p-4">
      <div className="text-sm text-gray-500">Monthly Budget</div>
      <div className="text-2xl font-bold">$5,000</div>
      <div className="text-xs text-green-600">↑ 12% from last month</div>
    </Card>
    {/* More stat cards... */}
  </div>

  {/* Quick Actions */}
  <div className="flex gap-4 flex-wrap">
    <Button size="lg" className="gap-2">
      <Plus className="w-4 h-4" />
      Create Budget
    </Button>
    <Button size="lg" variant="outline">
      View Reports
    </Button>
  </div>
</div>
```

### 3. Budget Creation Page
**File**: `/src/app/platform/budget/new/page.tsx`

Multi-step form UI (visual only):
```tsx
// Step indicator at top
// Card-based form sections
// Progress bar
// Navigation buttons

<div className="max-w-4xl mx-auto p-6">
  {/* Progress Steps */}
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center">
      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">1</div>
      <div className="w-20 h-1 bg-blue-600"></div>
    </div>
    {/* More steps... */}
  </div>

  {/* Form Card */}
  <Card className="p-8">
    <CardHeader>
      <CardTitle>Set Up Your Income</CardTitle>
      <CardDescription>Tell us about your income sources</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Income Source</Label>
          <Input placeholder="e.g., Salary" />
        </div>
        <div>
          <Label>Monthly Amount</Label>
          <Input type="number" placeholder="0.00" />
        </div>
      </div>
      {/* More form fields... */}
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button variant="outline">Previous</Button>
      <Button>Continue</Button>
    </CardFooter>
  </Card>
</div>
```

### 4. Budget View Page
**File**: `/src/app/platform/budget/[id]/page.tsx`

Display budget information:
```tsx
// Visual breakdown of budget
// Charts/graphs placeholder
// Category cards
// Action buttons

<div className="container mx-auto p-6 space-y-6">
  {/* Summary Cards */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card className="p-6 border-l-4 border-green-500">
      <div className="text-sm text-gray-500">Income</div>
      <div className="text-3xl font-bold">$5,000</div>
    </Card>
    <Card className="p-6 border-l-4 border-orange-500">
      <div className="text-sm text-gray-500">Expenses</div>
      <div className="text-3xl font-bold">$3,500</div>
    </Card>
    <Card className="p-6 border-l-4 border-blue-500">
      <div className="text-sm text-gray-500">Savings</div>
      <div className="text-3xl font-bold">$1,500</div>
    </Card>
  </div>

  {/* Visual Budget Breakdown */}
  <Card className="p-6">
    <CardHeader>
      <CardTitle>Budget Breakdown</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Housing</span>
            <span className="text-sm font-semibold">$1,500</span>
          </div>
          <Progress value={30} className="h-2" />
        </div>
        {/* More categories... */}
      </div>
    </CardContent>
  </Card>
</div>
```

### 5. Onboarding Flow
**File**: `/src/app/(auth)/onboarding/page.tsx`

Welcome screens for new users:
```tsx
// Clean, inviting design
// Step-by-step cards
// Illustrations/icons
// Clear CTAs

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
  <Card className="w-full max-w-md p-8">
    <div className="text-center mb-6">
      <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
        <DollarSign className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-2xl font-bold">Welcome to Fourmi</h1>
      <p className="text-gray-600 mt-2">Your personal financial copilot</p>
    </div>
    
    <div className="space-y-4">
      <Button className="w-full" size="lg">
        Get Started
      </Button>
      <Button variant="outline" className="w-full" size="lg">
        I already have an account
      </Button>
    </div>
  </Card>
</div>
```

### 6. Navigation Component
**File**: `/src/components/navigation/MainNav.tsx`

```tsx
// Desktop navigation bar
// Mobile drawer/sheet
// User menu dropdown
// Active state indicators

export function MainNav() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold">Fourmi</h1>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex gap-6">
              <Link href="/dashboard" className="text-sm font-medium hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/budget" className="text-sm font-medium hover:text-blue-600">
                Budgets
              </Link>
              <Link href="/reports" className="text-sm font-medium hover:text-blue-600">
                Reports
              </Link>
            </div>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
```

## Color Palette & Styling

Use these Tailwind classes for consistency:

```css
/* Primary Actions */
bg-blue-600 hover:bg-blue-700

/* Success States */
bg-green-50 text-green-600 border-green-500

/* Warning States */
bg-orange-50 text-orange-600 border-orange-500

/* Error States */
bg-red-50 text-red-600 border-red-500

/* Neutral/Background */
bg-gray-50 bg-gray-100 bg-white

/* Text */
text-gray-900 (headings)
text-gray-600 (body)
text-gray-500 (subtle)
```

## Mobile Responsiveness

Every component should work on mobile:
- Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for grids
- Hide/show elements with `hidden md:block`
- Stack elements on mobile with `flex-col md:flex-row`
- Proper padding: `p-4 md:p-6 lg:p-8`

## Component States to Show

For each interactive element, create these visual states:
- Default
- Hover
- Active/Selected
- Disabled
- Loading (use Skeleton components)
- Empty (nice placeholder content)

## Mock Data to Use

Use realistic placeholder data:
```tsx
const mockBudget = {
  income: 5000,
  expenses: {
    housing: 1500,
    food: 600,
    transport: 400,
    utilities: 200,
    entertainment: 300,
    savings: 1000,
    other: 500
  }
};

const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  memberSince: "January 2024"
};
```

## What NOT to Do
- No API calls or TRPC
- No complex state management
- No business logic or calculations
- No authentication logic
- No database operations

## Success Criteria
✅ All pages look professional and polished
✅ Mobile responsive (test at 375px, 768px, 1024px)
✅ Consistent spacing and typography
✅ Loading and empty states included
✅ Smooth hover effects and transitions
✅ Follows the design system colors
✅ Uses ShadCN components consistently

## File Structure to Create
```
/src/
├── app/
│   ├── (auth)/
│   │   └── onboarding/
│   │       └── page.tsx
│   ├── platform/
│   │   ├── page.tsx
│   │   └── budget/
│   │       ├── new/
│   │       │   └── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   └── layout.tsx (root; minimal, optional redirect from `/` → `/platform`)
└── components/
    └── navigation/
        └── MainNav.tsx
```

Start with the layout and navigation, then build each page. Focus on making it look beautiful and professional. The functionality will come later.