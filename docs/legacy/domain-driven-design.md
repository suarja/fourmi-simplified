# Domain Model
## Fourmi Financial Copilot

### Ubiquitous Language

**Core Entities:**
- **Profile**: Individual or household (solo/couple) with income, existing loans, savings, and cashflow tolerance
- **Project**: Real estate intention (e.g., "Main residence in Montpellier", "Rental in Las Terrenas") with local assumptions and costs
- **Simulation**: Time-locked snapshot = Profile(s) + Project + Assumptions (Low/Mid/High) → Results
- **Comparison**: Side-by-side view of multiple Simulations (A vs B vs C)

**AI & Chat:**
- **Fact**: Durable information extracted from chat conversations (requires human validation)
- **Assumption**: Calculation parameter (e.g., "maintenance 1%/year")
- **Plan**: Year-by-year deterministic projection
- **Agent**: AI entity with specific role (Extractor, Modeler, Calculator, Composer)

**Financial Concepts:**
- **KPI**: Key Performance Indicators (monthly cashflow, savings effort, total cost over horizon, break-even point)
- **Journal**: Conversation history with the AI
- **Memory**: Validated database of Facts and Assumptions

**System States:**
- **FRESH**: Simulation is current, inputs unchanged
- **STALE**: Underlying Profile/Project data changed, simulation needs update
- **LOCKED**: Archived simulation for reference/comparison

### Bounded Contexts

#### 1. Journal & Memory Context
**Responsibility**: Chat interface and knowledge persistence
- **Entities**: Message, Conversation, Fact, Memory
- **Services**: ChatService, FactExtractor, MemoryManager
- **Events**: FactProposed, FactValidated, FactRejected

#### 2. Modeling Context  
**Responsibility**: Core domain entities and their relationships
- **Aggregates**: Profile, Project, Simulation, Comparison
- **Value Objects**: Money, Percentage, Duration, Address
- **Services**: ProfileService, ProjectService, SimulationService

#### 3. Calculation Context
**Responsibility**: Financial calculations and projections
- **Services**: CalculatorEngine, FormulaRepository
- **Value Objects**: CashflowProjection, BreakEvenAnalysis, KPISet
- **Rules**: SimulationStateRules, ValidationRules

#### 4. Presentation Context
**Responsibility**: UI rendering and user interactions
- **Components**: UIBlock types (MetricCard, ComparisonTable, Timeline, Alert)
- **Services**: UIComposer, BlockRenderer
- **Events**: BlockInteraction, StateTransition

### Domain Aggregates & Invariants

#### Profile Aggregate
```typescript
interface Profile {
  id: ProfileId;
  name: string;
  persons: Person[];
  loans: ExistingLoan[];
  savings: Money;
  toleranceCashflowNegative: Money;
  updatedAt: Date;
}
```

**Invariants:**
- Profile must have at least one person
- Total loan payments cannot exceed total income
- Savings cannot be negative

#### Project Aggregate
```typescript
interface Project {
  id: ProjectId;
  name: string;
  location: { country: string; city: string };
  purpose: "MainResidence" | "Rental" | "Secondary";
  price: Money;
  downPayment: Money;
  financing: FinancingTerms;
  costs: PropertyCosts;
  updatedAt: Date;
}
```

**Invariants:**
- Down payment cannot exceed property price
- Project must have valid location and purpose
- Financing terms must be realistic (rate > 0, term > 0)

#### Simulation Aggregate
```typescript
interface Simulation {
  id: SimulationId;
  name: string;
  profileIds: ProfileId[];
  projectId: ProjectId;
  assumptionTier: "Low" | "Median" | "High";
  overrides: AssumptionOverrides;
  status: SimulationStatus;
  inputHash: string;
  results: SimulationResults;
  createdAt: Date;
}
```

**Invariants:**
- Simulation references existing Profiles and Project
- inputHash must reflect current state of inputs
- Results must be consistent with inputs
- Status transitions must follow valid state machine

#### Critical Business Rules

1. **Simulation Staleness Rule**: When Profile or Project is modified, all dependent Simulations must be marked STALE
2. **Comparison Integrity Rule**: Comparisons can only reference Simulations, never raw Profiles/Projects
3. **Human Validation Rule**: AI-extracted Facts cannot be automatically saved without human confirmation
4. **Calculation Consistency Rule**: Same inputs must always produce same results (deterministic)

### Domain Events

**Profile Events:**
- ProfileCreated
- ProfileUpdated
- ProfileDeleted

**Project Events:**
- ProjectCreated  
- ProjectUpdated
- ProjectDeleted

**Simulation Events:**
- SimulationCreated
- SimulationRecalculated
- SimulationMarkedStale
- SimulationLocked

**AI Events:**
- FactExtracted
- FactValidated
- FactRejected
- AgentCompleted

### Value Objects

#### Money
```typescript
type Money = {
  amount: number; // Always in cents for precision
  currency: "EUR" | "DOP";
};
```

#### AssumptionTier
```typescript
type AssumptionTier = "Low" | "Median" | "High";

interface TierAssumptions {
  maintenanceRate: number;    // % of property value per year
  propertyAppreciation: number; // % per year
  rentIncrease: number;       // % per year
  interestRateMargin: number; // Additional % on base rate
}
```

#### KPISet
```typescript
interface KPISet {
  monthlyCashflow: Money;
  savingsEffort: number;      // % of income
  totalCostOverHorizon: Money;
  breakEvenYear: number | null;
}
```

### Anti-Corruption Layer

**External Systems:**
- **Real Estate APIs**: Transform external property data to internal Project format
- **Financial Data Providers**: Convert market rates to internal AssumptionTier format  
- **AI Services**: Map LLM responses to domain Facts and Assumptions
- **Currency Services**: Handle EUR/DOP conversion with proper precision

**Integration Patterns:**
- Repository pattern for data persistence
- Adapter pattern for external API integration  
- Strategy pattern for different calculation methods
- Observer pattern for simulation state changes