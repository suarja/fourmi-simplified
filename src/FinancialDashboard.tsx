import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface FinancialDashboardProps {
  profileId: Id<"profiles">;
}

export function FinancialDashboard({ profileId }: FinancialDashboardProps) {
  const financialData = useQuery(api.profiles.getFinancialData, { profileId });
  const monthlyBalance = useQuery(api.profiles.getMonthlyBalance, { profileId });
  const pendingFacts = useQuery(api.domain.facts.getPendingFacts, { profileId });
  const generateBudgetInsights = useAction(api.ai.generateBudgetInsights);
  
  const [insights, setInsights] = useState<string>("");
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [hasGeneratedInsights, setHasGeneratedInsights] = useState(false);

  // Generate insights manually when user clicks the button
  const handleGenerateInsights = async () => {
    if (!financialData || (financialData.incomes.length === 0 && financialData.expenses.length === 0)) {
      return;
    }

    setLoadingInsights(true);
    try {
      const newInsights = await generateBudgetInsights({
        incomes: financialData.incomes.map(income => ({
          label: income.label,
          amount: income.amount / 100, // Convert from cents
          isMonthly: income.isMonthly,
        })),
        expenses: financialData.expenses.map(expense => ({
          category: expense.category,
          label: expense.label,
          amount: expense.amount / 100, // Convert from cents
        })),
        loans: financialData.loans.map(loan => ({
          type: loan.type,
          name: loan.name,
          monthlyPayment: loan.monthlyPayment / 100, // Convert from cents
          interestRate: loan.interestRate,
          remainingBalance: loan.remainingBalance / 100, // Convert from cents
          remainingMonths: loan.remainingMonths,
        })),
      });
      setInsights(newInsights);
      setHasGeneratedInsights(true);
      
      // Cache insights in localStorage
      const cacheKey = `insights_${profileId}`;
      const cacheData = {
        insights: newInsights,
        timestamp: Date.now(),
        dataHash: JSON.stringify(financialData) // Simple hash for data changes
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Error generating insights:", error);
    } finally {
      setLoadingInsights(false);
    }
  };

  // Check for cached insights on component mount
  useEffect(() => {
    if (financialData) {
      const cacheKey = `insights_${profileId}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        try {
          const cacheData = JSON.parse(cached);
          const currentDataHash = JSON.stringify(financialData);
          
          // Use cached insights if data hasn't changed and cache is less than 24 hours old
          const isRecentCache = Date.now() - cacheData.timestamp < 24 * 60 * 60 * 1000;
          const isDataUnchanged = cacheData.dataHash === currentDataHash;
          
          if (isRecentCache && isDataUnchanged && cacheData.insights) {
            setInsights(cacheData.insights);
            setHasGeneratedInsights(true);
          }
        } catch (error) {
          console.error("Error loading cached insights:", error);
        }
      }
    }
  }, [financialData, profileId]);

  if (!financialData || !monthlyBalance) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const expensesByCategory = financialData.expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount / 100;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="h-full overflow-y-auto bg-gray-900">
      {/* Dashboard Header */}
      <div className="p-6 border-b border-gray-700 bg-gray-800">
        <h3 className="text-xl font-bold text-white mb-2">Financial Dashboard</h3>
        <p className="text-gray-400">Real-time view of your budget</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Pending Facts Card */}
        {pendingFacts && pendingFacts.length > 0 && (
          <PendingFactsCard 
            facts={pendingFacts} 
            profileId={profileId}
          />
        )}
        {/* Monthly Balance Card */}
        <div className={`rounded-lg p-6 border ${
          monthlyBalance.isPositive 
            ? 'bg-green-900/20 border-green-700' 
            : 'bg-red-900/20 border-red-700'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Monthly Balance</h4>
            <span className={`text-2xl ${monthlyBalance.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {monthlyBalance.isPositive ? '📈' : '📉'}
            </span>
          </div>
          <div className={`text-3xl font-bold mb-2 ${
            monthlyBalance.isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {formatCurrency(monthlyBalance.balance)}
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Income</div>
              <div className="text-green-400 font-semibold">
                {formatCurrency(monthlyBalance.monthlyIncome)}
              </div>
            </div>
            <div>
              <div className="text-gray-400">Expenses</div>
              <div className="text-red-400 font-semibold">
                {formatCurrency(monthlyBalance.monthlyExpenses)}
              </div>
            </div>
            <div>
              <div className="text-gray-400">Loans</div>
              <div className="text-orange-400 font-semibold">
                {formatCurrency(monthlyBalance.monthlyLoanPayments)}
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        {(financialData.incomes.length > 0 || financialData.expenses.length > 0) && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <h4 className="text-lg font-semibold text-white">AI Insights</h4>
              </div>
              
              {!loadingInsights && (
                <button
                  onClick={handleGenerateInsights}
                  disabled={loadingInsights}
                  className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {hasGeneratedInsights ? "🔄 Refresh" : "✨ Generate"}
                </button>
              )}
            </div>
            
            {loadingInsights ? (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                Analyzing your budget...
              </div>
            ) : insights ? (
              <div className="text-gray-300 whitespace-pre-line">{insights}</div>
            ) : (
              <div className="text-gray-400 text-center py-4">
                Click "Generate" to get AI-powered insights about your budget
              </div>
            )}
          </div>
        )}

        {/* Income Sources */}
        {financialData.incomes.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-green-400">💰</span>
              Income Sources
            </h4>
            <div className="space-y-3">
              {financialData.incomes.map((income) => (
                <div key={income._id} className="flex justify-between items-center group">
                  <span className="text-gray-300">{income.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-semibold">
                      {formatCurrency(income.amount / 100)}
                      {income.isMonthly ? '/month' : '/year'}
                    </span>
                    <DeleteButton 
                      itemId={income._id} 
                      itemType="income" 
                      itemLabel={income.label}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expenses by Category */}
        {Object.keys(expensesByCategory).length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-red-400">💸</span>
              Monthly Expenses
            </h4>
            <div className="space-y-3">
              {financialData.expenses.map((expense) => (
                <div key={expense._id} className="flex justify-between items-center group">
                  <div>
                    <span className="text-gray-300">{expense.label}</span>
                    <span className="text-gray-500 text-sm ml-2">({expense.category})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-semibold">
                      {formatCurrency(expense.amount / 100)}
                    </span>
                    <DeleteButton 
                      itemId={expense._id} 
                      itemType="expense" 
                      itemLabel={expense.label}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loans */}
        {financialData.loans.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-400">🏦</span>
              Loans & Debt
            </h4>
            <div className="space-y-4">
              {financialData.loans.map((loan) => (
                <div key={loan._id} className="border border-gray-600 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold text-white">{loan.name}</h5>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                        {loan.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <DeleteButton 
                        itemId={loan._id} 
                        itemType="loan" 
                        itemLabel={loan.name}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Monthly Payment</div>
                      <div className="text-orange-400 font-semibold">
                        {formatCurrency(loan.monthlyPayment / 100)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Interest Rate</div>
                      <div className="text-gray-300">
                        {(loan.interestRate * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Remaining Balance</div>
                      <div className="text-gray-300">
                        {formatCurrency(loan.remainingBalance / 100)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Months Left</div>
                      <div className="text-gray-300">
                        {loan.remainingMonths}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {financialData.incomes.length === 0 && 
         financialData.expenses.length === 0 && 
         financialData.loans.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Financial Data Yet
            </h3>
            <p className="text-gray-400 mb-6">
              Start chatting with Fourmi to add your income, expenses, and loans
            </p>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-left max-w-md mx-auto">
              <h4 className="font-semibold text-white mb-2">Try saying:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• "I earn 3000€ per month"</li>
                <li>• "My rent is 800€ monthly"</li>
                <li>• "I spend 300€ on groceries"</li>
                <li>• "I have a car loan of 250€/month"</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Pending Facts Card Component
function PendingFactsCard({ facts, profileId }: { 
  facts: any[]; 
  profileId: Id<"profiles">;
}) {
  const confirmFact = useMutation(api.domain.facts.confirmPendingFact);
  const rejectFact = useMutation(api.domain.facts.rejectPendingFact);
  const updateFact = useMutation(api.domain.facts.updatePendingFact);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const handleConfirm = async (factId: string) => {
    setProcessingId(factId);
    try {
      await confirmFact({ factId: factId as Id<"pendingFacts"> });
      toast.success("Data confirmed and added");
    } catch (error) {
      console.error("Error confirming fact:", error);
      toast.error("Failed to confirm data");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (factId: string) => {
    setProcessingId(factId);
    try {
      await rejectFact({ factId: factId as Id<"pendingFacts"> });
      toast.success("Data rejected");
    } catch (error) {
      console.error("Error rejecting fact:", error);
      toast.error("Failed to reject data");
    } finally {
      setProcessingId(null);
    }
  };

  const handleEdit = (fact: any) => {
    setEditingId(fact._id);
    setEditForm(fact.data);
  };

  const handleSaveEdit = async (factId: string) => {
    setProcessingId(factId);
    try {
      await updateFact({ 
        factId: factId as Id<"pendingFacts">,
        data: editForm 
      });
      toast.success("Data updated");
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error("Error updating fact:", error);
      toast.error("Failed to update data");
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const formatFactDisplay = (fact: any) => {
    if (fact.type === "income") {
      return `${fact.data.label}: €${fact.data.amount}${fact.data.isMonthly ? '/month' : '/year'}`;
    } else if (fact.type === "expense") {
      return `${fact.data.label} (${fact.data.category}): €${fact.data.amount}/month`;
    } else if (fact.type === "loan") {
      let display = `${fact.data.name}: €${fact.data.monthlyPayment}/month`;
      if (fact.data.interestRate) {
        display += ` @ ${(fact.data.interestRate * 100).toFixed(1)}%`;
      }
      if (fact.data.remainingMonths) {
        display += ` (${fact.data.remainingMonths} months)`;
      }
      return display;
    }
    return "Unknown data";
  };

  return (
    <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">⏳</span>
        <h4 className="text-lg font-semibold text-white">Pending Confirmation</h4>
        <span className="text-sm text-yellow-400">({facts.length} item{facts.length > 1 ? 's' : ''})</span>
      </div>
      <div className="space-y-3">
        {facts.map((fact) => (
          <div key={fact._id} className="bg-gray-800/50 rounded-lg p-3">
            {editingId === fact._id ? (
              // Edit Mode
              <div className="space-y-3">
                <div className="text-white font-medium mb-2">
                  Edit {fact.type.charAt(0).toUpperCase() + fact.type.slice(1)}
                </div>
                
                {fact.type === "loan" ? (
                  <>
                    <div>
                      <label className="text-gray-400 text-sm">Name</label>
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-full px-2 py-1 bg-gray-700 text-white rounded mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Monthly Payment (€) *</label>
                      <input
                        type="number"
                        value={editForm.monthlyPayment || ''}
                        onChange={(e) => setEditForm({...editForm, monthlyPayment: parseFloat(e.target.value)})}
                        className="w-full px-2 py-1 bg-gray-700 text-white rounded mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Interest Rate (%) - Optional</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editForm.interestRate ? (editForm.interestRate * 100).toFixed(1) : ''}
                        onChange={(e) => setEditForm({...editForm, interestRate: e.target.value ? parseFloat(e.target.value) / 100 : undefined})}
                        className="w-full px-2 py-1 bg-gray-700 text-white rounded mt-1"
                        placeholder="e.g., 3.5 for 3.5%"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Remaining Balance (€) - Optional</label>
                      <input
                        type="number"
                        value={editForm.remainingBalance || ''}
                        onChange={(e) => setEditForm({...editForm, remainingBalance: e.target.value ? parseFloat(e.target.value) : undefined})}
                        className="w-full px-2 py-1 bg-gray-700 text-white rounded mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Remaining Months - Optional</label>
                      <input
                        type="number"
                        value={editForm.remainingMonths || ''}
                        onChange={(e) => setEditForm({...editForm, remainingMonths: e.target.value ? parseInt(e.target.value) : undefined})}
                        className="w-full px-2 py-1 bg-gray-700 text-white rounded mt-1"
                      />
                    </div>
                  </>
                ) : fact.type === "income" ? (
                  <>
                    <div>
                      <label className="text-gray-400 text-sm">Label</label>
                      <input
                        type="text"
                        value={editForm.label || ''}
                        onChange={(e) => setEditForm({...editForm, label: e.target.value})}
                        className="w-full px-2 py-1 bg-gray-700 text-white rounded mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Amount (€)</label>
                      <input
                        type="number"
                        value={editForm.amount || ''}
                        onChange={(e) => setEditForm({...editForm, amount: parseFloat(e.target.value)})}
                        className="w-full px-2 py-1 bg-gray-700 text-white rounded mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">
                        <input
                          type="checkbox"
                          checked={editForm.isMonthly || false}
                          onChange={(e) => setEditForm({...editForm, isMonthly: e.target.checked})}
                          className="mr-2"
                        />
                        Monthly (uncheck for annual)
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-gray-400 text-sm">Label</label>
                      <input
                        type="text"
                        value={editForm.label || ''}
                        onChange={(e) => setEditForm({...editForm, label: e.target.value})}
                        className="w-full px-2 py-1 bg-gray-700 text-white rounded mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Category</label>
                      <select
                        value={editForm.category || 'Other'}
                        onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                        className="w-full px-2 py-1 bg-gray-700 text-white rounded mt-1"
                      >
                        <option value="Housing">Housing</option>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Amount (€)</label>
                      <input
                        type="number"
                        value={editForm.amount || ''}
                        onChange={(e) => setEditForm({...editForm, amount: parseFloat(e.target.value)})}
                        className="w-full px-2 py-1 bg-gray-700 text-white rounded mt-1"
                      />
                    </div>
                  </>
                )}
                
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleSaveEdit(fact._id)}
                    disabled={processingId === fact._id}
                    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors disabled:opacity-50"
                  >
                    {processingId === fact._id ? "..." : "💾 Save"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-700 text-white text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Display Mode
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-white font-medium">
                    {fact.type.charAt(0).toUpperCase() + fact.type.slice(1)}: {formatFactDisplay(fact)}
                  </div>
                  {fact.type === "loan" && (!fact.data.interestRate || !fact.data.remainingBalance || !fact.data.remainingMonths) && (
                    <div className="text-orange-400 text-sm mt-1">⚠️ Incomplete data - click Edit to add details</div>
                  )}
                  {fact.suggestedAction === "skip" && (
                    <div className="text-yellow-400 text-sm mt-1">⚠️ Possible duplicate detected</div>
                  )}
                  <div className="text-gray-400 text-xs mt-1">
                    Confidence: {Math.round(fact.confidence * 100)}%
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(fact)}
                    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleConfirm(fact._id)}
                    disabled={processingId === fact._id}
                    className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-sm transition-colors disabled:opacity-50"
                  >
                    {processingId === fact._id ? "..." : "✓ Confirm"}
                  </button>
                  <button
                    onClick={() => handleReject(fact._id)}
                    disabled={processingId === fact._id}
                    className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm transition-colors disabled:opacity-50"
                  >
                    {processingId === fact._id ? "..." : "✗ Reject"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Delete button component
function DeleteButton({ itemId, itemType, itemLabel }: { 
  itemId: string; 
  itemType: "income" | "expense" | "loan";
  itemLabel: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteIncome = useMutation(api.domain.transactions.deleteIncome);
  const deleteExpense = useMutation(api.domain.transactions.deleteExpense);
  const deleteLoan = useMutation(api.domain.transactions.deleteLoan);

  const handleDelete = async () => {
    if (!confirm(`Delete ${itemType} "${itemLabel}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      if (itemType === "income") {
        await deleteIncome({ incomeId: itemId as Id<"incomes"> });
      } else if (itemType === "expense") {
        await deleteExpense({ expenseId: itemId as Id<"expenses"> });
      } else if (itemType === "loan") {
        await deleteLoan({ loanId: itemId as Id<"loans"> });
      }
      toast.success(`${itemType} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
      toast.error(`Failed to delete ${itemType}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-600/20 text-red-400 hover:text-red-300 transition-all"
      title={`Delete ${itemType}`}
    >
      {isDeleting ? (
        <div className="w-4 h-4 animate-spin border-2 border-red-400 border-t-transparent rounded-full" />
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
    </button>
  );
}
