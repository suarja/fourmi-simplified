# Senior Software Architect Brief: Foundational UI Layout Implementation

## Your Role
You are a Senior Software Architect tasked with implementing the foundational UI layout for Fourmi, a financial copilot application. You must create a production-ready, scalable foundation that will support both form-based and chat-based interactions.

## Critical Context Documents
Before proceeding, you MUST review these documents in order:
1. `/docs/product/PRD.md` - Product vision and three-tier business model
2. `/docs/guidelines/UI_UX_SPEC.md` - User experience specifications
3. `/docs/guidelines/DESIGN_SYSTEM.md` - Design system and component patterns
4. `/docs/technical/ARCHITECTURE.md` - Technical architecture (Clean Architecture + DDD)
5. `/docs/technical/DOMAIN.md` - Domain model and bounded contexts
6. `/docs/guidelines/ui-ux-guidelines-jason-suarez.md` - UI/UX implementation guidelines

## Technical Stack
- **Framework**: Next.js 15 with App Router
- **UI Components**: ShadCN UI (already installed - see `/src/components/ui/`)
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React Query via TRPC
- **Forms**: React Hook Form with Zod validation
- **Database**: Prisma with PostgreSQL

## Primary Objective
Create the foundational UI layout that serves as the backbone for all user interactions, with special focus on the onboarding flow and budget creation feature.

## Architectural Requirements

### 1. Layout Structure
Create a flexible, composable layout system in `/src/app/layout.tsx` and supporting layouts that:
- Implements a responsive shell with navigation
- Supports multiple view modes (form view, chat view, hybrid view)
- Has clear zones for: navigation, main content, auxiliary panels
- Follows the design inspiration from `/docs/design-inspiration/layout-inspiration.webp`

### 2. User Onboarding Flow
Implement the critical first-user experience:

```typescript
// User Journey States
type UserJourneyState = 
  | 'new_visitor'           // No profile exists
  | 'profile_incomplete'     // Profile started but not finished
  | 'profile_complete'       // Profile done, no budget
  | 'budget_in_progress'     // Budget creation started
  | 'active_user'           // Has profile and at least one budget
```

Create components in `/src/components/onboarding/`:
- `ProfileCreationCard.tsx` - Initial profile setup
- `BudgetCreationWizard.tsx` - Multi-step budget creation
- `OnboardingOrchestrator.tsx` - Manages the flow

### 3. Budget Feature Foundation
The budget feature is the core value proposition. Structure it as:

```typescript
// /src/features/budget/
├── components/
│   ├── BudgetForm.tsx        // Traditional form interface
│   ├── BudgetCard.tsx        // Display component
│   └── BudgetSummary.tsx     // Overview component
├── hooks/
│   ├── useBudgetState.ts     // Local state management
│   └── useBudgetSync.ts      // TRPC sync
└── types/
    └── budget.types.ts        // Type definitions
```

### 4. Form-to-Chat Abstraction Layer
Design components with future chat integration in mind:

```typescript
// Every form input should be abstractable to a chat message
interface ChatCompatibleInput<T> {
  // Traditional form mode
  renderAsFormField(): ReactElement;
  
  // Chat interface mode
  renderAsChatPrompt(): ReactElement;
  
  // Validation and state
  value: T;
  onChange: (value: T) => void;
  validate: (value: T) => ValidationResult;
}
```

### 5. Navigation and Routing
Implement smart navigation that adapts to user state:

```typescript
// /src/components/navigation/SmartNav.tsx
- Shows different options based on UserJourneyState
- Highlights current section
- Provides quick actions
- Mobile-responsive with sheet/drawer pattern
```

## Implementation Phases

### Phase 1: Shell and Layout (PRIORITY)
1. Create the main application shell with responsive layout
2. Implement the navigation system
3. Set up routing structure for main features
4. Add loading and error boundaries

### Phase 2: Onboarding Components
1. Build ProfileCreationCard with form validation
2. Create BudgetCreationWizard with step progression
3. Implement OnboardingOrchestrator for flow management
4. Add progress indicators and state persistence

