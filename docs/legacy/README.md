# Legacy Documentation

This directory contains the original architectural documentation from when Fourmi was planned with a more complex Clean Architecture + DDD approach using Drizzle ORM, Supabase, and TRPC.

## Why Legacy?

In January 2025, we pivoted to a simplified approach using **Convex + Chef** to rapidly build an MVP and test the market. The original architecture was over-engineered for our immediate needs.

## What's Here?

- **architecture-clean-ddd.md** - Original Clean Architecture + Domain-Driven Design approach
- **data-model-original.md** - Database schema using Drizzle ORM
- **tech-stack-drizzle-supabase.md** - Technology stack with Supabase, Drizzle, Schematic
- **domain-driven-design.md** - Domain modeling and bounded contexts

## Current Approach

We now use:
- **Convex** for the backend (real-time database, functions, file storage)
- **Chef** for rapid AI-powered development
- **Simplified architecture** focused on getting features to market quickly

See `/docs/technical/` for the current simplified architecture documentation.

## Future Consideration

These documents may be valuable when:
- Scaling beyond MVP and needing more sophisticated patterns
- Implementing complex business logic that benefits from DDD
- Migrating to a different backend infrastructure
- Adding enterprise features that require Clean Architecture separation

For now, we're following the principle: **Make it work, then make it right, then make it fast.**