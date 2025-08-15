# Product Requirements Document (PRD)
## Fourmi - Financial Decision Copilot

### Vision Statement

A **chat-first financial copilot** that helps households make life decisions (rent/buy, where to live) through deterministic simulations and simple comparisons, without financial jargon. Fighting the consumer debt trap created by $4B+ annual marketing budgets from credit companies.

### Target Persona

**Primary Users:**
- Couples/individuals without financial expertise, sensitive to clarity
- Need to compare 2-3 scenarios (low/median/high assumptions)
- Want to understand 3-4 comprehensible KPIs
- Trapped by consumer credit marketing, need empowering tools

**Secondary Users (Paid Tier):**
- More financially comfortable users wanting advanced projections
- Need long-term simulations and complex project planning

### Problems We Solve

**Core Social Problem:**
- $4+ billion spent annually by MasterCard, Visa, AmEx on consumer marketing
- Consumers trapped in debt cycles, lacking clear decision tools
- Excel is modular but difficult to version and share
- "Investment" tools are too complex (probabilistic vs deterministic)

**Technical Problems:**
- Need for time-locked snapshots (Simulation) with controlled updates
- Human-in-the-loop validation for AI-extracted facts
- Clear KPI presentation without financial jargon

### MVP Scope (POC)

**Core Features:**
- **Profiles** (individual/couple) with income, existing loans, savings, cashflow tolerance
- **Projects** (France/Dominican Republic) with local market data
- **Simulations** (Low/Median/High assumptions) with deterministic calculations
- **Comparisons** (2-3 simulations side by side)

**Chat + AI Integration:**
- Natural language input with **Fact extraction** (human-validated)
- **Agent-based architecture** using Vercel AI SDK
- Internet search capabilities (Perplexity-style) for market data
- **UI Blocks** rendering within chat responses

**Deterministic Calculations:**
- Monthly payment calculations
- Cashflow projections
- Total cost over horizon
- Break-even point analysis

**Simulation States:**
- **FRESH**: Recently calculated, inputs unchanged
- **STALE**: Underlying data changed, needs recalculation  
- **LOCKED**: Archived snapshot for reference

### Product KPIs

**User Experience:**
- **TTFP** (Time to First Projection) < 3 minutes
- 90% of users understand the 3 core KPIs without help
- 1-click simulation updates when data becomes stale

**Business Metrics:**
- Free tier adoption (basic income/expense tracking)
- Conversion to paid tier (advanced simulations)
- User retention (monthly active users)

### Three-Tier Feature Strategy

#### Tier 1: Basic Financial Health (FREE)
**Target:** People struggling with consumer debt
- Simple income vs expenses tracking
- Loan and credit card debt visualization
- Basic cashflow analysis
- Educational content about debt management

#### Tier 2: Life Decision Projects (PAID)
**Target:** Users planning major financial decisions
- Real estate rent vs buy comparisons
- Location-based cost analysis (FR/DR)
- Long-term financial projections
- AI-enhanced market data integration

#### Tier 3: Advanced Simulations (PAID)
**Target:** Sophisticated users and financial planning
- Multi-scenario Monte Carlo alternatives
- Complex investment property analysis
- International tax considerations
- Advanced AI-driven insights

### Out of Scope (v1)

- Detailed international tax calculations
- Real-time EUR/DOP exchange rates
- Bank account integrations
- Probabilistic/Monte Carlo simulations
- Investment portfolio management

### Technology Stack

**Frontend:**
- Next.js 14+ with App Router
- ShadCN/ui components with dark mode
- Tailwind CSS for styling
- TypeScript with strict mode

**AI Integration:**
- Vercel AI SDK for agent orchestration
- OpenAI/Claude for natural language processing
- Perplexity-style internet search tools
- Function calling for structured data extraction

**Backend:**
- Clean Architecture + DDD principles
- Prisma ORM (SQLite → PostgreSQL)
- Zod for runtime validation
- TRPC for type-safe APIs

**Testing:**
- Vitest for unit/integration tests
- Playwright for E2E testing
- Property-based testing for calculations

### Success Criteria

**Social Impact:**
- Help users escape consumer debt traps
- Improve financial literacy through clear KPIs
- Provide free tools for those who need them most

**Technical:**
- Sub-3-minute time to first meaningful projection
- 99.9% calculation accuracy for financial formulas
- <200ms response times for AI interactions
- Mobile-responsive, accessible interface

**Business:**
- Sustainable freemium model
- Clear value proposition for paid tiers
- Defensible through superior UX and AI integration