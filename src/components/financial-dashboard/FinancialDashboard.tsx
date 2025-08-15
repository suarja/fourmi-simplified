import { useQuery, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useState, useEffect } from "react";
import { PendingFactsCard } from "./PendingFactsCard";
import { DeleteButton } from "./DeleteButton";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';

interface FinancialDashboardProps {
  profileId: Id<"profiles">;
}

// Dashboard component types
type DashboardComponent = {
  id: string;
  type: 'balance' | 'insights' | 'income' | 'expenses' | 'loans';
  title: string;
  icon: string;
  visible: boolean;
};

// Default component order
const DEFAULT_COMPONENT_ORDER: DashboardComponent[] = [
  { id: 'balance', type: 'balance', title: 'Monthly Balance', icon: '📊', visible: true },
  { id: 'insights', type: 'insights', title: 'AI Insights', icon: '🤖', visible: true },
  { id: 'income', type: 'income', title: 'Income Sources', icon: '💰', visible: true },
  { id: 'expenses', type: 'expenses', title: 'Monthly Expenses', icon: '💸', visible: true },
  { id: 'loans', type: 'loans', title: 'Loans & Debt', icon: '🏦', visible: true },
];

// Sortable item wrapper component
function SortableItem({ 
  id, 
  children, 
  isDragOverlay = false 
}: { 
  id: string; 
  children: React.ReactNode;
  isDragOverlay?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative ${isDragOverlay ? '' : ''}`}
      {...attributes}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        className="absolute -left-2 top-4 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity z-10 p-1 rounded hover:bg-gray-700"
        title="Drag to reorder"
      >
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </div>
      {children}
    </div>
  );
}

export function FinancialDashboard({ profileId }: FinancialDashboardProps) {
  const financialData = useQuery(api.profiles.getFinancialData, { profileId });
  const monthlyBalance = useQuery(api.profiles.getMonthlyBalance, { profileId });
  const pendingFacts = useQuery(api.domain.facts.getPendingFacts, { profileId });
  const generateBudgetInsights = useAction(api.ai.generateBudgetInsights);
  
  const [insights, setInsights] = useState<string>("");
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [hasGeneratedInsights, setHasGeneratedInsights] = useState(false);
  
  // Component order state with localStorage persistence
  const [componentOrder, setComponentOrder] = useState<DashboardComponent[]>(() => {
    const saved = localStorage.getItem(`dashboard_order_${profileId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_COMPONENT_ORDER;
      }
    }
    return DEFAULT_COMPONENT_ORDER;
  });

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setComponentOrder((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Persist to localStorage
        localStorage.setItem(`dashboard_order_${profileId}`, JSON.stringify(newOrder));
        
        return newOrder;
      });
    }
  };

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

  // Component renderers
  const renderMonthlyBalance = () => (
    <div className={`rounded-lg p-4 sm:p-6 border ${
      monthlyBalance.isPositive 
        ? 'bg-green-900/20 border-green-700' 
        : 'bg-red-900/20 border-red-700'
    }`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h4 className="text-base sm:text-lg font-semibold text-white">Monthly Balance</h4>
        <span className={`text-xl sm:text-2xl ${monthlyBalance.isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {monthlyBalance.isPositive ? '📈' : '📉'}
        </span>
      </div>
      <div className={`text-2xl sm:text-3xl font-bold mb-2 ${
        monthlyBalance.isPositive ? 'text-green-400' : 'text-red-400'
      }`}>
        {formatCurrency(monthlyBalance.balance)}
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
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
  );

  const renderAIInsights = () => (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg sm:text-xl">🤖</span>
          <h4 className="text-base sm:text-lg font-semibold text-white">AI Insights</h4>
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
  );

  const renderIncomeCard = () => (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
      <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
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
  );

  const renderExpensesCard = () => (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
      <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
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
  );

  const renderLoansCard = () => (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
      <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
        <span className="text-orange-400">🏦</span>
        Loans & Debt
      </h4>
      <div className="space-y-4">
        {financialData.loans.map((loan) => (
          <div key={loan._id} className="border border-gray-600 rounded-lg p-3 sm:p-4">
            <div className="flex justify-between items-start mb-2">
              <h5 className="font-semibold text-white text-sm sm:text-base">{loan.name}</h5>
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
            <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
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
  );

  // Check if component should be rendered based on data availability
  const shouldRenderComponent = (type: DashboardComponent['type']) => {
    switch (type) {
      case 'balance':
        return true; // Always show balance
      case 'insights':
        return financialData.incomes.length > 0 || financialData.expenses.length > 0;
      case 'income':
        return financialData.incomes.length > 0;
      case 'expenses':
        return financialData.expenses.length > 0;
      case 'loans':
        return financialData.loans.length > 0;
      default:
        return false;
    }
  };

  // Render component based on type
  const renderComponent = (component: DashboardComponent) => {
    if (!shouldRenderComponent(component.type)) return null;

    switch (component.type) {
      case 'balance':
        return renderMonthlyBalance();
      case 'insights':
        return renderAIInsights();
      case 'income':
        return renderIncomeCard();
      case 'expenses':
        return renderExpensesCard();
      case 'loans':
        return renderLoansCard();
      default:
        return null;
    }
  };

  // Get components that should be displayed
  const visibleComponents = componentOrder.filter(comp => 
    comp.visible && shouldRenderComponent(comp.type)
  );

  return (
    <div className="h-full overflow-y-auto bg-gray-900">
      {/* Dashboard Header */}
      <div className="p-4 sm:p-6 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">Financial Dashboard</h3>
            <p className="text-sm sm:text-base text-gray-400">Real-time view of your budget • Drag cards to reorder</p>
          </div>
          <span className="text-2xl">⚡</span>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Pending Facts Card - Always first, not draggable */}
        {pendingFacts && pendingFacts.length > 0 && (
          <PendingFactsCard 
            facts={pendingFacts} 
            profileId={profileId}
          />
        )}

        {/* Draggable Dashboard Components */}
        {visibleComponents.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={visibleComponents.map(comp => comp.id)}
              strategy={verticalListSortingStrategy}
            >
              {visibleComponents.map((component) => (
                <SortableItem key={component.id} id={component.id}>
                  {renderComponent(component)}
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          /* Empty State */
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📊</div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
              No Financial Data Yet
            </h3>
            <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 px-4">
              Start chatting with Fourmi to add your income, expenses, and loans
            </p>
            <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700 text-left max-w-sm sm:max-w-md mx-auto">
              <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">Try saying:</h4>
              <ul className="text-xs sm:text-sm text-gray-300 space-y-1">
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

