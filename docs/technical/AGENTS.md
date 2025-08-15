# AI Agents Specification
## Fourmi Financial Copilot

### Agent Architecture Overview

**Multi-Agent System using Vercel AI SDK**
- Specialized agents for different tasks
- Tool-based architecture with function calling
- Human-in-the-loop validation for critical decisions
- Structured output with Zod validation

```typescript
import { createAgent, createTool } from "ai";

interface Agent {
  role: AgentRole;
  model: LanguageModel;
  tools: Record<string, Tool>;
  systemPrompt: string;
  maxTokens?: number;
  temperature?: number;
}
```

### Agent Roles & Responsibilities

#### 1. Extractor Agent
**Purpose**: Extract structured facts from natural language conversations

```typescript
const extractorAgent = createAgent({
  model: openai("gpt-4"),
  systemPrompt: `
You are a financial data extraction specialist. Your role is to identify and extract 
structured facts from user conversations about their financial situation and real estate goals.

NEVER automatically save facts. Always propose them for human validation.

Key extraction areas:
- Income information (net monthly, other sources)
- Existing financial obligations (loans, rent, expenses)
- Savings and available capital
- Real estate preferences (location, budget, timeline)
- Risk tolerance and constraints

Output format: Use the extractFacts tool with high confidence scores only for clear statements.
For ambiguous information, use the requestClarification tool.
  `,
  tools: {
    extractFacts: extractFactsTool,
    requestClarification: requestClarificationTool,
    searchMarketData: searchMarketDataTool,
  },
  temperature: 0.1, // Low temperature for accuracy
});
```

**Tools:**
```typescript
const extractFactsTool = createTool({
  description: "Extract structured facts from conversation",
  parameters: z.object({
    facts: z.array(z.object({
      key: z.string().describe("Unique identifier like 'income_primary_net'"),
      value: z.union([z.string(), z.number()]),
      unit: z.string().optional().describe("Unit like 'EUR/month', 'years'"),
      confidence: z.number().min(0).max(1),
      source: z.literal("conversation"),
      context: z.string().describe("Original text that supports this fact"),
    })),
    ambiguous: z.array(z.string()).describe("Questions needing clarification"),
  }),
  execute: async ({ facts, ambiguous }) => {
    // Return structured facts for human validation
    return {
      proposed_facts: facts,
      clarification_needed: ambiguous,
      requires_validation: true,
    };
  },
});
```

#### 2. Modeler Agent
**Purpose**: Create and structure financial simulations based on validated facts

```typescript
const modelerAgent = createAgent({
  model: openai("gpt-4"),
  systemPrompt: `
You are a financial modeling specialist. Create comprehensive simulation requests 
based on validated user facts and real estate projects.

Your responsibilities:
- Combine multiple profiles for household simulations
- Select appropriate assumption tiers based on user risk profile
- Suggest reasonable overrides for specific local conditions
- Ensure all required data is present before creating simulations

Always validate inputs and suggest missing information clearly.
  `,
  tools: {
    createSimulation: createSimulationTool,
    validateInputs: validateInputsTool,
    suggestAssumptions: suggestAssumptionsTool,
  },
  temperature: 0.2,
});
```

**Tools:**
```typescript
const createSimulationTool = createTool({
  description: "Create a new financial simulation",
  parameters: z.object({
    name: z.string().describe("Descriptive name for the simulation"),
    profileIds: z.array(z.string()).min(1),
    projectId: z.string(),
    assumptionTier: z.enum(["basse", "mediane", "haute"]),
    overrides: z.record(z.any()).optional(),
    reasoning: z.string().describe("Why these settings were chosen"),
  }),
  execute: async (params) => {
    // Validate and create simulation
    const simulation = await simulationService.create(params);
    return {
      simulationId: simulation.id,
      status: "created",
      nextSteps: ["run_calculations", "generate_results"],
    };
  },
});
```

#### 3. Calculator Agent
**Purpose**: Execute financial calculations and generate projections

```typescript
const calculatorAgent = createAgent({
  model: openai("gpt-4"),
  systemPrompt: `
You are a financial calculation engine. Execute precise mathematical calculations 
for real estate financial projections.

Your responsibilities:
- Run deterministic financial calculations
- Generate year-by-year projections
- Calculate key KPIs (cashflow, break-even, total cost)
- Validate calculation inputs for realism
- Handle edge cases and error conditions gracefully

Always show your calculation methodology and assumptions clearly.
  `,
  tools: {
    calculateProjection: calculateProjectionTool,
    validateCalculationInputs: validateCalculationInputsTool,
    generateKPIs: generateKPIsTool,
  },
  temperature: 0, // Deterministic calculations
});
```

