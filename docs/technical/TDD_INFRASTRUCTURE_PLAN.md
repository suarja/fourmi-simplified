# TDD Infrastructure Plan - Fourmi Mobile App
## Test-Driven Development Setup & Strategy

### Overview

**Objectif** : Établir une infrastructure de tests robuste suivant les principes TDD pour l'implémentation du système de quêtes éducatives avec architecture DDD.

**Approche** : Test Pyramid avec 3 niveaux de tests, Red-Green-Refactor cycles, et intégration continue.

## Test Pyramid Strategy

### Niveau 1: Unit Tests (70% des tests)

**Responsabilité** : Tester la logique métier en isolation
**Framework** : Vitest + TypeScript
**Scope** : Domain Layer (Aggregates, Value Objects, Domain Services)

#### Structure des Tests Unitaires

```ascii
tests/
├── unit/
│   ├── domain/
│   │   ├── user-progression/
│   │   │   ├── quest.aggregate.test.ts
│   │   │   ├── user-progression.aggregate.test.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── quest-id.test.ts
│   │   │   │   ├── experience-points.test.ts
│   │   │   │   └── progression-level.test.ts
│   │   │   └── services/
│   │   │       └── quest-orchestration.service.test.ts
│   │   ├── financial-data/
│   │   │   ├── financial-profile.aggregate.test.ts
│   │   │   ├── pending-facts-processor.aggregate.test.ts
│   │   │   └── value-objects/
│   │   │       ├── money-amount.test.ts
│   │   │       └── validation-result.test.ts
│   │   └── project-management/
│   │       ├── project.aggregate.test.ts
│   │       ├── project-types/
│   │       │   ├── rent-vs-buy.test.ts
│   │       │   └── debt-consolidation.test.ts
│   │       └── calculators/
│   │           └── financial-calculator.test.ts
│   └── application/
│       ├── commands/
│       │   ├── start-quest.command.test.ts
│       │   └── complete-step.command.test.ts
│       ├── queries/
│       │   ├── get-user-progression.query.test.ts
│       │   └── get-available-quests.query.test.ts
│       └── event-handlers/
│           └── quest-completed.handler.test.ts
```

#### Configuration Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup/unit.setup.ts'],
    include: ['tests/unit/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      },
      exclude: [
        'tests/**',
        'convex/_generated/**',
        'src/**/*.d.ts'
      ]
    }
  }
})
```

#### Test Utilities pour Domain

```typescript
// tests/utils/domain-test.utils.ts
export class QuestTestBuilder {
  private questData: Partial<QuestData> = {};

  static create(): QuestTestBuilder {
    return new QuestTestBuilder();
  }

  withId(id: string): QuestTestBuilder {
    this.questData.id = new QuestId(id);
    return this;
  }

  withType(type: QuestType): QuestTestBuilder {
    this.questData.type = type;
    return this;
  }

  withPrerequisites(...prerequisites: QuestId[]): QuestTestBuilder {
    this.questData.prerequisites = prerequisites;
    return this;
  }

  build(): Quest {
    const defaultData = {
      id: new QuestId('test-quest'),
      metadata: QuestMetadata.create('Test Quest', 'Test Description'),
      steps: [],
      prerequisites: [],
      status: QuestStatus.PUBLISHED
    };

    return Quest.create({ ...defaultData, ...this.questData });
  }
}

// Usage in tests
const quest = QuestTestBuilder
  .create()
  .withType(QuestType.BUDGET_SETUP)
  .withPrerequisites(new QuestId('onboarding'))
  .build();
```

### Niveau 2: Integration Tests (20% des tests)

**Responsabilité** : Tester l'interaction entre couches
**Scope** : Application Services ↔ Infrastructure (Convex)

#### Structure Tests d'Intégration

```ascii
tests/
├── integration/
│   ├── convex/
│   │   ├── quest.repository.test.ts
│   │   ├── user-progression.repository.test.ts
│   │   └── financial-profile.repository.test.ts
│   ├── application/
│   │   ├── quest-orchestration.integration.test.ts
│   │   ├── financial-data-validation.integration.test.ts
│   │   └── project-calculation.integration.test.ts
│   └── ai-agents/
│       ├── fact-extraction.integration.test.ts
│       └── financial-analysis.integration.test.ts
```

#### Mock Strategy pour Convex

```typescript
// tests/mocks/convex.mock.ts
export class MockConvexDatabase {
  private tables: Map<string, Map<string, any>> = new Map();

  constructor() {
    // Initialize tables
    ['profiles', 'quests', 'user_progression', 'projects'].forEach(table => {
      this.tables.set(table, new Map());
    });
  }

  insert(table: string, data: any): string {
    const id = `${table}_${Date.now()}_${Math.random()}`;
    this.tables.get(table)!.set(id, { ...data, _id: id });
    return id;
  }

  query(table: string) {
    const tableData = this.tables.get(table)!;
    return {
      withIndex: (index: string, filterFn: (q: any) => any) => ({
        first: () => Array.from(tableData.values())[0] || null,
        collect: () => Array.from(tableData.values())
      }),
      collect: () => Array.from(tableData.values())
    };
  }

