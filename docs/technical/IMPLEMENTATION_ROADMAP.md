# Implementation Roadmap - Fourmi Mobile App
## TDD + DDD Development Plan

### Strategic Overview

**Mission** : Transformer l'application existante vers une architecture DDD robuste avec système de quêtes éducatives, implémentée via TDD strict.

**Durée estimée** : 12-16 semaines
**Équipe recommandée** : 2-3 développeurs + 1 designer UX/UI
**Approche** : Incrémentale avec validation utilisateur à chaque phase

## Phase 1: Foundation & Strategic Design
**Durée** : 2-3 semaines
**Objectif** : Établir les bases solides DDD et TDD

### Week 1-2: Domain Modeling & Test Infrastructure

#### 🎯 Livrables Semaine 1
```ascii
LUNDI-MARDI: Event Storming Workshop
├── 3 Bounded Contexts validés
├── Ubiquitous Language défini  
├── Domain Events mappés
└── Context Map finalisé

MERCREDI-JEUDI: Test Infrastructure Setup
├── Vitest configuration complète
├── Test utilities et builders
├── CI/CD pipeline avec tests
└── Coverage thresholds établis

VENDREDI: Domain Layer Foundation
├── Base classes (Aggregate, ValueObject, DomainEvent)
├── Domain exceptions structure
├── Repository interfaces définies
└── Premier test unitaire (exemple)
```

#### 🎯 Livrables Semaine 2-3
```ascii
SEMAINE 2: Core Value Objects & Domain Services
├── MoneyAmount avec tests complets
├── QuestId, UserId, ProjectId
├── Domain Services interfaces
└── Event Bus architecture

SEMAINE 3: Architecture Validation
├── Proof of Concept: Quest Aggregate (TDD)
├── Integration avec Convex (spike)
├── Mobile UI mockups validation
└── Technical debt assessment
```

### 📊 Success Criteria Phase 1
- [ ] 100% tests unitaires domain layer passent
- [ ] Event Storming validé par équipe produit  
- [ ] Architecture decisions documentées
- [ ] Spike technique Convex integration réussi
- [ ] Mobile mockups approuvés par UX

### 🎯 Risk Mitigation
**Risque** : Complexité DDD trop élevée pour équipe
**Mitigation** : Formation DDD, pair programming, documentation extensive

**Risque** : Integration Convex complexe  
**Mitigation** : Spike technique early, adapter patterns DDD si nécessaire

## Phase 2: Domain Implementation (Core Aggregates)
**Durée** : 3-4 semaines  
**Objectif** : Implémenter les 3 agrégats principaux avec TDD

### Week 3-4: User Progression Context

#### 🔄 Red-Green-Refactor Cycle Example
```typescript
// RED: Test qui échoue
describe('Quest Aggregate', () => {
  it('should not be startable by user without prerequisites', () => {
    const quest = QuestTestBuilder.create()
      .withPrerequisites(new QuestId('basic-quest'))
      .build();
    
    const user = new UserId('user-123');
    const completedQuests: QuestId[] = [];
    
    expect(quest.canBeStartedBy(user, completedQuests)).toBe(false);
  });
});

// GREEN: Implementation minimale
export class Quest {
  canBeStartedBy(user: UserId, completedQuests: QuestId[]): boolean {
    return this.prerequisites.every(prereq => 
      completedQuests.some(completed => completed.equals(prereq))
    );
  }
}

// REFACTOR: Business rules plus sophistiquées
```

#### 🎯 Sprint Goals Week 3-4
```ascii
SPRINT 1 (Week 3): Quest Aggregate
├── Business rules: prerequisites, validation
├── Domain events: QuestStarted, StepCompleted  
├── Integration tests avec mock repository
└── 90%+ coverage tests unitaires

SPRINT 2 (Week 4): UserProgression Aggregate  
├── Gamification logic: XP, levels, rewards
├── Feature unlocking business rules
├── Quest orchestration service
└── Event handlers cross-aggregate
```

### Week 5-6: Financial Data Context

#### 🎯 Sprint Goals Week 5-6
```ascii
SPRINT 3 (Week 5): FinancialProfile Aggregate
├── Budget calculations (balance, DTI ratio)
├── Data validation business rules
├── Consistency checks et health score
└── Integration tests avec données réelles

SPRINT 4 (Week 6): PendingFactsProcessor Aggregate
├── IA extraction avec validation humaine  
├── Duplicate detection algorithms
├── Confidence scoring business logic
└── Event-driven fact approval workflow
```

### 📊 Success Criteria Phase 2
- [ ] 3 agrégats core implémentés avec >90% coverage
- [ ] Business rules documentées et testées
- [ ] Domain events flow validé
- [ ] Integration tests passent sur environnement test
- [ ] Performance: <100ms pour calculs financiers

## Phase 3: Infrastructure Adapters
**Durée** : 2-3 semaines
**Objectif** : Adapter Convex pour architecture DDD

