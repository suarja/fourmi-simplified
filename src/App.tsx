import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { FinancialCopilot } from "./FinancialCopilot";

export default function App() {
  return (
    <div className="min-h-screen bg-background-primary text-white">
      <header className="sticky top-0 z-50 bg-glass-card backdrop-blur-xl h-16 flex justify-between items-center border-b border-glass-light/30 px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center shadow-financial">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <h2 className="text-xl font-semibold text-white">Fourmi Financial</h2>
        </div>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>
      <main className="flex-1">
        <Content />
      </main>
      <Toaster theme="dark" />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

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
                Your Financial Copilot
              </h1>
              <p className="text-xl text-secondary-light">
                Chat-first budgeting to escape debt traps
              </p>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}
