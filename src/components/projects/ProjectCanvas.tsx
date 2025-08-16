import { useState } from "react";
import { useMutation } from "convex/react";
import { useTranslation } from 'react-i18next';
import { api } from "../../../convex/_generated/api";

interface ProjectCanvasProps {
  project: any; // Will properly type this later
  onBack: () => void;
  onEdit?: (project: any) => void;
  onDelete?: (projectId: string) => void;
  onGoToDashboard?: () => void;
}

export function ProjectCanvas({ project, onBack, onEdit, onDelete, onGoToDashboard }: ProjectCanvasProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'inputs' | 'results'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(project.name);
  
  const updateProject = useMutation(api.projects.updateProject);
  const deleteProject = useMutation(api.projects.deleteProject);
  
  const handleSaveEdit = async () => {
    try {
      await updateProject({
        projectId: project._id,
        updates: { name: editedName }
      });
      setIsEditing(false);
      // Optionally call onEdit callback
      onEdit?.(project);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm(t('projects.deleteConfirmation'))) {
      try {
        await deleteProject({ projectId: project._id });
        onDelete?.(project._id);
        onBack(); // Return to previous view
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const renderDebtConsolidationResults = () => {
    if (!project.results) {
      return (
        <div className="text-center py-8">
          <p className="text-white/60">{t('projects.noResultsAvailable')}</p>
        </div>
      );
    }

    const results = project.results;
    const eligibleOptions = results.consolidationComparison?.filter((opt: any) => opt.eligible) || [];

    return (
      <div className="space-y-6">
        {/* Current Debt Summary */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">{t('projects.canvas.currentDebtSummary')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                ${(results.totalCurrentDebt / 100).toFixed(2)}
              </div>
              <div className="text-white/60 text-sm">{t('projects.canvas.totalDebt')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                ${(results.totalCurrentPayment / 100).toFixed(2)}
              </div>
              <div className="text-white/60 text-sm">{t('projects.canvas.monthlyPayment')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-300">
                ${(results.totalCurrentInterest / 100).toFixed(2)}
              </div>
              <div className="text-white/60 text-sm">{t('projects.canvas.totalInterest')}</div>
            </div>
          </div>
        </div>

        {/* Consolidation Options */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Consolidation Options</h3>
          
          {eligibleOptions.length > 0 ? (
            <div className="space-y-4">
              {results.consolidationComparison.map((option: any, index: number) => (
                <div 
                  key={index}
                  className={`border rounded-lg p-4 ${
                    option.eligible 
                      ? 'border-green-500/30 bg-green-500/5' 
                      : 'border-red-500/30 bg-red-500/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white capitalize">
                      {option.type.replace('_', ' ')}
                    </h4>
                    <span className={`px-2 py-1 rounded text-xs ${
                      option.eligible 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {option.eligible ? 'Eligible' : 'Not Eligible'}
                    </span>
                  </div>
                  
                  {option.eligible && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-white/60">Monthly Payment</div>
                        <div className="text-white font-semibold">
                          ${(option.newMonthlyPayment / 100).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60">Total Interest</div>
                        <div className="text-white font-semibold">
                          ${(option.totalInterest / 100).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60">Months Saved</div>
                        <div className="text-white font-semibold">
                          {option.monthsSaved}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60">Total Savings</div>
                        <div className={`font-semibold ${
                          option.totalSavings > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          ${(option.totalSavings / 100).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-white/60">No eligible consolidation options found</p>
            </div>
          )}
        </div>

        {/* Recommendation */}
        {results.recommendation && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">Recommendation</h3>
            <p className="text-white/80 mb-4">{results.recommendation}</p>
            
            {results.nextSteps && results.nextSteps.length > 0 && (
              <div>
                <h4 className="text-blue-400 font-semibold mb-2">Next Steps:</h4>
                <ul className="space-y-1">
                  {results.nextSteps.map((step: string, index: number) => (
                    <li key={index} className="text-white/70 text-sm flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Warnings */}
        {results.warnings && results.warnings.length > 0 && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-orange-400 mb-3">Important Considerations</h3>
            <ul className="space-y-1">
              {results.warnings.map((warning: string, index: number) => (
                <li key={index} className="text-white/70 text-sm flex items-start">
                  <span className="text-orange-400 mr-2">⚠</span>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderInputs = () => {
    if (!project.inputs) {
      return (
        <div className="text-center py-8">
          <p className="text-white/60">No input data available</p>
        </div>
      );
    }

    const inputs = project.inputs;

    return (
      <div className="space-y-6">
        {/* Existing Debts */}
        {inputs.existingDebts && (
          <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Current Debts</h3>
            <div className="space-y-3">
              {inputs.existingDebts.map((debt: any, index: number) => (
                <div key={index} className="border border-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-white">{debt.name}</h4>
                      <p className="text-white/60 text-sm">
                        Balance: ${(debt.balance / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        ${(debt.monthlyPayment / 100).toFixed(2)}/mo
                      </div>
                      <div className="text-white/60 text-sm">
                        {(debt.interestRate * 100).toFixed(2)}% APR
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Consolidation Options */}
        {inputs.consolidationOptions && (
          <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Analyzed Options</h3>
            <div className="space-y-3">
              {inputs.consolidationOptions.map((option: any, index: number) => (
                <div key={index} className="border border-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-white capitalize">
                      {option.type.replace('_', ' ')}
                    </h4>
                    <div className="text-right">
                      <div className="text-white/60 text-sm">
                        {(option.rate * 100).toFixed(2)}% APR, {option.term} months
                      </div>
                      {option.fees > 0 && (
                        <div className="text-white/60 text-sm">
                          Fees: ${(option.fees / 100).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financial Context */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Financial Context</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-white/60">Monthly Income</div>
              <div className="text-white font-semibold">
                ${(inputs.monthlyIncome / 100).toFixed(2)}
              </div>
            </div>
            {inputs.creditScore && (
              <div>
                <div className="text-white/60">Credit Score</div>
                <div className="text-white font-semibold">
                  {inputs.creditScore}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderOverview = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Project Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-white/60">Created</div>
              <div className="text-white">
                {new Date(project.created).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-white/60">Last Updated</div>
              <div className="text-white">
                {new Date(project.updated).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-white/60">Status</div>
              <div className="text-white capitalize">{project.status}</div>
            </div>
            <div>
              <div className="text-white/60">State</div>
              <div className={`font-semibold ${
                project.state === 'FRESH' ? 'text-green-400' :
                project.state === 'STALE' ? 'text-orange-400' :
                'text-blue-400'
              }`}>
                {project.state}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        {project.results && (
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-400">
                  {project.results.consolidationComparison?.filter((opt: any) => opt.eligible).length || 0}
                </div>
                <div className="text-white/60 text-sm">Eligible Options</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-400">
                  ${Math.max(...(project.results.consolidationComparison?.map((opt: any) => opt.totalSavings) || [0])) / 100}
                </div>
                <div className="text-white/60 text-sm">Max Potential Savings</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-400">
                  ${(project.results.totalCurrentDebt / 100).toFixed(0)}
                </div>
                <div className="text-white/60 text-sm">Total Debt</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-background-primary overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background-primary/95 backdrop-blur-2xl border-b border-white/10 p-6 z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-2xl font-bold text-white bg-white/10 rounded-lg px-3 py-1 border border-white/20 focus:border-white/40 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                >
                  {t('common.save')}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedName(project.name);
                  }}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                >
                  {t('common.cancel')}
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-white">{project.name}</h2>
                <p className="text-white/60">
                  {project.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2"
                  title="Edit project name"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {t('common.edit')}
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors flex items-center gap-2"
                  title="Delete project"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {t('common.delete')}
                </button>
              </>
            )}
            <div className="flex items-center gap-2">
              {onGoToDashboard && (
                <button
                  onClick={onGoToDashboard}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
                >
                  {t('navigation.dashboard')}
                </button>
              )}
              <button
                onClick={onBack}
                className="px-4 py-2 bg-secondary/20 hover:bg-secondary/30 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('navigation.backToProjects')}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-6 bg-white/5 p-1 rounded-lg">
          {[
            { key: 'overview', label: t('projects.overview') },
            { key: 'inputs', label: t('projects.inputs') },
            { key: 'results', label: t('projects.results') }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'inputs' && renderInputs()}
        {activeTab === 'results' && renderDebtConsolidationResults()}
      </div>
    </div>
  );
}