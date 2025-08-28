# Domain Implementation Guide - Fourmi Mobile App
## Practical DDD Patterns & Code Structure

### Overview

Ce guide fournit les patterns concrets, la structure de fichiers, et les templates de code pour implémenter l'architecture DDD de Fourmi. Focus sur la pragmatisme et l'intégration avec l'écosystème TypeScript/Convex existant.

## Project Structure

### Recommended File Organization

```ascii
src/
├── domain/                          # Domain Layer (Pure Business Logic)
│   ├── shared/                      # Cross-bounded-context shared
│   │   ├── base/
│   │   │   ├── aggregate.ts         # Base Aggregate class
│   │   │   ├── value-object.ts      # Base ValueObject class
│   │   │   ├── domain-event.ts      # Base DomainEvent class
│   │   │   └── domain-error.ts      # Domain exceptions
│   │   ├── types/
│   │   │   ├── user-id.ts           # Shared UserId
│   │   │   └── money-amount.ts      # Money handling
│   │   └── events/
│   │       └── domain-event-bus.ts  # Event coordination
│   │
│   ├── user-progression/            # USER PROGRESSION BC
│   │   ├── aggregates/
│   │   │   ├── quest.aggregate.ts
│   │   │   └── user-progression.aggregate.ts
│   │   ├── value-objects/
│   │   │   ├── quest-id.ts
│   │   │   ├── step-id.ts
│   │   │   ├── experience-points.ts
│   │   │   └── progression-level.ts
│   │   ├── entities/
│   │   │   ├── step.entity.ts
│   │   │   └── milestone.entity.ts
│   │   ├── services/
│   │   │   └── quest-orchestration.service.ts
│   │   ├── events/
│   │   │   ├── quest-started.event.ts
│   │   │   ├── step-completed.event.ts
│   │   │   └── quest-completed.event.ts
│   │   └── repositories/
│   │       ├── quest.repository.ts       # Interface
│   │       └── user-progression.repository.ts
│   │
│   ├── financial-data/              # FINANCIAL DATA BC
│   │   ├── aggregates/
│   │   │   ├── financial-profile.aggregate.ts
│   │   │   └── pending-facts-processor.aggregate.ts
│   │   ├── value-objects/
│   │   │   ├── percentage.ts
│   │   │   ├── health-score.ts
│   │   │   └── validation-result.ts
│   │   ├── entities/
│   │   │   ├── income.entity.ts
│   │   │   ├── expense.entity.ts
│   │   │   └── loan.entity.ts
│   │   └── services/
│   │       ├── financial-calculator.service.ts
│   │       └── data-validation.service.ts
│   │
│   └── project-management/          # PROJECT MANAGEMENT BC
│       ├── aggregates/
│       │   └── project.aggregate.ts
│       ├── value-objects/
│       │   ├── project-id.ts
│       │   └── project-state.ts
│       ├── project-types/           # Strategy Pattern
│       │   ├── rent-vs-buy.project-type.ts
│       │   └── debt-consolidation.project-type.ts
│       └── services/
│           └── project-recommendation.service.ts
│
├── application/                     # Application Layer (Orchestration)
│   ├── commands/
│   │   ├── quest/
│   │   │   ├── start-quest.command.ts
│   │   │   ├── complete-step.command.ts
│   │   │   └── complete-quest.command.ts
│   │   └── financial/
│   │       ├── update-financial-data.command.ts
│   │       └── validate-pending-facts.command.ts
│   ├── queries/
│   │   ├── quest/
│   │   │   ├── get-available-quests.query.ts
│   │   │   └── get-user-progression.query.ts
│   │   └── financial/
│   │       └── get-financial-summary.query.ts
│   ├── handlers/
│   │   ├── command-handlers/
│   │   │   ├── start-quest.handler.ts
│   │   │   └── update-financial-data.handler.ts
│   │   ├── query-handlers/
│   │   │   └── get-available-quests.handler.ts
│   │   └── event-handlers/
│   │       ├── quest-completed.handler.ts
│   │       └── financial-data-updated.handler.ts
│   └── services/
│       ├── quest-orchestration.service.ts
│       └── financial-analysis.service.ts
│
├── infrastructure/                  # Infrastructure Layer (Convex Adapters)
│   ├── convex/
│   │   ├── repositories/
│   │   │   ├── quest.convex-repository.ts
│   │   │   ├── user-progression.convex-repository.ts
│   │   │   └── financial-profile.convex-repository.ts
│   │   ├── event-store/
│   │   │   ├── convex-event-store.ts
│   │   │   └── event-projection.service.ts
│   │   └── adapters/
│   │       ├── convex-query-adapter.ts
│   │       └── convex-mutation-adapter.ts
│   └── external/
│       ├── ai-service.adapter.ts
│       └── voice-recognition.adapter.ts
│
└── presentation/                    # Presentation Layer (React Components)
    ├── pages/
    │   ├── quest-page.tsx
    │   ├── profile-page.tsx
    │   └── analysis-page.tsx
    ├── components/
    │   ├── quest/
    │   └── overlays/
    └── hooks/
        ├── use-quest.ts
        ├── use-progression.ts
        └── use-financial-data.ts
```

