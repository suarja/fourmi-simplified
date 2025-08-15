# Technical Documentation Changes
## Fourmi Financial Copilot

### ⚙️ Technical-Specific Changelog

This document tracks changes to architecture, implementation specifications, API documentation, and integration guides.

---

## [2025-01-13] - Technology Stack Modernization
**Type**: 🎯 Major  
**Impact**: High  
**Author**: Claude Code Assistant

### Changes Made
- Migrated from Prisma to Drizzle ORM + Supabase architecture
- Integrated Schematic for feature management and billing
- Selected production-ready ShadCN ecosystem libraries
- Designed TRPC streaming integration with AI chat interface

### Core Technology Changes

#### Database & ORM Migration
- **From**: Prisma ORM with SQLite → PostgreSQL migration path
- **To**: Drizzle ORM with Supabase (real-time subscriptions + edge functions)
- **Benefits**: Better TypeScript support, real-time capabilities, edge runtime compatibility

#### Business Logic Integration
- **Added**: Schematic for feature flags and subscription billing
- **Benefits**: Unified feature management, Stripe integration, usage-based metering

#### UI Component Strategy
- **Selected Libraries**:
  - **Assistant UI**: Production-ready AI chat components
  - **AutoForm**: Dynamic form generation from Zod schemas
  - **Tremor**: Professional financial charts and dashboards
  - **TanStack UI Table**: Advanced data tables with server-side operations

### Affected Documents
- **[`/technical/TECH_STACK.md`](../technical/TECH_STACK.md)** - Created comprehensive integration guide
- **[`/technical/ARCHITECTURE.md`](../technical/ARCHITECTURE.md)** - Updated with new patterns
- **[`/technical/REFERENCE_LINKS.md`](../technical/REFERENCE_LINKS.md)** - Added external documentation
- **[`/technical/DATA_MODEL.md`](../technical/DATA_MODEL.md)** - Updated for Drizzle schemas

### Migration Impact
- **Development Setup**: New environment configuration required
- **Database Schema**: Migration scripts needed for Prisma → Drizzle
- **Component Architecture**: Integration testing for new libraries
- **Deployment Pipeline**: Updated for Supabase + Vercel integration

### Rationale
Technology stack modernization addresses:
- **Performance**: Better runtime efficiency and bundle size optimization
- **Developer Experience**: Enhanced TypeScript support and faster iteration
- **Scalability**: Real-time features and edge function capabilities
- **Maintainability**: Reduced custom code through proven library adoption

---

## [2025-01-13] - TRPC Streaming Architecture Design
**Type**: 🎯 Major  
**Impact**: High  
**Author**: Claude Code Assistant

### Changes Made
- Designed TRPC subscription system for real-time AI chat
- Created streaming patterns for AI agent responses
- Integrated AutoForm with human-in-the-loop fact validation
- Established feature flag middleware with Schematic

### Key Architectural Patterns

#### Real-Time Chat Integration
```typescript
// TRPC streaming subscriptions
api.chat.stream.useSubscription({ conversationId }, {
  onData: (chunk) => {
    if (chunk.uiBlocks) {
      setUIBlocks(prev => [...prev, ...chunk.uiBlocks]);
    }
  }
});
```

#### Dynamic Form Generation
```typescript
// AutoForm integration for AI-generated forms
<AutoForm
  schema={factValidationSchema}
  onSubmit={(data) => validateFact.mutate(data)}
/>
```

#### Feature Gate Implementation
```typescript
// Schematic middleware for tiered access
const hasAccess = await schematic.checkFlag({
  userId, flagKey: 'advanced_simulations'
});
```

### Performance Implications
- **Streaming Responses**: Improved perceived performance for AI interactions
- **Optimistic Updates**: Immediate UI feedback before server confirmation  
- **Real-time Sync**: Supabase subscriptions for collaborative features
- **Edge Processing**: AI operations closer to users via edge functions

### Affected Documents
- **[`/technical/ARCHITECTURE.md`](../technical/ARCHITECTURE.md)** - Added streaming patterns section
- **[`/technical/TECH_STACK.md`](../technical/TECH_STACK.md)** - Integration code examples

### Rationale
TRPC streaming architecture enables:
- **Better UX**: Real-time AI responses without page refreshes
- **Scalability**: Efficient handling of concurrent chat sessions
- **Type Safety**: End-to-end TypeScript across websocket connections

---

## [2025-01-13] - AI Agent System Architecture
**Type**: 🎯 Major  
**Impact**: High  
**Author**: Claude Code Assistant

### Changes Made
- Designed multi-agent system using Vercel AI SDK
- Defined specialized agent roles and responsibilities
- Created tool-based architecture with function calling
- Established human-in-the-loop validation patterns

### Agent Architecture Specifications

