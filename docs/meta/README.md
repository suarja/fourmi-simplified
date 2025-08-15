# Documentation Management
## Meta Documentation for Fourmi

### 📝 Purpose

This directory contains documentation about documentation - change tracking, contribution guidelines, and maintenance processes that keep our knowledge base organized, current, and useful.

### 📄 Documents Overview

#### [CHANGELOG.md](./CHANGELOG.md) - Documentation History
Master record of all documentation changes, organized by date and impact level.

#### Change Logs by Category
- **[product-changes.md](./product-changes.md)** - Product documentation updates
- **[technical-changes.md](./technical-changes.md)** - Technical specification changes  
- **[guidelines-changes.md](./guidelines-changes.md)** - Development standards updates

### 🔄 Change Tracking System

#### Change Types
- **🎯 Major**: Significant architectural, product, or process changes
- **🔧 Minor**: Updates, clarifications, or small additions
- **📝 Editorial**: Typos, formatting, or structural improvements
- **🔗 Reference**: Link updates, external documentation changes

#### Change Entry Format
```markdown
## [YYYY-MM-DD] - Change Title
**Type**: 🎯 Major | 🔧 Minor | 📝 Editorial | 🔗 Reference  
**Scope**: product | technical | guidelines | meta  
**Impact**: High | Medium | Low  
**Author**: [Name]

### Changes Made
- Specific change description
- Another change with rationale

### Affected Documents
- [`/path/to/document.md`](../path/to/document.md) - Description of change
- [`/other/document.md`](../other/document.md) - How it was affected

### Migration Required
- [ ] Update related documentation
- [ ] Communicate to development team
- [ ] Update external references

### Rationale
Why this change was necessary and what problem it solves.
```

### 📋 Documentation Standards

#### File Organization Rules
1. **Logical Grouping**: Related documents in same subdirectory
2. **Clear Naming**: Descriptive filenames using consistent conventions
3. **Navigation Support**: README in every directory with >3 files
4. **Cross-References**: Link between related documents
5. **Update Tracking**: Record changes in appropriate changelog

#### Writing Guidelines
1. **English Only**: All documentation in English for team consistency
2. **Clear Structure**: Use headers, lists, and tables for scanability
3. **Code Examples**: Include practical implementation examples
4. **Context Provision**: Explain why decisions were made, not just what
5. **Maintenance Notes**: Include update triggers and review schedules

#### Review Process
1. **Self-Review**: Check formatting, links, and cross-references
2. **Peer Review**: Get feedback from relevant team members
3. **Changelog Update**: Record changes in appropriate changelog
4. **Communication**: Share significant changes with affected teams
5. **Follow-up**: Ensure changes are adopted in practice

### 🛠️ Maintenance Workflow

#### Regular Review Schedule
- **Weekly**: Recent changes review and cross-reference validation
- **Monthly**: Documentation completeness audit
- **Quarterly**: Major reorganization and cleanup
- **Per Release**: Documentation alignment with codebase changes

#### Health Metrics
- **Link Validity**: % of internal/external links working
- **Completeness**: Features documented vs features implemented  
- **Freshness**: Average age of last update per document
- **Usage**: Which documents are accessed most frequently

#### Maintenance Tasks
```bash
# Link checking
npm run docs:check-links

# Documentation build test
npm run docs:build

# Cross-reference validation
npm run docs:validate-refs

# Accessibility check for documentation
npm run docs:a11y
```

### 📊 Documentation Analytics

#### Usage Tracking
- Most accessed documents
- Common entry points for new team members
- Documents with highest update frequency
- Cross-reference patterns and navigation flows

#### Quality Metrics
- Documentation coverage ratio (features documented / features built)
- Time to find information (new developer onboarding)
- Accuracy ratio (outdated information discovery rate)
- Contribution distribution (who updates what, when)

### 🤝 Contribution Guidelines

#### Before Creating New Documentation
1. **Search Existing**: Check if information already exists elsewhere
2. **Identify Category**: Determine correct subdirectory placement
3. **Plan Structure**: Outline major sections and cross-references
4. **Consider Audience**: Write for appropriate technical level

#### Documentation Creation Process
1. **Draft Creation**: Write initial version with clear structure
2. **Internal Review**: Get feedback from relevant team members
3. **Integration**: Add to appropriate directory with README update
4. **Cross-Reference**: Link from related documents
5. **Changelog Entry**: Record creation in appropriate changelog

#### Updating Existing Documentation
1. **Impact Assessment**: Understand change scope and affected documents
2. **Consistent Updates**: Ensure all related documents stay synchronized
3. **Version History**: Maintain change rationale for future reference
4. **Communication**: Notify relevant team members of significant changes

### 🔗 External Documentation Dependencies

#### Technology Documentation
- **[Supabase Docs](https://supabase.com/docs)** - Database and real-time features
- **[Vercel AI SDK](https://ai-sdk.dev/)** - AI agent development
- **[ShadCN/ui](https://ui.shadcn.com/)** - Component library
- **[Next.js](https://nextjs.org/docs)** - Framework documentation

#### Business Tools
- **[Schematic](https://docs.schematichq.com/)** - Feature management and billing
- **[Stripe](https://stripe.com/docs)** - Payment processing
- **[Linear](https://linear.app/docs)** - Project management

#### Monitoring Strategy
- **Quarterly Review**: Check for breaking changes in external dependencies
- **Newsletter Subscriptions**: Stay updated on major technology updates
- **Version Tracking**: Monitor breaking changes in critical dependencies
- **Migration Planning**: Prepare for major external documentation changes

### 🎯 Success Criteria

This meta-documentation system is successful when:
- **Developers find information quickly** (<2 minutes for common questions)
- **Documentation stays current** (>90% accuracy on audit)
- **Changes are tracked consistently** (all updates recorded)
- **Knowledge is preserved** (architectural decisions documented with context)
- **Team onboarding is efficient** (new developers productive in <1 day)

---

*Meta-documentation ensures our knowledge base remains a reliable, organized, and valuable resource for the entire team throughout the project lifecycle.*