# Guidelines Documentation
## Fourmi Financial Copilot

### 📏 Purpose

This directory contains development standards, design principles, and best practices that define **how we work** on Fourmi. These documents ensure consistency, quality, and maintainability across all team contributions.

### 📄 Documents Overview

#### Design & User Experience

##### [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Visual Design Standards
**Owner**: Design Lead  
**Audience**: Designers, Frontend developers  
**Last Updated**: 2025-01-13

Comprehensive design system with ShadCN dark theme, typography, and component specifications.

**Key Sections**:
- **Color System**: Dark-first palette with semantic usage
- **Typography**: Inter font stack with financial-optimized hierarchy
- **Component Specs**: Metric cards, comparison tables, chat interface
- **Animation System**: Micro-interactions and loading states
- **Accessibility**: WCAG 2.1 AA compliance standards

**When to Use**: UI development, component creation, design decisions, accessibility reviews

##### [UI_UX_SPEC.md](./UI_UX_SPEC.md) - Interaction Design Patterns
**Owner**: UX Lead  
**Audience**: Frontend developers, Product team  
**Last Updated**: 2025-01-13

Chat-first interface patterns, responsive design, and user interaction guidelines.

**Key Sections**:
- **Conversational Flow**: Human-in-the-loop validation patterns
- **Layout Patterns**: Desktop/tablet/mobile responsive behavior
- **UI Block System**: AI-generated component structures
- **State Management**: Simulation status and user feedback
- **Performance Optimization**: Loading states and perceived performance

**When to Use**: Frontend feature development, UX pattern implementation, responsive design

#### Development Standards

##### [claude-code-guidelines-jason-suarez.md](./claude-code-guidelines-jason-suarez.md) - AI-Assisted Development
**Owner**: Jason Suarez  
**Audience**: All developers  
**Last Updated**: 2025-01-13

Project-agnostic guidelines for AI-powered development with context engineering.

**Key Sections**:
- **Context Engineering**: Building focused, relevant context from codebase
- **Change Tracking**: Per-file change logs and architectural decisions
- **Type-First Development**: Branded types and domain modeling
- **Testing Philosophy**: Vitest patterns and property-based testing
- **Quality Gates**: Pre-commit hooks and code review standards

**When to Use**: AI-assisted development sessions, code review, architectural decisions

##### [ui-ux-guidelines-jason-suarez.md](./ui-ux-guidelines-jason-suarez.md) - Conversational Design Principles
**Owner**: Jason Suarez  
**Audience**: Designers, Frontend developers  
**Last Updated**: 2025-01-13

Context-driven design principles for AI-powered applications in the LLM era.

**Key Sections**:
- **Conversational Design**: Chat interfaces over traditional forms
- **AI-Aware Loading States**: Engaging waiting periods with reasoning
- **Color Psychology**: Dark-first design for financial applications
- **Component Architecture**: Composition over configuration patterns
- **Future Vision**: LLM-era interface evolution

**When to Use**: AI interface design, conversational UX patterns, component architecture

### 🛠️ Development Workflow

#### Code Quality Standards

**TypeScript Requirements**:
- Strict mode enabled across all files
- >90% type coverage target
- Branded types for domain safety
- Zod validation at API boundaries

**Testing Standards**:
- >80% coverage for business logic
- Property-based testing for financial calculations
- Integration tests for AI agent workflows
- E2E tests for critical user flows

**Performance Benchmarks**:
- Initial load <2s
- Calculation responses <500ms
- AI agent responses <3s
- Core Web Vitals compliance

#### Design Quality Standards

**Visual Consistency**:
- ShadCN component library usage
- Dark-first theme implementation
- Consistent spacing (4px grid system)
- Financial-optimized typography

**User Experience**:
- Chat-first interaction patterns
- Progressive disclosure of complexity
- Human-in-the-loop validation flows
- Accessible keyboard navigation

