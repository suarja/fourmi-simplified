# Projects & Simulations Implementation Architecture

## Overview

This document outlines the implementation strategy for Financial Projects & Simulations in Fourmi, following the existing patterns established in the codebase while enabling seamless chat-to-canvas interactions.

## Architecture Pattern: Project-Specific Agent Tools

### Core Pattern
We follow the exact pattern established in `convex/agents/financialTools.ts`:
- Each project type = one focused agent tool using `createTool()`
- Tools use `generateObject()` for AI processing and structured data extraction
- Tools create/update projects in database and return structured responses
- Main financial agent orchestrates these specialized tools

### Why This Pattern?
1. **Modularity**: Each project type is self-contained and focused
2. **Consistency**: Follows existing successful financial tools pattern
3. **Testability**: Each tool can be tested independently
4. **Scalability**: Easy to add new project types without bloating main agent
5. **Error Handling**: Isolated error boundaries per project type

## Data Model

### Projects Table
```typescript
projects: defineTable({
  profileId: v.id("profiles"),
  type: v.union(
    v.literal("debt_consolidation"), 
    v.literal("rent_vs_buy"),
    v.literal("debt_payoff_strategy")
  ),
  name: v.string(), // "Credit Card Consolidation" or user-defined
  status: v.union(v.literal("draft"), v.literal("active"), v.literal("completed")),
  inputs: v.any(), // Project-specific input data (flexible JSON)
  results: v.optional(v.any()), // Calculated results (flexible JSON)
  state: v.union(v.literal("FRESH"), v.literal("STALE"), v.literal("NEEDS_DATA")),
  created: v.number(),
  updated: v.number(),
}).index("by_profile", ["profileId"])
  .index("by_type", ["type"])
  .index("by_status", ["status"])
```

### Conversation Context Extension
```typescript
conversations: {
  // ... existing fields
  activeProjectId: v.optional(v.id("projects")),
}
```

## Project Types & Tool Implementation

### 1. Debt Consolidation Tool
**File**: `convex/agents/debtConsolidationTool.ts`

**Trigger Phrases**: 
- "consolidate my debt"
- "personal loan vs balance transfer"  
- "combine my credit cards"

**Tool Structure**:
```typescript
export const debtConsolidationTool = createTool({
  description: "Analyze debt consolidation options for user's existing debts",
  args: z.object({
    message: z.string(),
    consolidationOptions: z.optional(z.array(z.object({
      type: z.enum(["personal_loan", "balance_transfer", "heloc"]),
      rate: z.number(),
      term: z.number(),
      fees: z.number()
    })))
  }),
  handler: async (ctx, { message, consolidationOptions }) => {
    // 1. Get user's existing loans from profile
    // 2. Extract consolidation intent using generateObject()
    // 3. Calculate potential savings for each option
    // 4. Create/update consolidation project
    // 5. Set activeProjectId in conversation
    // 6. Return analysis results
  }
});
```

**Project Data Structure**:
```typescript
// inputs
{
  existingDebts: Loan[], // From user profile
  consolidationOptions: ConsolidationOption[],
  assumptions: {
    currentCreditScore: number,
    monthlyIncome: number
  }
}

// results
{
  totalCurrentPayment: number,
  totalCurrentInterest: number,
  consolidationComparison: {
    personalLoan: { monthlyPayment: number, totalInterest: number, savings: number },
    balanceTransfer: { monthlyPayment: number, totalInterest: number, savings: number },
    heloc: { monthlyPayment: number, totalInterest: number, savings: number }
  },
  recommendation: string,
  nextSteps: string[]
}
```

### 2. Debt Payoff Strategy Tool
**File**: `convex/agents/debtPayoffTool.ts`

**Trigger Phrases**:
- "avalanche vs snowball"
- "pay off debt faster"
- "debt payoff strategy"

**Project Data Structure**:
```typescript
// inputs
{
  debts: Loan[], // From user profile
  extraPayment: number, // Monthly extra amount
  strategy: "avalanche" | "snowball" | "custom"
}

// results  
{
  avalancheMethod: PayoffPlan,
  snowballMethod: PayoffPlan,
  comparison: {
    totalInterestSaved: number,
    monthsSaved: number,
    recommendedStrategy: string
  },
  payoffTimeline: PayoffMilestone[]
}
```

## UI State Management

### View Mode State
```typescript
type ViewMode = 'dashboard' | 'project';
type ProjectMode = 'overview' | 'editing' | 'results';

const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
const [projectMode, setProjectMode] = useState<ProjectMode>('overview');
const [activeProject, setActiveProject] = useState<Project | null>(null);
```

