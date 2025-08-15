# Data Model & Schemas
## Fourmi Financial Copilot

### Database Schema (Prisma)

#### Core Tables (MVP)

```prisma
// User management
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  households Household[]
  messages   Message[]
  
  @@map("users")
}

model Household {
  id     String @id @default(cuid())
  name   String
  type   String // "solo" | "couple"
  userId String
  
  user     User      @relation(fields: [userId], references: [id])
  profiles Profile[]
  
  @@map("households")
}

// Chat & Memory
model Message {
  id         String   @id @default(cuid())
  content    String
  role       String   // "user" | "assistant" | "system"
  timestamp  DateTime @default(now())
  userId     String
  
  user  User   @relation(fields: [userId], references: [id])
  facts Fact[]
  
  @@map("messages")
}

model Fact {
  id          String   @id @default(cuid())
  key         String   // "income_primary_net"
  value       Json     // Flexible value storage
  unit        String?  // "EUR/month", "years", etc.
  confidence  Float    @default(0.8)
  validated   Boolean  @default(false)
  source      String   // "chat" | "user_input" | "external_api"
  messageId   String?
  createdAt   DateTime @default(now())
  
  message Message? @relation(fields: [messageId], references: [id])
  
  @@map("facts")
}

// Core Domain
model Profile {
  id                      String @id @default(cuid())
  name                    String
  householdId             String
  persons                 Json   // Person[]
  loans                   Json   // ExistingLoan[]
  savings                 Int    // Money in cents
  toleranceCashflowNeg    Int    // Money in cents
  updatedAt               DateTime @updatedAt
  
  household   Household    @relation(fields: [householdId], references: [id])
  simulations SimulationProfile[]
  
  @@map("profiles")
}

model Project {
  id          String @id @default(cuid())
  name        String
  country     String
  city        String
  purpose     String // "RP" | "Locatif" | "Secondaire"
  price       Int    // Money in cents
  downPayment Int    // Money in cents
  rate        Float
  termYears   Int
  feesAcq     Json   // Flexible acquisition fees
  chargesYear Json   // Annual charges breakdown
  rentMonth   Int?   // Optional rental income
  updatedAt   DateTime @updatedAt
  
  simulations Simulation[]
  
  @@map("projects")
}

model Simulation {
  id             String @id @default(cuid())
  name           String
  projectId      String
  assumptionTier String // "basse" | "mediane" | "haute"
  overrides      Json   @default("{}")
  status         String @default("FRESH") // "FRESH" | "STALE" | "LOCKED"
  inputHash      String
  results        Json   // SimulationResults
  createdAt      DateTime @default(now())
  
  project  Project             @relation(fields: [projectId], references: [id])
  profiles SimulationProfile[]
  
  @@map("simulations")
}

// Many-to-many relationship
model SimulationProfile {
  simulationId String
  profileId    String
  
  simulation Simulation @relation(fields: [simulationId], references: [id])
  profile    Profile    @relation(fields: [profileId], references: [id])
  
  @@id([simulationId, profileId])
  @@map("simulation_profiles")
}

model Comparison {
  id            String   @id @default(cuid())
  name          String
  simulationIds Json     // Array of simulation IDs
  createdAt     DateTime @default(now())
  
  @@map("comparisons")
}
```

### Zod Schemas & TypeScript Types

#### Value Objects

```typescript
import { z } from "zod";

// Core value objects
export const Money = z.number().int().min(0); // Always in cents
export const Percentage = z.number().min(0).max(1);
export const Currency = z.enum(["EUR", "DOP"]);

export const MoneyAmount = z.object({
  amount: Money,
  currency: Currency,
});

// Helper for money operations
export const MoneyHelpers = {
  fromEuros: (euros: number) => Math.round(euros * 100),
  toEuros: (cents: number) => cents / 100,
  format: (cents: number, currency: string = "EUR") => 
    new Intl.NumberFormat("fr-FR", { 
      style: "currency", 
      currency 
    }).format(cents / 100),
};
```

#### Person & Household

```typescript
export const Person = z.object({
  name: z.string().min(1),
  netIncomeMonth: Money,
  otherIncomeMonth: Money.default(0),
  age: z.number().int().min(18).max(100).optional(),
});

export const ExistingLoan = z.object({
  type: z.enum(["mortgage", "auto", "personal", "student", "credit_card"]),
  monthly: Money,
  remainingTermMonths: z.number().int().min(0),
  remainingPrincipal: Money,
  rate: Percentage,
});

export const Profile = z.object({
  id: z.string(),
  name: z.string().min(1),
  persons: z.array(Person).min(1),
  loans: z.array(ExistingLoan).default([]),
  savings: Money.default(0),
  toleranceCashflowNeg: Money.default(0),
  updatedAt: z.date(),
});

export type Profile = z.infer<typeof Profile>;
```

#### Project & Property

```typescript
export const PropertyPurpose = z.enum(["RP", "Locatif", "Secondaire"]);

export const AcquisitionFees = z.union([
  z.number(), // Fixed amount
  z.object({
    percentage: Percentage,
    minimum: Money.optional(),
    maximum: Money.optional(),
  }),
]);

export const PropertyCosts = z.object({
  copropriete: Money.default(0),
  entretienPct: Percentage.default(0.01), // 1% of property value
  assurance: Money,
  taxeFonciere: Money,
  gestionPct: Percentage.default(0).optional(), // For rental properties
});

export const Project = z.object({
  id: z.string(),
  name: z.string().min(1),
  country: z.string().length(2), // ISO country code
  city: z.string().min(1),
  purpose: PropertyPurpose,
  price: Money,
  downPayment: Money,
  rate: Percentage,
  termYears: z.number().int().min(1).max(50),
  feesAcq: AcquisitionFees,
  chargesYear: PropertyCosts,
  rentMonth: Money.nullable().default(null),
  updatedAt: z.date(),
});

export type Project = z.infer<typeof Project>;
```

