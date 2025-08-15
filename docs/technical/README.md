# Technical Documentation (Simplified with Convex)
## Fourmi Financial Copilot

### ⚙️ Purpose

This directory contains technical documentation for Fourmi's **simplified Convex implementation**. We've moved from Clean Architecture to a pragmatic approach focused on rapid MVP development.

### 📄 Current Documentation

#### 🆕 Simplified Architecture

##### [CONVEX_ARCHITECTURE.md](./CONVEX_ARCHITECTURE.md) - Current System Design
**Status**: ✅ ACTIVE  
**Last Updated**: 2025-01-15

Simplified architecture using Convex for rapid development.

**Key Topics**:
- Convex function types (mutations, queries, actions)
- Real-time reactive patterns
- Fact validation workflow
- Security and validation approach

##### [MCP_INTEGRATION.md](./MCP_INTEGRATION.md) - MCP Server Usage
**Status**: ✅ ACTIVE  
**Last Updated**: 2025-01-15

Model Context Protocol server integration for enhanced development.

**Key Topics**:
- ShadCN/ui component access
- Convex backend management
- ByteRover memory management
- Development workflow patterns

#### Legacy Documentation (Moved to `/docs/legacy/`)

- **architecture-clean-ddd.md** - Original Clean Architecture design
- **data-model-original.md** - Drizzle ORM schema
- **tech-stack-drizzle-supabase.md** - Original technology choices
- **domain-driven-design.md** - DDD patterns and bounded contexts

*These documents are preserved for reference when scaling beyond MVP.*

#### Still Relevant Documentation

##### [CALCULATOR.md](./CALCULATOR.md) - Financial Formulas
**Status**: ✅ ACTIVE  
Core financial calculations (PMT formula, projections) - still applicable.

#### AI & Integration

##### [AGENTS.md](./AGENTS.md) - AI Design
**Status**: 📝 PARTIAL  
Multi-agent concepts still valid, but implementation simplified in `convex/ai.ts`.

##### [REFERENCE_LINKS.md](./REFERENCE_LINKS.md) - External Links
**Status**: ✅ ACTIVE  
Useful external documentation and API references.

### 🔧 Simplified Development Workflow

1. **Write Convex Function**: Mutation, query, or action
2. **Add Validation**: Use `convex/lib/validation.ts`
3. **Test Locally**: `npm run dev` with hot reload
4. **Deploy**: `npx convex deploy` when ready

### 🧪 Testing (To Be Implemented)

- **Vitest** for unit tests
- Focus on `convex/lib/financial.ts` calculations
- Mock Convex functions for testing
- Property-based testing for PMT formula

### 📊 Current Status

#### ✅ Completed
- Basic CRUD for income/expenses/loans
- AI fact extraction from chat
- Duplicate prevention logic
- Edit/delete functionality
- Pending facts system

#### 🚧 In Progress
- Fact validation UI components
- Testing infrastructure

#### 📋 TODO
- Schematic billing integration
- Real estate projects (PAID tier)
- Simulations (PREMIUM tier)

### 🚀 Quick Start

```bash
# Install and run
npm install
npm run dev

# Deploy to production
npx convex deploy
npm run build
# Deploy frontend to Vercel/Netlify
```

### 📚 Resources

- [Convex Documentation](https://docs.convex.dev)
- [AI SDK Documentation](https://sdk.vercel.ai)
- [Product Requirements](../product/PRD.md)
- [Legacy Architecture](../legacy/) - For reference when scaling

---

*Simplified technical documentation for Fourmi's Convex implementation - focused on shipping the MVP quickly.*