import { Routes, Route, Link, useLocation } from "react-router-dom";
import { DocsHome } from "./DocsHome";
import { AgentDocs } from "./pages/AgentDocs";
import { FinancialDocs } from "./pages/FinancialDocs";
import { ImplementationDocs } from "./pages/ImplementationDocs";

export function DocsLayout() {
  const location = useLocation();
  
  const navigation = [
    { path: "/docs", label: "Overview", exact: true },
    { path: "/docs/agents", label: "Agents", exact: false },
    { path: "/docs/financial", label: "Financial", exact: false },
    { path: "/docs/implementation", label: "Implementation", exact: false },
  ];
  
  const isActive = (path: string, exact: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen gradient-bg text-white">
      {/* Header */}
      <header className="fixed top-4 left-4 right-4 z-[100] bg-white/[0.03] backdrop-blur-2xl h-14 flex justify-between items-center rounded-2xl px-6 shadow-xl">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-financial">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <h2 className="text-xl font-semibold text-white">Fourmi Docs</h2>
          </Link>
        </div>
        <Link 
          to="/" 
          className="px-4 py-2 bg-secondary/20 hover:bg-secondary/30 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to App
        </Link>
      </header>

      <div className="flex pt-20 h-screen">
        {/* Sidebar Navigation */}
        <nav className="w-64 p-6 bg-white/5 backdrop-blur-2xl border-r border-white/10">
          <div className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.path, item.exact)
                    ? 'bg-primary text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            <Routes>
              <Route index element={<DocsHome />} />
              <Route path="agents" element={<AgentDocs />} />
              <Route path="financial" element={<FinancialDocs />} />
              <Route path="implementation" element={<ImplementationDocs />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}