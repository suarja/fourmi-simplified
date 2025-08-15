# Documentation
## Fourmi Financial Copilot

### 📋 Overview

This documentation provides comprehensive guidance for developing, maintaining, and understanding the Fourmi Financial Copilot - a chat-first application that helps households make informed financial decisions about real estate purchases and rentals.

**Mission**: Fight consumer debt traps created by $4B+ annual credit company marketing through accessible financial tools.

### 🗂️ Documentation Structure

#### [`/product/`](./product/) - Product & Business Documentation
Strategic documents defining what we're building and why.

- **[PRD.md](./product/PRD.md)** - Product Requirements Document with vision, personas, and feature strategy
- **[ROADMAP.md](./product/ROADMAP.md)** - Development phases, milestones, and delivery timeline

#### [`/technical/`](./technical/) - Technical Architecture & Implementation
Core technical specifications for development team.

- **[ARCHITECTURE.md](./technical/ARCHITECTURE.md)** - Clean Architecture + DDD patterns, TRPC integration
- **[DATA_MODEL.md](./technical/DATA_MODEL.md)** - Database schema, Zod types, repository patterns
- **[DOMAIN.md](./technical/DOMAIN.md)** - Domain modeling, ubiquitous language, bounded contexts
- **[CALCULATOR.md](./technical/CALCULATOR.md)** - Financial formulas, calculation engine specifications
- **[AGENTS.md](./technical/AGENTS.md)** - AI agent architecture using Vercel AI SDK
- **[TECH_STACK.md](./technical/TECH_STACK.md)** - Technology integration guide (Supabase, Drizzle, Schematic)
- **[REFERENCE_LINKS.md](./technical/REFERENCE_LINKS.md)** - External documentation and integration guides

#### [`/guidelines/`](./guidelines/) - Development Standards & Best Practices
Team conventions and development workflows.

- **[DESIGN_SYSTEM.md](./guidelines/DESIGN_SYSTEM.md)** - ShadCN dark theme, typography, component specs
- **[UI_UX_SPEC.md](./guidelines/UI_UX_SPEC.md)** - Chat interface patterns, responsive design
- **[claude-code-guidelines-jason-suarez.md](./guidelines/claude-code-guidelines-jason-suarez.md)** - AI-assisted development patterns
- **[ui-ux-guidelines-jason-suarez.md](./guidelines/ui-ux-guidelines-jason-suarez.md)** - Conversational design principles

#### [`/design-inspiration/`](./design-inspiration/) - Visual References
UI/UX inspiration images and design references.

#### [`/conversations/`](./conversations/) - Development Discussions
Meeting notes, interviews, and key decisions.

#### [`/meta/`](./meta/) - Documentation Management
Change tracking, contribution guidelines, and documentation maintenance.

### 🚀 Quick Start

1. **New Developer Onboarding**: Start with [`/product/PRD.md`](./product/PRD.md) → [`/technical/ARCHITECTURE.md`](./technical/ARCHITECTURE.md)
2. **Feature Development**: Check [`/product/ROADMAP.md`](./product/ROADMAP.md) → [`/technical/`](./technical/) relevant specs
3. **UI/UX Work**: Review [`/guidelines/DESIGN_SYSTEM.md`](./guidelines/DESIGN_SYSTEM.md) → [`/design-inspiration/`](./design-inspiration/)
4. **AI Agent Development**: Start with [`/technical/AGENTS.md`](./technical/AGENTS.md) → [`/technical/DOMAIN.md`](./technical/DOMAIN.md)

### 📝 Documentation Standards

#### Contributing to Documentation
- **Always update documentation** when making architectural changes
- **Update changelog** in relevant `/meta/CHANGES.md` after modifications
- **Follow English-only policy** for consistency across international team
- **Include code examples** and integration patterns where applicable

#### File Naming Convention
- Use `SCREAMING_SNAKE_CASE.md` for major specification documents
- Use `kebab-case.md` for guidelines and process documents
- Include dates in meeting notes: `YYYY-MM-DD-topic.md`

#### Documentation Review Process
1. Check existing documentation before creating new files
2. Update relevant README files when adding new documents
3. Record changes in appropriate changelog
4. Ensure cross-references are updated

### 🔄 Recent Changes

**2025-01-13**: Major reorganization into logical subdirectories
- Created product/, technical/, guidelines/, meta/ structure  
- Added navigation READMEs to each subdirectory
- Implemented documentation changelog system

**2025-01-13**: Technology stack update
- Migrated from Prisma to Drizzle ORM + Supabase
- Added Schematic for feature management and billing
- Selected ShadCN ecosystem libraries (Assistant UI, AutoForm, Tremor)

### 🔗 External Resources

- **[Fourmi Repository](/)** - Main codebase
- **[CLAUDE.md](/CLAUDE.md)** - Claude Code integration guide
- **[Supabase Docs](https://supabase.com/docs)** - Database and real-time features
- **[Vercel AI SDK](https://ai-sdk.dev/)** - AI agent development
- **[ShadCN/ui](https://ui.shadcn.com/)** - Component library

### 📞 Getting Help

- **Architecture Questions**: Review [`/technical/ARCHITECTURE.md`](./technical/ARCHITECTURE.md)
- **UI/UX Guidance**: Check [`/guidelines/DESIGN_SYSTEM.md`](./guidelines/DESIGN_SYSTEM.md)
- **Development Patterns**: See [`/guidelines/claude-code-guidelines-jason-suarez.md`](./guidelines/claude-code-guidelines-jason-suarez.md)
- **Feature Specifications**: Browse [`/technical/`](./technical/) directory

---

*This documentation follows the 80/20 Pareto principle - focusing on the 20% of information that provides 80% of the value for effective development and maintenance.*