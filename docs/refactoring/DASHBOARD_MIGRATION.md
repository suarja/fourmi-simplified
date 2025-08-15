# Financial Dashboard Refactoring Migration

## Overview
This document tracks the migration from a monolithic `FinancialDashboard.tsx` component (530+ lines) to a modular, maintainable architecture with inline editing capabilities.

## Migration Goals
- ✅ Break down monolithic component into focused, reusable cards
- ✅ Add inline editing for all financial items (income, expenses, loans)
- ✅ Implement AI insights persistence
- ✅ Extract business logic into custom hooks
- ✅ Maintain drag & drop functionality
- ✅ Preserve all existing features

## Before State
```
src/components/financial-dashboard/
├── FinancialDashboard.tsx      # 530+ lines - everything mixed together
├── PendingFactsCard.tsx        # Already extracted
└── DeleteButton.tsx            # Already extracted
```

## Target Architecture
```
src/components/financial-dashboard/
├── FinancialDashboard.tsx           # Main orchestrator (50-100 lines)
├── cards/
│   ├── BalanceCard.tsx             # Monthly balance (non-editable)
│   ├── InsightsCard.tsx            # AI insights (non-editable) 
│   ├── IncomeCard.tsx              # Income sources with inline editing
│   ├── ExpensesCard.tsx            # Expenses with inline editing  
│   ├── LoansCard.tsx               # Loans with inline editing
│   └── EmptyStateCard.tsx          # No data state
├── hooks/
│   ├── useFinancialData.ts         # Data fetching
│   ├── useComponentOrder.ts        # Drag & drop state
│   └── useEditableItems.ts         # Inline editing logic
├── shared/
│   ├── EditableItem.tsx            # Reusable inline edit component
│   └── types.ts                    # Shared TypeScript types
├── PendingFactsCard.tsx            # Existing
└── DeleteButton.tsx                # Existing
```

## Migration Steps

### ✅ Step 1: Documentation & Planning
- [x] Create this migration document
- [x] Set up todo tracking

### 🚧 Step 2: Component Extraction
- [ ] Extract BalanceCard component
- [ ] Extract InsightsCard component  
- [ ] Extract IncomeCard component
- [ ] Extract ExpensesCard component
- [ ] Extract LoansCard component
- [ ] Extract EmptyStateCard component

### 🚧 Step 3: Custom Hooks
- [ ] Create useFinancialData hook
- [ ] Create useComponentOrder hook
- [ ] Create useEditableItems hook

### 🚧 Step 4: Inline Editing System
- [ ] Build EditableItem shared component
- [ ] Add edit capabilities to Income card
- [ ] Add edit capabilities to Expenses card
- [ ] Add edit capabilities to Loans card
- [ ] Connect to existing backend mutations in `convex/domain/transactions.ts`

### 🚧 Step 5: AI Insights Persistence
- [ ] Add insights table to schema
- [ ] Create insights mutations/queries
- [ ] Implement insights persistence in InsightsCard
- [ ] Add data change detection for auto-regeneration

### 🚧 Step 6: Final Integration
- [ ] Update main FinancialDashboard to use new components
- [ ] Test drag & drop functionality
- [ ] Test inline editing across all cards
- [ ] Test AI insights persistence
- [ ] Code cleanup and optimization

## Key Decisions

### Inline Editing Pattern
```tsx
// Standard pattern for all editable cards
<EditableItem
  value={item}
  onSave={handleSave}
  onCancel={handleCancel}
  validationSchema={itemSchema}
  renderView={(item) => <ItemDisplay {...item} />}
  renderEdit={(item, onChange) => <ItemEditForm {...item} onChange={onChange} />}
/>
```

### Data Flow
1. **FinancialDashboard** - Main orchestrator, manages component order
2. **Individual Cards** - Focused on single responsibility 
3. **Custom Hooks** - Handle data fetching, editing, state management
4. **Shared Components** - Reusable UI patterns

### Non-Editable Components
- **BalanceCard** - Calculated from other data, not directly editable
- **InsightsCard** - AI-generated content, regenerated on data changes

## Commits Strategy
- Commit after each card component extraction
- Commit after each hook creation
- Commit after adding edit functionality to each card type
- Commit after insights persistence implementation
- Final cleanup commit

## Testing Checklist
- [ ] All drag & drop functionality works
- [ ] Inline editing works for income items
- [ ] Inline editing works for expense items  
- [ ] Inline editing works for loan items
- [ ] AI insights persist and regenerate on data changes
- [ ] Component order persists in localStorage
- [ ] All existing features maintained
- [ ] No performance regressions
- [ ] TypeScript compilation passes
- [ ] All tests pass

## Rollback Plan
Each step is independent and can be rolled back:
1. Keep original FinancialDashboard.tsx as backup
2. Each component extraction is additive
3. Progressive migration allows partial rollback
4. Git commits provide restore points

---

**Migration Started:** [Current Date]
**Estimated Completion:** 1-2 weeks
**Risk Level:** Low (additive changes, preserve existing functionality)