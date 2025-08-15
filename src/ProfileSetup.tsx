import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import { OnboardingGuide } from "./OnboardingGuide";

export function ProfileSetup() {
  const [name, setName] = useState("");
  const [type, setType] = useState<"solo" | "couple">("solo");
  const [isCreating, setIsCreating] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  const createProfile = useMutation(api.profiles.createProfile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);
    try {
      await createProfile({ name: name.trim(), type });
      toast.success("Profile created successfully! Let's start building your budget.");
    } catch (error) {
      toast.error("Failed to create profile");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  if (showOnboarding) {
    return <OnboardingGuide onClose={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">🐜</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Create Your Financial Profile
            </h2>
            <p className="text-gray-300">
              This is the foundation for personalized budgeting advice
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Profile Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., My Budget, Family Finances"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Profile Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType("solo")}
                  className={`p-4 rounded-lg border transition-colors ${
                    type === "solo"
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">👤</div>
                    <div className="font-medium">Solo</div>
                    <div className="text-xs opacity-75">Individual budget</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setType("couple")}
                  className={`p-4 rounded-lg border transition-colors ${
                    type === "couple"
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">👥</div>
                    <div className="font-medium">Couple</div>
                    <div className="text-xs opacity-75">Shared finances</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <h4 className="font-semibold text-blue-300 mb-2">Next Steps:</h4>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Share your income and expenses through chat</li>
                <li>• Upload CSV/Excel files with financial data</li>
                <li>• Use voice recording for hands-free input</li>
                <li>• Get real-time insights and advice</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={!name.trim() || isCreating}
              className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? "Creating Profile..." : "Create Profile & Start Chatting"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setShowOnboarding(true)}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Show onboarding guide again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
