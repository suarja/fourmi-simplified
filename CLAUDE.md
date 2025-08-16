# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Fourmi** is a chat-first financial copilot that helps households escape debt traps and make informed real estate decisions. Built with Convex + Chef for rapid MVP development.

**Core Mission**: Fighting consumer debt traps with accessible financial tools. Three-tier model:
1. **FREE**: Basic monthly budget tracking (income/expenses/loans)
2. **PAID**: Real estate projects (rent vs buy decisions)  
3. **PREMIUM**: Multiple simulations and comparisons

## Communication Protocol

**COMMIT MESSAGE POLICY**: 
- Do NOT add Claude Code attribution or co-authorship to git commit messages
- Do NOT include "🤖 Generated with [Claude Code]" or "Co-Authored-By: Claude" 
- Keep commits clean and professional without any AI tool references
- Focus on technical changes and business impact only

## Technology Stack (Simplified with Convex)

### Core Framework
- **Vite + React** - Fast development with HMR
- **TypeScript** - Type safety throughout
- **Convex** - Real-time backend, database, file storage
- **Clerk Authentication** - User authentication and management
- **Tailwind CSS** - Styling with dark theme
- **AI SDK** - OpenAI integration for fact extraction

### Fully Integrated
- **Schematic** - ✅ Complete billing system with subscription management
- **Clerk** - ✅ User authentication and profile management
- **i18next** - ✅ Internationalization with French/English support
- **ShadCN/ui** - Component library (partially implemented)
- **Vitest** - Testing framework (config ready, tests to be written)

### MCP Server Integration
- **ShadCN/ui MCP** - Access to component library via `mcp__shadcn-ui__*` tools
- **Supabase MCP** - Database operations via `mcp__supabase__*` tools  
- **Convex MCP** - Backend management via `mcp__convex__*` tools
- **ByteRover Memory** - Shared knowledge layer via `mcp__byterover-mcp__*` tools

## Convex Architecture (Simplified Approach)

### Current Structure
```
convex/
├── schema.ts          # Database schema definitions
├── profiles.ts        # Profile management functions
├── conversations.ts   # Chat conversation handling
├── ai.ts             # AI integration (fact extraction, advice)
├── lib/              # Business logic layer ✅ IMPLEMENTED
│   ├── validation.ts # Input validation, duplicate checks
│   ├── debtConsolidation.ts # Debt consolidation calculations
│   └── financial.ts  # Financial calculations
└── domain/           # Domain logic ✅ IMPLEMENTED
    ├── facts.ts      # Fact validation system
    ├── agents.ts     # Agent definitions and exports
    └── projects.ts   # Project management types
```

### Key Patterns
- **Convex Functions**: Mutations, queries, and actions
- **Real-time Updates**: Automatic reactivity with useQuery
- **File Storage**: Built-in file handling for CSV uploads
- **AI Actions**: Node.js runtime for OpenAI integration
- **Human-in-the-Loop**: Pending facts → user validation → save
- **Shared Memory**: ByteRover MCP for persistent knowledge across sessions

## Common Commands

### Development
```bash
# Start both frontend and backend
npm run dev

# Start frontend only
npm run dev:frontend

# Start Convex backend only
npm run dev:backend

# Build for production
npm run build

# Lint and type check
npm run lint
```

### Convex Commands
```bash
# Deploy to production
npx convex deploy

# Run Convex dev server
npx convex dev

# View Convex dashboard
npx convex dashboard

# Run a function manually
npx convex run profiles:createProfile

# Clear database (dev only)
npx convex run --push reset:clearAll
```

### Testing (To Be Implemented)
```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### MCP Tools Usage

#### ByteRover Memory Management
```bash
# Always retrieve context before tasks
mcp__byterover-mcp__byterover-retrieve-knowledge --query "Fourmi architecture business logic"

# Store critical information after successful tasks
mcp__byterover-mcp__byterover-store-knowledge --messages "Implemented fact validation workflow with duplicate prevention"
```

#### Convex Development
```bash
# Check project status and deployments
mcp__convex__status --projectDir "/Users/suarja/App/2025/fourmi-simplified"

# View function metadata
mcp__convex__functionSpec --deploymentSelector "dev"

# Run functions manually
mcp__convex__run --functionName "profiles:createProfile" --args "{}"
```

#### ShadCN/ui Integration
```bash
# List available components
mcp__shadcn-ui__list_components

# Get component source
mcp__shadcn-ui__get_component --componentName "card"