### Week 7-8: Convex Integration

#### 🏗️ Repository Pattern Implementation
```typescript
// Interface (Domain Layer)
export interface QuestRepository {
  getById(id: QuestId): Promise<Quest>;
  save(quest: Quest): Promise<void>;
  getAvailableFor(userId: UserId): Promise<Quest[]>;
}

// Implementation (Infrastructure Layer)  
export class QuestConvexRepository implements QuestRepository {
  constructor(private ctx: ConvexContext) {}

  async save(quest: Quest): Promise<void> {
    const snapshot = quest.toSnapshot();
    const events = quest.getUncommittedEvents();
    
    // Transactional: save aggregate + publish events
    await this.ctx.db.insert('quests', snapshot);
    await this.publishEvents(events);
    quest.markEventsAsCommitted();
  }
}
```

#### 🎯 Sprint Goals Week 7-8
```ascii
SPRINT 5 (Week 7): Repository Implementations
├── Quest, UserProgression, FinancialProfile repositories
├── Event store avec Convex tables
├── Transaction management patterns
└── Integration tests repository layer

SPRINT 6 (Week 8): Application Services
├── Command handlers (StartQuest, CompleteStep)
├── Query handlers (GetProgression, GetQuests)  
├── Event handlers coordination
└── Anti-corruption layer design
```

### Week 9: Event Sourcing & CQRS

#### 🎯 Event Store Design
```ascii
CONVEX TABLES:
├── domain_events: { aggregateId, type, data, version, timestamp }
├── aggregate_snapshots: { aggregateId, type, data, version }
├── projections: { id, type, data, lastEventVersion }
└── saga_state: { sagaId, type, currentStep, data }
```

### 📊 Success Criteria Phase 3
- [ ] Repositories implementés avec tests d'intégration
- [ ] Event sourcing fonctionnel
- [ ] Command/Query separation claire
- [ ] Performance: <200ms pour requêtes complexes
- [ ] Zero data loss sur événements critiques

## Phase 4: Application Layer & Use Cases  
**Durée** : 2-3 semaines
**Objectif** : Orchestration business flows

### Week 10-11: Use Cases Implementation

#### 🎯 Use Case Example: Complete Quest Flow
```typescript
// Application Service
export class QuestOrchestrationService {
  async completeQuest(command: CompleteQuestCommand): Promise<void> {
    // 1. Load aggregates
    const quest = await this.questRepo.getById(command.questId);
    const progression = await this.progressionRepo.getByUserId(command.userId);
    
    // 2. Business validation
    if (!quest.canBeCompletedBy(command.userId)) {
      throw new DomainError('Quest cannot be completed');
    }
    
    // 3. Execute business logic
    const questEvents = quest.complete(command.results);
    const progressionEvents = progression.completeQuest(command.questId, command.results);
    
    // 4. Persist changes
    await this.questRepo.save(quest);
    await this.progressionRepo.save(progression);
    
    // 5. Publish events
    await this.eventBus.publishAll([...questEvents, ...progressionEvents]);
  }
}
```

#### 🎯 Sprint Goals Week 10-11
```ascii
SPRINT 7 (Week 10): Core Use Cases
├── StartQuest, CompleteStep, CompleteQuest
├── UpdateFinancialData, ValidatePendingFacts
├── CreateProject, CalculateProject
└── Error handling et validation

SPRINT 8 (Week 11): Advanced Use Cases  
├── QuestRecommendation based on profile
├── AutomaticProgressionUnlock workflows
├── Cross-aggregate sagas (complex flows)
└── Performance optimization
```

### 📊 Success Criteria Phase 4
- [ ] Use cases couvrent 100% des workflows métier
- [ ] Error handling robuste avec domain exceptions
- [ ] Saga patterns pour flows complexes
- [ ] Integration tests E2E passent
- [ ] Monitoring et observabilité en place

## Phase 5: Mobile Interface Implementation
**Durée** : 3-4 semaines  
**Objectif** : Interface mobile avec système de quêtes

### Week 12-13: Core Mobile UI

#### 🎯 Component Architecture
```ascii
PRESENTATION LAYER:
├── pages/
│   ├── QuestPage.tsx (écran principal dynamique)
│   ├── ProfilePage.tsx (données éditables)
│   ├── QuestsListPage.tsx (progression)  
│   └── AnalysisPage.tsx (résultats IA)
├── components/
│   ├── quest/
│   │   ├── QuestStep.tsx
│   │   ├── ProgressBar.tsx
│   │   └── RewardBadge.tsx
│   ├── overlays/
│   │   ├── ChatOverlay.tsx
│   │   └── ProfileSummary.tsx
│   └── forms/
│       ├── FinancialDataForm.tsx
│       └── VoiceInput.tsx
└── hooks/
    ├── useQuest.ts (connect to application layer)
    ├── useProgression.ts  
    └── useFinancialData.ts
```

