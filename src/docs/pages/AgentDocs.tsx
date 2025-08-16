export function AgentDocs() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Agent System</h1>
        <p className="text-xl text-white/70 mb-6">
          How Fourmi's AI agents process your financial information
        </p>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">🤖 Financial Agent</h2>
        <p className="text-white/70 mb-4">
          The main agent that processes your chat messages and extracts financial information.
        </p>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Current Capabilities</h3>
            <ul className="text-white/70 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <div>
                  <strong>Income Detection:</strong> Recognizes salary, wages, freelance income
                  <div className="text-sm text-white/50 mt-1">Keywords: earn, salary, income, make, paid, wage, revenue</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <div>
                  <strong>Expense Tracking:</strong> Categorizes spending across 7 categories
                  <div className="text-sm text-white/50 mt-1">Housing, Food, Transport, Utilities, Entertainment, Healthcare, Other</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <div>
                  <strong>Loan Processing:</strong> Extracts loan details including payment amounts
                  <div className="text-sm text-white/50 mt-1">Types: credit_card, personal, mortgage, auto</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <div>
                  <strong>Duplicate Prevention:</strong> Checks existing data before adding new entries
                  <div className="text-sm text-white/50 mt-1">Prevents accidental double-entry of the same information</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <div>
                  <strong>Fact Validation:</strong> Creates pending facts for user confirmation
                  <div className="text-sm text-white/50 mt-1">All extractions require dashboard confirmation before saving</div>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-2">Extraction Examples</h3>
            <div className="bg-black/20 rounded-lg p-4 space-y-3">
              <div>
                <div className="text-green-400 text-sm">Input:</div>
                <div className="text-white/90">"I earn 3000€ per month"</div>
                <div className="text-blue-400 text-sm">Output:</div>
                <div className="text-white/70">Income: Monthly earnings - €3000/month</div>
              </div>
              <div>
                <div className="text-green-400 text-sm">Input:</div>
                <div className="text-white/90">"My rent is 800€ and I spend 300 on groceries"</div>
                <div className="text-blue-400 text-sm">Output:</div>
                <div className="text-white/70">
                  Expense: Housing - Rent - €800/month<br/>
                  Expense: Food - Groceries - €300/month
                </div>
              </div>
              <div>
                <div className="text-green-400 text-sm">Input:</div>
                <div className="text-white/90">"Car loan 250€/month at 4.5%"</div>
                <div className="text-blue-400 text-sm">Output:</div>
                <div className="text-white/70">Loan: Auto - Car loan - €250/month (4.5% APR)</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-2">Limitations</h3>
            <ul className="text-white/70 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">⚠</span>
                <div>
                  <strong>Language Support:</strong> Optimized for English and French
                  <div className="text-sm text-white/50 mt-1">Other languages may have reduced accuracy</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">⚠</span>
                <div>
                  <strong>Complex Scenarios:</strong> Struggles with highly complex financial situations
                  <div className="text-sm text-white/50 mt-1">Best with clear, straightforward financial statements</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">⚠</span>
                <div>
                  <strong>Interest Rate Guessing:</strong> Only extracts explicitly mentioned rates
                  <div className="text-sm text-white/50 mt-1">Will not estimate or assume rates if not stated</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">🛠️ Agent Tools</h2>
        <p className="text-white/70 mb-4">
          Specialized tools used by the agent for different tasks.
        </p>

        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">extractFinancialDataTool</h3>
            <p className="text-white/70 mb-2">
              Processes natural language and extracts financial facts with validation.
            </p>
            <div className="text-sm text-white/50">
              Location: <code>convex/agents/financialTools.ts:14</code>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">getFinancialSummaryTool</h3>
            <p className="text-white/70 mb-2">
              Provides current financial overview with monthly balance calculations.
            </p>
            <div className="text-sm text-white/50">
              Location: <code>convex/agents/financialTools.ts:223</code>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">generateFinancialAdviceTool</h3>
            <p className="text-white/70 mb-2">
              Creates personalized financial advice based on user's situation.
            </p>
            <div className="text-sm text-white/50">
              Location: <code>convex/agents/financialTools.ts:268</code>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">🔄 Validation Workflow</h2>
        <p className="text-white/70 mb-4">
          How the agent ensures data accuracy through human-in-the-loop validation.
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
            <div>
              <h3 className="text-white font-medium">Message Processing</h3>
              <p className="text-white/70 text-sm">Agent analyzes user message for financial content</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">2</div>
            <div>
              <h3 className="text-white font-medium">Fact Extraction</h3>
              <p className="text-white/70 text-sm">AI extracts structured financial data using GPT-4</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">3</div>
            <div>
              <h3 className="text-white font-medium">Duplicate Check</h3>
              <p className="text-white/70 text-sm">System checks for existing similar entries</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">4</div>
            <div>
              <h3 className="text-white font-medium">Pending Creation</h3>
              <p className="text-white/70 text-sm">Creates pending facts requiring user confirmation</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">5</div>
            <div>
              <h3 className="text-white font-medium">User Validation</h3>
              <p className="text-white/70 text-sm">User reviews and confirms/rejects in dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">6</div>
            <div>
              <h3 className="text-white font-medium">Data Storage</h3>
              <p className="text-white/70 text-sm">Confirmed facts are permanently saved to profile</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}