# Get component demo
mcp__shadcn-ui__get_component_demo --componentName "form"
```

## Development Guidelines

### Financial Calculations
- **Use cents for money storage** (avoid floating point errors)
- **Validate inputs** before calculations (positive amounts, realistic ranges)
- **Deterministic results** - same inputs must produce same outputs
- **Test edge cases** - zero amounts, negative balances, etc.

### Convex Best Practices
- **Mutations** for data changes (createProfile, addIncome)
- **Queries** for data fetching (getMonthlyBalance)
- **Actions** for AI operations and external APIs (processFinancialMessage)
- **Real-time subscriptions** - useQuery automatically updates UI
- **File storage** - use generateUploadUrl for secure uploads

### AI Integration
- **Fact extraction with validation** - Extract → Pending → Confirm → Save
- **Duplicate prevention** - Check existing data before adding
- **Low temperature (0.2)** for accurate extraction
- **Structured outputs** using Zod schemas
- **User feedback** - Always show what was extracted

### Convex Agents (CRITICAL RULES)
- **⚠️ ALWAYS check documentation first** - Read `/docs/technical/CONVEX_AGENTS.md` and stored knowledge before implementing
- **Agent Declaration** - Declare agents at MODULE LEVEL, NOT inside action handlers
- **Export for Playground** - Always export agents (e.g., `export const financialAgent`) for playground integration
- **Reuse Agents** - Never create `new Agent()` inside action handlers (inefficient, wrong pattern)
- **Correct API Syntax** - Follow exact patterns from documentation for `generateText()`, `createThread()`, etc.
- **Tool Integration** - Add tools to agent constructor, not action handlers
- **Version Compatibility** - AI SDK v4, not v5 (see documentation for exact versions)

### Memory & Knowledge Management
- **Always retrieve context** before starting complex tasks
- **Store critical implementations** after successful completion
- **Include code snippets** in stored knowledge for reusability
- **Capture architectural decisions** and reasoning
- **Document error patterns** and solutions

### Data Validation
```typescript
// Example validation in convex/lib/validation.ts
export function validateAmount(amount: number): boolean {
  return amount > 0 && amount < 1000000; // Max 1M euros
}

export function validateInterestRate(rate: number): boolean {
  return rate >= 0 && rate <= 0.5; // 0-50% max
}
```

## Current Implementation Status

### ✅ Completed
- ✅ User authentication and profile management (Clerk integration)
- ✅ Income, expense, and loan tracking with full CRUD operations
- ✅ AI-powered fact extraction with pending validation system
- ✅ CSV file upload processing
- ✅ Real-time financial dashboard with drag-and-drop components
- ✅ Monthly balance calculations and financial summaries
- ✅ **Schematic billing system** - Complete subscription management
- ✅ Convex Agents with specialized financial tools
- ✅ Project system with debt consolidation analysis
- ✅ Thread-to-project linking for chat-to-canvas switching
- ✅ Duplicate prevention for financial entries
- ✅ React Router implementation with documentation system
- ✅ **Internationalization (French/English)** - Language switcher and translation system

### 🚧 In Progress
- Comprehensive fact validation UI (backend complete, UI refinements)
- Complete ShadCN/ui component migration

### 📋 TODO
- Write comprehensive test suite (Vitest config ready)
- Implement real estate projects (PAID tier)
- Create multiple simulations and comparisons (PREMIUM tier)
- Deploy to production with CI/CD pipeline

## Key Business Logic

### Three-Tier Value Proposition
1. **FREE Tier**: Basic monthly budget tracking (income/expenses/loans)
2. **PAID Tier**: Real estate projects (rent vs buy decisions)
3. **PREMIUM Tier**: Multiple simulations and comparisons

### Core Workflow
1. User chats with Fourmi
2. AI extracts financial facts
3. User validates facts (pending → confirmed)
4. System stores validated data
5. Dashboard shows real-time calculations

### Financial Formulas

```typescript
// PMT (Monthly Payment) Formula
function calculateMonthlyPayment(
  principal: number,  // in cents
  rate: number,       // annual rate (0.035 = 3.5%)
  years: number
): number {
  const monthlyRate = rate / 12;
  const months = years * 12;
  if (monthlyRate === 0) return principal / months;
  
  return principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
    (Math.pow(1 + monthlyRate, months) - 1);
}
```

## Common Pitfalls to Avoid

### Current Issues to Fix
- ❌ No comprehensive test coverage (config ready, tests to be written)
- ❌ Incomplete ShadCN/ui migration (some components still custom)
- ❌ No production deployment pipeline
- ❌ Component strings need full translation extraction (basic implementation done)

### Best Practices
- ✅ Store money in cents (avoid floating point errors)
- ✅ Validate all inputs (positive amounts, realistic ranges)
- ✅ Show pending facts for user confirmation
- ✅ Check for duplicates before adding data
- ✅ Provide edit/delete capabilities

## Social Impact Focus

Remember: This isn't just a financial tool. We're fighting consumer debt traps created by $4B+ annual credit company marketing. The free tier must genuinely help people escape debt, while paid tiers fund the mission.

Always prioritize:
1. **Clarity over complexity** - plain language, no jargon
2. **Empowerment over intimidation** - build confidence
3. **Education over exploitation** - help users understand
4. **Accessibility over exclusivity** - free tier must be valuable[byterover-mcp]

# important 
always use byterover-retrive-knowledge tool to get the related context before any tasks 
always use byterover-store-knowledge to store all the critical informations after sucessful tasks