## Domain Layer Implementation Patterns

### 1. Base Classes & Infrastructure

#### Base Aggregate

```typescript
// src/domain/shared/base/aggregate.ts
import { DomainEvent } from './domain-event';
import { DomainError } from './domain-error';

export abstract class Aggregate<TId extends ValueObject<any>> {
  private _domainEvents: DomainEvent[] = [];
  protected readonly _id: TId;

  constructor(id: TId) {
    this._id = id;
  }

  get id(): TId {
    return this._id;
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  getUncommittedEvents(): readonly DomainEvent[] {
    return [...this._domainEvents];
  }

  markEventsAsCommitted(): void {
    this._domainEvents = [];
  }

  clearEvents(): void {
    this._domainEvents = [];
  }
}
```

#### Base Value Object

```typescript
// src/domain/shared/base/value-object.ts
export abstract class ValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = value;
    this.validate();
  }

  get value(): T {
    return this._value;
  }

  protected abstract validate(): void;

  equals(other: ValueObject<T>): boolean {
    if (!other) return false;
    return this._value === other._value;
  }

  toString(): string {
    return String(this._value);
  }
}

// Example implementation
export class QuestId extends ValueObject<string> {
  static create(value: string): QuestId {
    return new QuestId(value);
  }

  static generate(): QuestId {
    return new QuestId(`quest_${Date.now()}_${Math.random().toString(36).substring(7)}`);
  }

  protected validate(): void {
    if (!this._value || this._value.trim().length === 0) {
      throw new DomainError('QuestId cannot be empty');
    }
    if (this._value.length > 100) {
      throw new DomainError('QuestId cannot exceed 100 characters');
    }
  }
}
```

#### Domain Events

```typescript
// src/domain/shared/base/domain-event.ts
export abstract class DomainEvent {
  readonly occurredOn: Date;
  readonly eventId: string;

  constructor() {
    this.occurredOn = new Date();
    this.eventId = `event_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  abstract getEventName(): string;
}

// Example implementation
export class QuestStartedEvent extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly questId: QuestId,
    public readonly questType: QuestType
  ) {
    super();
  }

  getEventName(): string {
    return 'QuestStarted';
  }
}
```

### 2. Money Handling (Critical for Financial App)

```typescript
// src/domain/shared/types/money-amount.ts
export class MoneyAmount extends ValueObject<number> {
  private constructor(cents: number) {
    super(cents);
  }

  static fromCents(cents: number): MoneyAmount {
    return new MoneyAmount(Math.round(cents));
  }

  static fromEuros(euros: number): MoneyAmount {
    return new MoneyAmount(Math.round(euros * 100));
  }

  static zero(): MoneyAmount {
    return new MoneyAmount(0);
  }

  protected validate(): void {
    if (!Number.isInteger(this._value)) {
      throw new DomainError('Money amount must be in cents (integer)');
    }
  }

