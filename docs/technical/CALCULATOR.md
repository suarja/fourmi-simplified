# Calculator Engine Specification
## Fourmi Financial Copilot

### Core Financial Formulas

#### Loan Payment Calculation (PMT)

```typescript
/**
 * Calculate monthly payment for a fixed-rate loan
 * Formula: PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
export function calculateMonthlyPayment(
  principal: number,    // Loan amount in cents
  annualRate: number,   // Annual interest rate (e.g., 0.035 for 3.5%)
  termYears: number     // Loan term in years
): number {
  if (annualRate === 0) {
    return Math.round(principal / (termYears * 12));
  }
  
  const monthlyRate = annualRate / 12;
  const totalPayments = termYears * 12;
  const factor = Math.pow(1 + monthlyRate, totalPayments);
  
  return Math.round(
    principal * (monthlyRate * factor) / (factor - 1)
  );
}
```

#### Property Acquisition Costs

```typescript
export function calculateAcquisitionCosts(
  propertyPrice: number,
  feesConfig: AcquisitionFees,
  country: string = "FR"
): number {
  if (typeof feesConfig === "number") {
    return feesConfig; // Fixed amount
  }
  
  // Percentage-based calculation
  let fees = Math.round(propertyPrice * feesConfig.percentage);
  
  if (feesConfig.minimum && fees < feesConfig.minimum) {
    fees = feesConfig.minimum;
  }
  
  if (feesConfig.maximum && fees > feesConfig.maximum) {
    fees = feesConfig.maximum;
  }
  
  return fees;
}

// Default acquisition fees by country
export const DEFAULT_ACQUISITION_FEES = {
  FR: { percentage: 0.08, minimum: 500000 }, // ~8% in France
  DOP: { percentage: 0.05, minimum: 100000 }, // ~5% in Dominican Republic
} as const;
```

#### Monthly Cashflow Calculation

```typescript
export interface CashflowInputs {
  // Property costs
  monthlyPayment: number;
  monthlyCharges: number;
  monthlyInsurance: number;
  
  // Income (for rental properties)
  monthlyRent?: number;
  
  // Maintenance and management
  maintenanceRate: number;    // Annual % of property value
  managementRate?: number;    // Annual % of rental income
  propertyValue: number;
}

export function calculateMonthlyCashflow(inputs: CashflowInputs): number {
  const {
    monthlyPayment,
    monthlyCharges,
    monthlyInsurance,
    monthlyRent = 0,
    maintenanceRate,
    managementRate = 0,
    propertyValue
  } = inputs;
  
  // Monthly maintenance cost
  const monthlyMaintenance = Math.round(
    (propertyValue * maintenanceRate) / 12
  );
  
  // Monthly management cost (percentage of rent)
  const monthlyManagement = Math.round(
    monthlyRent * managementRate
  );
  
  // Total monthly expenses
  const totalExpenses = 
    monthlyPayment + 
    monthlyCharges + 
    monthlyInsurance + 
    monthlyMaintenance + 
    monthlyManagement;
  
  // Net cashflow (can be negative)
  return monthlyRent - totalExpenses;
}
```

### Assumption Tiers (Low/Median/High)

```typescript
export interface AssumptionSet {
  // Property appreciation
  propertyAppreciationRate: number;   // Annual %
  
  // Rental market
  rentGrowthRate: number;            // Annual %
  vacancyRate: number;               // % of time vacant
  
  // Costs
  maintenanceRate: number;           // Annual % of property value
  insuranceGrowthRate: number;       // Annual % increase
  propertyTaxGrowthRate: number;     // Annual % increase
  
  // Interest rates
  interestRateMargin: number;        // Additional % on base rate
}

export const ASSUMPTION_TIERS: Record<string, AssumptionSet> = {
  basse: {
    propertyAppreciationRate: 0.01,   // 1% per year
    rentGrowthRate: 0.01,             // 1% per year
    vacancyRate: 0.08,                // 8% vacancy
    maintenanceRate: 0.015,           // 1.5% of value
    insuranceGrowthRate: 0.03,        // 3% per year
    propertyTaxGrowthRate: 0.02,      // 2% per year
    interestRateMargin: 0.005,        // +0.5%
  },
  mediane: {
    propertyAppreciationRate: 0.025,  // 2.5% per year
    rentGrowthRate: 0.02,             // 2% per year
    vacancyRate: 0.05,                // 5% vacancy
    maintenanceRate: 0.01,            // 1% of value
    insuranceGrowthRate: 0.025,       // 2.5% per year
    propertyTaxGrowthRate: 0.015,     // 1.5% per year
    interestRateMargin: 0,            // No margin
  },
  haute: {
    propertyAppreciationRate: 0.04,   // 4% per year
    rentGrowthRate: 0.03,             // 3% per year
    vacancyRate: 0.02,                // 2% vacancy
    maintenanceRate: 0.008,           // 0.8% of value
    insuranceGrowthRate: 0.02,        // 2% per year
    propertyTaxGrowthRate: 0.01,      // 1% per year
    interestRateMargin: -0.005,       // -0.5% (better rate)
  },
} as const;
```

