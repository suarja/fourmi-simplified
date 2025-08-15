# Budget Form Implementation - Dual Mode Architecture

## Context
This prompt focuses specifically on implementing the budget creation feature with a dual-mode architecture that supports both traditional form UI and chat interface integration.

## Prerequisites
- Review `/docs/prompts/01-foundational-ui-layout.md` first
- Ensure the foundational layout from Phase 1 is complete
- Review `/docs/technical/CALCULATOR.md` for budget calculation logic

## Core Requirement
Build a budget creation system that can seamlessly switch between:
1. **Form Mode**: Traditional multi-step form with cards and inputs
2. **Chat Mode**: Conversational interface that collects the same data
3. **Hybrid Mode**: Form with chat assistance for help and guidance

## Implementation Architecture

### 1. Abstraction Layer
Create a unified data collection abstraction:

```typescript
// /src/features/budget/abstractions/BudgetDataCollector.ts
interface BudgetDataCollector {
  // Core data structure
  data: Partial<BudgetData>;
  
  // Collection methods
  collectIncome(): Promise<Income[]>;
  collectExpenses(): Promise<Expense[]>;
  collectGoals(): Promise<FinancialGoal[]>;
  
  // Validation
  validateStep(step: BudgetStep): ValidationResult;
  canProceed(): boolean;
  
  // Persistence
  saveDraft(): Promise<void>;
  loadDraft(): Promise<Partial<BudgetData>>;
}
```

### 2. Form Implementation
```typescript
// /src/features/budget/components/BudgetFormMode.tsx
export function BudgetFormMode({ collector }: { collector: BudgetDataCollector }) {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Create Your Budget</CardTitle>
        <Progress value={progressPercentage} />
      </CardHeader>
      <CardContent>
        <Tabs value={currentStep}>
          <TabsList>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Fixed Expenses</TabsTrigger>
            <TabsTrigger value="variable">Variable Expenses</TabsTrigger>
            <TabsTrigger value="goals">Savings Goals</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>
          
          <TabsContent value="income">
            <IncomeForm onSubmit={collector.collectIncome} />
          </TabsContent>
          
          <TabsContent value="expenses">
            <ExpensesForm onSubmit={collector.collectExpenses} />
          </TabsContent>
          
          {/* Other tabs... */}
        </Tabs>
      </CardContent>
    </Card>
  );
}
```

### 3. Chat Wrapper Architecture
Design forms to be embeddable in chat:

```typescript
// /src/features/budget/components/ChatCompatibleForm.tsx
interface ChatCompatibleFormProps<T> {
  mode: 'standalone' | 'embedded' | 'guided';
  onComplete: (data: T) => void;
  context?: ChatContext;
}

export function ChatCompatibleIncomeForm<Income>({ 
  mode, 
  onComplete,
  context 
}: ChatCompatibleFormProps<Income>) {
  if (mode === 'embedded') {
    // Render minimal version for chat embedding
    return <MinimalIncomeInput onSubmit={onComplete} />;
  }
  
  if (mode === 'guided') {
    // Render with AI assistance panel
    return (
      <div className="grid grid-cols-2 gap-4">
        <IncomeForm onSubmit={onComplete} />
        <AiAssistantPanel context={context} />
      </div>
    );
  }
  
  // Default standalone mode
  return <IncomeForm onSubmit={onComplete} />;
}
```

### 4. Income Collection Component
```typescript
// /src/features/budget/components/forms/IncomeForm.tsx
const incomeSchema = z.object({
  source: z.string().min(1, "Income source is required"),
  amount: z.number().positive("Amount must be positive"),
  frequency: z.enum(['weekly', 'biweekly', 'monthly', 'yearly']),
  type: z.enum(['salary', 'freelance', 'investment', 'other']),
  isTaxed: z.boolean(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export function IncomeForm({ onSubmit }: { onSubmit: (data: Income[]) => void }) {
  const [incomes, setIncomes] = useState<Income[]>([]);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Income Sources</h3>
        <Button onClick={addIncomeSource} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Income
        </Button>
      </div>
      
      {incomes.map((income, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Source"
                placeholder="e.g., Main Job"
                value={income.source}
                onChange={(value) => updateIncome(index, 'source', value)}
              />
              
              <FormField
                label="Amount"
                type="number"
                placeholder="0.00"
                value={income.amount}
                onChange={(value) => updateIncome(index, 'amount', value)}
              />
              
              <Select
                value={income.frequency}
                onValueChange={(value) => updateIncome(index, 'frequency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id={`taxed-${index}`}
                  checked={income.isTaxed}
                  onCheckedChange={(checked) => updateIncome(index, 'isTaxed', checked)}
                />
                <Label htmlFor={`taxed-${index}`}>After Tax</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={saveDraft}>
          Save Draft
        </Button>
        <Button onClick={() => onSubmit(incomes)}>
          Continue
        </Button>
      </div>
    </div>
  );
}
```

