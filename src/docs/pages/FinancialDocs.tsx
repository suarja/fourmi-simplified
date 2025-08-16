export function FinancialDocs() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Financial Guide</h1>
        <p className="text-xl text-white/70 mb-6">
          Understanding financial terms, calculations, and how Fourmi processes your money data
        </p>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">💰 Financial Terms</h2>
        <p className="text-white/70 mb-4">
          Key financial concepts used throughout Fourmi.
        </p>

        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">HELOC (Home Equity Line of Credit)</h3>
            <p className="text-white/70 mb-2">
              A revolving credit line secured by your home's equity. Functions like a credit card but with lower interest rates.
            </p>
            <div className="text-sm text-white/50">
              <strong>Typical Rate:</strong> Prime rate + 0.5-2.0% margin<br/>
              <strong>Credit Limit:</strong> Up to 80-90% of home value minus existing mortgage<br/>
              <strong>Usage:</strong> Debt consolidation, home improvements, emergency funds
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">DTI (Debt-to-Income Ratio)</h3>
            <p className="text-white/70 mb-2">
              The percentage of your monthly income that goes toward debt payments. A key metric lenders use.
            </p>
            <div className="text-sm text-white/50">
              <strong>Formula:</strong> (Total Monthly Debt Payments / Gross Monthly Income) × 100<br/>
              <strong>Good DTI:</strong> Below 36% (including housing)<br/>
              <strong>Housing DTI:</strong> Below 28% for housing costs only
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">Personal Loan</h3>
            <p className="text-white/70 mb-2">
              Unsecured installment loan with fixed monthly payments. Common for debt consolidation.
            </p>
            <div className="text-sm text-white/50">
              <strong>Typical Rate:</strong> 6-36% APR (depends on credit score)<br/>
              <strong>Terms:</strong> 2-7 years<br/>
              <strong>Amount:</strong> $1,000-$100,000
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">Balance Transfer</h3>
            <p className="text-white/70 mb-2">
              Moving high-interest debt to a credit card with lower promotional rates.
            </p>
            <div className="text-sm text-white/50">
              <strong>Promotional Rate:</strong> Often 0% APR for 12-21 months<br/>
              <strong>Transfer Fee:</strong> Typically 3-5% of transferred amount<br/>
              <strong>After Promo:</strong> Rate jumps to standard APR (15-25%)
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">📊 Hardcoded Values</h2>
        <p className="text-white/70 mb-4">
          Standard rates and assumptions used in Fourmi's calculations.
        </p>

        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">Credit Card Default Rate: 18%</h3>
            <p className="text-white/70 mb-2">
              When users don't specify their credit card interest rate, we assume 18% APR.
            </p>
            <div className="text-sm text-white/50">
              <strong>Reasoning:</strong> Average US credit card APR as of 2024<br/>
              <strong>Usage:</strong> Payoff calculations, consolidation comparisons
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">Personal Loan Rate: 12%</h3>
            <p className="text-white/70 mb-2">
              Default rate for personal loan calculations when not specified by user.
            </p>
            <div className="text-sm text-white/50">
              <strong>Reasoning:</strong> Average rate for borrowers with good credit (650+ score)<br/>
              <strong>Usage:</strong> Debt consolidation scenarios
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">HELOC Rate: 8%</h3>
            <p className="text-white/70 mb-2">
              Default rate for Home Equity Line of Credit calculations.
            </p>
            <div className="text-sm text-white/50">
              <strong>Reasoning:</strong> Typical rate for prime + 1-2% margin<br/>
              <strong>Usage:</strong> High-amount debt consolidation scenarios
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">Maximum DTI: 36%</h3>
            <p className="text-white/70 mb-2">
              Maximum debt-to-income ratio for loan eligibility calculations.
            </p>
            <div className="text-sm text-white/50">
              <strong>Reasoning:</strong> Conservative lending standard<br/>
              <strong>Usage:</strong> Determining consolidation loan eligibility
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">🧮 Financial Formulas</h2>
        <p className="text-white/70 mb-4">
          Mathematical formulas used in Fourmi's calculations.
        </p>

        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">PMT (Monthly Payment)</h3>
            <p className="text-white/70 mb-2">
              Calculates fixed monthly payment for loans.
            </p>
            <div className="bg-black/40 rounded p-3 font-mono text-sm text-white/90 mb-2">
              PMT = P × [r(1+r)^n] / [(1+r)^n - 1]
            </div>
            <div className="text-sm text-white/50">
              <strong>P:</strong> Principal (loan amount)<br/>
              <strong>r:</strong> Monthly interest rate (annual rate ÷ 12)<br/>
              <strong>n:</strong> Number of months<br/>
              <strong>Location:</strong> <code>convex/lib/debtConsolidation.ts:4</code>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">Payoff Timeline</h3>
            <p className="text-white/70 mb-2">
              Calculates months needed to pay off debt with current payments.
            </p>
            <div className="bg-black/40 rounded p-3 font-mono text-sm text-white/90 mb-2">
              n = -log(1 - (P × r) / PMT) / log(1 + r)
            </div>
            <div className="text-sm text-white/50">
              <strong>P:</strong> Current balance<br/>
              <strong>r:</strong> Monthly interest rate<br/>
              <strong>PMT:</strong> Monthly payment<br/>
              <strong>Location:</strong> <code>convex/lib/debtConsolidation.ts:21</code>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">Total Interest</h3>
            <p className="text-white/70 mb-2">
              Calculates total interest paid over the life of a loan.
            </p>
            <div className="bg-black/40 rounded p-3 font-mono text-sm text-white/90 mb-2">
              Total Interest = (Monthly Payment × Number of Months) - Principal
            </div>
            <div className="text-sm text-white/50">
              <strong>Usage:</strong> Comparing consolidation options<br/>
              <strong>Location:</strong> <code>convex/lib/debtConsolidation.ts:15</code>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">💾 Data Storage</h2>
        <p className="text-white/70 mb-4">
          How Fourmi stores and processes your financial data.
        </p>

        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">Money Storage: Cents</h3>
            <p className="text-white/70 mb-2">
              All monetary amounts are stored as integers in cents to avoid floating-point errors.
            </p>
            <div className="text-sm text-white/50">
              <strong>Example:</strong> €25.50 is stored as 2550 cents<br/>
              <strong>Benefit:</strong> Precise calculations, no rounding errors<br/>
              <strong>Conversion:</strong> Display value = stored_value / 100
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">Data Validation</h3>
            <p className="text-white/70 mb-2">
              Input validation rules for financial data entry.
            </p>
            <div className="text-sm text-white/50">
              <strong>Amounts:</strong> Must be positive, max €1M<br/>
              <strong>Interest Rates:</strong> 0-50% range<br/>
              <strong>Location:</strong> <code>convex/lib/validation.ts</code>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">Real-time Updates</h3>
            <p className="text-white/70 mb-2">
              Dashboard automatically updates when new data is added or confirmed.
            </p>
            <div className="text-sm text-white/50">
              <strong>Technology:</strong> Convex real-time subscriptions<br/>
              <strong>Pattern:</strong> useQuery hooks automatically re-render<br/>
              <strong>Performance:</strong> Only changed data triggers updates
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}