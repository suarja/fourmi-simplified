# Domain Model - Fourmi App
## Domain-Driven Design Architecture

### Vision Stratégique

**Fourmi** implémente un système de **quêtes éducatives financières** avec une interface d'inversion où l'application guide l'utilisateur. L'architecture DDD structure le domaine en 3 Bounded Contexts indépendants mais collaboratifs.

## Strategic Design - Bounded Contexts

### Context Map

```ascii
┌─────────────────────────────────────────────────────────────┐
│                    CONTEXT MAP FOURMI                       │
│                                                             │
│  ┌─ USER PROGRESSION ─┐    ┌─ FINANCIAL DATA ─┐            │
│  │ • Quêtes           │◄──►│ • Profil          │            │
│  │ • Étapes           │    │ • Revenus/Dépenses│            │
│  │ • Progression      │    │ • Validation IA   │            │
│  │ • Récompenses      │    │ • Pending Facts   │            │
│  └────────────────────┘    └───────────────────┘            │
│           │                          │                      │
│           │                          │                      │
│           └──────────┬───────────────┘                      │
│                      │                                      │
│            ┌─ PROJECT MANAGEMENT ─┐                         │
│            │ • Projets immobiliers │                        │
│            │ • Simulations         │                        │
│            │ • Comparaisons        │                        │
│            │ • États FRESH/STALE   │                        │
│            └───────────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

**Relations entre contextes** :
- **USER PROGRESSION ↔ FINANCIAL DATA** : Shared Kernel (données utilisateur communes)
- **USER PROGRESSION → PROJECT MANAGEMENT** : Customer/Supplier (progression débloque projets)
- **FINANCIAL DATA → PROJECT MANAGEMENT** : Customer/Supplier (données alimentent projets)

## Bounded Context 1: USER PROGRESSION

### Responsabilités
- Orchestrer le parcours éducatif utilisateur
- Gérer la gamification et les récompenses  
- Contrôler les déblocages conditionnels
- Maintenir la progression globale

### Ubiquitous Language

**Concepts métier** :
- **Quest** : Parcours éducatif thématique (Budget, Habitudes, Projets)
- **Step** : Étape atomique dans une quête (collecte donnée, validation)
- **Progression** : État d'avancement utilisateur global
- **Unlock** : Déblocage conditionnel de nouvelles fonctionnalités
- **Milestone** : Étape importante avec récompense
- **UserJourney** : Parcours personnalisé selon profil

### Agrégats

#### Quest Aggregate (Racine)

```typescript
export class Quest {
  private constructor(
    private readonly id: QuestId,
    private readonly metadata: QuestMetadata,
    private readonly steps: Step[],
    private readonly prerequisites: Prerequisite[],
    private status: QuestStatus
  ) {}

  // Factory methods
  static create(metadata: QuestMetadata, steps: Step[]): Quest
  static fromSnapshot(snapshot: QuestSnapshot): Quest

  // Business methods
  canBeStartedBy(user: UserId, completedQuests: QuestId[]): boolean
  startFor(user: UserId): DomainEvent[]
  completeStep(stepId: StepId, data: StepData): DomainEvent[]
  isCompleted(): boolean

  // Queries
  getNextStep(): Step | null
  getCompletionRate(): number
  getEstimatedDuration(): Duration
}

// Value Objects
export class QuestId extends ValueObject<string> {}
export class StepId extends ValueObject<string> {}

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
```

#### UserProgression Aggregate (Racine)

```typescript
export class UserProgression {
  private constructor(
    private readonly userId: UserId,
    private activeQuest: QuestId | null,
    private completedQuests: Map<QuestId, CompletionData>,
    private unlockedFeatures: Set<FeatureId>,
    private level: ProgressionLevel,
    private experience: ExperiencePoints
  ) {}

  // Business methods
  startQuest(questId: QuestId): DomainEvent[]
  completeQuest(questId: QuestId, results: QuestResults): DomainEvent[]
  abandonQuest(questId: QuestId, reason: string): DomainEvent[]
  unlockFeature(featureId: FeatureId): DomainEvent[]