### Auto-Switching Logic
```typescript
// In FinancialCopilot.tsx
const conversation = useQuery(api.conversations.get, { threadId: currentThreadId });
const activeProject = useQuery(
  api.projects.get, 
  conversation?.activeProjectId ? { projectId: conversation.activeProjectId } : "skip"
);

useEffect(() => {
  if (conversation?.activeProjectId && activeProject) {
    setViewMode('project');
    setActiveProject(activeProject);
  } else {
    setViewMode('dashboard');
    setActiveProject(null);
  }
}, [conversation?.activeProjectId, activeProject]);
```

### Canvas Layout
```typescript
// Replace FinancialDashboard conditionally
{viewMode === 'dashboard' ? (
  <FinancialDashboard profileId={profile._id} />
) : (
  <ProjectCanvas 
    project={activeProject}
    onBack={() => setViewMode('dashboard')}
    onUpdate={handleProjectUpdate}
  />
)}
```

## Agent Integration Flow

### 1. User Message Processing
```
User: "I want to consolidate my credit card debt"
  ↓
Financial Agent receives message
  ↓
Agent calls debtConsolidationTool
  ↓
Tool extracts intent, gets user loans, calculates options
  ↓
Tool creates/updates project, sets activeProjectId
  ↓
Tool returns analysis results to agent
  ↓
Agent responds with project summary
  ↓
UI detects activeProjectId change → switches to project canvas
```

### 2. Project State Management
```
Project States:
- NEEDS_DATA: Missing required inputs, show input form
- FRESH: Recently calculated, show current results  
- STALE: Underlying data changed, show refresh button
```

### 3. Context Awareness
```typescript
// Agent tools can access current project context
const getProjectContext = async (ctx) => {
  const conversation = await ctx.runQuery(api.conversations.getCurrent);
  if (conversation?.activeProjectId) {
    return await ctx.runQuery(api.projects.get, { 
      projectId: conversation.activeProjectId 
    });
  }
  return null;
};
```

## Component Architecture

### ProjectCanvas Component
```typescript
interface ProjectCanvasProps {
  project: Project;
  onBack: () => void;
  onUpdate: (updates: Partial<Project>) => void;
}

<ProjectCanvas>
  <ProjectHeader project={project} onBack={onBack} />
  <ProjectTabs activeTab={projectMode} onTabChange={setProjectMode}>
    <ProjectInputs project={project} onUpdate={onUpdate} />
    <ProjectResults results={project.results} />
    <ProjectComparison comparisons={project.results?.comparison} />
  </ProjectTabs>
  <ProjectActions 
    project={project}
    onRefresh={handleRefresh}
    onShare={handleShare}
  />
</ProjectCanvas>
```

### Project-Specific Components
```
src/components/projects/
├── ProjectCanvas.tsx           # Main project container
├── ProjectHeader.tsx          # Project name, status, actions
├── ProjectTabs.tsx            # Navigation between sections
├── debt-consolidation/
│   ├── ConsolidationInputs.tsx    # Input form
│   ├── ConsolidationResults.tsx   # Results display
│   └── ConsolidationComparison.tsx # Option comparison
└── shared/
    ├── ProjectActions.tsx     # Refresh, share buttons
    └── ProjectUtils.ts        # Common utilities
```

## Integration with Existing Systems

### Financial Tools Integration
- Debt consolidation tool accesses existing loans via `api.profiles.getFinancialData`
- Leverages existing duplicate detection and validation logic
- Follows same error handling and response patterns

### Schematic Integration (Future)
```typescript
// In project tools
const planAccess = await checkProjectAccess(ctx, "debt_consolidation", userPlan);
if (!planAccess.allowed) {
  return {
    success: false,
    upgradeRequired: true,
    message: planAccess.upgradeMessage
  };
}
```

### Chat Interface Integration
- Project tools return special response types that UI can handle
- Upgrade prompts displayed inline in chat when plan limits hit
- Seamless transitions between chat and canvas without losing context

## Testing Strategy

### Unit Testing
- Each project tool tested independently with mock data
- UI components tested with mock project data
- State management tested with various project states

### Integration Testing
- End-to-end flow: chat → project creation → canvas display
- Context switching: dashboard ↔ project canvas
- Data synchronization: project updates reflected in real-time

### User Testing Scenarios
1. "Consolidate my credit cards" → see analysis options
2. "Compare avalanche vs snowball" → see payoff strategies
3. Update project parameters → see recalculated results
4. Switch between projects → context maintained

## Future Expansion

### Adding New Project Types
1. Create new tool in `convex/agents/[projectType]Tool.ts`
2. Define project data structure for inputs/results
3. Add UI components in `src/components/projects/[projectType]/`
4. Add tool to main financial agent
5. Update router logic for trigger phrases

### Advanced Features
- Multi-project comparisons (requires simulations table)
- Project templates and presets
- Export capabilities (PDF, CSV)
- Social sharing of results
- Real-time market data integration

This architecture ensures scalable, maintainable code while delivering the seamless chat-to-canvas experience outlined in the product vision.