### Year-by-Year Projections

```typescript
export interface YearlyProjection {
  year: number;
  loanBalance: number;
  cumulativeCashflow: number;
  propertyValue: number;
  netPosition: number;
  monthlyRent: number;
  monthlyExpenses: number;
}

export function generateProjections(
  initialInputs: ProjectionInputs,
  assumptions: AssumptionSet,
  horizonYears: number = 20
): YearlyProjection[] {
  const projections: YearlyProjection[] = [];
  let currentLoanBalance = initialInputs.loanAmount;
  let cumulativeCashflow = 0;
  let currentPropertyValue = initialInputs.propertyValue;
  let currentRent = initialInputs.monthlyRent || 0;
  
  for (let year = 1; year <= horizonYears; year++) {
    // Update property value
    currentPropertyValue *= (1 + assumptions.propertyAppreciationRate);
    
    // Update rental income
    if (currentRent > 0) {
      currentRent *= (1 + assumptions.rentGrowthRate);
      // Apply vacancy rate
      const effectiveRent = currentRent * (1 - assumptions.vacancyRate);
    }
    
    // Calculate annual cashflow
    const monthlyCashflow = calculateMonthlyCashflow({
      monthlyPayment: initialInputs.monthlyPayment,
      monthlyCharges: initialInputs.monthlyCharges,
      monthlyInsurance: initialInputs.monthlyInsurance,
      monthlyRent: currentRent * (1 - assumptions.vacancyRate),
      maintenanceRate: assumptions.maintenanceRate,
      propertyValue: currentPropertyValue,
    });
    
    const annualCashflow = monthlyCashflow * 12;
    cumulativeCashflow += annualCashflow;
    
    // Update loan balance (amortization)
    currentLoanBalance = calculateRemainingBalance(
      initialInputs.loanAmount,
      initialInputs.annualRate,
      initialInputs.termYears,
      year
    );
    
    // Net position = Property value - Loan balance + Cumulative cashflow
    const netPosition = currentPropertyValue - currentLoanBalance + cumulativeCashflow;
    
    projections.push({
      year,
      loanBalance: Math.round(currentLoanBalance),
      cumulativeCashflow: Math.round(cumulativeCashflow),
      propertyValue: Math.round(currentPropertyValue),
      netPosition: Math.round(netPosition),
      monthlyRent: Math.round(currentRent),
      monthlyExpenses: Math.round(-monthlyCashflow + currentRent),
    });
  }
  
  return projections;
}
```

### Break-Even Analysis

```typescript
export function calculateBreakEvenPoint(
  projections: YearlyProjection[],
  initialInvestment: number
): number | null {
  for (const projection of projections) {
    const totalReturn = projection.netPosition;
    
    if (totalReturn >= initialInvestment) {
      return projection.year;
    }
  }
  
  return null; // Never breaks even within horizon
}
```

### KPI Calculations

```typescript
export function calculateKPIs(
  projections: YearlyProjection[],
  totalIncome: number,
  initialInvestment: number,
  horizonYears: number
): KPIResults {
  const lastProjection = projections[projections.length - 1];
  
  // Monthly cashflow (average over first 3 years)
  const avgMonthlyCashflow = projections
    .slice(0, 3)
    .reduce((sum, p) => sum + (p.cumulativeCashflow / p.year / 12), 0) / 3;
  
  // Savings effort (monthly payment + down payment amortized)
  const monthlyPayment = projections[0]?.monthlyExpenses || 0;
  const monthlyDownPayment = initialInvestment / (horizonYears * 12);
  const totalMonthlySavingsEffort = monthlyPayment + monthlyDownPayment;
  const savingsEffort = totalMonthlySavingsEffort / (totalIncome / 12);
  
  // Total cost over horizon
  const totalCashflowHorizon = lastProjection.cumulativeCashflow;
  const totalCostHorizon = Math.max(0, -totalCashflowHorizon);
  
  // Break-even point
  const breakEvenYear = calculateBreakEvenPoint(projections, initialInvestment);
  
  return {
    monthlyCashflow: Math.round(avgMonthlyCashflow),
    savingsEffort: Math.round(savingsEffort * 10000) / 10000, // 4 decimal precision
    totalCostOverHorizon: Math.round(totalCostHorizon),
    breakEvenYear,
  };
}
```