  toEuros(): number {
    return this._value / 100;
  }

  toCents(): number {
    return this._value;
  }

  add(other: MoneyAmount): MoneyAmount {
    return new MoneyAmount(this._value + other._value);
  }

  subtract(other: MoneyAmount): MoneyAmount {
    return new MoneyAmount(this._value - other._value);
  }

  multiply(factor: number): MoneyAmount {
    return new MoneyAmount(Math.round(this._value * factor));
  }

  divide(divisor: number): MoneyAmount {
    if (divisor === 0) throw new DomainError('Cannot divide by zero');
    return new MoneyAmount(Math.round(this._value / divisor));
  }

  isZero(): boolean {
    return this._value === 0;
  }

  isPositive(): boolean {
    return this._value > 0;
  }

  isNegative(): boolean {
    return this._value < 0;
  }

  isGreaterThan(other: MoneyAmount): boolean {
    return this._value > other._value;
  }

  isLessThan(other: MoneyAmount): boolean {
    return this._value < other._value;
  }

  absoluteValue(): MoneyAmount {
    return new MoneyAmount(Math.abs(this._value));
  }

  format(locale: string = 'fr-FR'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(this.toEuros());
  }
}
```

### 3. Quest Aggregate Implementation

```typescript
// src/domain/user-progression/aggregates/quest.aggregate.ts
import { Aggregate } from '../../shared/base/aggregate';
import { QuestId } from '../value-objects/quest-id';
import { Step } from '../entities/step.entity';
import { QuestStartedEvent } from '../events/quest-started.event';

export enum QuestStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum QuestType {
  BUDGET_SETUP = 'budget_setup',
  FINANCIAL_HABITS = 'financial_habits',
  PROJECT_CREATION = 'project_creation',
  DEBT_ANALYSIS = 'debt_analysis'
}

export class QuestMetadata {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly estimatedDuration: number // minutes
  ) {}

  static create(name: string, description: string, duration: number = 15): QuestMetadata {
    if (!name || name.trim().length === 0) {
      throw new DomainError('Quest name cannot be empty');
    }
    if (duration <= 0) {
      throw new DomainError('Quest duration must be positive');
    }
    return new QuestMetadata(name, description, duration);
  }
}

export class Quest extends Aggregate<QuestId> {
  private constructor(
    id: QuestId,
    private readonly _metadata: QuestMetadata,
    private readonly _type: QuestType,
    private readonly _steps: Step[],
    private readonly _prerequisites: QuestId[],
    private _status: QuestStatus
  ) {
    super(id);
  }

  // Factory methods
  static create(
    metadata: QuestMetadata,
    type: QuestType,
    steps: Step[],
    prerequisites: QuestId[] = []
  ): Quest {
    const id = QuestId.generate();
    const quest = new Quest(id, metadata, type, steps, prerequisites, QuestStatus.DRAFT);
    
    // Business rule: Quest must have at least one step
    if (steps.length === 0) {
      throw new DomainError('Quest must have at least one step');
    }

    return quest;
  }

  static fromSnapshot(snapshot: QuestSnapshot): Quest {
    return new Quest(
      new QuestId(snapshot.id),
      QuestMetadata.create(snapshot.name, snapshot.description, snapshot.estimatedDuration),
      snapshot.type,
      snapshot.steps.map(s => Step.fromSnapshot(s)),
      snapshot.prerequisites.map(p => new QuestId(p)),
      snapshot.status
    );
  }

  // Business methods
  canBeStartedBy(userId: UserId, completedQuests: QuestId[]): boolean {
    // Business rule: Must be published
    if (this._status !== QuestStatus.PUBLISHED) {
      return false;
    }

    // Business rule: All prerequisites must be completed
    return this._prerequisites.every(prereq =>
      completedQuests.some(completed => completed.equals(prereq))
    );
  }

  startFor(userId: UserId): DomainEvent[] {
    if (this._status !== QuestStatus.PUBLISHED) {
      throw new DomainError('Cannot start unpublished quest');
    }

    const event = new QuestStartedEvent(userId, this._id, this._type);
    this.addDomainEvent(event);

    return this.getUncommittedEvents();
  }

