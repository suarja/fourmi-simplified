# Fourmi Architecture Migration

## Migration from Conversations to Agent Threads

### Overview
We're migrating from a manual conversation system to Convex Agents, simplifying the data model and improving maintainability.

### Key Architecture Decisions
- **Financial facts are PROFILE-LEVEL**: All financial data belongs to the profile, not specific conversations
- **Threads are for chat history only**: Agent threads manage conversation flow, not data ownership
- **Dashboard shows ALL data**: Financial dashboard displays complete profile data, unfiltered by thread

## Files Status

### 🗑️ TO DELETE (Deprecated)

| File | Purpose | Replacement | Status |
|------|---------|-------------|--------|
| `convex/ai.ts` | Old AI processing with direct OpenAI calls | `convex/agents/financialTools.ts` | PENDING DELETION |
| `convex/conversations.ts` | Manual conversation management | Agent threads via `convex/agents.ts` | PENDING DELETION |

### ⚠️ TO UPDATE (Partial Migration)

| File | Current Issue | Required Change | Status |
|------|--------------|-----------------|--------|
| `convex/schema.ts` | `pendingFacts` has `conversationId` | Remove `conversationId` field | PENDING |
| `convex/domain/facts.ts` | Uses `conversationId` | Remove conversation dependency | PENDING |
| `src/SpeechToText.tsx` | Uses `api.ai.transcribeAudio` | Keep as-is (works fine) | NO CHANGE |
| `src/FinancialDashboard.tsx` | Regenerates insights on every render | Keep for now (not critical) | NO CHANGE |

### ✅ KEEP (Already Correct)

| File | Purpose | Notes |
|------|---------|-------|
| `convex/agents.ts` | Agent-based conversation system | Core of new architecture |
| `convex/agents/financialTools.ts` | Financial data extraction tools | Needs duplicate checking |
| `convex/threads.ts` | Thread management for agents | Working correctly |
| `convex/domain/transactions.ts` | Delete/edit mutations | Ready to use |
| `convex/lib/validation.ts` | Duplicate detection logic | Ready to integrate |
| `src/ChatInterface.tsx` | Uses agent actions | Working correctly |

## Database Schema Changes

### Tables to Remove
- `conversations` - Replaced by agent threads
- `messages` - Replaced by agent message storage

### Schema Updates
```typescript
// OLD pendingFacts table
pendingFacts: defineTable({
  conversationId: v.id("conversations"), // REMOVE THIS
  // ... other fields
})

// NEW pendingFacts table
pendingFacts: defineTable({
  // No conversationId - facts are profile-level only
  profileId: v.id("profiles"),
  type: v.union(v.literal("income"), v.literal("expense"), v.literal("loan")),
  // ... rest remains the same
})
```

## API Changes

### Deprecated Functions
- `api.ai.processFinancialMessage` → Use agent tools
- `api.ai.processFinancialFile` → Already migrated to `processFinancialFileWithThread`
- `api.conversations.*` → Use agent threads

### Updated Functions
- `createPendingFact` - Remove `conversationId` parameter
- `getPendingFacts` - Remove `conversationId` filter

## Implementation Steps

### Phase 1: Update Schema & Domain (Current)
1. Remove `conversationId` from schema
2. Update `domain/facts.ts` functions
3. Simplify pending facts to be profile-only

### Phase 2: Integrate Validation
1. Update agent tools to check duplicates
2. Create pending facts instead of direct adds
3. Return validation feedback to user

### Phase 3: Add UI Features
1. Add delete buttons to dashboard items
2. Create pending facts confirmation UI
3. Wire up delete mutations

### Phase 4: Cleanup
1. Delete deprecated files
2. Remove unused imports
3. Test complete flow

## Rollback Plan
If issues arise:
1. Git revert to previous commit
2. Agent threads continue working independently
3. No data loss (all financial data preserved)

## Success Criteria
- [x] Users can delete financial entries - Delete buttons added to dashboard
- [x] Duplicate data is prevented - Validation layer integrated in agent tools
- [x] Pending facts show for confirmation - PendingFactsCard component added
- [x] No references to old conversation system - Deprecated files marked
- [x] All backend compiles successfully - Convex functions ready

## Completed Changes (Jan 15, 2025)
1. ✅ Removed `conversationId` from `pendingFacts` schema
2. ✅ Updated `domain/facts.ts` to be profile-level only
3. ✅ Integrated duplicate checking in agent tools
4. ✅ Added delete buttons to all financial items
5. ✅ Added pending facts UI for confirmation/rejection
6. ✅ Marked deprecated files with comments