  // Queries
  getAvailableQuests(allQuests: Quest[]): Quest[]
  getCurrentLevel(): ProgressionLevel
  getNextMilestone(): Milestone | null
  hasCompletedQuest(questId: QuestId): boolean
  canAccessFeature(featureId: FeatureId): boolean

  // Progression calculation
  private calculateLevelFromExperience(): ProgressionLevel
  private getExperienceForQuest(questType: QuestType): number
}

// Value Objects
export class ExperiencePoints extends ValueObject<number> {
  static create(value: number): ExperiencePoints {
    if (value < 0) throw new DomainError('Experience cannot be negative');
    return new ExperiencePoints(value);
  }
}

export enum ProgressionLevel {
  BEGINNER = 'beginner',      // 0-499 XP
  INTERMEDIATE = 'intermediate', // 500-1499 XP  
  ADVANCED = 'advanced',      // 1500-2999 XP
  EXPERT = 'expert'           // 3000+ XP
}
```

### Domain Services

```typescript
export class QuestOrchestrationService {
  constructor(
    private questRepository: QuestRepository,
    private progressionRepository: UserProgressionRepository,
    private eventBus: DomainEventBus
  ) {}

  async startNextRecommendedQuest(userId: UserId): Promise<void> {
    const progression = await this.progressionRepository.getByUserId(userId);
    const availableQuests = await this.getAvailableQuests(progression);
    
    const recommendedQuest = this.selectBestQuestFor(progression, availableQuests);
    if (recommendedQuest) {
      const events = progression.startQuest(recommendedQuest.getId());
      await this.progressionRepository.save(progression);
      this.eventBus.publishAll(events);
    }
  }

  private selectBestQuestFor(progression: UserProgression, quests: Quest[]): Quest | null {
    // Business logic: prioriser selon niveau, objectifs, données manquantes
    return quests
      .filter(q => progression.canAccessQuest(q))
      .sort((a, b) => this.calculatePriority(b, progression) - this.calculatePriority(a, progression))
      [0] || null;
  }
}
```

## Bounded Context 2: FINANCIAL DATA

### Responsabilités
- Centraliser les données financières utilisateur
- Valider la cohérence des informations
- Orchestrer l'extraction IA avec validation humaine
- Maintenir l'historique des modifications

### Agrégats

#### FinancialProfile Aggregate (Racine)

```typescript
export class FinancialProfile {
  private constructor(
    private readonly userId: UserId,
    private incomes: Income[],
    private expenses: Expense[],
    private loans: Loan[],
    private lastUpdated: Date,
    private validationStatus: ValidationStatus
  ) {}

  // Business methods
  addIncome(income: Income): DomainEvent[]
  updateExpense(expenseId: ExpenseId, newData: Partial<ExpenseData>): DomainEvent[]
  removeLoan(loanId: LoanId): DomainEvent[]
  
  // Calculations
  calculateMonthlyBalance(): MoneyAmount {
    const totalIncome = this.getTotalMonthlyIncome();
    const totalExpenses = this.getTotalMonthlyExpenses();
    const totalLoanPayments = this.getTotalMonthlyLoanPayments();
    
    return totalIncome.subtract(totalExpenses).subtract(totalLoanPayments);
  }

  calculateDebtToIncomeRatio(): Percentage {
    const totalIncome = this.getTotalMonthlyIncome();
    const totalDebt = this.getTotalMonthlyLoanPayments();
    return new Percentage(totalDebt.divide(totalIncome).value);
  }

  // Validation
  validateConsistency(): ValidationResult {
    const balance = this.calculateMonthlyBalance();
    const issues: ValidationIssue[] = [];

    if (balance.isNegative() && balance.absoluteValue().isGreaterThan(MoneyAmount.fromEuros(500))) {
      issues.push(new ValidationIssue('SEVERE_NEGATIVE_BALANCE', 'Monthly balance is severely negative'));
    }

    return new ValidationResult(issues);
  }

  // Queries
  getFinancialHealthScore(): HealthScore {
    const balance = this.calculateMonthlyBalance();
    const dti = this.calculateDebtToIncomeRatio();
    
    // Business logic: score calculation
    let score = 50; // Base score
    if (balance.isPositive()) score += 30;
    if (dti.isLessThan(new Percentage(0.30))) score += 20; // DTI < 30%
    
    return new HealthScore(Math.min(100, score));
  }
}