### 5. Expense Categories Structure
```typescript
// /src/features/budget/data/expense-categories.ts
export const EXPENSE_CATEGORIES = {
  housing: {
    label: 'Housing',
    icon: Home,
    subcategories: ['Rent', 'Mortgage', 'Insurance', 'Utilities', 'Maintenance'],
  },
  transportation: {
    label: 'Transportation',
    icon: Car,
    subcategories: ['Car Payment', 'Insurance', 'Gas', 'Maintenance', 'Public Transit'],
  },
  food: {
    label: 'Food',
    icon: ShoppingCart,
    subcategories: ['Groceries', 'Restaurants', 'Delivery', 'Coffee'],
  },
  // ... more categories
} as const;
```

### 6. State Management with TRPC
```typescript
// /src/features/budget/hooks/useBudgetWizard.ts
export function useBudgetWizard() {
  const utils = api.useUtils();
  const [localData, setLocalData] = useState<Partial<BudgetData>>({});
  
  // Auto-save draft every 30 seconds
  const saveDraft = api.budget.saveDraft.useMutation({
    onSuccess: () => {
      toast.success('Draft saved');
    },
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(localData).length > 0) {
        saveDraft.mutate(localData);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [localData]);
  
  const completeBudget = api.budget.create.useMutation({
    onSuccess: (budget) => {
      router.push(`/budget/${budget.id}`);
      toast.success('Budget created successfully!');
    },
  });
  
  return {
    data: localData,
    updateData: setLocalData,
    saveDraft: () => saveDraft.mutate(localData),
    complete: () => completeBudget.mutate(localData as BudgetData),
  };
}
```

### 7. Validation and Business Rules
```typescript
// /src/features/budget/validation/budget-rules.ts
export const budgetValidation = {
  validateIncome: (incomes: Income[]): ValidationResult => {
    if (incomes.length === 0) {
      return { valid: false, error: 'At least one income source is required' };
    }
    
    const totalMonthlyIncome = calculateMonthlyTotal(incomes);
    if (totalMonthlyIncome < 0) {
      return { valid: false, error: 'Total income must be positive' };
    }
    
    return { valid: true };
  },
  
  validateExpenses: (expenses: Expense[], income: number): ValidationResult => {
    const totalExpenses = calculateMonthlyTotal(expenses);
    
    if (totalExpenses > income) {
      return { 
        valid: false, 
        warning: 'Expenses exceed income. Consider reviewing your budget.',
        canProceed: true 
      };
    }
    
    return { valid: true };
  },
  
  validate50_30_20_Rule: (budget: BudgetData): RuleValidation => {
    const income = calculateMonthlyTotal(budget.incomes);
    const needs = calculateNeeds(budget.expenses);
    const wants = calculateWants(budget.expenses);
    const savings = calculateSavings(budget.goals);
    
    return {
      needs: { target: income * 0.5, actual: needs, status: getStatus(needs, income * 0.5) },
      wants: { target: income * 0.3, actual: wants, status: getStatus(wants, income * 0.3) },
      savings: { target: income * 0.2, actual: savings, status: getStatus(savings, income * 0.2) },
    };
  },
};
```

### 8. Review and Summary Screen
```typescript
// /src/features/budget/components/BudgetReview.tsx
export function BudgetReview({ data }: { data: BudgetData }) {
  const validation = budgetValidation.validate50_30_20_Rule(data);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Budget Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <MetricCard
              label="Monthly Income"
              value={formatCurrency(data.totalIncome)}
              trend="+5% from last month"
            />
            <MetricCard
              label="Monthly Expenses"
              value={formatCurrency(data.totalExpenses)}
              status={data.totalExpenses > data.totalIncome ? 'warning' : 'success'}
            />
            <MetricCard
              label="Monthly Savings"
              value={formatCurrency(data.totalIncome - data.totalExpenses)}
              status={data.totalIncome > data.totalExpenses ? 'success' : 'error'}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>50/30/20 Rule Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <BudgetRuleVisualization validation={validation} />
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={goBack}>
          Back to Edit
        </Button>
        <Button onClick={saveBudget}>
          Save Budget
        </Button>
      </div>
    </div>
  );
}
```

## Integration Points

### 1. With Chat Interface (Future)
```typescript
// The form components should expose these methods for chat integration
interface ChatIntegration {
  // Convert form field to chat prompt
  toPrompt(field: FormField): string;
  
  // Parse chat response to form data
  fromChatResponse(response: string): Partial<FormData>;
  
  // Get next question in sequence
  getNextPrompt(currentData: Partial<FormData>): string;
}
```

### 2. With AI Assistant
```typescript
// AI can provide suggestions and validations
interface AIBudgetAssistant {
  suggestBudgetAdjustments(budget: BudgetData): Suggestion[];
  identifyRedFlags(expenses: Expense[]): Warning[];
  recommendSavingsGoals(income: number, expenses: number): Goal[];
}
```

## Testing Requirements
1. Form validation works correctly
2. Data persists between steps
3. Draft auto-save functions
4. Calculations are accurate
5. Mobile responsive design
6. Keyboard navigation works
7. Screen reader compatible

## Success Metrics
- User can complete budget in < 5 minutes
- 90% completion rate once started
- Data validation prevents errors
- Smooth transition between steps
- Clear visual feedback on progress

This implementation provides the foundation for both traditional form interaction and future chat-based budget creation.