# Convex Agents Documentation

## Overview

Convex Agents is a framework for building AI-powered applications with persistent conversation threads, tools, and human-in-the-loop workflows. This document outlines key concepts and usage patterns.

## Official Documentation Links

### Core Concepts
- [Getting Started](https://docs.convex.dev/agents/getting-started) - Initial setup and basic agent creation
- [Threads](https://docs.convex.dev/agents/threads) - Conversation thread management
- [Messages](https://docs.convex.dev/agents/messages) - Message handling and history
- [Tools](https://docs.convex.dev/agents/tools) - Creating and using agent tools

### Advanced Features  
- [Context](https://docs.convex.dev/agents/context) - Agent memory and context management
- [Workflows](https://docs.convex.dev/agents/workflows) - Multi-step agent workflows
- [Files](https://docs.convex.dev/agents/files) - File handling and processing
- [RAG](https://docs.convex.dev/agents/rag) - Retrieval-Augmented Generation patterns

### Development & Operations
- [Debugging](https://docs.convex.dev/agents/debugging) - Debugging agent behavior
- [Rate Limiting](https://docs.convex.dev/agents/rate-limiting) - Managing API rate limits
- [Usage Tracking](https://docs.convex.dev/agents/usage-tracking) - Monitoring agent usage
- [Human Agents](https://docs.convex.dev/agents/human-agents) - Human-in-the-loop workflows
- [Playground](https://docs.convex.dev/agents/playground) - Testing and experimentation

## Version Compatibility Issues

### Key Problem: AI SDK Version Conflicts

**Root Cause**: Convex Agents was built for AI SDK v4, but many projects use AI SDK v5.

#### Required Versions for Convex Agents
```json
{
  "dependencies": {
    "@convex-dev/agent": "^0.1.18",
    "ai": "^4.3.19",                    // NOT v5.x
    "@ai-sdk/openai": "^1.3.24",       // NOT v2.x  
    "@auth/core": "^0.37.4",           // Peer dependency
    "convex-helpers": "^0.1.103"       // Required utility library
  }
}
```

#### Migration Issues
- **Syntax Changes**: `generateObject()` API changed between v4/v5
- **Model Interface**: `LanguageModelV1` vs `LanguageModelV2`
- **Schema Requirements**: v4 requires `schemaName` parameter

#### Resolution Steps
1. **Downgrade AI SDK**: `npm install ai@^4.3.19 --legacy-peer-deps`
2. **Downgrade Provider**: `npm install @ai-sdk/openai@^1.3.24`
3. **Install Missing Deps**: `npm install @auth/core convex-helpers`
4. **Update Code**: Add `schemaName` to `generateObject()` calls

## Convex MCP Integration

### Available MCP Functions
From the `mcp__convex__*` functions available:

#### Project Management
- `mcp__convex__status` - Get deployment info and selectors
- `mcp__convex__tables` - List all tables and schemas
- `mcp__convex__functionSpec` - Get function metadata

#### Data Operations  
- `mcp__convex__data` - Read paginated table data
- `mcp__convex__run` - Execute Convex functions
- `mcp__convex__runOneoffQuery` - Run ad-hoc queries

#### Environment Management
- `mcp__convex__envList/Get/Set/Remove` - Manage environment variables

### Effective Usage Patterns

#### 1. Development Workflow
```bash
# Check deployment status
mcp__convex__status("/path/to/project")

# View function metadata  
mcp__convex__functionSpec(deploymentSelector)

# Test functions
mcp__convex__run(deploymentSelector, "agents:startFinancialConversation", args)
```

#### 2. Data Inspection
```bash
# List tables
mcp__convex__tables(deploymentSelector)

# Read data
mcp__convex__data(deploymentSelector, "conversations", "desc", limit: 10)
```

#### 3. Agent Testing
```bash
# Test agent responses
mcp__convex__run(deploymentSelector, "agents:startFinancialConversation", {
  "profileId": "profile_id", 
  "message": "I earn 3000 euros per month"
})
```

## Agent Implementation Patterns

### Basic Agent Setup
```typescript
import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";
import { components } from "./_generated/api";

const agent = new Agent(components.agent, {
  name: "Financial Copilot",
  chat: openai("gpt-4o"),
  instructions: "System prompt here..."
});
```

### Thread Management
```typescript
// Create thread
const threadId = await agent.createThread(ctx);

// Generate response
const response = await agent.generateText(ctx, threadId, {
  messages: [{ role: "user", content: message }],
});
```

### Tool Integration
```typescript
// Tools are defined separately and registered with the agent
const agent = new Agent(components.agent, {
  tools: {
    addIncome: /* tool definition */,
    getBalance: /* tool definition */
  }
});
```

## Fourmi-Specific Usage

### Current Implementation Status
- ✅ **Basic Agent Setup**: Working with corrected API calls
- ✅ **Thread Creation**: Using `agent.createThread(ctx)`
- ✅ **Text Generation**: Using `agent.generateText(ctx, threadId, options)`
- 🚧 **Tool Integration**: Next phase for financial operations
- 📋 **Context Management**: Future enhancement for personalization

### Next Steps for Fourmi
1. **Add Financial Tools**: Create tools for adding income/expenses/loans
2. **Fact Validation**: Implement human-in-the-loop for financial data
3. **Context Persistence**: Store user preferences and history
4. **Multi-Agent**: Separate agents for different tiers (FREE/PAID/PREMIUM)

### Integration with Existing System
- **Replace**: Manual conversation management in `convex/conversations.ts`
- **Enhance**: Fact validation workflow with agent tools
- **Preserve**: Existing business logic in `convex/lib/` and `convex/domain/`

## Troubleshooting Common Issues

### TypeScript Errors
- **Issue**: `LanguageModelV2` not compatible with `LanguageModelV1`
- **Fix**: Ensure AI SDK v4 and matching provider versions

### Missing Dependencies
- **Issue**: `convex-helpers/validators` not found
- **Fix**: `npm install convex-helpers`

### API Method Errors
- **Issue**: `generateText()` argument mismatch  
- **Fix**: Use correct signature: `agent.generateText(ctx, threadId, options)`

### Configuration Issues
- **Issue**: Agent components not found
- **Fix**: Ensure `convex.config.ts` includes agent component

## Best Practices

### Performance
- **Reuse Agents**: Create agent instances outside handlers when possible
- **Limit Steps**: Use `maxSteps` to prevent infinite tool calling
- **Cache Context**: Store frequently used data in agent context

### Error Handling
- **Graceful Degradation**: Fallback to simple responses if agent fails
- **Logging**: Use comprehensive logging for debugging agent behavior
- **Validation**: Validate tool outputs before saving to database

### Security
- **Input Sanitization**: Validate all user inputs before processing
- **Permission Checks**: Ensure users can only access their own data
- **Rate Limiting**: Implement appropriate rate limits for agent calls

This documentation provides the foundation for effectively using Convex Agents in the Fourmi financial copilot application.