  completeStep(stepId: StepId, data: StepData, userId: UserId): DomainEvent[] {
    const step = this.findStep(stepId);
    if (!step) {
      throw new DomainError(`Step ${stepId.value} not found in quest`);
    }

    if (step.isCompleted()) {
      throw new DomainError('Step already completed');
    }

    const events = step.complete(data, userId);
    events.forEach(event => this.addDomainEvent(event));

    // Check if quest is now completed
    if (this.isCompleted()) {
      const questCompletedEvent = new QuestCompletedEvent(
        userId,
        this._id,
        this.calculateResults(),
        this.calculateExperienceReward()
      );
      this.addDomainEvent(questCompletedEvent);
    }

    return this.getUncommittedEvents();
  }

  // Query methods
  getMetadata(): QuestMetadata {
    return this._metadata;
  }

  getType(): QuestType {
    return this._type;
  }

  getNextStep(): Step | null {
    return this._steps.find(step => !step.isCompleted()) || null;
  }

  getCompletionRate(): number {
    if (this._steps.length === 0) return 0;
    const completedSteps = this._steps.filter(step => step.isCompleted()).length;
    return completedSteps / this._steps.length;
  }

  isCompleted(): boolean {
    return this._steps.every(step => step.isCompleted());
  }

  getEstimatedDuration(): number {
    return this._metadata.estimatedDuration;
  }

  // Private methods
  private findStep(stepId: StepId): Step | null {
    return this._steps.find(step => step.getId().equals(stepId)) || null;
  }

  private calculateResults(): QuestResults {
    const completedSteps = this._steps.filter(step => step.isCompleted());
    return new QuestResults(
      this._id,
      completedSteps.map(step => step.getData()),
      Date.now()
    );
  }

  private calculateExperienceReward(): number {
    // Business rule: Experience based on quest type and completion time
    const baseXP = {
      [QuestType.BUDGET_SETUP]: 100,
      [QuestType.FINANCIAL_HABITS]: 150,
      [QuestType.PROJECT_CREATION]: 200,
      [QuestType.DEBT_ANALYSIS]: 250
    };

    return baseXP[this._type] || 100;
  }

  // Snapshot for persistence
  toSnapshot(): QuestSnapshot {
    return {
      id: this._id.value,
      name: this._metadata.name,
      description: this._metadata.description,
      estimatedDuration: this._metadata.estimatedDuration,
      type: this._type,
      steps: this._steps.map(step => step.toSnapshot()),
      prerequisites: this._prerequisites.map(p => p.value),
      status: this._status
    };
  }
}

// Snapshot interfaces for serialization
export interface QuestSnapshot {
  id: string;
  name: string;
  description: string;
  estimatedDuration: number;
  type: QuestType;
  steps: StepSnapshot[];
  prerequisites: string[];
  status: QuestStatus;
}
```

### 4. Repository Pattern with Convex

```typescript
// src/domain/user-progression/repositories/quest.repository.ts (Interface)
export interface QuestRepository {
  getById(id: QuestId): Promise<Quest | null>;
  getByType(type: QuestType): Promise<Quest[]>;
  getAvailableFor(userId: UserId): Promise<Quest[]>;
  save(quest: Quest): Promise<void>;
  delete(id: QuestId): Promise<void>;
}

// src/infrastructure/convex/repositories/quest.convex-repository.ts (Implementation)
import { ConvexContext } from '../../../types/convex';
import { QuestRepository } from '../../../domain/user-progression/repositories/quest.repository';

export class QuestConvexRepository implements QuestRepository {
  constructor(private ctx: ConvexContext) {}

  async getById(id: QuestId): Promise<Quest | null> {
    const doc = await this.ctx.db
      .query('quests')
      .filter(q => q.eq('id', id.value))
      .first();

    if (!doc) return null;

    return Quest.fromSnapshot(doc as QuestSnapshot);
  }

