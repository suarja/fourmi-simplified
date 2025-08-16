# Fourmi Vision: "Code Editor for Financial Decisions"

## Executive Summary

Fourmi reimagines financial decision-making through the proven UX pattern of AI coding tools (Cursor, Bolt, Lovable). Users engage with an AI agent through chat (2/5 screen) while watching their financial scenarios build in real-time on a live canvas (3/5 screen). This creates an addictive, viral-ready experience where **Projects** serve as data primitives and **Simulations** deliver shareable insights.

## Core UX Pattern: Chat + Live Canvas

### Layout Inspiration: AI Coding Tools
- **Chat Panel** (2/5 screen, left): User prompts, agent responses, contextual questions
- **Live Canvas** (3/5 screen, right): Real-time simulation building and preview
- **Desktop-optimized**: Users see their financial simulation built in real-time via streaming
- **Mobile adaptation**: Swipe between chat and canvas views

### Real-Time Streaming Experience
```javascript
// Convex agents streaming implementation
const { thread } = await agent.continueThread(ctx, { threadId });
const simulation = await thread.streamObject({ 
  prompt: "Update rent vs buy comparison with new market data",
  schema: SimulationSchema 
});
// Canvas updates live as object streams in
```

## Entity Architecture: Projects → Simulations

### Projects = Raw Data Primitives
**Individual building blocks for financial scenarios:**
- **Examples**: "Las Terrenas Beach House", "Paris 15th Apartment", "Chartres Family Home"
- **Data**: Location, property price, mortgage terms, market data, local taxes
- **Sources**: User input + AI web search + RAG financial knowledge
- **Editing**: User can modify directly in canvas OR prompt AI to update

### Simulations = Live Financial Models
**The real value - combining projects into actionable insights:**
- **Single Project Analysis**: Detailed breakdown, cash flow, timeline
- **Comparison Mode**: Side-by-side analysis of 2-3 projects
- **Scenario Planning**: Low/medium/high projections for same project
- **Real-time updates**: Live calculations as underlying projects change

### State Management
**Simulation States (borrowed from interview insights):**
- **FRESH**: Recently calculated, all data current
- **STALE**: Underlying project data changed, needs recalculation
- **ARCHIVED**: Saved snapshot for reference/sharing

## AI-Powered Subscription Strategy

### LLM as Intelligent Gatekeeper + Salesperson

**Plan-Aware Tool Execution:**
```javascript
// Agent checks subscription before tool invocation
const checkPlanAccess = async (ctx, toolName, userPlan) => {
  if (userPlan === 'FREE') {
    switch(toolName) {
      case 'webSearch':
        return { allowed: false, message: "Real-time market data requires Pro! Upgrade for $3.99/month to get live property prices 📈" };
      case 'createProject':
        if (projectCount >= 2) {
          return { allowed: false, message: "You've hit your 2-project limit! Upgrade to Pro for unlimited projects and compare Las Terrenas, Paris, AND Barcelona all at once! 🏡" };
        }
    }
  }
  return { allowed: true };
};
```

**Contextual Upgrade Prompts:**
- **At tool boundaries**: "I can find current market data for you! This requires Pro for real-time property prices."
- **During workflow**: "You already have a simulation running. Pro users can run unlimited comparisons side-by-side..."
- **Value demonstration**: "With Pro, I could add 5-year projections and opportunity cost analysis to this simulation."

### Perfect Conversion Moments
1. **User hits limits** while engaged in valuable workflow
2. **AI explains exact value** they'll unlock immediately  
3. **Seamless upgrade** without losing current context
4. **Immediate gratification** - features unlock instantly

## Viral-Ready Canvas Design

### Social Media Optimization Strategy

**Shareable Visual Elements:**
- **Clean, branded simulation cards** perfect for screenshots
- **Shocking number reveals**: "You'll save $47,382 by choosing rent!"
- **Beautiful data visualization** that tells a compelling story
- **Quotable insights**: "According to my financial analysis, buying in Paris will cost you..."
- **Location comparisons** that spark debate and geographic pride

### Canvas Templates by Mode

**1. Single Project Deep Dive**
```
┌─────────────────────────────────────┐
│ 🏡 Las Terrenas Beach House         │
│                                     │
│ 💰 Total Cost (5 years): $185K     │
│ 📈 Monthly Payment: $1,247          │
│ 🎯 Break-even: 4.2 years           │
│                                     │
│ ✨ AI Insight: "Beach properties    │
│    in DR appreciate 12% annually"   │
└─────────────────────────────────────┘
```

**2. Head-to-Head Comparison**
```
Las Terrenas 🏖️     vs     Paris 🏛️
Total: $185K                $420K
Monthly: $1,247             $2,890
ROI: 12%/year              4%/year

🏆 Winner: Las Terrenas saves $235K over 5 years!
```

