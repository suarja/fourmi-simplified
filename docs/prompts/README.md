# LLM Prompts for Fourmi Development

This directory contains structured prompts for LLMs to implement various features of the Fourmi financial copilot application. Each prompt is designed to be self-contained with full context and architectural guidance.

## Prompt Structure

Each prompt follows a consistent structure:
1. **Role Definition** - Who the LLM should act as
2. **Context Documents** - Essential files to review
3. **Technical Requirements** - Stack and constraints
4. **Implementation Details** - Step-by-step guidance
5. **Success Criteria** - How to measure completion

## Available Prompts

### 01. Foundational UI Layout
**File**: `01-foundational-ui-layout.md`
**Purpose**: Create the core application shell and layout system
**Output**: 
- Application shell with responsive layout
- Navigation system
- Route structure
- Onboarding flow components

### 02. Budget Form Implementation
**File**: `02-budget-form-implementation.md`
**Purpose**: Implement the dual-mode budget creation feature
**Output**:
- Multi-step budget creation wizard
- Form validation and state management
- TRPC integration for data persistence
- Review and summary screens

## How to Use These Prompts

1. **For Initial Implementation**:
   - Start with prompt 01 to establish the foundation
   - Each subsequent prompt builds on the previous work
   - Review the success criteria before marking complete

2. **For AI/LLM Developers**:
   - Copy the entire prompt content
   - Ensure the LLM has access to the referenced documentation
   - Provide the current codebase context
   - Request implementation in phases as outlined

3. **For Iteration**:
   - Prompts can be modified based on implementation feedback
   - Add specific examples from completed work
   - Update file paths if structure changes

## Prompt Principles

1. **Senior Architect Perspective**: Prompts are written as if briefing a senior developer
2. **Full Context**: All necessary information is included or referenced
3. **Phased Approach**: Complex features are broken into manageable phases
4. **Future-Proof Design**: Consider chat interface integration from the start
5. **Production Ready**: Focus on scalable, maintainable solutions

## Adding New Prompts

When creating new prompts:
1. Follow the existing structure template
2. Reference prerequisite prompts
3. Include specific file paths and code examples
4. Define clear success criteria
5. Consider both current and future requirements

## Prompt Dependencies

```
01-foundational-ui-layout.md (Foundation)
    └── 02-budget-form-implementation.md (Core Feature)
            └── [Future: 03-chat-interface-integration.md]
            └── [Future: 04-ai-assistant-integration.md]
```

## Key Documentation References

These documents provide essential context for all prompts:
- `/docs/product/PRD.md` - Product vision
- `/docs/technical/ARCHITECTURE.md` - Technical architecture
- `/docs/guidelines/UI_UX_SPEC.md` - UX specifications
- `/docs/guidelines/DESIGN_SYSTEM.md` - Design system
- `/docs/technical/DOMAIN.md` - Domain model

## Version Control

Each prompt should be versioned when significant changes are made:
- Keep the original prompt for reference
- Document what changed and why
- Update dependent prompts if needed