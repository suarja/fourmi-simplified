# UI/UX Specification
## Fourmi Financial Copilot

### Design Philosophy

**Chat-First Financial Interface**
- Conversation over configuration: Natural language input instead of complex forms
- Progressive disclosure: Show complexity only when needed
- Human-in-the-loop validation: AI proposes, user confirms
- Dark-first design: Sophisticated, distraction-free environment

### Core Interaction Patterns

#### 1. Conversational Flow

```typescript
interface ConversationalInteraction {
  input: "natural_language" | "quick_action" | "validation";
  processing: "reasoning" | "calculating" | "searching";
  output: "blocks" | "questions" | "confirmations";
  feedback: "immediate" | "progressive" | "final";
}
```

**Examples:**
- User: "I earn 3000€/month and want to buy in Montpellier"
- System: Shows reasoning → Proposes facts → Generates simulation blocks
- User: Validates facts → Receives comparison cards and timeline

#### 2. Human-in-the-Loop Validation

```tsx
// Fact validation component
<FactValidation>
  <ProposedFact
    icon="💰"
    label="Monthly Income"
    value="3,000 €"
    confidence={0.9}
    source="chat_extraction"
  />
  <ValidationActions>
    <Button variant="ghost">Edit</Button>
    <Button variant="default">Add to Profile</Button>
    <Button variant="ghost">Skip</Button>
  </ValidationActions>
</FactValidation>
```

### Navigation & Layout

#### Desktop Layout (Primary)
```
┌─────────────────────────────────────────────────────────────────┐
│  🏠 Fourmi                     Profile | Projects | Compare     │
├─────────────────┬───────────────────────────────────────────────┤
│                 │                                               │
│  Chat History   │            Main Content Area                  │
│  ┌─────────────┐│  ┌─────────────┬─────────────┬─────────────┐  │
│  │ ● New Chat  ││  │ Metric Card │ Metric Card │ Metric Card │  │
│  │             ││  └─────────────┴─────────────┴─────────────┘  │
│  │ Conversation││  ┌─────────────────────────────────────────┐  │
│  │ 1: Rent vs  ││  │          Comparison Table               │  │
│  │ Buy Paris   ││  │                                         │  │
│  │             ││  └─────────────────────────────────────────┘  │
│  │ ● Simulation││                                               │
│  │ Vegas       ││                                               │
│  └─────────────┘│                                               │
│                 │                                               │
│  Facts & Memory │  ┌─────────────────────────────────────────┐  │
│  ┌─────────────┐│  │           Chat Input Area               │  │
│  │ 💰 Income:  ││  │  "Compare this with renting..."         │  │
│  │   3000€/mo  ││  └─────────────────────────────────────────┘  │
│  │ 🏠 Savings: ││                                               │
│  │   15000€    ││                                               │
│  └─────────────┘│                                               │
└─────────────────┴───────────────────────────────────────────────┘
```

#### Tablet Layout
```
┌─────────────────────────────────────────────┐
│  Fourmi        Profile | Projects | Compare │
├─────────────────────────────────────────────┤
│                                             │
│  ┌────────────────┬─────────────────────────┐│
│  │ Chat Interface │    Results & Blocks     ││
│  │                │                         ││
│  │ [Chat messages]│  [Metric cards]         ││
│  │                │  [Comparison table]     ││
│  │                │                         ││
│  │ [Input field]  │  [Timeline chart]       ││
│  └────────────────┴─────────────────────────┘│
│                                             │
└─────────────────────────────────────────────┘
```

#### Mobile Layout
```
┌─────────────────────────┐
│ 🏠 Fourmi        ☰ Menu │
├─────────────────────────┤
│                         │
│  Tab: 💬 Chat           │
│  ┌─────────────────────┐│
│  │ [Chat messages]     ││
│  │                     ││
│  │ [Metric cards]      ││
│  │                     ││
│  │ [Input area]        ││
│  └─────────────────────┘│
│                         │
│  Tab: 📊 Results        │
│  [Comparison view]      │
│  [Timeline view]        │
│                         │
└─────────────────────────┘
```

### Interactive UI Blocks

#### 1. Metric Cards
```tsx
<MetricCard
  title="Monthly Cashflow"
  value="-210 €"
  subtitle="After all expenses"
  trend="neutral"
  tooltip="Mortgage + charges - rental income"
  actions={[
    { label: "Explain", action: "explain_calculation" },
    { label: "Update", action: "update_assumptions" }
  ]}
/>
```

#### 2. Comparison Tables
```tsx
<ComparisonTable
  title="Rent vs Buy Analysis"
  scenarios={[
    { name: "Rent", cashflow: "-800 €", total: "96,000 €" },
    { name: "Buy", cashflow: "-1,200 €", total: "144,000 €" },
  ]}
  onScenarioClick={handleScenarioDetails}
  highlightBest={true}
/>
```

#### 3. Interactive Forms (Inline Editing)
```tsx
<AssumptionList
  title="Key Assumptions"
  editable={true}
  items={[
    { label: "Property appreciation", value: "2.5%/year", type: "percentage" },
    { label: "Maintenance costs", value: "1%/year", type: "percentage" },
    { label: "Interest rate", value: "3.5%", type: "percentage" }
  ]}
  onUpdate={handleAssumptionUpdate}
/>
```