  patch(id: string, table: string, updates: any): void {
    const tableData = this.tables.get(table)!;
    const existing = tableData.get(id);
    if (existing) {
      tableData.set(id, { ...existing, ...updates });
    }
  }

  delete(id: string, table: string): void {
    this.tables.get(table)!.delete(id);
  }
}

// Mock Convex Context
export const createMockConvexContext = (): ConvexContext => ({
  db: new MockConvexDatabase() as any,
  auth: { getUserId: async () => 'test-user-123' },
  storage: {
    store: vi.fn(),
    get: vi.fn(),
    delete: vi.fn()
  }
});
```

#### Test d'Intégration Example

```typescript
// tests/integration/convex/quest.repository.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { QuestConvexRepository } from '../../../src/infrastructure/convex/quest.repository';
import { createMockConvexContext } from '../../mocks/convex.mock';

describe('QuestConvexRepository', () => {
  let repository: QuestConvexRepository;
  let mockCtx: ConvexContext;

  beforeEach(() => {
    mockCtx = createMockConvexContext();
    repository = new QuestConvexRepository(mockCtx);
  });

  describe('save and getById', () => {
    it('should persist and retrieve a quest correctly', async () => {
      // Arrange
      const quest = QuestTestBuilder
        .create()
        .withType(QuestType.BUDGET_SETUP)
        .build();

      // Act
      await repository.save(quest);
      const retrieved = await repository.getById(quest.getId());

      // Assert
      expect(retrieved).toBeDefined();
      expect(retrieved.getId().value).toBe(quest.getId().value);
      expect(retrieved.getType()).toBe(QuestType.BUDGET_SETUP);
    });
  });

  describe('getAvailableFor', () => {
    it('should return quests that meet user prerequisites', async () => {
      // Test prerequisite logic
      const basicQuest = QuestTestBuilder.create()
        .withType(QuestType.BUDGET_SETUP)
        .build();

      const advancedQuest = QuestTestBuilder.create()
        .withType(QuestType.PROJECT_CREATION)
        .withPrerequisites(basicQuest.getId())
        .build();

      await repository.save(basicQuest);
      await repository.save(advancedQuest);

      // User hasn't completed any quests
      const available = await repository.getAvailableFor(new UserId('test-user'));
      
      expect(available).toHaveLength(1);
      expect(available[0].getType()).toBe(QuestType.BUDGET_SETUP);
    });
  });
});
```

### Niveau 3: End-to-End Tests (10% des tests)

**Responsabilité** : Tester les parcours utilisateur complets
**Framework** : Playwright + React Testing Library
**Scope** : Interface mobile complète

#### E2E Test Structure

```ascii
tests/
├── e2e/
│   ├── user-journeys/
│   │   ├── new-user-onboarding.e2e.test.ts
│   │   ├── budget-quest-completion.e2e.test.ts
│   │   ├── project-creation-flow.e2e.test.ts
│   │   └── financial-data-validation.e2e.test.ts
│   ├── mobile/
│   │   ├── navigation.mobile.e2e.test.ts
│   │   ├── chat-interface.mobile.e2e.test.ts
│   │   └── responsive-behavior.e2e.test.ts
│   └── fixtures/
│       ├── user-data.fixtures.ts
│       └── quest-scenarios.fixtures.ts
```

#### E2E Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### E2E Test Example

```typescript
// tests/e2e/user-journeys/budget-quest-completion.e2e.test.ts
import { test, expect } from '@playwright/test';

