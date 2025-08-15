# Development Roadmap
## Fourmi Financial Copilot

### Development Philosophy

**80/20 Pareto Approach**
- Focus on the 20% of features that deliver 80% of user value
- Iterate rapidly with user feedback loops
- Start with desktop-first, responsive design
- Test-driven development, especially for financial calculations

**Lean Architecture with Clean Patterns**
- Implement Clean Architecture principles incrementally
- Domain-Driven Design for financial concepts
- Comprehensive testing for critical financial logic
- AI-first interface design from day one

### Phase 0: Foundation (Week 1)
**Goal**: Core infrastructure and financial calculation engine

#### Backend Foundation
- [ ] **Project Setup**
  - Next.js 14 with App Router
  - TypeScript configuration with strict mode
  - Supabase project setup with local development
  - Drizzle ORM configuration and schema setup
  - Vitest testing framework
  - Schematic integration for feature management
  
- [ ] **Domain Models** 
  - Zod schemas for all financial entities (Profile, Project, Simulation)
  - Value objects (Money, Percentage, Currency)
  - Domain events system (ProfileUpdated, SimulationStale)
  
- [ ] **Calculation Engine**
  - Core financial formulas (PMT, cashflow, projections)
  - Assumption tier system (Low/Median/High)
  - Input hash generation for staleness detection
  - Comprehensive test suite with property-based testing

- [ ] **Database Schema (Drizzle + Supabase)**
  - Core tables: users, profiles, projects, simulations
  - Fact storage for AI-extracted information  
  - Message history for chat conversations
  - Real-time subscriptions setup
  - Row-level security policies

#### Frontend Foundation
- [ ] **UI Infrastructure**
  - ShadCN/ui component library setup
  - Selected ecosystem libraries integration (Assistant UI, AutoForm, Tremor)
  - Dark theme configuration
  - Tailwind CSS with design tokens
  - Storybook for component development

- [ ] **Basic Layout**
  - App shell with navigation
  - Chat interface structure
  - Responsive grid layouts
  - Error boundary implementation

**Success Criteria:**
- All financial formulas pass property-based tests
- Basic UI components render correctly in Storybook
- Database schema supports core MVP features
- API endpoints return properly validated data

---

### Phase 1: Chat + Basic AI (Weeks 2-3)
**Goal**: Functional chat interface with fact extraction

#### AI Integration
- [ ] **Vercel AI SDK Setup**
  - OpenAI/Claude integration
  - Agent architecture with tools
  - Streaming responses for chat
  
- [ ] **Extractor Agent**
  - Extract facts from natural language
  - Human-in-the-loop validation
  - Structured output with confidence scores
  - Integration with fact storage

- [ ] **Chat Interface (Assistant UI + TRPC)**
  - Message display with user/AI distinction using Assistant UI components
  - Typing indicators and loading states
  - AutoForm integration for fact validation components
  - Message history persistence with Supabase

#### Core Features
- [ ] **Profile Management**
  - Create/edit personal profiles
  - Income, savings, existing loans
  - Multi-person household support
  
- [ ] **Project Creation**  
  - Property details input
  - Location-based assumptions
  - Purpose-driven configurations (main residence, rental, secondary)

- [ ] **Simulation Creation**
  - Link profiles to projects
  - Apply assumption tiers
  - Generate basic financial projections
  - Status management (FRESH/STALE/LOCKED)

**Success Criteria:**
- Users can extract facts through natural conversation
- Basic profiles and projects can be created/edited
- Simple simulations generate accurate financial projections
- Chat history persists across sessions

---

### Phase 2: Advanced Calculations & Comparisons (Weeks 4-5)
**Goal**: Comprehensive financial analysis and comparison tools

#### Enhanced Calculator
- [ ] **Advanced Projections**
  - Year-by-year detailed calculations
  - Break-even analysis
  - Multiple assumption scenarios
  - Sensitivity analysis for key parameters

- [ ] **KPI Dashboard (Tremor Components)**
  - Monthly cashflow cards with Tremor metrics
  - Savings effort visualization with charts
  - Total cost over horizon projections
  - Break-even timeline with AreaChart components

#### Comparison Engine
- [ ] **Multi-Scenario Analysis**
  - Side-by-side simulation comparison
  - Rent vs buy analysis
  - Location comparison features
  - Assumption sensitivity comparison

- [ ] **Composer Agent**
  - Transform calculations into UI blocks
  - Generate narrative explanations
  - Contextual insights and recommendations
  - Progressive disclosure of complex data

#### UI Block System
- [ ] **Interactive Components**
  - Metric cards with tooltips
  - Comparison tables
  - Timeline visualizations
  - Alert and status indicators

**Success Criteria:**
- Complex financial projections render clearly in UI blocks
- Comparison tables highlight key differences effectively
- Users can understand financial trade-offs without expertise
- Assumption changes trigger appropriate simulation updates

---

### Phase 3: Advanced Features & Polish (Weeks 6-7)
**Goal**: Production-ready application with advanced functionality