#### 4. Composer Agent  
**Purpose**: Transform calculation results into user-friendly UI blocks

```typescript
const composerAgent = createAgent({
  model: openai("gpt-4"),
  systemPrompt: `
You are a financial communication specialist. Transform complex calculation results 
into clear, actionable UI components that non-financial users can understand.

Design principles:
- Present 3-4 key metrics prominently (monthly cashflow, savings effort, break-even, total cost)
- Use progressive disclosure - simple overview, detailed breakdown on request
- Highlight actionable insights and next steps
- Use clear, jargon-free language
- Include contextual explanations and tooltips

Always provide narrative explanations alongside visual components.
  `,
  tools: {
    renderMetricCards: renderMetricCardsTool,
    renderComparison: renderComparisonTool,
    renderTimeline: renderTimelineTool,
    generateInsights: generateInsightsTool,
  },
  temperature: 0.3,
});
```

**Tools:**
```typescript
const renderMetricCardsTool = createTool({
  description: "Generate metric cards for key financial KPIs",
  parameters: z.object({
    kpis: z.object({
      monthlyCashflow: z.number(),
      savingsEffort: z.number(),
      totalCostOverHorizon: z.number(),
      breakEvenYear: z.number().nullable(),
    }),
    context: z.object({
      simulationName: z.string(),
      assumptionTier: z.string(),
      timeframe: z.string(),
    }),
  }),
  execute: async ({ kpis, context }) => {
    return [
      {
        type: "MetricCard",
        title: "Monthly Cashflow",
        value: formatters.currency(kpis.monthlyCashflow),
        subtitle: kpis.monthlyCashflow < 0 ? "Monthly cost" : "Monthly income",
        tooltip: "Total monthly cost after mortgage, taxes, and maintenance",
        trend: kpis.monthlyCashflow < 0 ? "down" : "up",
        color: kpis.monthlyCashflow < 0 ? "error" : "success",
      },
      {
        type: "MetricCard", 
        title: "Savings Effort",
        value: formatters.percentage(kpis.savingsEffort),
        subtitle: "Of monthly income",
        tooltip: "Percentage of income needed for this housing choice",
        color: kpis.savingsEffort > 0.3 ? "warning" : "default",
      },
      // ... other cards
    ];
  },
});
```

#### 5. Comparator Agent
**Purpose**: Generate side-by-side comparisons of multiple scenarios

```typescript
const comparatorAgent = createAgent({
  model: openai("gpt-4"),
  systemPrompt: `
You are a financial comparison specialist. Create clear, actionable comparisons 
between different financial scenarios (rent vs buy, different properties, etc.).

Focus on:
- Highlighting the most significant differences
- Explaining trade-offs in plain language
- Identifying break-even points and decision factors
- Providing personalized recommendations based on user profile
- Showing both short-term and long-term implications

Make recommendations confident but explain the reasoning clearly.
  `,
  tools: {
    generateComparison: generateComparisonTool,
    identifyTradeoffs: identifyTradeoffsTool,
    recommendScenario: recommendScenarioTool,
  },
  temperature: 0.4,
});
```

### Agent Orchestration

#### Multi-Agent Workflow
```typescript
interface AgentWorkflow {
  id: string;
  steps: AgentStep[];
  currentStep: number;
  context: WorkflowContext;
}

interface AgentStep {
  agent: AgentRole;
  input: any;
  output?: any;
  status: "pending" | "running" | "completed" | "failed";
  humanValidation?: boolean;
}

// Example workflow: User message → Financial projection
const projectionWorkflow: AgentWorkflow = {
  id: "projection_001",
  steps: [
    {
      agent: "extractor",
      input: { message: "I earn 3000€/month and want to buy in Paris" },
      humanValidation: true, // Facts must be validated
    },
    {
      agent: "modeler", 
      input: { facts: "validated_facts", project: "paris_property" },
      humanValidation: false,
    },
    {
      agent: "calculator",
      input: { simulation_request: "from_modeler" },
      humanValidation: false,
    },
    {
      agent: "composer",
      input: { calculation_results: "from_calculator" },
      humanValidation: false,
    },
  ],
  currentStep: 0,
  context: {},
};
```

