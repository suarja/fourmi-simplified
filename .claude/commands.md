# Fourmi Claude Code Commands

## Documentation Management

### Audit Documentation
```bash
# Full documentation audit
claude-code task --description "Documentation audit" --prompt "You are the Documentation Management Agent for Fourmi. Audit all documentation for accuracy vs current implementation. Focus on: 1) Implementation status accuracy in ImplementationDocs.tsx 2) Package dependency verification 3) Feature completion claims in CLAUDE.md 4) User guide currency. Cross-reference actual code with documentation claims. Provide specific file changes needed with priority ranking."
```

### Update Implementation Status
```bash
# Update all documentation status
claude-code task --description "Update implementation status" --prompt "You are the Documentation Management Agent for Fourmi. Update all documentation to reflect current implementation status. Scan package.json, actual code, and component files. Move completed features from TODO to Completed sections. Add newly implemented features. Verify technology stack claims. Focus on src/docs/pages/ImplementationDocs.tsx and CLAUDE.md."
```

### Create User Guides
```bash
# Generate user documentation
claude-code task --description "Create user guides" --prompt "You are the Documentation Management Agent for Fourmi. Create comprehensive user guides for [FEATURE_NAME]. Include: step-by-step setup, usage examples, troubleshooting common issues, and integration with existing features. Target audience: end users (not developers). Output should be markdown suitable for src/docs/pages/."
```

### Sync Technical Documentation
```bash
# Synchronize technical docs with code
claude-code task --description "Sync technical docs" --prompt "You are the Documentation Management Agent for Fourmi. Synchronize technical documentation with current codebase. Scan convex/ functions, src/ components, and package.json. Update docs/technical/ files to match current architecture. Document any new patterns, agent tools, or API changes. Ensure accuracy of all technical claims."
```

## Translation Management

### Comprehensive Translation Audit
```bash
# Find all untranslated strings
claude-code task --description "Translation audit" --prompt "You are the Translation Agent for Fourmi. Scan ALL React components for hardcoded English strings that need French translation. Focus on: 1) Card components in src/components/financial-dashboard/cards/ 2) Project components 3) Form labels and buttons 4) Error messages 5) Any component missing useTranslation hook. Provide comprehensive list of components needing translation work."
```

### Apply Missing Translations
```bash
# Translate specific components
claude-code task --description "Apply translations" --prompt "You are the Translation Agent for Fourmi. Translate all hardcoded strings in [COMPONENT_NAMES]. For each component: 1) Add useTranslation hook 2) Replace hardcoded strings with t() calls 3) Update both EN and FR translation JSON files 4) Use professional French financial terminology. Maintain existing functionality and styling."
```

## Development Workflow

### Feature Documentation
```bash
# Document new features
claude-code task --description "Feature documentation" --prompt "Document the newly implemented [FEATURE_NAME] in Fourmi. Create both technical documentation (for developers) and user documentation (for end users). Include: feature overview, implementation details, usage instructions, integration points, and any configuration required. Update relevant sections in both docs/technical/ and src/docs/pages/."
```

### Architecture Documentation
```bash
# Update architecture docs
claude-code task --description "Architecture documentation" --prompt "Update Fourmi architecture documentation based on current codebase. Scan convex/ backend, src/ frontend, and integration patterns. Document: 1) Convex agent system 2) Real-time data flow 3) Authentication patterns 4) File organization 5) Key design decisions. Update docs/technical/ files accordingly."
```

## Quality Assurance

### Documentation Quality Check
```bash
# Verify documentation quality
claude-code task --description "Documentation quality check" --prompt "Perform quality check on Fourmi documentation. Verify: 1) All links work 2) Code examples are current 3) Screenshots are up-to-date 4) Technical accuracy 5) Writing clarity 6) Consistent terminology. Provide prioritized list of quality issues found."
```

### Translation Completeness Check
```bash
# Verify translation completeness
claude-code task --description "Translation completeness check" --prompt "Verify French translation completeness in Fourmi app. Test: 1) All UI components display French text when language is switched 2) No English strings remain in French mode 3) Professional financial terminology is used 4) Proper French formatting (dates, numbers, currency). Report any untranslated or incorrectly translated content."
```

## Usage Examples

```bash
# Daily documentation maintenance
claude-code task --description "Documentation audit" --prompt "You are the Documentation Management Agent for Fourmi. Audit all documentation for accuracy vs current implementation..."

# After implementing new feature
claude-code task --description "Feature documentation" --prompt "Document the newly implemented internationalization system in Fourmi..."

# When finding untranslated UI
claude-code task --description "Apply translations" --prompt "You are the Translation Agent for Fourmi. Translate all hardcoded strings in BalanceCard, IncomeCard components..."
```

These commands provide standardized access to specialized agents for maintaining high-quality documentation and translations in the Fourmi project.