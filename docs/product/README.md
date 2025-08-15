# Product Documentation
## Fourmi Financial Copilot

### 🎯 Purpose

This directory contains product strategy, requirements, and roadmap documentation that defines **what** we're building and **why**. These documents guide product decisions, feature prioritization, and business strategy.

### 📄 Documents

#### [PRD.md](./PRD.md) - Product Requirements Document
**Owner**: Product Team  
**Audience**: All stakeholders  
**Last Updated**: 2025-01-13

The master specification defining Fourmi's vision, target users, and feature strategy.

**Key Sections**:
- **Vision Statement**: Chat-first financial copilot fighting consumer debt traps
- **Target Personas**: Non-financial users needing clear decision tools
- **Three-Tier Strategy**: Free basic tools → Paid simulations → Premium portfolios
- **MVP Scope**: Profiles, Projects, Simulations, Comparisons with AI chat
- **Success Metrics**: TTFP <3min, 90% KPI comprehension, social impact goals

**When to Reference**:
- Planning new features or changes
- Onboarding new team members
- Stakeholder alignment discussions
- User research and validation

#### [ROADMAP.md](./ROADMAP.md) - Development Roadmap
**Owner**: Engineering Lead  
**Audience**: Development team, stakeholders  
**Last Updated**: 2025-01-13

Phase-by-phase development plan following 80/20 Pareto approach.

**Key Sections**:
- **Phase 0**: Foundation (Week 1) - Core infrastructure, calculation engine
- **Phase 1**: Chat + AI (Weeks 2-3) - Basic chat interface with fact extraction
- **Phase 2**: Advanced Features (Weeks 4-5) - Comparisons, KPI dashboards
- **Phase 3**: Polish (Weeks 6-7) - Responsive design, performance optimization
- **Phase 4**: Production (Weeks 8+) - Deployment, monitoring, business features

**When to Reference**:
- Sprint planning and milestone tracking
- Resource allocation decisions
- Feature prioritization discussions
- Timeline estimation and commitments

### 🔄 Update Guidelines

#### When to Update PRD
- Major feature scope changes
- New user research insights  
- Business model modifications
- Competitive landscape shifts

#### When to Update Roadmap
- Sprint completion and retrospectives
- Scope changes or technical discoveries
- Resource availability changes
- Priority shifts from stakeholder feedback

#### Update Process
1. **Review Current State**: Check existing content before modifications
2. **Document Changes**: Update relevant sections with clear rationale
3. **Update Changelog**: Record changes in `/meta/product-changes.md`
4. **Stakeholder Review**: Share significant changes with product team
5. **Cross-Reference Update**: Ensure technical docs align with product changes

### 📊 Key Metrics & KPIs

#### Product Success Metrics
- **Time to First Projection (TTFP)**: <3 minutes target
- **User Comprehension**: 90% understand core KPIs without help
- **Social Impact**: Number of users helped with debt decisions
- **Conversion Rate**: Free → Paid tier conversion percentage

#### Development Velocity Metrics  
- **Sprint Completion**: % of planned features delivered on time
- **Technical Debt**: Ratio of feature work vs refactoring
- **Quality Gates**: Test coverage, performance benchmarks
- **User Feedback**: Post-release satisfaction and usability scores

### 🔗 Cross-References

#### Related Technical Documentation
- **[Architecture](../technical/ARCHITECTURE.md)**: Implementation approach for product features
- **[Domain Model](../technical/DOMAIN.md)**: Technical representation of business concepts
- **[Agents](../technical/AGENTS.md)**: AI implementation of chat-first experience

#### Related Guidelines
- **[Design System](../guidelines/DESIGN_SYSTEM.md)**: Visual representation of product vision
- **[UI/UX Spec](../guidelines/UI_UX_SPEC.md)**: User experience implementation of product goals

### 📝 Templates

#### Feature Request Template
```markdown
## Feature: [Name]
**Problem**: What user problem does this solve?
**Solution**: Proposed approach
**Success Criteria**: How do we measure success?
**Priority**: High/Medium/Low
**Effort**: T-shirt sizing (XS/S/M/L/XL)
**Dependencies**: Other features or technical requirements
```

#### Milestone Review Template
```markdown
## Milestone: [Phase X - Name]
**Goals**: What we aimed to achieve
**Completed**: Features delivered
**Blocked**: Obstacles encountered  
**Learnings**: Key insights for next phase
**Next Steps**: Immediate action items
```

### 🎯 Success Criteria

This product documentation is successful when:
- New team members can understand the product vision in <30 minutes
- Feature decisions can be validated against clear product principles
- Development priorities align with business objectives
- Stakeholders have shared understanding of goals and timeline

---

*Product documentation serves as the north star for all development decisions - keeping the team aligned on the **why** behind every feature we build.*