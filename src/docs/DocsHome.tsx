export function DocsHome() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Fourmi Documentation</h1>
        <p className="text-xl text-white/70 mb-6">
          Complete guide to your financial copilot
        </p>
        <div className="bg-primary/20 border border-primary/30 rounded-lg p-4">
          <p className="text-white/90">
            Welcome to Fourmi's documentation. Here you'll find everything you need to know about using your financial copilot effectively.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-3">🤖 Agents</h3>
          <p className="text-white/70 mb-4">
            Learn about our AI agents, their capabilities, and how they process your financial information.
          </p>
          <ul className="text-sm text-white/60 space-y-1">
            <li>• Financial data extraction</li>
            <li>• Advice generation</li>
            <li>• Project tools</li>
            <li>• Validation workflows</li>
          </ul>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-3">💰 Financial</h3>
          <p className="text-white/70 mb-4">
            Understand financial terms, calculations, and how Fourmi processes your money data.
          </p>
          <ul className="text-sm text-white/60 space-y-1">
            <li>• HELOC, DTI, and loan types</li>
            <li>• Interest rate calculations</li>
            <li>• Hardcoded values (12%, 18%, 8%)</li>
            <li>• PMT formulas</li>
          </ul>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-3">⚙️ Implementation</h3>
          <p className="text-white/70 mb-4">
            Technical details about the current implementation and architecture.
          </p>
          <ul className="text-sm text-white/60 space-y-1">
            <li>• Current vs roadmap audit</li>
            <li>• Convex patterns</li>
            <li>• Component architecture</li>
            <li>• Testing approach</li>
          </ul>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-3">📊 Projects</h3>
          <p className="text-white/70 mb-4">
            Learn about financial projects and simulations (Coming soon).
          </p>
          <ul className="text-sm text-white/60 space-y-1">
            <li>• Debt consolidation</li>
            <li>• Rent vs buy analysis</li>
            <li>• Payoff strategies</li>
            <li>• Multi-project comparisons</li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-6 border border-primary/30">
        <h3 className="text-xl font-semibold text-white mb-3">🎯 Mission</h3>
        <p className="text-white/90 mb-4">
          Fourmi is a chat-first financial copilot helping households escape debt traps and make informed real estate decisions.
        </p>
        <p className="text-white/70">
          We're fighting consumer debt traps created by $4B+ annual credit company marketing with accessible, empowering tools.
        </p>
      </div>
    </div>
  );
}