**Responsive Design**:
- Desktop-first, mobile-optimized
- Breakpoint consistency (768px, 1024px)
- Touch-friendly interactive elements
- Cross-browser compatibility

### 🔄 Update Process

#### When to Update Guidelines
- New technology adoption (libraries, frameworks)
- Pattern discovery during development
- User research insights affecting UX
- Performance optimization learnings
- Accessibility requirement changes

#### Update Workflow
1. **Propose Changes**: Document rationale and impact
2. **Team Review**: Get feedback from relevant stakeholders
3. **Update Documentation**: Modify guidelines with examples
4. **Update Changelog**: Record changes in `/meta/guidelines-changes.md`
5. **Communicate Changes**: Share updates with entire team
6. **Validate Adoption**: Check implementation in subsequent PRs

### 📚 Quick Reference

#### Component Creation Checklist
- [ ] Follows ShadCN component patterns
- [ ] Implements dark theme support
- [ ] Includes TypeScript definitions
- [ ] Has Storybook story
- [ ] Includes accessibility attributes
- [ ] Responsive across breakpoints
- [ ] Performance optimized (lazy loading, memoization)

#### AI Feature Development Checklist
- [ ] Human validation for critical decisions
- [ ] Graceful fallback for API failures
- [ ] Loading states show AI reasoning
- [ ] Error boundaries handle edge cases
- [ ] Usage tracking for billing (Schematic)
- [ ] Conversation context preservation
- [ ] Tool calling with structured outputs

#### Financial Feature Checklist
- [ ] Property-based testing for calculations
- [ ] Input validation with realistic constraints
- [ ] Currency handling (cents precision)
- [ ] Error handling for edge cases
- [ ] Performance testing for complex projections
- [ ] Accessibility for financial data presentation

### 🎯 Quality Gates

#### Pre-commit Requirements
```bash
npm run lint           # ESLint + Prettier
npm run type-check     # TypeScript validation
npm run test:unit      # Unit test coverage
npm run test:a11y      # Accessibility testing
npm run perf:bundle    # Bundle size analysis
```

#### Code Review Focus Areas
- **Architecture Alignment**: Follows Clean Architecture patterns
- **Type Safety**: Proper use of branded types and Zod schemas
- **Performance**: No unnecessary re-renders or heavy computations
- **Accessibility**: ARIA labels, keyboard navigation, color contrast
- **Testing**: Appropriate test coverage for feature complexity
- **Documentation**: Code comments and architectural decision updates

### 🔗 Cross-References

#### Related Technical Documentation
- **[Architecture](../technical/ARCHITECTURE.md)**: Implementation patterns for guidelines
- **[Data Model](../technical/DATA_MODEL.md)**: Type definitions and validation schemas
- **[Agents](../technical/AGENTS.md)**: AI development patterns

#### Related Product Documentation
- **[PRD](../product/PRD.md)**: Product vision driving UX guidelines
- **[Roadmap](../product/ROADMAP.md)**: Implementation timeline affecting guideline priorities

#### External Standards
- **[WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)** - Accessibility guidelines
- **[ShadCN/ui](https://ui.shadcn.com/)** - Component library standards
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Utility-first CSS framework
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - Type system best practices

### 📊 Metrics & Success Criteria

#### Design System Adoption
- **Component Usage**: % of UI using design system components
- **Consistency Score**: Visual audit passing rate
- **Accessibility Compliance**: WCAG 2.1 AA audit results
- **Performance Impact**: Bundle size and render performance

#### Development Efficiency
- **Onboarding Time**: New developer productivity metrics
- **Code Review Speed**: Time to approve following guidelines
- **Bug Reduction**: Issues related to guideline violations
- **Technical Debt**: Ratio of guideline-compliant vs legacy code

---

*Guidelines documentation serves as the team's compass for **how we work** - ensuring every contribution aligns with our standards for quality, consistency, and user experience.*