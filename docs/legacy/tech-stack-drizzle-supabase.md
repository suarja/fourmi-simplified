# Technology Stack & Integration Guide
## Fourmi Financial Copilot

### Updated Core Technologies

#### Database & ORM
- **Supabase** - PostgreSQL with real-time subscriptions, auth, and edge functions
- **Drizzle ORM** - Type-safe, performant ORM with excellent TypeScript support
- **Supabase Edge Functions** - Server-side logic for AI agent processing

#### Business & Payments
- **Schematic** - Feature management and subscription billing platform
  - Feature flags for three-tier access control
  - Stripe integration for subscription management
  - Usage-based metering for AI operations
  - Customer entitlements and plan management

#### Form Generation & AI Interface
- **AutoForm (vantezzen)** - Automatic form generation from Zod schemas
- **Assistant UI** - React components for AI chat interfaces
- **Simple AI** - Components and blocks for AI app development

### Selected ShadCN Libraries

#### Essential for Financial Copilot

```typescript
// Core chat and AI interface
import { ChatInterface } from "assistant-ui";
import { AIComponents } from "simple-ai";

// Financial data visualization
import { Tremor } from "@tremor/react"; // Charts and financial dashboards
import { DataTable } from "tanstack-ui-table"; // Advanced data tables

// Dynamic form generation
import { AutoForm } from "@autoform/react";
import { AsyncSelect } from "async-select-shadcn";

// Date and time handling for financial data
import { DateTimeRangePicker } from "date-time-range-picker-shadcn";

// Utility components
import { PhoneInput } from "phone-input-shadcn";
import { FileUploader } from "file-uploader-shadcn";
```

#### Library Justifications

**Assistant UI** - Perfect for our chat-first interface with AI agents
- Pre-built chat components
- Streaming message support
- Custom message types for UI blocks

**Tremor** - Essential for financial visualizations
- Financial charts and KPI dashboards
- Built-in responsive design
- Integrates seamlessly with ShadCN

**AutoForm** - Critical for dynamic form generation
- AI agents can generate forms from Zod schemas
- Perfect for fact validation interfaces
- Supports our human-in-the-loop workflows

**TanStack UI Table** - Advanced financial data display
- Server-side sorting/filtering
- Virtual scrolling for large datasets
- Custom cell rendering for financial formatting

### Architecture Integration

#### Supabase + Drizzle Setup

```typescript
// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;

// Database schema with Drizzle
import { pgTable, serial, text, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  persons: jsonb("persons").notNull(),
  loans: jsonb("loans").default([]),
  savings: serial("savings").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const simulations = pgTable("simulations", {
  id: serial("id").primaryKey(),
  profileIds: jsonb("profile_ids").notNull(),
  projectId: serial("project_id").notNull(),
  results: jsonb("results"),
  status: text("status").default("FRESH"),
  inputHash: text("input_hash").notNull(),
});
```

#### Schematic Integration for Feature Management

```typescript
// lib/schematic.ts
import { SchematicClient } from "@schematichq/client";

const schematic = new SchematicClient({
  apiKey: process.env.SCHEMATIC_API_KEY!,
});

// Feature flag checking
export async function hasFeatureAccess(
  userId: string,
  feature: "advanced_simulations" | "comparison_tools" | "export_features"
): Promise<boolean> {
  return await schematic.checkFlag({
    userId,
    flagKey: feature,
  });
}

// Usage tracking for AI operations
export async function trackAIUsage(
  userId: string,
  operation: "fact_extraction" | "simulation_generation" | "comparison_analysis"
) {
  await schematic.track({
    userId,
    event: `ai_${operation}`,
    value: 1,
  });
}
```

### TRPC + Chat Interface Integration

#### AI Agent TRPC Routes