test.describe('Budget Quest Completion Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Setup test user
    await page.goto('/');
    await page.getByTestId('sign-in-test-user').click();
  });

  test('complete budget quest through form input', async ({ page }) => {
    // Navigate to quest
    await page.getByTestId('start-budget-quest').click();
    
    // Fill form step by step
    await expect(page.getByText('Construisons votre budget mensuel')).toBeVisible();
    
    // Step 1: Income
    await page.getByLabel('Salaire principal').fill('2800');
    await page.getByTestId('next-step').click();
    
    // Step 2: Expenses  
    await page.getByLabel('Loyer').fill('950');
    await page.getByLabel('Alimentation').fill('400');
    await page.getByTestId('next-step').click();
    
    // Step 3: Review and confirm
    await expect(page.getByText('Solde mensuel: +1,450€')).toBeVisible();
    await page.getByTestId('complete-quest').click();
    
    // Assert quest completion
    await expect(page.getByText('✅ Budget mensuel terminé!')).toBeVisible();
    await expect(page.getByTestId('quest-reward-badge')).toBeVisible();
    
    // Verify next quest unlocked
    await page.getByTestId('tab-quests').click();
    await expect(page.getByText('Habitudes financières')).toBeVisible();
    await expect(page.getByTestId('quest-unlocked-habitudes')).toBeVisible();
  });

  test('complete budget quest through voice input', async ({ page, context }) => {
    // Grant microphone permissions
    await context.grantPermissions(['microphone']);
    
    await page.getByTestId('start-budget-quest').click();
    await page.getByTestId('voice-input-mode').click();
    
    // Mock voice input (since we can't actually speak in tests)
    await page.evaluate(() => {
      // Mock SpeechRecognition API
      window.mockVoiceInput = (text: string) => {
        const event = new CustomEvent('voiceRecognized', { detail: { text } });
        document.dispatchEvent(event);
      };
    });
    
    // Simulate voice inputs
    await page.evaluate(() => window.mockVoiceInput('Mon salaire est de 2800 euros par mois'));
    await expect(page.getByText('J\'ai enregistré : Salaire 2800€')).toBeVisible();
    
    await page.getByTestId('confirm-voice-input').click();
    await page.evaluate(() => window.mockVoiceInput('Pour le logement je paie 950 euros de loyer'));
    
    // Continue flow and assert completion
    await page.getByTestId('complete-quest').click();
    await expect(page.getByText('✅ Budget mensuel terminé!')).toBeVisible();
  });
});
```

## Test Data Management

### Fixtures et Test Data

```typescript
// tests/fixtures/quest-scenarios.fixtures.ts
export const QuestScenarios = {
  BUDGET_QUEST_BASIC: {
    quest: QuestTestBuilder.create()
      .withType(QuestType.BUDGET_SETUP)
      .withSteps([
        Step.create('income', 'Vos revenus mensuels'),
        Step.create('expenses', 'Vos dépenses principales'),
        Step.create('review', 'Validation de votre budget')
      ])
      .build(),
    
    userInputs: {
      income: { salary: 2800, other: 0 },
      expenses: { rent: 950, food: 400, transport: 200 }
    },
    
    expectedResults: {
      monthlyBalance: 1250,
      questCompleted: true,
      experienceGained: 100,
      unlockedFeatures: [FeatureId.FINANCIAL_HABITS_QUEST]
    }
  },

  COMPLEX_FINANCIAL_PROFILE: {
    profile: FinancialProfileTestBuilder.create()
      .withIncomes([
        Income.create('Salaire', MoneyAmount.fromEuros(3200), PaymentFrequency.MONTHLY),
        Income.create('Freelance', MoneyAmount.fromEuros(800), PaymentFrequency.MONTHLY)
      ])
      .withExpenses([
        Expense.create('Loyer', MoneyAmount.fromEuros(1200), 'Housing'),
        Expense.create('Transport', MoneyAmount.fromEuros(350), 'Transport')
      ])
      .withLoans([
        Loan.create('Crédit auto', MoneyAmount.fromEuros(280), 18)
      ])
      .build()
  }
};
```

### Database Setup/Teardown

```typescript
// tests/setup/integration.setup.ts
import { beforeEach, afterEach } from 'vitest';

let testDatabase: TestDatabaseManager;

beforeEach(async () => {
  testDatabase = new TestDatabaseManager();
  await testDatabase.initialize();
  await testDatabase.seedBasicData();
});

afterEach(async () => {
  await testDatabase.cleanup();
});

export { testDatabase };

// Database Manager for Integration Tests
export class TestDatabaseManager {
  async initialize(): Promise<void> {
    // Setup clean test database state
    await this.clearAllTables();
    await this.createTestUser();
  }

  async seedBasicData(): Promise<void> {
    // Create basic quests
    await this.createQuest(QuestScenarios.BUDGET_QUEST_BASIC.quest);
    
    // Create test profiles
    await this.createProfile('test-user-123');
  }

  async cleanup(): Promise<void> {
    // Clean up test data
    await this.clearAllTables();
  }
}
```

## Continuous Integration

### GitHub Actions Pipeline

```yaml
# .github/workflows/tests.yml
name: Tests
on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:unit
      - uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    services:
      convex:
        image: convex/convex-dev:latest
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY }}
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests]
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## Test Scripts Configuration

### Package.json Scripts

```json
{
  "scripts": {
    "test": "npm-run-all test:unit test:integration",
    "test:unit": "vitest run tests/unit",
    "test:integration": "vitest run tests/integration",
    "test:e2e": "playwright test",
    "test:watch": "vitest watch tests/unit",
    "test:coverage": "vitest run tests/unit --coverage",
    "test:ci": "npm-run-all test test:e2e"
  }
}
```

## Quality Gates

### Definition of Done - Tests

**Chaque feature doit passer ces critères** :

1. **Unit Tests** : ≥80% coverage sur domain layer
2. **Integration Tests** : Tous les repository adapters testés
3. **E2E Tests** : Au moins 1 happy path testé
4. **Performance** : Tests s'exécutent en <30s (unit), <2min (integration)
5. **Reliability** : 0% flaky tests sur CI

### Test Metrics Dashboard

**Métriques à tracker** :
- Code Coverage par bounded context
- Test execution time trends
- Flaky test detection
- Feature test completeness
- CI pipeline success rate

Cette infrastructure TDD garantit la qualité du code dès le développement et facilite les refactorings futurs avec confiance.