### Rent vs Buy Comparison

```typescript
export interface RentScenario {
  monthlyRent: number;
  rentersInsurance: number;
  rentGrowthRate: number;
  utilityDifference: number; // Rent utilities vs own
}

export function compareRentVsBuy(
  buyScenario: ProjectionInputs,
  rentScenario: RentScenario,
  assumptions: AssumptionSet,
  horizonYears: number = 10
): ComparisonResult {
  const buyProjections = generateProjections(buyScenario, assumptions, horizonYears);
  
  // Calculate rent projections
  let currentRent = rentScenario.monthlyRent;
  let cumulativeRentCosts = 0;
  
  for (let year = 1; year <= horizonYears; year++) {
    const annualRent = currentRent * 12;
    const annualInsurance = rentScenario.rentersInsurance * 12;
    const annualUtilities = rentScenario.utilityDifference * 12;
    
    cumulativeRentCosts += annualRent + annualInsurance + annualUtilities;
    
    // Increase rent
    currentRent *= (1 + rentScenario.rentGrowthRate);
  }
  
  const finalBuyPosition = buyProjections[buyProjections.length - 1];
  const buyNetPosition = finalBuyPosition.netPosition;
  const rentNetPosition = -cumulativeRentCosts; // Pure expense
  
  return {
    buyAdvantage: buyNetPosition - rentNetPosition,
    breakEvenYear: buyProjections.findIndex(p => p.netPosition > -cumulativeRentCosts) + 1,
    buyNetPosition,
    rentNetPosition,
    buyProjections,
  };
}
```

### Input Hash Generation

```typescript
/**
 * Generate deterministic hash for simulation inputs
 * Used to detect when simulations become stale
 */
export function generateInputHash(
  profiles: Profile[],
  project: Project,
  assumptionTier: string,
  overrides: Record<string, any> = {}
): string {
  const input = {
    profiles: profiles.map(p => ({
      id: p.id,
      persons: p.persons,
      loans: p.loans,
      savings: p.savings,
      updatedAt: p.updatedAt.toISOString(),
    })),
    project: {
      ...project,
      updatedAt: project.updatedAt.toISOString(),
    },
    assumptionTier,
    overrides,
  };
  
  return createHash('sha256')
    .update(JSON.stringify(input))
    .digest('hex');
}
```

### Error Handling & Validation

```typescript
export class CalculationError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message);
    this.name = 'CalculationError';
  }
}

export const CalculationErrorCodes = {
  INVALID_LOAN_TERMS: 'INVALID_LOAN_TERMS',
  NEGATIVE_PROPERTY_VALUE: 'NEGATIVE_PROPERTY_VALUE',
  EXCESSIVE_DOWN_PAYMENT: 'EXCESSIVE_DOWN_PAYMENT',
  UNREALISTIC_RATES: 'UNREALISTIC_RATES',
} as const;

export function validateCalculationInputs(
  project: Project,
  profiles: Profile[]
): void {
  // Validate loan terms
  if (project.rate <= 0 || project.rate > 0.2) {
    throw new CalculationError(
      'Interest rate must be between 0% and 20%',
      CalculationErrorCodes.UNREALISTIC_RATES
    );
  }
  
  // Validate down payment
  if (project.downPayment > project.price) {
    throw new CalculationError(
      'Down payment cannot exceed property price',
      CalculationErrorCodes.EXCESSIVE_DOWN_PAYMENT
    );
  }
  
  // Validate property value
  if (project.price <= 0) {
    throw new CalculationError(
      'Property price must be positive',
      CalculationErrorCodes.NEGATIVE_PROPERTY_VALUE
    );
  }
  
  // Additional validations...
}
```