```typescript
// server/api/routers/agents.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { extractorAgent, modelerAgent, composerAgent } from "~/lib/agents";

export const agentsRouter = createTRPCRouter({
  // Streaming chat responses
  chatStream: protectedProcedure
    .input(z.object({
      message: z.string(),
      conversationId: z.string(),
    }))
    .subscription(async function* ({ input, ctx }) {
      // Stream AI agent responses
      const response = await extractorAgent.stream(input.message);
      
      for await (const chunk of response) {
        yield {
          type: "chunk" as const,
          content: chunk.content,
          facts: chunk.facts,
        };
      }
    }),

  // Generate UI blocks from simulation results
  generateUIBlocks: protectedProcedure
    .input(z.object({
      simulationId: z.string(),
      blockTypes: z.array(z.enum(["metrics", "comparison", "timeline"])),
    }))
    .mutation(async ({ input, ctx }) => {
      const simulation = await ctx.db.query.simulations.findFirst({
        where: eq(simulations.id, input.simulationId),
      });

      const blocks = await composerAgent.generateBlocks({
        results: simulation.results,
        blockTypes: input.blockTypes,
      });

      return blocks;
    }),
});
```

#### Chat Interface with TRPC

```tsx
// components/chat/ChatInterface.tsx
import { api } from "~/utils/api";
import { AutoForm } from "@autoform/react";
import { ChatMessage, ChatInput } from "assistant-ui";

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // TRPC subscription for streaming chat
  api.agents.chatStream.useSubscription(
    { conversationId: "current" },
    {
      onData: (data) => {
        if (data.type === "chunk") {
          setMessages(prev => updateLastMessage(prev, data.content));
        }
      },
    }
  );

  // TRPC mutation for fact validation
  const validateFact = api.facts.validate.useMutation({
    onSuccess: () => {
      // Update UI with validated fact
    },
  });

  return (
    <div className="chat-container">
      <ChatMessages messages={messages} />
      
      {/* Dynamic fact validation forms */}
      {pendingFacts.map(fact => (
        <AutoForm
          key={fact.id}
          schema={factValidationSchema}
          onSubmit={(data) => validateFact.mutate({ ...fact, ...data })}
        />
      ))}
      
      <ChatInput onSend={sendMessage} />
    </div>
  );
}
```

### Development Workflow Updates

#### Database Migrations with Drizzle

```bash
# Generate migrations
npm run db:generate

# Push changes to Supabase
npm run db:push

# Studio for database management
npm run db:studio
```

#### Feature Flag Development

```typescript
// middleware.ts - Feature flag middleware
import { schematic } from "~/lib/schematic";

export async function middleware(request: NextRequest) {
  const userId = getUserId(request);
  
  // Check feature access for protected routes
  if (request.nextUrl.pathname.startsWith("/advanced")) {
    const hasAccess = await schematic.checkFlag({
      userId,
      flagKey: "advanced_simulations",
    });
    
    if (!hasAccess) {
      return NextResponse.redirect(new URL("/upgrade", request.url));
    }
  }
}
```

### Updated Commands

```bash
# Database operations
npm run db:generate     # Generate Drizzle migrations
npm run db:push         # Push to Supabase
npm run db:studio      # Open Drizzle Studio
npm run db:seed        # Seed development data

# Schematic feature management
npm run features:sync   # Sync feature flags
npm run billing:test   # Test billing integration

# Development with new stack
npm run dev            # Start with Supabase local
npm run build          # Build with feature flags
npm run deploy         # Deploy to Vercel + Supabase
```

### Migration Strategy

#### Phase 1: Core Infrastructure
1. **Supabase Setup** - Database, auth, real-time subscriptions
2. **Drizzle Migration** - Convert Prisma schemas to Drizzle
3. **Schematic Integration** - Feature flags for three-tier model

#### Phase 2: Enhanced UI
1. **Assistant UI Integration** - Replace custom chat components
2. **AutoForm Implementation** - Dynamic form generation
3. **Tremor Charts** - Financial visualizations

#### Phase 3: Advanced Features
1. **Real-time Collaboration** - Supabase realtime for shared simulations
2. **Edge Functions** - AI processing at the edge
3. **Advanced Analytics** - Usage tracking and billing optimization

### Benefits of New Stack

**Drizzle ORM**
- Better TypeScript support than Prisma
- Lighter runtime overhead
- More flexible query building
- Better edge runtime compatibility

**Supabase**
- Real-time subscriptions for collaborative features
- Built-in auth and row-level security
- Edge functions for AI processing
- Integrated file storage for exports

**Schematic**
- Unified feature management and billing
- Stripe integration out-of-the-box
- Usage-based metering for AI operations
- Customer self-service portal

**Selected ShadCN Libraries**
- Assistant UI for production-ready chat
- AutoForm for dynamic AI-generated forms
- Tremor for professional financial charts
- Reduced custom component development