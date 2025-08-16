import { SchematicComponent } from "./schematic/Schematic";

interface BillingPageProps {
  onBack: () => void;
}

export function BillingPage({ onBack }: BillingPageProps) {
  return (
    <div className="min-h-screen gradient-bg text-white">
      {/* Header */}
      <header className="fixed top-4 left-4 right-4 z-[100] bg-white/[0.03] backdrop-blur-2xl h-14 flex justify-between items-center rounded-2xl px-6 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-financial">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <h2 className="text-xl font-semibold text-white">Billing & Subscription</h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Manage Your Subscription</h1>
            <p className="text-gray-400">Update your billing information, view usage, and manage your plan</p>
          </div>

          {/* Schematic Component Container */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <SchematicComponent />
          </div>
        </div>
      </main>
    </div>
  );
}