// Value Objects
export class MoneyAmount extends ValueObject<number> {
  constructor(private cents: number) {
    super(cents);
    if (!Number.isInteger(cents)) {
      throw new DomainError('Money amount must be in cents (integer)');
    }
  }

  static fromEuros(euros: number): MoneyAmount {
    return new MoneyAmount(Math.round(euros * 100));
  }

  toEuros(): number {
    return this.cents / 100;
  }

  add(other: MoneyAmount): MoneyAmount {
    return new MoneyAmount(this.cents + other.cents);
  }

  subtract(other: MoneyAmount): MoneyAmount {
    return new MoneyAmount(this.cents - other.cents);
  }

  isNegative(): boolean {
    return this.cents < 0;
  }
}

export class Income {
  constructor(
    private readonly id: IncomeId,
    private source: string,
    private amount: MoneyAmount,
    private frequency: PaymentFrequency
  ) {}

  getMonthlyAmount(): MoneyAmount {
    switch (this.frequency) {
      case PaymentFrequency.MONTHLY: return this.amount;
      case PaymentFrequency.ANNUAL: return new MoneyAmount(Math.round(this.amount.value / 12));
      default: throw new DomainError(`Unsupported frequency: ${this.frequency}`);
    }
  }
}
```

#### PendingFactsProcessor Aggregate

```typescript
export class PendingFactsProcessor {
  private constructor(
    private readonly userId: UserId,
    private pendingFacts: PendingFact[],
    private processingRules: ExtractionRule[]
  ) {}

  // Business methods
  extractFactsFromText(text: string, context: ExtractionContext): PendingFact[] {
    const extractedData = this.aiExtractionService.extract(text, context);
    
    return extractedData.map(data => {
      const confidence = this.calculateConfidence(data);
      const similarExisting = this.findSimilarExisting(data);
      
      return new PendingFact(
        PendingFactId.generate(),
        data.type,
        data.value,
        confidence,
        text,
        similarExisting ? SuggestedAction.UPDATE : SuggestedAction.ADD,
        similarExisting?.id
      );
    });
  }

  validateAndApprove(factId: PendingFactId, userApproval: UserApproval): DomainEvent[] {
    const fact = this.findPendingFact(factId);
    if (!fact) throw new DomainError('Pending fact not found');

    if (userApproval.isApproved()) {
      return [
        new FactApprovedEvent(this.userId, fact.getData(), fact.getSuggestedAction()),
        new PendingFactRemovedEvent(factId)
      ];
    } else {
      return [new PendingFactRejectedEvent(factId, userApproval.getReason())];
    }
  }
}
```

## Bounded Context 3: PROJECT MANAGEMENT

### Responsabilités  
- Gérer les projets financiers complexes (immobilier, consolidation dettes)
- Orchestrer les simulations et comparaisons
- Maintenir les états de fraîcheur des données
- Générer les analyses et recommandations

### Agrégats

#### Project Aggregate (Racine)

```typescript
export class Project {
  private constructor(
    private readonly id: ProjectId,
    private readonly userId: UserId,
    private readonly type: ProjectType,
    private name: string,
    private inputs: ProjectInputs,
    private results: ProjectResults | null,
    private state: ProjectState,
    private lastCalculated: Date | null
  ) {}

  // Business methods
  updateInputs(newInputs: Partial<ProjectInputs>): DomainEvent[] {
    const oldInputs = this.inputs;
    this.inputs = { ...this.inputs, ...newInputs };
    
    const events: DomainEvent[] = [
      new ProjectInputsUpdatedEvent(this.id, oldInputs, this.inputs)
    ];

    // If inputs changed significantly, mark as STALE
    if (this.hasSignificantChanges(oldInputs, this.inputs)) {
      this.state = ProjectState.STALE;
      events.push(new ProjectMarkedStaleEvent(this.id));
    }

    return events;
  }

