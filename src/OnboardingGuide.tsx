import { useState } from "react";

interface OnboardingGuideProps {
  onClose: () => void;
}

export function OnboardingGuide({ onClose }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Fourmi Financial! 🐜",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            I'm your AI financial copilot, here to help you escape debt traps and build a better budget.
          </p>
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <h4 className="font-semibold text-blue-300 mb-2">Why start with a profile?</h4>
            <p className="text-sm text-blue-200">
              Creating your financial profile is the foundation for personalized budgeting advice. 
              It helps me understand your unique situation and provide tailored recommendations.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Multiple Ways to Add Your Data 📊",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">You can share your financial information in several ways:</p>
          <div className="grid gap-3">
            <div className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
              <span className="text-2xl">💬</span>
              <div>
                <h4 className="font-semibold text-white">Chat</h4>
                <p className="text-sm text-gray-400">Type naturally: "I earn 3000€ monthly, rent is 800€"</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
              <span className="text-2xl">🎤</span>
              <div>
                <h4 className="font-semibold text-white">Voice</h4>
                <p className="text-sm text-gray-400">Record your voice and I'll convert it to text</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
              <span className="text-2xl">📄</span>
              <div>
                <h4 className="font-semibold text-white">File Upload</h4>
                <p className="text-sm text-gray-400">Upload CSV or Excel files with your financial data</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "What Information I Need 📝",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">To give you the best advice, I'll help you track:</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm">💰</span>
              <div>
                <h4 className="font-semibold text-white">Income Sources</h4>
                <p className="text-sm text-gray-400">Salary, freelance work, investments, etc.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-sm">💸</span>
              <div>
                <h4 className="font-semibold text-white">Monthly Expenses</h4>
                <p className="text-sm text-gray-400">Rent, groceries, utilities, entertainment, etc.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-sm">🏦</span>
              <div>
                <h4 className="font-semibold text-white">Loans & Debt</h4>
                <p className="text-sm text-gray-400">Credit cards, mortgages, personal loans, etc.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Start! 🚀",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Once you've created your profile, you'll see a real-time dashboard showing your financial health.
          </p>
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
            <h4 className="font-semibold text-green-300 mb-2">Pro Tips:</h4>
            <ul className="text-sm text-green-200 space-y-1">
              <li>• Be specific with amounts and currencies</li>
              <li>• Include both fixed and variable expenses</li>
              <li>• Don't worry about being perfect - we can always adjust</li>
              <li>• I'll provide insights and suggestions as we go</li>
            </ul>
          </div>
          <p className="text-gray-300">
            Let's create your profile and start building a better financial future together!
          </p>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <h2 className="text-xl font-bold text-white">Getting Started</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Content */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              {steps[currentStep].title}
            </h3>
            {steps[currentStep].content}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={nextStep}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