**3. Multi-Scenario Grid**
```
LOW          MEDIUM        HIGH
$165K        $185K         $210K
8% growth    12% growth    15% growth
Break-even   Break-even    Break-even
5.1 years    4.2 years     3.8 years
```

### Viral Content Triggers
- **Controversial recommendations**: "Don't buy in Paris - here's why"
- **Surprising arbitrage**: "Las Terrenas beats Miami for investment returns"
- **Counter-intuitive insights**: "Renting + investing beats buying by $50K"
- **Relatable scenarios**: "Millennial homebuying reality check: the numbers"

## Freemium Strategy That Creates Natural Demand

### FREE Tier (Viral Engine)
- **2 projects maximum** → Forces focus, creates upgrade pressure
- **1 simulation at a time** → Can't compare multiple scenarios
- **Basic calculations only** → No web search, limited insights
- **Social sharing enabled** → Drives organic growth

### PRO Tier ($3.99/month)
- **Unlimited projects** → Build comprehensive scenario library
- **Unlimited simulations** → Compare as many scenarios as needed  
- **Advanced AI tools** → Web search, market data, RAG insights
- **Export capabilities** → PDF reports, data downloads
- **Priority support** → Faster response times

### Premium Features Worth Paying For
- **Real-time market data** → Web search tool for current prices
- **Advanced projections** → 10+ year timelines, inflation adjustments
- **Opportunity cost analysis** → "What if you invested instead?"
- **Tax optimization** → Location-specific tax implications
- **Risk assessment** → Market volatility considerations

## Technical Implementation Roadmap

### Phase 1: Core Architecture (Current Sprint)
- [x] Convex agents integration with streaming
- [ ] Project entity schema and CRUD operations
- [ ] Simulation entity with state management
- [ ] Basic canvas layouts for single project
- [ ] Plan checking middleware for tool gating

### Phase 2: AI-Enhanced Features
- [ ] Web search tool for market data
- [ ] RAG implementation for financial knowledge
- [ ] Financial calculation tools (PMT, ROI, etc.)
- [ ] Contextual upgrade prompt system
- [ ] Streaming simulation updates

### Phase 3: Viral Canvas Design
- [ ] Social media optimized templates
- [ ] Screenshot-ready result cards
- [ ] Export functionality for sharing
- [ ] Mobile-responsive canvas layouts
- [ ] Animation/transitions for engagement

### Phase 4: Subscription & Monetization
- [ ] Billing integration (likely Clerk or Schematic)
- [ ] Usage tracking and limits enforcement
- [ ] Seamless upgrade flows
- [ ] Analytics for conversion optimization

## Success Metrics

### Viral Growth KPIs
- **Sharing rate**: % of simulations shared to social media
- **Viral coefficient**: New users per shared simulation
- **Engagement time**: Average session duration in canvas
- **Project completion**: % of users who finish first simulation

### Conversion Metrics  
- **Free-to-paid conversion**: Target 8-12% (high for utility app)
- **Time to conversion**: Days from signup to upgrade
- **Feature usage**: Which gated features drive upgrades
- **Retention**: Monthly active users across tiers

### Financial Impact
- **Year 1 target**: 10K free users → 1K paid users ($48K ARR)
- **Year 2 target**: 50K free users → 5K paid users ($240K ARR)
- **Unit economics**: $3.99 monthly - $0.50 costs = $3.49 profit
- **Payback period**: Target <3 months from viral acquisition

## Competitive Advantage

### Why This Approach Wins
1. **AI-native experience**: Unlike static calculators, our AI guides and educates
2. **Real-time collaboration**: Between user and AI, like pair programming
3. **Viral by design**: Every simulation is shareable content
4. **Contextual monetization**: AI sells upgrades at perfect moments
5. **Educational value**: Users learn while using, building trust

### Defensible Moats
- **Convex agents expertise**: Advanced streaming and context management
- **Financial knowledge base**: RAG-powered insights unique to locations
- **UX innovation**: Chat + canvas pattern not used in finance
- **Viral growth engine**: User-generated content drives organic acquisition
- **AI-powered sales**: Conversion optimization through intelligent prompts

## Vision Statement

**"Fourmi transforms financial decision-making from spreadsheet drudgery into an engaging, social, AI-assisted experience. By combining the proven UX patterns of AI coding tools with viral-ready financial insights, we create a platform where users don't just calculate - they discover, share, and make confident life decisions."**

The future of financial planning isn't complex dashboards or intimidating forms - it's a conversation with an intelligent assistant that builds your financial future in real-time while you watch.