#### Simulation & Results

```typescript
export const AssumptionTier = z.enum(["basse", "mediane", "haute"]);

export const SimulationStatus = z.enum(["FRESH", "STALE", "LOCKED"]);

export const KPIResults = z.object({
  monthlyCashflow: z.number(), // Can be negative
  savingsEffort: Percentage,   // % of income going to savings
  totalCostOverHorizon: Money,
  breakEvenYear: z.number().nullable(), // null if never breaks even
});

export const YearlyProjection = z.object({
  year: z.number().int(),
  loanBalance: Money,
  cumulativeCashflow: z.number(),
  propertyValue: Money,
  netPosition: z.number(), // Assets - Liabilities
});

export const SimulationResults = z.object({
  kpis: KPIResults,
  yearlyProjections: z.array(YearlyProjection),
  assumptions: z.record(z.any()), // Applied assumptions
  calculatedAt: z.date(),
});

export const Simulation = z.object({
  id: z.string(),
  name: z.string().min(1),
  profileIds: z.array(z.string()).min(1),
  projectId: z.string(),
  assumptionTier: AssumptionTier,
  overrides: z.record(z.any()).default({}),
  status: SimulationStatus.default("FRESH"),
  inputHash: z.string(),
  results: SimulationResults.optional(),
  createdAt: z.date(),
});

export type Simulation = z.infer<typeof Simulation>;
```

#### UI Block Types

```typescript
export const MetricCard = z.object({
  type: z.literal("MetricCard"),
  title: z.string(),
  value: z.string(),
  subtitle: z.string().optional(),
  tooltip: z.string().optional(),
  trend: z.enum(["up", "down", "neutral"]).optional(),
  color: z.enum(["default", "success", "warning", "error"]).optional(),
});

export const AssumptionItem = z.object({
  label: z.string(),
  value: z.string(),
  editable: z.boolean().default(false),
  type: z.enum(["text", "number", "percentage", "money"]).optional(),
});

export const AssumptionList = z.object({
  type: z.literal("AssumptionList"),
  title: z.string(),
  items: z.array(AssumptionItem),
});

export const ComparisonRow = z.object({
  kpi: z.string(),
  values: z.record(z.string()), // simulationId -> formatted value
  highlight: z.string().optional(), // Which simulation to highlight
});

export const ComparisonTable = z.object({
  type: z.literal("ComparisonTable"),
  title: z.string(),
  simulationNames: z.record(z.string()), // simulationId -> name
  rows: z.array(ComparisonRow),
});

export const TimelineEvent = z.object({
  year: z.number().int(),
  label: z.string(),
  amount: z.string().optional(),
  type: z.enum(["milestone", "payment", "income", "expense"]).optional(),
});

export const Timeline = z.object({
  type: z.literal("Timeline"),
  title: z.string(),
  events: z.array(TimelineEvent),
  horizonYears: z.number().int().default(20),
});

export const Alert = z.object({
  type: z.literal("Alert"),
  level: z.enum(["info", "warning", "error", "success"]),
  title: z.string(),
  message: z.string(),
  dismissible: z.boolean().default(true),
});

export const UIBlock = z.discriminatedUnion("type", [
  MetricCard,
  AssumptionList,
  ComparisonTable,
  Timeline,
  Alert,
]);

export type UIBlock = z.infer<typeof UIBlock>;
```

#### AI Agent Schemas

```typescript
export const ExtractedFact = z.object({
  key: z.string(),
  value: z.any(),
  unit: z.string().optional(),
  confidence: z.number().min(0).max(1),
  source: z.enum(["chat", "calculation", "external_api"]),
});

export const AgentFactExtraction = z.object({
  facts: z.array(ExtractedFact),
  ambiguous: z.array(z.string()), // Questions that need clarification
  confidence: z.number().min(0).max(1),
});

export const AgentSimulationRequest = z.object({
  name: z.string(),
  profileIds: z.array(z.string()),
  projectId: z.string(),
  assumptionTier: AssumptionTier,
  overrides: z.record(z.any()).default({}),
});

export const AgentUIComposition = z.object({
  blocks: z.array(UIBlock),
  narrative: z.string(), // Plain text explanation
  suggestions: z.array(z.string()).default([]), // Next steps
});
```

### Data Access Patterns

#### Repository Interfaces

```typescript
export interface ProfileRepository {
  findById(id: string): Promise<Profile | null>;
  findByHouseholdId(householdId: string): Promise<Profile[]>;
  save(profile: Profile): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface SimulationRepository {
  findById(id: string): Promise<Simulation | null>;
  findByProfileIds(profileIds: string[]): Promise<Simulation[]>;
  findByProjectId(projectId: string): Promise<Simulation[]>;
  markStale(profileId: string, newInputHash: string): Promise<void>;
  save(simulation: Simulation): Promise<void>;
}

export interface FactRepository {
  findByKey(key: string): Promise<Fact[]>;
  findValidated(): Promise<Fact[]>;
  save(fact: Fact): Promise<void>;
  validate(id: string): Promise<void>;
}
```

### Database Migrations Strategy

**Version 1.0.0 (MVP)**
- Basic user, profile, project, simulation tables
- Simple fact storage with JSON flexibility
- Minimal indexing for performance

**Version 1.1.0 (Optimization)**
- Add indexes on frequently queried fields
- Optimize JSON queries for facts and results
- Add audit logging tables

**Version 2.0.0 (Advanced Features)**
- Multi-currency support tables
- Advanced calculation cache tables
- User preference and personalization tables