#### State Management
- [ ] **Staleness Detection**
  - Automatic simulation invalidation
  - Input hash comparison system
  - User notifications for outdated data
  - Batch update workflows

- [ ] **Advanced AI Agents**
  - Modeler agent for simulation creation
  - Comparator agent for scenario analysis
  - Internet search integration (market data)
  - Multi-agent workflow orchestration

#### User Experience Polish
- [ ] **Responsive Design**
  - Mobile-optimized chat interface
  - Tablet-friendly comparison views
  - Desktop power-user features
  - Progressive web app capabilities

- [ ] **Performance Optimization**
  - React Server Components
  - Optimistic UI updates
  - Calculation caching
  - Image and asset optimization

#### Advanced Features
- [ ] **Export Capabilities**
  - PDF report generation
  - Excel export for power users
  - Shareable simulation links
  - Data import/export

**Success Criteria:**
- Application performs smoothly across devices
- Advanced users can efficiently manage multiple scenarios
- Financial reports are professional and comprehensive
- Performance metrics meet production standards

---

### Phase 4: Production & Scaling (Weeks 8+)
**Goal**: Production deployment with monitoring and optimization

#### Production Infrastructure
- [ ] **Deployment Pipeline**
  - Vercel deployment with Supabase integration
  - Supabase production database setup
  - Edge functions deployment
  - CDN for static assets
  - Schematic production configuration

- [ ] **Monitoring & Observability** 
  - Application performance monitoring
  - Financial calculation accuracy tracking
  - AI agent performance metrics
  - User behavior analytics

#### Business Features (Schematic Integration)
- [ ] **Freemium Model**
  - Basic tier (income/expense tracking) with feature flags
  - Paid tier (advanced simulations) with Schematic entitlements
  - Usage-based AI limits with Schematic tracking
  - Stripe payment integration through Schematic

- [ ] **Multi-Currency Support**
  - EUR/DOP conversion system
  - Localized number formatting
  - Regional assumption defaults
  - Currency preference management

**Success Criteria:**
- Application handles production traffic reliably
- Financial calculations maintain accuracy at scale
- User onboarding and conversion funnels work effectively
- Support system handles user questions

---

### Continuous Improvement Backlog

#### Enhanced AI Capabilities
- [ ] Voice input for chat interface
- [ ] Advanced market data integration
- [ ] Personalized assumption learning
- [ ] Multi-language support (French/Spanish)

#### Advanced Financial Features  
- [ ] Investment property portfolio analysis
- [ ] Tax optimization recommendations
- [ ] Mortgage refinancing analysis
- [ ] International property comparison

#### User Experience Enhancements
- [ ] Collaborative household planning
- [ ] Financial goal tracking
- [ ] Educational content integration
- [ ] Community features and benchmarking

---

### Technical Debt & Quality Gates

#### Code Quality Standards
- **Test Coverage**: >80% for financial calculations, >60% overall
- **Type Coverage**: >90% TypeScript coverage
- **Performance**: <2s initial load, <500ms calculation responses
- **Accessibility**: WCAG 2.1 AA compliance

#### Regular Quality Reviews
- **Weekly**: Code review checklist compliance
- **Sprint End**: Architecture decision documentation
- **Monthly**: Performance benchmark review
- **Quarterly**: Security audit and dependency updates

#### Refactoring Priorities
1. **Financial Formula Library**: Extract to separate package
2. **Agent Framework**: Standardize agent interfaces
3. **Component Architecture**: Optimize bundle size
4. **Database Optimization**: Query performance and indexing

---

### Success Metrics by Phase

#### Phase 0-1: Foundation
- All core calculations pass comprehensive test suite
- Basic chat workflow completes successfully
- User can create profile and first simulation

#### Phase 2: Features
- Time to first projection <3 minutes
- Users successfully compare rent vs buy scenarios
- 90% of extracted facts validated correctly

#### Phase 3: Polish
- Mobile user experience equivalent to desktop
- Advanced users manage multiple scenarios efficiently
- Performance benchmarks consistently met

#### Phase 4: Production
- Production uptime >99.9%
- User onboarding completion rate >70%
- Financial calculation accuracy >99.95%

---

### Risk Mitigation

#### Technical Risks
- **AI API Reliability**: Implement fallback UI for agent failures
- **Calculation Accuracy**: Extensive test coverage with edge cases
- **Performance**: Load testing before production launch
- **Security**: Regular penetration testing and code audits

#### Product Risks  
- **User Adoption**: Early user testing and feedback integration
- **Financial Accuracy**: Professional financial review of formulas
- **Regulatory Compliance**: Legal review of financial advice disclaimers
- **Market Fit**: Continuous user interview and usage analytics

#### Resource Risks
- **Development Velocity**: Maintain 80/20 focus and feature prioritization  
- **Quality vs Speed**: Automated testing and CI/CD pipeline
- **Knowledge Transfer**: Comprehensive documentation and code comments