#### Agent Role Definitions
1. **Extractor Agent**: Natural language → structured facts (low temperature 0.1)
2. **Modeler Agent**: Validated facts → simulation requests (temperature 0.2)
3. **Calculator Agent**: Simulation inputs → financial projections (temperature 0)
4. **Composer Agent**: Results → UI blocks with narrative (temperature 0.3)
5. **Comparator Agent**: Multiple scenarios → comparisons + recommendations (temperature 0.4)

#### Tool Integration Patterns
```typescript
const extractorAgent = createAgent({
  model: openai("gpt-4"),
  tools: {
    extractFacts: extractFactsTool,
    requestClarification: requestClarificationTool,
    searchMarketData: searchMarketDataTool,
  },
  temperature: 0.1,
});
```

#### Human Validation Workflow
- AI extracts facts with confidence scores
- User receives validation prompts via AutoForm
- Validated facts stored in memory system
- Subsequent AI operations use validated data

### Safety & Performance Features
- **Input Validation**: Zod schemas for all agent inputs/outputs
- **Error Handling**: Graceful fallbacks for API failures
- **Usage Tracking**: Schematic integration for billing metering
- **Context Preservation**: Conversation state management

### Affected Documents
- **[`/technical/AGENTS.md`](../technical/AGENTS.md)** - Complete agent system specification
- **[`/technical/ARCHITECTURE.md`](../technical/ARCHITECTURE.md)** - Agent integration patterns

### Rationale
Multi-agent architecture provides:
- **Specialized Intelligence**: Each agent optimized for specific tasks
- **Reliability**: Multiple fallback strategies for different failure modes
- **Scalability**: Independent agent scaling based on usage patterns
- **Maintainability**: Clear separation of concerns and responsibilities

---

## [2025-01-13] - Financial Calculation Engine Specification
**Type**: 🎯 Major  
**Impact**: High  
**Author**: Claude Code Assistant

### Changes Made
- Documented complete financial formula library
- Established assumption tier system (Low/Median/High)
- Created input validation and error handling patterns
- Defined property-based testing strategies

### Financial Accuracy Requirements
- **Precision**: All money values in cents to avoid floating point errors
- **Validation**: Input constraints (rates 0-20%, positive amounts, realistic terms)
- **Testing**: Property-based testing with fast-check library
- **Performance**: Complex projections must complete in <500ms

### Core Formulas Implemented
```typescript
// PMT calculation with validation
export function calculateMonthlyPayment(
  principal: number,    // in cents
  annualRate: number,   // 0.035 for 3.5%
  termYears: number     // 1-50 years
): number
```

### Assumption Tier System
- **Low (Conservative)**: 1% appreciation, 8% vacancy, 1.5% maintenance
- **Median (Realistic)**: 2.5% appreciation, 5% vacancy, 1% maintenance  
- **High (Optimistic)**: 4% appreciation, 2% vacancy, 0.8% maintenance

### Error Handling Strategy
```typescript
export class CalculationError extends Error {
  constructor(
    message: string, 
    public code: string, 
    public details?: any
  ) {}
}
```

### Affected Documents
- **[`/technical/CALCULATOR.md`](../technical/CALCULATOR.md)** - Complete calculation specification
- **[`/technical/DATA_MODEL.md`](../technical/DATA_MODEL.md)** - Money type definitions

### Rationale
Financial calculation engine requires:
- **Absolute Accuracy**: >99.95% accuracy for financial projections
- **Performance**: Real-time calculations during chat interactions
- **Reliability**: Comprehensive error handling for edge cases
- **Testability**: Property-based testing to catch calculation errors

---

### Update Guidelines

#### When to Update Technical Documentation
- Architecture or design pattern changes
- New technology adoption or version updates
- Performance optimization discoveries
- Security requirement modifications
- Integration pattern evolution

#### Update Process
1. **Technical Review**: Get feedback from engineering team
2. **Impact Assessment**: Identify affected systems and components
3. **Documentation Update**: Update specifications with code examples
4. **Change Recording**: Add detailed entry to this changelog
5. **Knowledge Sharing**: Present changes in team technical review
6. **Validation**: Ensure implementation matches updated documentation

#### Template for Technical Changes
```markdown
## [YYYY-MM-DD] - Change Title
**Type**: 🎯 Major | 🔧 Minor | 📝 Editorial | 🔗 Reference
**Impact**: High | Medium | Low
**Author**: [Name]

### Changes Made
- Technical change with implementation details

### Affected Documents
- [`/technical/document.md`](../technical/document.md) - What changed technically

### Performance Impact
How this change affects system performance, if applicable.

### Migration Required
- [ ] Database schema updates
- [ ] API changes requiring client updates
- [ ] Configuration changes
- [ ] Testing updates

### Rationale
Technical reasoning for the change.
```