#### Agent Communication Protocol
```typescript
interface AgentMessage {
  id: string;
  fromAgent: AgentRole;
  toAgent: AgentRole;
  type: "request" | "response" | "error";
  payload: any;
  timestamp: Date;
  requiresValidation?: boolean;
}

class AgentOrchestrator {
  async executeWorkflow(workflow: AgentWorkflow): Promise<AgentWorkflowResult> {
    for (const step of workflow.steps) {
      if (step.humanValidation && !step.validated) {
        // Pause for human validation
        return { status: "awaiting_validation", step: step };
      }
      
      const agent = this.getAgent(step.agent);
      const result = await agent.execute(step.input);
      
      step.output = result;
      step.status = "completed";
    }
    
    return { status: "completed", results: workflow.steps.map(s => s.output) };
  }
}
```

### Tool Specifications

#### Search & External Data Tools
```typescript
const searchMarketDataTool = createTool({
  description: "Search for real estate market data and trends",
  parameters: z.object({
    location: z.object({
      city: z.string(),
      country: z.string(),
    }),
    propertyType: z.enum(["apartment", "house", "investment"]),
    priceRange: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }),
  }),
  execute: async ({ location, propertyType, priceRange }) => {
    // Integration with real estate APIs
    // Return market data, price trends, etc.
    return {
      averagePrice: 450000,
      pricePerSqm: 8500,
      trend: "increasing",
      rentYield: 0.035,
      source: "notaires.fr",
    };
  },
});

const currencyConversionTool = createTool({
  description: "Convert between EUR and DOP with current rates",
  parameters: z.object({
    amount: z.number(),
    from: z.enum(["EUR", "DOP"]),
    to: z.enum(["EUR", "DOP"]),
  }),
  execute: async ({ amount, from, to }) => {
    // Get current exchange rate
    const rate = await exchangeRateService.getRate(from, to);
    return {
      originalAmount: amount,
      convertedAmount: amount * rate,
      rate,
      timestamp: new Date(),
    };
  },
});
```

### Safety & Validation

#### Input Validation
```typescript
const agentInputValidation = {
  financial_amounts: z.number().min(0).max(10_000_000), // Max 10M euros
  interest_rates: z.number().min(0).max(0.2), // Max 20%
  time_horizons: z.number().min(1).max(50), // 1-50 years
  percentages: z.number().min(0).max(1),
};

// Validate before agent processing
function validateAgentInput(input: any, schema: z.ZodSchema): boolean {
  try {
    schema.parse(input);
    return true;
  } catch (error) {
    logger.warn("Agent input validation failed", { input, error });
    return false;
  }
}
```

#### Output Sanitization
```typescript
function sanitizeAgentOutput(output: any): any {
  // Remove any potentially sensitive information
  // Validate financial calculations are reasonable
  // Ensure UI blocks conform to expected schemas
  
  return {
    ...output,
    metadata: {
      generatedAt: new Date(),
      agentVersion: "1.0.0",
      validated: true,
    },
  };
}
```

### Error Handling & Fallbacks

#### Agent Error Recovery
```typescript
class AgentErrorHandler {
  async handleAgentFailure(
    agent: AgentRole,
    error: Error,
    input: any
  ): Promise<AgentResult> {
    switch (agent) {
      case "extractor":
        // Fallback to manual form input
        return { type: "fallback", action: "manual_input_form" };
      
      case "calculator":
        // Use cached results or simplified calculation
        return await this.fallbackCalculation(input);
      
      case "composer":
        // Return basic metric cards without advanced formatting
        return this.generateBasicUI(input);
      
      default:
        throw error; // Re-throw if no fallback available
    }
  }
}
```

### Performance & Monitoring

#### Agent Performance Metrics
```typescript
interface AgentMetrics {
  agentRole: AgentRole;
  averageResponseTime: number;
  successRate: number;
  tokenUsage: number;
  userSatisfactionScore?: number;
}

// Monitor agent performance
class AgentMonitoring {
  trackExecution(agent: AgentRole, duration: number, success: boolean) {
    // Track metrics for optimization
  }
  
  detectAnomalies(metrics: AgentMetrics[]): AgentAnomalies {
    // Identify performance issues
  }
}
```

### Testing Strategy

#### Agent Testing Framework
```typescript
describe("ExtractorAgent", () => {
  it("should extract income facts with high confidence", async () => {
    const input = "I earn 3000 euros per month";
    const result = await extractorAgent.execute({ message: input });
    
    expect(result.proposed_facts).toContainEqual({
      key: "income_primary_net",
      value: 3000,
      unit: "EUR/month",
      confidence: expect.toBeGreaterThan(0.8),
    });
  });
  
  it("should request clarification for ambiguous statements", async () => {
    const input = "I make good money";
    const result = await extractorAgent.execute({ message: input });
    
    expect(result.clarification_needed).toContain(
      expect.stringContaining("specific amount")
    );
  });
});
```