  async getByType(type: QuestType): Promise<Quest[]> {
    const docs = await this.ctx.db
      .query('quests')
      .filter(q => q.eq('type', type))
      .collect();

    return docs.map(doc => Quest.fromSnapshot(doc as QuestSnapshot));
  }

  async getAvailableFor(userId: UserId): Promise<Quest[]> {
    // First get user's completed quests
    const userProgression = await this.ctx.db
      .query('user_progressions')
      .filter(q => q.eq('userId', userId.value))
      .first();

    const completedQuestIds = userProgression?.completedQuests || [];

    // Then get all published quests
    const allQuests = await this.ctx.db
      .query('quests')
      .filter(q => q.eq('status', 'published'))
      .collect();

    // Filter based on prerequisites
    return allQuests
      .map(doc => Quest.fromSnapshot(doc as QuestSnapshot))
      .filter(quest => quest.canBeStartedBy(
        userId,
        completedQuestIds.map(id => new QuestId(id))
      ));
  }

  async save(quest: Quest): Promise<void> {
    const snapshot = quest.toSnapshot();
    const events = quest.getUncommittedEvents();

    // Transactional save: quest + events
    const existingDoc = await this.ctx.db
      .query('quests')
      .filter(q => q.eq('id', quest.id.value))
      .first();

    if (existingDoc) {
      await this.ctx.db.patch(existingDoc._id, snapshot);
    } else {
      await this.ctx.db.insert('quests', snapshot);
    }

    // Publish domain events
    for (const event of events) {
      await this.publishEvent(event);
    }

    quest.markEventsAsCommitted();
  }

  async delete(id: QuestId): Promise<void> {
    const doc = await this.ctx.db
      .query('quests')
      .filter(q => q.eq('id', id.value))
      .first();

    if (doc) {
      await this.ctx.db.delete(doc._id);
    }
  }

  private async publishEvent(event: DomainEvent): Promise<void> {
    await this.ctx.db.insert('domain_events', {
      eventId: event.eventId,
      eventName: event.getEventName(),
      eventData: event,
      occurredOn: event.occurredOn.toISOString(),
      processed: false
    });
  }
}
```

## Application Layer Patterns

### 1. Command Pattern

```typescript
// src/application/commands/quest/start-quest.command.ts
export class StartQuestCommand {
  constructor(
    public readonly userId: string,
    public readonly questId: string
  ) {}
}

// src/application/handlers/command-handlers/start-quest.handler.ts
export class StartQuestHandler {
  constructor(
    private questRepo: QuestRepository,
    private progressionRepo: UserProgressionRepository,
    private eventBus: DomainEventBus
  ) {}

  async handle(command: StartQuestCommand): Promise<void> {
    const userId = new UserId(command.userId);
    const questId = new QuestId(command.questId);

    // Load aggregates
    const quest = await this.questRepo.getById(questId);
    if (!quest) {
      throw new ApplicationError('Quest not found');
    }

    const progression = await this.progressionRepo.getByUserId(userId);
    if (!progression) {
      throw new ApplicationError('User progression not found');
    }

    // Business validation
    const completedQuests = progression.getCompletedQuests();
    if (!quest.canBeStartedBy(userId, completedQuests)) {
      throw new ApplicationError('Quest prerequisites not met');
    }

    // Execute business logic
    const questEvents = quest.startFor(userId);
    const progressionEvents = progression.startQuest(questId);

    // Persist changes
    await this.questRepo.save(quest);
    await this.progressionRepo.save(progression);

    // Publish events
    const allEvents = [...questEvents, ...progressionEvents];
    await this.eventBus.publishAll(allEvents);
  }
}
```

### 2. Query Pattern

```typescript
// src/application/queries/quest/get-available-quests.query.ts
export class GetAvailableQuestsQuery {
  constructor(public readonly userId: string) {}
}

export class GetAvailableQuestsResult {
  constructor(
    public readonly quests: Array<{
      id: string;
      name: string;
      description: string;
      estimatedDuration: number;
      type: string;
      isUnlocked: boolean;
      prerequisites: string[];
    }>
  ) {}
}