#### 4. Timeline Visualization
```tsx
<Timeline
  title="Financial Timeline"
  events={[
    { year: 0, label: "Purchase", amount: "-50,000 €", type: "expense" },
    { year: 5, label: "Break-even", type: "milestone" },
    { year: 10, label: "Net positive", amount: "+25,000 €", type: "income" }
  ]}
  interactive={true}
  onEventClick={handleEventDetail}
/>
```

### State Management & Feedback

#### Simulation Status Badges
```tsx
<SimulationCard>
  <StatusBadge status="FRESH" />     // Green: ✓ Up to date
  <StatusBadge status="STALE" />     // Amber: ⚠ Needs update  
  <StatusBadge status="LOCKED" />    // Purple: 🔒 Archived
</SimulationCard>
```

#### Loading States (AI Processing)
```tsx
<AIProcessingIndicator
  step="Analyzing market data for Montpellier..."
  progress={0.6}
  steps={[
    "✓ Processing your profile",
    "→ Analyzing market data",      // Current step
    "○ Calculating projections",
    "○ Generating recommendations"
  ]}
  cancelable={true}
  onCancel={handleCancel}
/>
```

#### Alert System
```tsx
<Alert level="warning">
  <AlertIcon />
  <AlertContent>
    <AlertTitle>Simulation Out of Date</AlertTitle>
    <AlertMessage>
      Your income was updated. This simulation needs recalculation.
    </AlertMessage>
  </AlertContent>
  <AlertActions>
    <Button size="sm">Update Now</Button>
    <Button size="sm" variant="ghost">Dismiss</Button>
  </AlertActions>
</Alert>
```

### Keyboard Shortcuts & Quick Actions

```typescript
const shortcuts = {
  "/": "Focus chat input",
  "⌘K": "Open command palette",
  "⌘U": "Toggle chat/canvas view",
  "⌘N": "New simulation",
  "⌘S": "Save simulation",
  "⌘D": "Duplicate simulation",
  "Escape": "Cancel current action",
} as const;
```

### Responsive Behavior

#### Breakpoints
```css
/* Mobile first approach */
.container {
  /* Mobile: Stack vertically */
  flex-direction: column;
}

@media (min-width: 768px) {
  /* Tablet: Side by side */
  .container {
    flex-direction: row;
  }
  .chat-section { flex: 1; }
  .results-section { flex: 1; }
}

@media (min-width: 1024px) {
  /* Desktop: Three columns */
  .layout {
    grid-template-columns: 300px 1fr 300px;
  }
}
```

#### Adaptive UI Components
```tsx
<AdaptiveLayout>
  <ChatSection>
    {/* Always visible */}
  </ChatSection>
  
  <ResultsSection>
    {/* Hidden on mobile, shown on tablet+ */}
    <MobileToggle />
  </ResultsSection>
  
  <SidePanel>
    {/* Desktop only */}
    <FactsMemory />
    <QuickActions />
  </SidePanel>
</AdaptiveLayout>
```

### Accessibility Features

#### Screen Reader Support
```tsx
<MetricCard
  aria-label="Monthly cashflow: negative 210 euros"
  role="region"
  tabIndex={0}
>
  <VisuallyHidden>
    This metric shows your monthly cashflow after all housing expenses
  </VisuallyHidden>
</MetricCard>
```

#### Keyboard Navigation
```tsx
<ComparisonTable
  onKeyDown={handleKeyNavigation}
  aria-describedby="comparison-help"
>
  <caption id="comparison-help">
    Use arrow keys to navigate scenarios, Enter to select
  </caption>
</ComparisonTable>
```

### Animation & Micro-Interactions

#### Page Transitions
```css
.page-transition {
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(10px); }
  to { opacity: 1; transform: translateX(0); }
}
```

#### AI Response Animation
```tsx
<ChatMessage className="ai-message">
  <TypewriterEffect text={aiResponse} speed={50} />
  <FadeInBlocks blocks={uiBlocks} delay={1000} />
</ChatMessage>
```

#### Hover States & Focus
```css
.metric-card {
  transition: all 0.15s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.metric-card:focus-visible {
  outline: 2px solid var(--color-accent-primary);
  outline-offset: 2px;
}
```

### Error States & Recovery

#### Calculation Errors
```tsx
<ErrorBoundary>
  <ErrorState
    title="Calculation Error"
    message="Unable to generate projections with current inputs"
    actions={[
      { label: "Review Inputs", action: "review_inputs" },
      { label: "Reset", action: "reset_simulation" },
      { label: "Contact Support", action: "contact_support" }
    ]}
  />
</ErrorBoundary>
```

#### AI Service Errors
```tsx
<AIErrorState
  type="service_unavailable"
  retry={true}
  onRetry={handleRetry}
  fallback={() => <ManualInputForm />}
/>
```

### Performance Optimizations

#### Lazy Loading
```tsx
<Suspense fallback={<SkeletonLoader />}>
  <LazyComparisonChart data={simulationData} />
</Suspense>
```

#### Virtual Scrolling (Large Lists)
```tsx
<VirtualizedList
  itemHeight={80}
  items={chatHistory}
  renderItem={renderChatMessage}
  overscan={5}
/>
```

### Testing Considerations

#### Visual Regression Tests
- Screenshot comparisons for UI blocks
- Mobile/tablet/desktop layout verification
- Dark mode consistency checks

#### Interaction Tests
- Chat flow from input to result blocks
- Fact validation workflows
- Simulation state transitions
- Keyboard navigation paths

#### Accessibility Tests
- Screen reader compatibility
- Keyboard-only navigation
- Color contrast ratios
- Focus management