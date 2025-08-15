# Executive Summary: Fourmi UI Implementation Brief

## Quick Start for LLM
You are implementing Fourmi, a financial copilot that helps users escape debt traps through intelligent budget management. The application uses a dual-interface approach: traditional forms that can seamlessly transform into conversational chat interactions.

## Project Location
- **Repository**: `/Users/suarja/App/2025/fourmi/`
- **Documentation**: `/docs/`
- **Source Code**: `/src/`

## Core Mission
Build a financial copilot that fights the $4B consumer debt trap problem by providing accessible, intelligent budget management tools. Start with traditional forms, design for chat integration.

## Technical Foundation (Already Set Up)
- ✅ Next.js 15 with App Router
- ✅ TRPC for type-safe APIs
- ✅ ShadCN UI components installed
- ✅ Prisma ORM with PostgreSQL
- ✅ React Hook Form + Zod validation
- ✅ Tailwind CSS with custom design system

## Implementation Priority

### Phase 1: Foundation (Start Here)
Read: `/docs/prompts/01-foundational-ui-layout.md`

Create the application shell:
1. Responsive layout system
2. Smart navigation
3. User journey orchestration
4. Onboarding flow

### Phase 2: Core Feature
Read: `/docs/prompts/02-budget-form-implementation.md`

Implement budget creation:
1. Multi-step wizard
2. Income/expense collection
3. Validation and calculations
4. Review and summary

### Phase 3: Intelligence Layer (Future)
- Chat interface wrapper
- AI-assisted form filling
- Smart recommendations
- Real-time validation

## Key Design Decisions

### 1. Form-First, Chat-Ready
Every form component must be designed to work in both modes:
```typescript
// Bad: Tightly coupled to form UI
<Input name="income" type="number" />

// Good: Abstractable to chat
<ChatCompatibleInput
  mode={interfaceMode}
  field="income"
  validation={incomeSchema}
/>
```

### 2. Progressive Disclosure
Start simple, reveal complexity:
- New user sees: Simple budget creation
- Power user sees: Advanced options, projections
- All users get: Contextual help via AI

### 3. State Management Strategy
- Local state for form data
- TRPC for server sync
- Optimistic updates for responsiveness
- Auto-save drafts every 30 seconds

## File Structure You'll Create
```
/src/
├── app/
│   ├── (auth)/onboarding/    # New user flow
│   ├── (dashboard)/           # Main app
│   │   └── budget/           # Budget feature
│   └── layout.tsx            # Update existing
├── components/
│   ├── navigation/           # Smart navigation
│   ├── onboarding/          # Onboarding components
│   └── layout/              # Layout components
└── features/
    └── budget/              # Budget domain
        ├── components/      # UI components
        ├── hooks/          # State management
        └── types/          # TypeScript types
```

## Critical Success Factors
1. **User can create budget in < 5 minutes**
2. **Forms work perfectly on mobile**
3. **Every action has loading/error states**
4. **Components ready for chat mode**
5. **TypeScript fully typed (no `any`)**

## Essential Reading Order
1. `/docs/product/PRD.md` - Understand the mission
2. `/docs/guidelines/UI_UX_SPEC.md` - User experience goals
3. `/docs/technical/ARCHITECTURE.md` - Technical structure
4. `/docs/prompts/01-foundational-ui-layout.md` - Start implementation
5. `/docs/prompts/02-budget-form-implementation.md` - Core feature

## Remember
- **Design for both modes**: Every form should be chat-compatible
- **Use existing components**: ShadCN UI is already set up
- **Follow the architecture**: Clean Architecture + DDD principles
- **Think mobile-first**: Most users will be on phones
- **Build for scale**: This is a foundation, not a prototype

## Start Command
```bash
# Development server is ready
pnpm dev

# Your task: Implement Phase 1 from prompt 01
# Location: /src/app/ and /src/components/
```

Begin with the foundational layout. The success of the entire application depends on getting this right.