# Technology Reference Links
## Fourmi Financial Copilot

### Core Technologies

#### Database & ORM
- **[Supabase](https://supabase.com/)** - PostgreSQL with real-time, auth, edge functions
  - [Supabase Docs](https://supabase.com/docs)
  - [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)
  - [Edge Functions](https://supabase.com/docs/guides/functions)

- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe, lightweight ORM
  - [Drizzle with Supabase Guide](https://orm.drizzle.team/docs/tutorials/drizzle-with-supabase)
  - [Schema Definition](https://orm.drizzle.team/docs/sql-schema-declaration)
  - [Queries](https://orm.drizzle.team/docs/crud)

#### Business & Payments
- **[Schematic](https://schematichq.com/)** - Feature management + billing
  - [Documentation](https://docs.schematichq.com/)
  - [Next.js Integration](https://docs.schematichq.com/integrations/nextjs)
  - [Feature Flags API](https://docs.schematichq.com/api-reference/flags)

#### ShadCN Ecosystem Libraries

##### Chat & AI Components
- **[Assistant UI](https://github.com/Yonom/assistant-ui)** - React components for AI chat
  - Documentation: Check repository README
  - Features: Streaming, custom message types, thread management

- **[Simple AI](https://github.com/simple-ai-org/simple-ai)** - AI app building blocks
  - Components and utilities for AI interfaces

##### Form Generation
- **[AutoForm](https://github.com/vantezzen/autoform)** - Automatic forms from Zod schemas
  - [Documentation](https://autoform.dev/)
  - [Examples](https://autoform.dev/examples)
  - Integration with ShadCN/ui components

##### Data Visualization
- **[Tremor](https://tremor.so/)** - Charts and dashboard components
  - [Documentation](https://tremor.so/docs/getting-started/installation)
  - [Chart Gallery](https://tremor.so/docs/visualizations/chart-library)
  - Built for financial and business data

##### Advanced Tables
- **[TanStack UI Table](https://github.com/sadmann7/shadcn-table)** - Advanced data tables
  - [TanStack Table Docs](https://tanstack.com/table/latest)
  - Server-side operations, virtual scrolling
  - Custom cell rendering

##### Utility Components
- **[Date-Time Range Picker](https://github.com/johnpolacek/date-range-picker-for-shadcn)** - Date/time selection
  - Perfect for financial data filtering

- **[Async Select](https://github.com/AbhinetKrAnand/async-select-shadcn-ui)** - Searchable select with async data
  - Debounced search, dynamic options

### AI & Language Models
- **[Vercel AI SDK](https://ai-sdk.dev/)** - AI agent orchestration
  - [Documentation](https://ai-sdk.dev/docs)
  - [Streaming](https://ai-sdk.dev/docs/concepts/streaming)
  - [Tool Calling](https://ai-sdk.dev/docs/concepts/tools-and-tool-calling)

- **[OpenAI API](https://platform.openai.com/docs/)** - Language models
- **[Anthropic Claude API](https://docs.anthropic.com/)** - Alternative language models

### Development Tools
- **[TRPC](https://trpc.io/)** - Type-safe APIs
  - [Next.js Integration](https://trpc.io/docs/quickstart)
  - [Subscriptions](https://trpc.io/docs/subscriptions)

- **[Zod](https://zod.dev/)** - TypeScript schema validation
- **[Vitest](https://vitest.dev/)** - Testing framework
- **[Storybook](https://storybook.js.org/)** - Component development

### Awesome ShadCN Collections
- **[Main Awesome List](https://github.com/birobirobiro/awesome-shadcn-ui)** - Comprehensive collection
- **[ShadCN/ui Components](https://ui.shadcn.com/)** - Official component library
- **[ShadCN Extensions](https://github.com/hsuanyi-chou/shadcn-ui-expansions)** - Community extensions

### Recommended Libraries from Awesome Collection

#### ✅ Selected for Fourmi
1. **assistant-ui** - AI chat components
2. **auto-form** - Dynamic form generation  
3. **tremor** - Financial charts and dashboards
4. **tanstack-ui-table** - Advanced data tables
5. **date-time-range-picker-shadcn** - Date filtering
6. **async-select** - Dynamic search components

#### 🤔 Worth Considering
1. **druid/ui** - Intercom-inspired chatbot components
2. **linked-chart** - Charts linked with data tables  
3. **downshift-shadcn-combobox** - Advanced autocomplete
4. **file-uploader** - File upload with drag & drop
5. **phone-input** - International phone validation

#### ❌ Not Needed for MVP
1. **video/audio components** - Not relevant for financial app
2. **e-commerce components** - Different use case
3. **social media integrations** - Out of scope
4. **gaming/entertainment** - Not applicable

### Integration Patterns

#### TRPC + Chat Interface
```typescript
// Real-time chat with AI agents
const chatRouter = createTRPCRouter({
  stream: protectedProcedure
    .input(z.object({ message: z.string() }))
    .subscription(async function* ({ input }) {
      const response = await aiAgent.stream(input.message);
      for await (const chunk of response) {
        yield chunk;
      }
    }),
});
```

#### AutoForm + Fact Validation
```typescript
// Dynamic forms for AI-extracted facts
<AutoForm
  schema={factValidationSchema}
  onSubmit={(data) => validateFact.mutate(data)}
  fieldConfig={{
    amount: {
      fieldType: "number",
      inputProps: {
        placeholder: "Enter amount in EUR",
      },
    },
  }}
/>
```

#### Tremor + Financial KPIs
```typescript
// Financial dashboard components
<Card>
  <Title>Monthly Cashflow</Title>
  <Metric>-210 €</Metric>
  <Flex className="mt-4">
    <Text>vs last month</Text>
    <Text>-15%</Text>
  </Flex>
  <AreaChart
    data={cashflowData}
    categories={["income", "expenses"]}
    colors={["emerald", "red"]}
  />
</Card>
```

#### Schematic + Feature Gates
```typescript
// Feature-gated components
function AdvancedSimulations() {
  const { hasFeature } = useSchematic();
  
  if (!hasFeature("advanced_simulations")) {
    return <UpgradePrompt feature="Advanced Simulations" />;
  }
  
  return <SimulationDashboard />;
}
```

### Development Workflow Links
- **[Next.js App Router](https://nextjs.org/docs/app)** - Routing and layouts
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - Type definitions
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Styling framework
- **[Vercel Deployment](https://vercel.com/docs)** - Production hosting

### Financial Calculation Resources
- **[Financial Formulas](https://www.financeformulas.net/)** - PMT, NPV, IRR calculations
- **[European Mortgage Standards](https://www.eba.europa.eu/)** - Regulatory guidelines
- **[French Real Estate APIs](https://www.data.gouv.fr/)** - Market data sources