// src/application/handlers/query-handlers/get-available-quests.handler.ts
export class GetAvailableQuestsHandler {
  constructor(
    private questRepo: QuestRepository,
    private progressionRepo: UserProgressionRepository
  ) {}

  async handle(query: GetAvailableQuestsQuery): Promise<GetAvailableQuestsResult> {
    const userId = new UserId(query.userId);
    const progression = await this.progressionRepo.getByUserId(userId);
    
    if (!progression) {
      return new GetAvailableQuestsResult([]);
    }

    const availableQuests = await this.questRepo.getAvailableFor(userId);
    const completedQuestIds = progression.getCompletedQuests().map(q => q.value);

    const questDTOs = availableQuests.map(quest => ({
      id: quest.id.value,
      name: quest.getMetadata().name,
      description: quest.getMetadata().description,
      estimatedDuration: quest.getEstimatedDuration(),
      type: quest.getType(),
      isUnlocked: quest.canBeStartedBy(userId, progression.getCompletedQuests()),
      prerequisites: quest.getPrerequisites().map(p => p.value)
    }));

    return new GetAvailableQuestsResult(questDTOs);
  }
}
```

## Integration with React (Presentation Layer)

### 1. Custom Hooks Pattern

```typescript
// src/presentation/hooks/use-quest.ts
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function useQuest(questId?: string) {
  // Query for quest data
  const quest = useQuery(
    api.quests.getById,
    questId ? { questId } : 'skip'
  );

  // Mutations
  const startQuestMutation = useMutation(api.quests.start);
  const completeStepMutation = useMutation(api.quests.completeStep);

  const startQuest = async (userId: string) => {
    if (!questId) throw new Error('Quest ID required');
    return await startQuestMutation({ userId, questId });
  };

  const completeStep = async (stepId: string, data: any) => {
    if (!questId) throw new Error('Quest ID required');
    return await completeStepMutation({ questId, stepId, data });
  };

  return {
    quest,
    isLoading: quest === undefined,
    startQuest,
    completeStep
  };
}

export function useAvailableQuests(userId?: string) {
  const availableQuests = useQuery(
    api.quests.getAvailable,
    userId ? { userId } : 'skip'
  );

  return {
    quests: availableQuests || [],
    isLoading: availableQuests === undefined
  };
}
```

### 2. Component Integration

```typescript
// src/presentation/pages/quest-page.tsx
import React from 'react';
import { useQuest, useAvailableQuests } from '../hooks/use-quest';
import { useAuth } from '@clerk/clerk-react';

export function QuestPage() {
  const { userId } = useAuth();
  const { quests, isLoading } = useAvailableQuests(userId);
  const [activeQuestId, setActiveQuestId] = useState<string>();
  const { quest, startQuest, completeStep } = useQuest(activeQuestId);

  const handleStartQuest = async (questId: string) => {
    if (!userId) return;
    setActiveQuestId(questId);
    await startQuest(userId);
  };

  const handleCompleteStep = async (stepId: string, data: any) => {
    await completeStep(stepId, data);
  };

  if (isLoading) {
    return <QuestPageSkeleton />;
  }

  return (
    <div className="quest-page">
      {!activeQuestId ? (
        <QuestSelection 
          quests={quests}
          onSelectQuest={handleStartQuest}
        />
      ) : (
        <ActiveQuest
          quest={quest}
          onCompleteStep={handleCompleteStep}
        />
      )}
    </div>
  );
}
```

## Convex Schema Extensions

### Updated Schema for Quest System

```typescript
// convex/schema.ts (additions)
const questTables = {
  quests: defineTable({
    id: v.string(),
    name: v.string(),
    description: v.string(),
    estimatedDuration: v.number(),
    type: v.union(
      v.literal('budget_setup'),
      v.literal('financial_habits'),
      v.literal('project_creation'),
      v.literal('debt_analysis')
    ),
    steps: v.array(v.object({
      id: v.string(),
      name: v.string(),
      type: v.string(),
      required: v.boolean(),
      data: v.any()
    })),
    prerequisites: v.array(v.string()),
    status: v.union(
      v.literal('draft'),
      v.literal('published'),
      v.literal('archived')
    )
  }).index('by_type', ['type'])
    .index('by_status', ['status']),

  user_progressions: defineTable({
    userId: v.string(),
    activeQuestId: v.optional(v.string()),
    completedQuests: v.array(v.string()),
    unlockedFeatures: v.array(v.string()),
    level: v.string(),
    experiencePoints: v.number(),
    created: v.number(),
    lastActivity: v.number()
  }).index('by_user', ['userId']),

  domain_events: defineTable({
    eventId: v.string(),
    eventName: v.string(),
    eventData: v.any(),
    occurredOn: v.string(),
    processed: v.boolean()
  }).index('by_processed', ['processed'])
    .index('by_occurred_on', ['occurredOn']),

  quest_completions: defineTable({
    userId: v.string(),
    questId: v.string(),
    completedAt: v.number(),
    results: v.any(),
    experienceGained: v.number(),
    duration: v.number() // seconds
  }).index('by_user', ['userId'])
    .index('by_quest', ['questId'])
    .index('by_completed_at', ['completedAt'])
};