  calculate(calculator: ProjectCalculator): DomainEvent[] {
    const newResults = calculator.calculate(this.type, this.inputs);
    this.results = newResults;
    this.state = ProjectState.FRESH;
    this.lastCalculated = new Date();

    return [
      new ProjectCalculatedEvent(this.id, newResults),
      new ProjectStateChangedEvent(this.id, ProjectState.STALE, ProjectState.FRESH)
    ];
  }

  // Queries
  needsRecalculation(): boolean {
    return this.state === ProjectState.STALE || 
           this.state === ProjectState.NEEDS_DATA ||
           (this.lastCalculated && this.isCalculationOutdated());
  }

  getRecommendation(): ProjectRecommendation | null {
    if (!this.results) return null;
    return this.type.generateRecommendation(this.results);
  }
}

// Project Types (Strategy Pattern)
export abstract class ProjectType {
  abstract calculate(inputs: ProjectInputs): ProjectResults;
  abstract validate(inputs: ProjectInputs): ValidationResult;
  abstract generateRecommendation(results: ProjectResults): ProjectRecommendation;
}

export class RentVsBuyProjectType extends ProjectType {
  calculate(inputs: RentVsBuyInputs): RentVsBuyResults {
    const monthlyRent = inputs.monthlyRent;
    const purchasePrice = inputs.purchasePrice;
    const downPayment = inputs.downPayment;
    const mortgageRate = inputs.mortgageRate;
    
    // PMT calculation
    const loanAmount = purchasePrice.subtract(downPayment);
    const monthlyPayment = this.calculatePMT(loanAmount, mortgageRate, 25 * 12);
    
    // Break-even analysis
    const monthlyOwnershipCost = monthlyPayment
      .add(inputs.propertyTaxes)
      .add(inputs.insurance)
      .add(inputs.maintenance);
    
    const breakEvenMonths = this.calculateBreakEven(
      monthlyRent, 
      monthlyOwnershipCost, 
      downPayment,
      inputs.opportunityCostRate
    );

    return new RentVsBuyResults({
      monthlyRent,
      monthlyOwnership: monthlyOwnershipCost,
      breakEvenMonths,
      totalCostRent5Years: monthlyRent.multiply(60),
      totalCostBuy5Years: this.calculateTotalOwnershipCost(5, inputs),
      recommendation: breakEvenMonths.isLessThan(36) ? 'BUY' : 'RENT'
    });
  }

  generateRecommendation(results: RentVsBuyResults): ProjectRecommendation {
    if (results.recommendation === 'BUY') {
      return new ProjectRecommendation(
        'BUY',
        `L'achat est avantageux avec un seuil de rentabilité de ${results.breakEvenMonths} mois`,
        [
          `Économies sur 5 ans: ${results.totalCostRent5Years.subtract(results.totalCostBuy5Years).toEuros()}€`,
          'Vous construisez un patrimoine immobilier',
          'Protection contre l\'inflation des loyers'
        ]
      );
    } else {
      return new ProjectRecommendation(
        'RENT',
        `La location reste plus avantageuse sur ${results.breakEvenMonths} mois`,
        [
          'Plus de flexibilité géographique',
          'Pas de frais d\'entretien ni de taxes foncières',
          'Capital disponible pour autres investissements'
        ]
      );
    }
  }
}
```

## Domain Events

### Event Definitions

```typescript
// User Progression Events
export class QuestStartedEvent extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly questId: QuestId,
    public readonly startedAt: Date = new Date()
  ) { super(); }
}

export class StepCompletedEvent extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly questId: QuestId,
    public readonly stepId: StepId,
    public readonly data: StepData,
    public readonly completedAt: Date = new Date()
  ) { super(); }
}

export class QuestCompletedEvent extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly questId: QuestId,
    public readonly results: QuestResults,
    public readonly experienceGained: number,
    public readonly completedAt: Date = new Date()
  ) { super(); }
}

// Financial Data Events  
export class FinancialDataValidatedEvent extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly dataType: string,
    public readonly oldValue: any,
    public readonly newValue: any,
    public readonly validatedAt: Date = new Date()
  ) { super(); }
}

// Project Events
export class ProjectCreatedEvent extends DomainEvent {
  constructor(
    public readonly projectId: ProjectId,
    public readonly userId: UserId,
    public readonly type: ProjectType,
    public readonly createdAt: Date = new Date()
  ) { super(); }
}

