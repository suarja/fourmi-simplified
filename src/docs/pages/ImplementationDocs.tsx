export function ImplementationDocs() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Implementation Status</h1>
        <p className="text-xl text-white/70 mb-6">
          Current implementation vs roadmap audit and technical architecture
        </p>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">✅ Completed Features</h2>
        <p className="text-white/70 mb-4">
          Core functionality that's fully implemented and working.
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <h3 className="text-white font-medium">Basic Profile Management</h3>
              <p className="text-white/70 text-sm">User profiles with authentication via Convex Auth</p>
              <div className="text-xs text-white/50 mt-1">Location: <code>convex/profiles.ts</code></div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <h3 className="text-white font-medium">Financial Data Tracking</h3>
              <p className="text-white/70 text-sm">Income, expense, and loan tracking with real-time calculations</p>
              <div className="text-xs text-white/50 mt-1">Location: <code>convex/profiles.ts:getFinancialData</code></div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <h3 className="text-white font-medium">AI-Powered Fact Extraction</h3>
              <p className="text-white/70 text-sm">GPT-4 extracts financial information from natural language</p>
              <div className="text-xs text-white/50 mt-1">Location: <code>convex/agents/financialTools.ts:extractFinancialDataTool</code></div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <h3 className="text-white font-medium">Duplicate Prevention</h3>
              <p className="text-white/70 text-sm">Checks for existing similar entries before adding new data</p>
              <div className="text-xs text-white/50 mt-1">Location: <code>convex/lib/validation.ts</code></div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <h3 className="text-white font-medium">Real-time Dashboard</h3>
              <p className="text-white/70 text-sm">Live financial dashboard with monthly balance calculations</p>
              <div className="text-xs text-white/50 mt-1">Location: <code>src/components/FinancialDashboard.tsx</code></div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <h3 className="text-white font-medium">CSV File Upload</h3>
              <p className="text-white/70 text-sm">Process financial data from uploaded CSV files</p>
              <div className="text-xs text-white/50 mt-1">Location: <code>convex/ai.ts:processCsvAction</code></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">🚧 In Progress</h2>
        <p className="text-white/70 mb-4">
          Features currently being developed or partially implemented.
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">⚡</span>
            </div>
            <div>
              <h3 className="text-white font-medium">Fact Validation System</h3>
              <p className="text-white/70 text-sm">Human-in-the-loop validation for AI extractions (backend complete, UI in progress)</p>
              <div className="text-xs text-white/50 mt-1">Backend: <code>convex/domain/facts.ts</code> | UI: Pending</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">⚡</span>
            </div>
            <div>
              <h3 className="text-white font-medium">Edit/Delete Functionality</h3>
              <p className="text-white/70 text-sm">Allow users to modify or remove financial entries (partially implemented)</p>
              <div className="text-xs text-white/50 mt-1">Backend mutations exist, UI integration needed</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">⚡</span>
            </div>
            <div>
              <h3 className="text-white font-medium">Business Logic Organization</h3>
              <p className="text-white/70 text-sm">Moving calculations to dedicated lib/ and domain/ folders</p>
              <div className="text-xs text-white/50 mt-1">Started: <code>convex/lib/debtConsolidation.ts</code></div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">⚡</span>
            </div>
            <div>
              <h3 className="text-white font-medium">React Router Implementation</h3>
              <p className="text-white/70 text-sm">Proper routing instead of overlay/modal approach (currently being implemented)</p>
              <div className="text-xs text-white/50 mt-1">Status: Router setup complete, documentation pages in progress</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">📋 TODO</h2>
        <p className="text-white/70 mb-4">
          Planned features and improvements for future development.
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">◯</span>
            </div>
            <div>
              <h3 className="text-white font-medium">Schematic Integration</h3>
              <p className="text-white/70 text-sm">Feature flags and subscription billing for three-tier model</p>
              <div className="text-xs text-white/50 mt-1">Dependency: Schematic setup and configuration</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">◯</span>
            </div>
            <div>
              <h3 className="text-white font-medium">Real Estate Projects (PAID Tier)</h3>
              <p className="text-white/70 text-sm">Rent vs buy analysis and real estate decision tools</p>
              <div className="text-xs text-white/50 mt-1">Design: <code>docs/technical/PROJECTS_IMPLEMENTATION.md</code></div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">◯</span>
            </div>
            <div>
              <h3 className="text-white font-medium">Multiple Simulations (PREMIUM Tier)</h3>
              <p className="text-white/70 text-sm">Compare multiple financial scenarios and projections</p>
              <div className="text-xs text-white/50 mt-1">Requires: Project system foundation + comparison engine</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">◯</span>
            </div>
            <div>
              <h3 className="text-white font-medium">Comprehensive Testing</h3>
              <p className="text-white/70 text-sm">Unit and integration tests with Vitest framework</p>
              <div className="text-xs text-white/50 mt-1">Setup: Test environment configuration needed</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">◯</span>
            </div>
            <div>
              <h3 className="text-white font-medium">Production Deployment</h3>
              <p className="text-white/70 text-sm">Deploy to production with proper CI/CD pipeline</p>
              <div className="text-xs text-white/50 mt-1">Prerequisites: Testing + billing integration</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">🏗️ Architecture Patterns</h2>
        <p className="text-white/70 mb-4">
          Key architectural decisions and patterns used in the codebase.
        </p>

        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">Convex Agent Tools Pattern</h3>
            <p className="text-white/70 mb-2">
              Each major functionality is implemented as a focused agent tool using <code>createTool()</code>.
            </p>
            <div className="text-sm text-white/50">
              <strong>Benefits:</strong> Modularity, testability, error isolation<br/>
              <strong>Example:</strong> <code>extractFinancialDataTool</code>, <code>getFinancialSummaryTool</code><br/>
              <strong>Future:</strong> Project-specific tools (debt consolidation, rent vs buy)
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">Real-time Data Flow</h3>
            <p className="text-white/70 mb-2">
              Convex handles real-time subscriptions with <code>useQuery</code> hooks for automatic UI updates.
            </p>
            <div className="text-sm text-white/50">
              <strong>Pattern:</strong> Mutations trigger automatic re-renders<br/>
              <strong>Performance:</strong> Only changed data causes updates<br/>
              <strong>Usage:</strong> Dashboard reflects changes immediately
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">Human-in-the-Loop Validation</h3>
            <p className="text-white/70 mb-2">
              AI extractions create pending facts that require user confirmation before permanent storage.
            </p>
            <div className="text-sm text-white/50">
              <strong>Flow:</strong> Extract → Pending → Confirm → Save<br/>
              <strong>Benefit:</strong> Accuracy and user control<br/>
              <strong>Implementation:</strong> <code>pendingFacts</code> table + dashboard UI
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">Component Composition</h3>
            <p className="text-white/70 mb-2">
              UI components are composed with clear separation between data, logic, and presentation.
            </p>
            <div className="text-sm text-white/50">
              <strong>Pattern:</strong> Container components fetch data, presentational components display<br/>
              <strong>Example:</strong> <code>FinancialCopilot</code> (container) + <code>FinancialDashboard</code> (presentation)<br/>
              <strong>Reusability:</strong> Components can be easily tested and reused
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">🔄 Development Workflow</h2>
        <p className="text-white/70 mb-4">
          Recommended process for adding new features and maintaining quality.
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
            <div>
              <h3 className="text-white font-medium">Design Phase</h3>
              <p className="text-white/70 text-sm">Create technical documentation in <code>docs/technical/</code></p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">2</div>
            <div>
              <h3 className="text-white font-medium">Backend Implementation</h3>
              <p className="text-white/70 text-sm">Add Convex functions, schemas, and agent tools</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">3</div>
            <div>
              <h3 className="text-white font-medium">Frontend Integration</h3>
              <p className="text-white/70 text-sm">Create UI components and integrate with backend</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">4</div>
            <div>
              <h3 className="text-white font-medium">Testing</h3>
              <p className="text-white/70 text-sm">Unit tests for business logic, integration tests for workflows</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">5</div>
            <div>
              <h3 className="text-white font-medium">Documentation Update</h3>
              <p className="text-white/70 text-sm">Update this implementation status and user guides</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}