export default defineSchema({
  ...applicationTables, // existing tables
  ...questTables
});
```

## Testing Templates

### Domain Tests Template

```typescript
// tests/unit/domain/quest.aggregate.test.ts
import { describe, it, expect } from 'vitest';
import { Quest, QuestType, QuestMetadata } from '../../../src/domain/user-progression/aggregates/quest.aggregate';
import { Step } from '../../../src/domain/user-progression/entities/step.entity';
import { QuestId } from '../../../src/domain/user-progression/value-objects/quest-id';
import { UserId } from '../../../src/domain/shared/types/user-id';

describe('Quest Aggregate', () => {
  describe('creation', () => {
    it('should create quest with valid data', () => {
      const metadata = QuestMetadata.create('Test Quest', 'Description', 15);
      const steps = [Step.create('step1', 'Step 1', 'form', true)];
      
      const quest = Quest.create(metadata, QuestType.BUDGET_SETUP, steps);
      
      expect(quest.id).toBeDefined();
      expect(quest.getType()).toBe(QuestType.BUDGET_SETUP);
      expect(quest.getEstimatedDuration()).toBe(15);
    });

    it('should throw error when creating quest without steps', () => {
      const metadata = QuestMetadata.create('Test Quest', 'Description');
      
      expect(() => Quest.create(metadata, QuestType.BUDGET_SETUP, []))
        .toThrow('Quest must have at least one step');
    });
  });

  describe('business rules', () => {
    it('should not be startable without prerequisites', () => {
      const prerequisiteId = new QuestId('prereq-quest');
      const metadata = QuestMetadata.create('Advanced Quest', 'Description');
      const steps = [Step.create('step1', 'Step 1', 'form', true)];
      
      const quest = Quest.create(metadata, QuestType.PROJECT_CREATION, steps, [prerequisiteId]);
      const userId = new UserId('user-123');
      const completedQuests: QuestId[] = [];
      
      expect(quest.canBeStartedBy(userId, completedQuests)).toBe(false);
    });

    it('should be startable when prerequisites are met', () => {
      const prerequisiteId = new QuestId('prereq-quest');
      const metadata = QuestMetadata.create('Advanced Quest', 'Description');
      const steps = [Step.create('step1', 'Step 1', 'form', true)];
      
      const quest = Quest.create(metadata, QuestType.PROJECT_CREATION, steps, [prerequisiteId]);
      // Mark quest as published (needed for startability)
      quest.publish();
      
      const userId = new UserId('user-123');
      const completedQuests = [prerequisiteId];
      
      expect(quest.canBeStartedBy(userId, completedQuests)).toBe(true);
    });
  });
});
```

Cette structure guide l'implémentation d'une architecture DDD solide, testable et maintenable pour l'application Fourmi, avec une intégration naturelle à l'écosystème Convex/React existant.