#### 🎯 Sprint Goals Week 12-13
```ascii
SPRINT 9 (Week 12): Base Components & Navigation
├── Tab navigation avec états adaptatifs  
├── Quest interface (form + chat hybrid)
├── Overlay system (chat + profile summary)
└── Responsive design mobile-first

SPRINT 10 (Week 13): Interactive Features
├── Voice input avec transcription
├── Real-time progression updates
├── Gamification UI (badges, XP, levels)
└── Error states et offline handling
```

### Week 14-15: Advanced Mobile Features

#### 🎯 Sprint Goals Week 14-15  
```ascii
SPRINT 11 (Week 14): IA Integration UI
├── Chat interface avec Convex agents
├── Pending facts validation workflow
├── Real-time financial calculations display
└── Project creation et comparison UI

SPRINT 12 (Week 15): Polish & Performance
├── Animations et micro-interactions
├── Performance optimization (lazy loading)
├── Accessibility compliance (A11y)
└── Cross-platform testing (iOS/Android)
```

### 📊 Success Criteria Phase 5
- [ ] Interface mobile complète et responsive
- [ ] Voice input fonctionnel sur mobile
- [ ] Chat IA intégré et contextuel  
- [ ] Performance: <2s load time, <100ms interactions
- [ ] User testing validé (>80% satisfaction)

## Phase 6: Integration & Launch Preparation
**Durée** : 2 semaines
**Objectif** : Tests complets et déploiement

### Week 16: End-to-End Validation

#### 🎯 Final Integration
```ascii
TESTS E2E COMPLETS:
├── User journey: nouveau utilisateur → quest complétée
├── Data consistency: financial data → project creation  
├── Performance: load testing avec 1000+ users
└── Security: authentication flows et data protection

DEPLOYMENT PREPARATION:
├── Production Convex deployment configuration
├── Monitoring et alerting setup (Sentry, Analytics)
├── Feature flags pour rollout progressif
└── Rollback procedures documentation
```

#### 🎯 Sprint Goals Week 16
```ascii
SPRINT 13 (Week 16): Launch Readiness
├── E2E test suite complète (>95% success rate)
├── Performance benchmarks validés  
├── Security audit passed
├── Documentation utilisateur et développeur
└── Support procedures établies
```

### 📊 Success Criteria Phase 6
- [ ] Zero bugs critiques en production
- [ ] Performance SLA respectés (99.5% uptime)
- [ ] User onboarding <3 minutes (TTFP)
- [ ] Support team formée
- [ ] Analytics et monitoring opérationnels

## Resource Planning & Dependencies

### 👥 Équipe Recommandée

**Lead Developer DDD** (40h/semaine)
- Domain modeling et architecture decisions
- Code reviews et mentoring équipe
- Integration complexe Convex ↔ DDD

**Mobile Developer React** (40h/semaine) 
- Interface mobile et responsive design
- Integration avec backend via hooks
- Performance optimization mobile

**Fullstack Developer** (30h/semaine, à partir Phase 3)
- Infrastructure et deployment
- Testing automation et CI/CD
- Support développement backend

**UX/UI Designer** (20h/semaine, concentré Phase 5)
- Mobile interface design
- User journey optimization  
- Accessibility et usability testing

### 📅 Critical Path & Dependencies

```ascii
DEPENDENCIES CRITIQUES:
Phase 1 → Phase 2: Domain model validé
Phase 2 → Phase 3: Aggregates stables  
Phase 3 → Phase 4: Repositories fonctionnels
Phase 4 → Phase 5: Use cases implémentés
Phase 5 → Phase 6: Interface complète

RISQUES PLANNING:
├── Phase 2 (+1 semaine si complexité domain élevée)
├── Phase 3 (+2 semaines si adaptation Convex complexe)
├── Phase 5 (+1 semaine si perf mobile insuffisantes)
└── Phase 6 (buffer 1 semaine pour bugs critiques)
```

### 🎯 Definition of Done - Global

**Chaque phase doit satisfaire** :
1. **Fonctionnel** : Features implémentées selon specs
2. **Qualité** : Tests passent (unit + integration + E2E)
3. **Performance** : SLA respectés sur environnement test
4. **Documentation** : Code documenté, ADRs à jour
5. **Review** : Code review passé, architecture validée
6. **UX** : User testing validé (si applicable)

### 📊 Success Metrics - Post-Launch

**Adoption (1 mois)** :
- 70%+ nouveaux utilisateurs finissent première quête
- 40%+ passent à deuxième quête  
- <5% taux d'abandon en cours de quête

**Engagement (3 mois)** :
- 60%+ retention à 1 semaine
- 30%+ utilisateurs actifs mensuels
- 8-12% conversion freemium

**Technique (ongoing)** :
- 99.5%+ uptime production
- <2s TTFP (Time to First Profile)
- <100ms response time interactions

Cette roadmap offre une approche structurée et validée pour transformer Fourmi vers une architecture DDD moderne avec un système de quêtes engageant.