export class ProjectCalculatedEvent extends DomainEvent {
  constructor(
    public readonly projectId: ProjectId,
    public readonly results: ProjectResults,
    public readonly calculatedAt: Date = new Date()
  ) { super(); }
}
```

### Event Handlers (Cross-Context Integration)

```typescript
// When quest completed → unlock project features
export class QuestCompletedHandler {
  constructor(
    private userProgressionRepo: UserProgressionRepository,
    private questRepo: QuestRepository
  ) {}

  async handle(event: QuestCompletedEvent): Promise<void> {
    const progression = await this.userProgressionRepo.getByUserId(event.userId);
    const quest = await this.questRepo.getById(event.questId);

    // Business rule: Budget quest unlocks project creation
    if (quest.getType() === QuestType.BUDGET_SETUP) {
      const events = progression.unlockFeature(FeatureId.PROJECT_CREATION);
      await this.userProgressionRepo.save(progression);
    }

    // Business rule: All basic quests unlock advanced features  
    const completedBasicQuests = [
      QuestType.BUDGET_SETUP,
      QuestType.FINANCIAL_HABITS
    ];

    if (completedBasicQuests.every(type => progression.hasCompletedQuestOfType(type))) {
      const events = progression.unlockFeature(FeatureId.ADVANCED_ANALYSIS);
      await this.userProgressionRepo.save(progression);
    }
  }
}
```

## Repository Interfaces (Ports)

```typescript
// User Progression Bounded Context
export interface QuestRepository {
  getById(id: QuestId): Promise<Quest>;
  getByType(type: QuestType): Promise<Quest[]>;
  getAvailableFor(userId: UserId): Promise<Quest[]>;
  save(quest: Quest): Promise<void>;
}

export interface UserProgressionRepository {
  getByUserId(userId: UserId): Promise<UserProgression>;
  save(progression: UserProgression): Promise<void>;
}

// Financial Data Bounded Context  
export interface FinancialProfileRepository {
  getByUserId(userId: UserId): Promise<FinancialProfile>;
  save(profile: FinancialProfile): Promise<void>;
}

export interface PendingFactsRepository {
  getByUserId(userId: UserId): Promise<PendingFactsProcessor>;
  save(processor: PendingFactsProcessor): Promise<void>;
}

// Project Management Bounded Context
export interface ProjectRepository {
  getById(id: ProjectId): Promise<Project>;
  getByUserId(userId: UserId): Promise<Project[]>;
  getByType(type: ProjectType, userId: UserId): Promise<Project[]>;
  save(project: Project): Promise<void>;
}
```

## Domain Services

```typescript
export class ProjectRecommendationService {
  constructor(
    private projectRepo: ProjectRepository,
    private financialProfileRepo: FinancialProfileRepository
  ) {}

  async generateRecommendationFor(userId: UserId): Promise<ProjectRecommendation[]> {
    const profile = await this.financialProfileRepo.getByUserId(userId);
    const projects = await this.projectRepo.getByUserId(userId);

    const recommendations: ProjectRecommendation[] = [];

    // Business logic: recommend project types based on financial profile
    if (profile.hasPositiveBalance() && !projects.some(p => p.getType() === 'rent_vs_buy')) {
      recommendations.push(
        new ProjectRecommendation(
          'CREATE_RENT_VS_BUY',
          'Analysez votre capacité d\'achat immobilier',
          ['Votre solde mensuel positif permet d\'envisager un achat']
        )
      );
    }

    if (profile.hasMultipleDebts() && !projects.some(p => p.getType() === 'debt_consolidation')) {
      recommendations.push(
        new ProjectRecommendation(
          'CREATE_DEBT_CONSOLIDATION', 
          'Optimisez vos remboursements de dettes',
          ['Consolidation pourrait réduire vos mensualités']
        )
      );
    }

    return recommendations;
  }
}
```

Cette modélisation DDD fournit une base solide pour l'implémentation TDD, avec des bounded contexts clairement séparés, des agrégats avec logique métier encapsulée, et un système d'événements pour l'intégration entre contextes.