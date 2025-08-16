import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface ProjectsListProps {
  profileId: Id<"profiles">;
  onProjectSelect: (projectId: Id<"projects">) => void;
  onBack?: () => void;
}

export function ProjectsList({ profileId, onProjectSelect, onBack }: ProjectsListProps) {
  const projects = useQuery(api.projects.listProjects, { profileId });
  const setActiveProject = useMutation(api.conversations.setActiveProjectByThread);

  const handleProjectClick = async (projectId: Id<"projects">) => {
    onProjectSelect(projectId);
  };

  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'debt_consolidation':
        return '🏦';
      case 'debt_payoff_strategy':
        return '💳';
      case 'rent_vs_buy':
        return '🏠';
      default:
        return '📊';
    }
  };

  const getProjectTypeLabel = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'FRESH':
        return 'text-green-400 bg-green-400/10';
      case 'STALE':
        return 'text-orange-400 bg-orange-400/10';
      case 'NEEDS_DATA':
        return 'text-blue-400 bg-blue-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="h-full bg-background-primary overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background-primary/95 backdrop-blur-2xl border-b border-white/10 p-6 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Projects</h2>
            <p className="text-white/60">Your financial analysis projects</p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-secondary/20 hover:bg-secondary/30 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {projects === undefined ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
            <p className="text-white/60 mb-6">
              Start a conversation about debt consolidation, budget planning, or financial goals to create your first project.
            </p>
            {onBack && (
              <button
                onClick={onBack}
                className="px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-lg transition-colors"
              >
                Start Chatting
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => handleProjectClick(project._id)}
                className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer border border-white/10 hover:border-white/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-3xl">{getProjectIcon(project.type)}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {project.name}
                      </h3>
                      <p className="text-white/60 text-sm mb-3">
                        {getProjectTypeLabel(project.type)}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStateColor(project.state)}`}>
                          {project.state}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium text-white/60 bg-white/10">
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-white/60">
                    <div>Created</div>
                    <div>{new Date(project.created).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Quick Summary */}
                {project.results && project.type === 'debt_consolidation' && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-white font-semibold">
                          ${(project.results.totalCurrentDebt / 100).toFixed(0)}
                        </div>
                        <div className="text-white/60">Total Debt</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-semibold">
                          {project.results.consolidationComparison?.filter((opt: any) => opt.eligible).length || 0}
                        </div>
                        <div className="text-white/60">Options</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-400 font-semibold">
                          ${Math.max(...(project.results.consolidationComparison?.map((opt: any) => opt.totalSavings) || [0])) / 100}
                        </div>
                        <div className="text-white/60">Max Savings</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}