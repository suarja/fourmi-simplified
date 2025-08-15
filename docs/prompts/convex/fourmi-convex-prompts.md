# Fourmi Convex Chef Prompts

This file contains the complete prompt strategy for building Fourmi's backend with Convex Chef. Each prompt is designed to be concise (300 words max) and build upon the previous one.

---

## Executive Context (Give this context before the first prompt)

**Fourmi Financial Copilot** - Chat-first app helping people escape debt traps. Like having a personal Excel spreadsheet but with an AI copilot making it easy to create and maintain. NOT an expense tracker - just monthly fixed income/expenses like "charges fixes" in French.

**Three user tiers:**
1. **FREE**: Basic spreadsheet (monthly income/expenses/loans) - fights debt traps
2. **PAID**: Real estate projects (rent vs buy decisions)  
3. **PREMIUM**: Multiple simulations and comparisons

**Core flow**: User chats → AI extracts financial facts → Validates with user → Stores structured data → Shows calculations in UI blocks

**UI Style**: Dark theme chat interface like Cursor or ChatGPT. Chat on left, results as cards in conversation.

**Tech focus**: Convex reactive backend, TypeScript functions, real-time updates when data changes.

Start with Layer 1: The foundational financial profile.

---

## Prompt 1: Financial Profile Foundation (FREE Tier)

Build a digital monthly budget spreadsheet. Users create it through chat OR upload existing CSV. Focus on fixed monthly amounts, not daily expense tracking.

**Convex Schema:**
```typescript
profiles: {
  userId: string
  name: string  
  type: "solo" | "couple"
  created: number
}

incomes: {
  profileId: Id<"profiles">
  label: string // "Salary", "Rental income"
  amount: number // cents for precision
  isMonthly: boolean // false = annual
}

expenses: {
  profileId: Id<"profiles">
  category: string // "Housing", "Food", "Transport"
  label: string
  amount: number // monthly amount in cents
}

loans: {
  profileId: Id<"profiles">
  type: "credit_card" | "personal" | "mortgage" | "auto"
  name: string
  monthlyPayment: number
  interestRate: number // 0.035 = 3.5%
  remainingBalance: number
  remainingMonths: number
}
```

**Core Functions:**
- `createProfile(userId, name, type)` - Initialize profile
- `addIncome(profileId, label, amount)` - Add income source
- `addExpense(profileId, category, label, amount)` - Add monthly expense
- `addLoan(profileId, loanData)` - Add loan details
- `getMonthlyBalance(profileId)` - Calculate: incomes - expenses - loans
- `importCSV(profileId, csvData)` - Parse uploaded spreadsheet

**Chat Integration:**
When user says "I earn 3000€/month, rent is 800€", extract facts, show validation card, save to database.

**UI Blocks in Chat:**
- Monthly balance card (green/red based on positive/negative)
- Income/expense breakdown table
- Loan summary with total monthly payments
- Simple spreadsheet view

Start by creating the schema and mutation for createProfile.

---

## Prompt 2: Real Estate Projects (PAID Tier)

Add property project planning for users considering buying or renting. Links to profiles from Layer 1 to check affordability.

**Convex Schema:**
```typescript
projects: {
  profileId: Id<"profiles">
  name: string // "House in Montpellier"
  type: "buy" | "rent"
  location: { country: string, city: string }
  
  // For buying
  purchasePrice?: number
  downPayment?: number
  loanTermYears?: number
  mortgageRate?: number
  propertyTaxAnnual?: number
  maintenancePercent?: number // 1% = 0.01
  
  // For renting
  monthlyRent?: number
  rentIncreasePercent?: number // annual
}

assumptions: {
  projectId: Id<"projects">
  tier: "conservative" | "moderate" | "optimistic"
  propertyAppreciation: number // annual %
  maintenanceCost: number // annual % of value
  vacancyRate?: number // for rental properties
}
```

**Core Functions:**
- `createProject(profileId, projectData)` - New property project
- `calculateMortgagePayment(principal, rate, years)` - PMT formula
- `calculateAffordability(profileId, projectId)` - Can user afford based on income?
- `projectTotalCost(projectId, years)` - Total cost over time horizon
- `getRentVsBuyComparison(projectId, rentAmount, years)` - Basic comparison

**Chat Flow:**
User: "I want to buy a 300k€ house with 50k€ down"
AI: Creates project, calculates €1,264/month payment, checks if affordable with profile income

**UI Blocks:**
- Affordability indicator (% of income)
- Monthly payment calculator card
- Total cost projection
- Rent vs Buy quick comparison

Start by creating projects table and calculateMortgagePayment function.

---

## Prompt 3: Simulations & Comparisons (PREMIUM Tier)

Create and compare multiple scenarios side-by-side. Time-locked snapshots with different assumptions.

**Convex Schema:**
```typescript
simulations: {
  profileId: Id<"profiles">
  projectId: Id<"projects">
  name: string // "Conservative scenario"
  assumptionTier: "low" | "medium" | "high"
  status: "fresh" | "stale" | "locked"
  created: number
  
  results: {
    monthlyPayment: number
    totalCostHorizon: number
    breakEvenYear?: number
    savingsEffortPercent: number // % of income
    netWorth10Years: number
  }
}

comparisons: {
  name: string // "Rent vs Buy Montpellier"
  simulationIds: Id<"simulations">[]
  created: number
  insights?: string // AI-generated analysis
}
```

**Core Functions:**
- `createSimulation(profileId, projectId, assumptions)` - Generate projection
- `calculateProjections(simulation, years)` - Year-by-year calculations
- `compareSimulations(simIds)` - Side-by-side analysis
- `markSimulationStale(simId)` - When profile/project changes
- `generateComparison(simIds)` - Create comparison with insights

**State Management:**
- FRESH: Current with latest data
- STALE: Underlying data changed
- LOCKED: Archived for reference

**UI Blocks:**
- Comparison table (3 scenarios side-by-side)
- Break-even timeline chart
- Key metrics cards (monthly cost, 10-year position)
- AI recommendation block

**Chat Example:**
User: "Compare conservative vs optimistic scenarios"
AI: Shows table with monthly payments, total costs, break-even years, recommends best option

Start by creating simulations table and basic comparison logic.

---

## Implementation Notes

### Progression Strategy
1. **Week 1**: Implement Prompt 1 - Get basic profile working with chat input
2. **Week 2**: Add Prompt 2 - Projects linked to profiles  
3. **Week 3**: Add Prompt 3 - Simulations and comparisons

### Key Principles
- Keep it simple - it's just a monthly spreadsheet made easy
- No daily expense tracking
- Chat makes data entry painless
- Show results as clean UI blocks in chat
- Each tier builds on the previous one

### Success Metrics
- User can create profile in < 2 minutes via chat
- Financial calculations are accurate
- Comparisons clearly show best option
- UI blocks render cleanly in chat interface