### Phase 3: Budget Feature
1. Implement BudgetForm with comprehensive validation
2. Create budget display components
3. Add TRPC endpoints for budget CRUD operations
4. Implement real-time sync with optimistic updates

### Phase 4: Polish and Optimization
1. Add animations and transitions
2. Implement keyboard navigation
3. Add accessibility features (ARIA labels, focus management)
4. Optimize bundle size and performance

## Design Principles to Follow

1. **Progressive Disclosure**: Start simple, reveal complexity as needed
2. **Optimistic UI**: Update immediately, sync in background
3. **Mobile-First**: Design for mobile, enhance for desktop
4. **Accessibility**: WCAG 2.1 AA compliance minimum
5. **Performance**: Target INP < 200ms, LCP < 2.5s

## Component Patterns to Use

### Card-Based Forms
```tsx
<Card>
  <CardHeader>
    <CardTitle>Create Your Budget</CardTitle>
    <CardDescription>Let's set up your financial plan</CardDescription>
  </CardHeader>
  <CardContent>
    <Form {...form}>
      {/* Form fields */}
    </Form>
  </CardContent>
  <CardFooter>
    <Button>Continue</Button>
  </CardFooter>
</Card>
```

### Multi-Step Wizards
```tsx
<Tabs value={currentStep} className="w-full">
  <TabsList className="grid grid-cols-4">
    <TabsTrigger value="income">Income</TabsTrigger>
    <TabsTrigger value="expenses">Expenses</TabsTrigger>
    <TabsTrigger value="goals">Goals</TabsTrigger>
    <TabsTrigger value="review">Review</TabsTrigger>
  </TabsList>
  {/* Tab contents */}
</Tabs>
```

## File Structure to Create

```
/src/
├── app/
│   ├── (auth)/
│   │   ├── onboarding/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── budget/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── layout.tsx (update existing)
├── components/
│   ├── navigation/
│   │   ├── SmartNav.tsx
│   │   ├── MobileNav.tsx
│   │   └── DesktopNav.tsx
│   ├── onboarding/
│   │   ├── ProfileCreationCard.tsx
│   │   ├── BudgetCreationWizard.tsx
│   │   └── OnboardingOrchestrator.tsx
│   └── layout/
│       ├── AppShell.tsx
│       └── ContentContainer.tsx
├── features/
│   └── budget/
│       ├── components/
│       ├── hooks/
│       └── types/
└── lib/
    └── user-journey.ts

```

## TRPC Router Updates Needed

```typescript
// /src/server/routers/user.ts
export const userRouter = router({
  getJourneyState: publicProcedure.query(/* ... */),
  createProfile: publicProcedure.mutation(/* ... */),
  updateProfile: protectedProcedure.mutation(/* ... */),
});

// /src/server/routers/budget.ts
export const budgetRouter = router({
  create: protectedProcedure.mutation(/* ... */),
  update: protectedProcedure.mutation(/* ... */),
  list: protectedProcedure.query(/* ... */),
  getById: protectedProcedure.query(/* ... */),
});
```

## Success Criteria
1. ✅ User can complete onboarding in < 2 minutes
2. ✅ Forms are fully keyboard navigable
3. ✅ All interactions have loading and error states
4. ✅ Mobile experience is fluid and native-feeling
5. ✅ Code is modular and ready for chat interface integration
6. ✅ TypeScript types are comprehensive with no `any`
7. ✅ Components follow ShadCN patterns consistently

## Important Notes
- Every form component must be designed to work in both traditional and chat modes
- Use ShadCN components as the foundation - don't recreate what exists
- Follow the existing project structure and patterns
- Ensure all database operations go through TRPC
- Keep components pure and side-effect free
- Document complex business logic inline

## References
- ShadCN UI Docs: https://ui.shadcn.com
- Next.js App Router: https://nextjs.org/docs/app
- TRPC with App Router: Review `/src/app/api/trpc/[trpc]/route.ts`
- Existing UI Components: `/src/components/ui/`

Begin by implementing the Phase 1 shell and layout, ensuring it provides a solid foundation for all subsequent features.