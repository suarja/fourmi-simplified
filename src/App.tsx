import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { UserProfileDropdown } from "./components/UserProfileDropdown";
import { BillingPage } from "./components/BillingPage";
import { Toaster } from "sonner";
import { FinancialCopilot } from "./FinancialCopilot";
import { DocsLayout } from "./docs/DocsLayout";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/billing" element={<BillingPage onBack={() => window.history.back()} />} />
        <Route path="/docs/*" element={<DocsLayout />} />
      </Routes>
      <Toaster theme="dark" />
    </Router>
  );
}

// Extract the main layout to preserve existing functionality
function MainLayout() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBillingClick = () => {
    navigate("/billing");
  };

  return (
    <div className="min-h-screen gradient-bg text-white">
      <header className="fixed top-4 left-4 right-4 z-[100] bg-white/[0.03] backdrop-blur-2xl h-14 flex justify-between items-center rounded-2xl px-6 shadow-xl">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-financial">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <h2 className="text-xl font-semibold text-white">Fourmi Financial</h2>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Authenticated>
            <Link 
              to="/docs" 
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
            >
              {t('navigation.docs')}
            </Link>
            <UserProfileDropdown onBillingClick={handleBillingClick} />
          </Authenticated>
        </div>
      </header>
      <main className="flex-1 pt-20">
        <Content />
      </main>
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const { t } = useTranslation();

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-background-primary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <Authenticated>
        <FinancialCopilot />
      </Authenticated>
      <Unauthenticated>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 bg-background-primary">
          <div className="w-full max-w-md mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                {t('mission.title')}
              </h1>
              <p className="text-xl text-secondary-light">
                {t('auth.subtitle')}
              </p>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}
