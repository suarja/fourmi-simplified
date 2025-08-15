# MCP Server Integration
## Fourmi Financial Copilot

### Overview

Fourmi integrates with multiple **Model Context Protocol (MCP)** servers to enhance development capabilities and maintain shared knowledge across AI assistant sessions.

### Available MCP Servers

#### 1. ShadCN/ui MCP Server
**Purpose**: Access to ShadCN/ui v4 component library and blocks

**Available Tools**:
- `mcp__shadcn-ui__list_components` - Get all available components
- `mcp__shadcn-ui__get_component` - Get source code for specific component
- `mcp__shadcn-ui__get_component_demo` - Get usage examples
- `mcp__shadcn-ui__get_component_metadata` - Get component information
- `mcp__shadcn-ui__list_blocks` - Get available UI blocks
- `mcp__shadcn-ui__get_block` - Get block source code

**Usage Example**:
```typescript
// Get card component for fact validation UI
const cardComponent = await mcp__shadcn_ui__get_component({
  componentName: "card"
});

// Get form components for pending fact editing
const formDemo = await mcp__shadcn_ui__get_component_demo({
  componentName: "form"
});
```

#### 2. Convex MCP Server
**Purpose**: Convex backend management and development

**Available Tools**:
- `mcp__convex__status` - Get project status and deployments
- `mcp__convex__tables` - List database tables and schema
- `mcp__convex__functionSpec` - Get function metadata
- `mcp__convex__run` - Execute Convex functions
- `mcp__convex__data` - Read table data
- `mcp__convex__runOneoffQuery` - Run ad-hoc queries

**Usage Example**:
```typescript
// Check current deployment status
const status = await mcp__convex__status({
  projectDir: "/Users/suarja/App/2025/fourmi-simplified"
});

// View all functions in development deployment
const functions = await mcp__convex__functionSpec({
  deploymentSelector: "dev"
});

// Test a profile creation
const result = await mcp__convex__run({
  deploymentSelector: "dev",
  functionName: "profiles:createProfile",
  args: JSON.stringify({ name: "Test", type: "solo" })
});
```

#### 3. Supabase MCP Server
**Purpose**: Database operations and management (for future migration)

**Available Tools**:
- `mcp__supabase__list_tables` - List database tables
- `mcp__supabase__execute_sql` - Run SQL queries
- `mcp__supabase__apply_migration` - Apply database migrations
- `mcp__supabase__generate_typescript_types` - Generate types

**Note**: Currently using Convex, but Supabase MCP available for future scaling.

#### 4. ByteRover Memory MCP Server
**Purpose**: Persistent knowledge and context management

**Available Tools**:
- `mcp__byterover-mcp__byterover-retrieve-knowledge` - Search stored knowledge
- `mcp__byterover-mcp__byterover-store-knowledge` - Store new knowledge

**Usage Pattern**:
```typescript
// ALWAYS retrieve context before complex tasks
const context = await byterover_retrieve_knowledge({
  query: "Fourmi fact validation implementation patterns"
});

// ALWAYS store critical implementations after success
await byterover_store_knowledge({
  messages: `
    Implemented pending facts validation system:
    - Added pendingFacts table to schema
    - Created facts.ts domain logic
    - Includes duplicate prevention with semantic similarity
    - Supports confirm/reject/edit workflow
  `
});
```

### Development Workflow with MCP

#### 1. Starting a Task
```bash
# Retrieve relevant context
mcp__byterover-mcp__byterover-retrieve-knowledge --query "task relevant keywords"

# Check current Convex state
mcp__convex__status --projectDir "/path/to/project"
```

#### 2. Component Development
```bash
# Find relevant ShadCN components
mcp__shadcn-ui__list_components

# Get component implementation
mcp__shadcn-ui__get_component --componentName "dialog"

# See usage examples
mcp__shadcn-ui__get_component_demo --componentName "dialog"
```

#### 3. Backend Development
```bash
# View current database schema
mcp__convex__tables --deploymentSelector "dev"

# Test function implementations
mcp__convex__run --functionName "domain/facts:createPendingFact" --args "{...}"

# Debug with one-off queries
mcp__convex__runOneoffQuery --query "console.log('debug info')"
```

#### 4. Completing a Task
```bash
# Store implementation knowledge
mcp__byterover-mcp__byterover-store-knowledge --messages "Implementation details with code snippets"
```

### Best Practices

#### Memory Management
1. **Always retrieve** context before starting complex tasks
2. **Store critical patterns** that could be reused
3. **Include complete code snippets** in stored knowledge
4. **Document architectural decisions** and reasoning
5. **Capture error patterns** and their solutions

#### Component Integration
1. **Check available components** before creating custom ones
2. **Use component demos** to understand proper usage
3. **Leverage blocks** for complex UI patterns
4. **Maintain consistency** with ShadCN design system

#### Backend Development
1. **Verify schema changes** with convex tables tool
2. **Test functions** using convex run tool before UI integration
3. **Monitor deployment status** during development
4. **Use one-off queries** for debugging complex issues

### Integration Examples

#### Fact Validation UI Development
```typescript
// 1. Retrieve knowledge about existing patterns
const patterns = await byterover_retrieve_knowledge({
  query: "React form validation patterns ShadCN"
});

// 2. Get relevant components
const dialogComponent = await shadcn_ui_get_component({
  componentName: "dialog"
});

const formComponent = await shadcn_ui_get_component({
  componentName: "form"
});

// 3. Test backend integration
const pendingFacts = await convex_run({
  functionName: "domain/facts:getPendingFacts",
  args: JSON.stringify({ profileId: "test123" })
});

// 4. Store implementation
await byterover_store_knowledge({
  messages: "Fact validation UI implementation using ShadCN Dialog + Form..."
});
```

### Configuration

MCP servers are configured in the Claude Code environment and available through the `mcp__*` tool namespace. No additional setup required for development.

### Troubleshooting

#### Common Issues
1. **Tool not found**: Ensure MCP server is properly configured
2. **Invalid parameters**: Check tool parameter schemas carefully
3. **Connection errors**: Verify server availability

#### Debugging
- Use `ListMcpResourcesTool` to see available resources
- Check tool documentation for parameter requirements
- Verify deployment selector strings for Convex tools

### Future Enhancements

1. **Custom MCP servers** for Fourmi-specific operations
2. **Automated knowledge extraction** from successful implementations
3. **Cross-session context preservation** for complex features
4. **Integration with testing frameworks** via MCP