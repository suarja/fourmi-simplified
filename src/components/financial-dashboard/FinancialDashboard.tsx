import { Id } from "../../../convex/_generated/dataModel";
import { useTranslation } from 'react-i18next';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';

// Components
import { PendingFactsCard } from "./PendingFactsCard";
import { BalanceCard } from "./cards/BalanceCard";
import { InsightsCard } from "./cards/InsightsCard";
import { IncomeCard } from "./cards/IncomeCard";
import { ExpensesCard } from "./cards/ExpensesCard";
import { LoansCard } from "./cards/LoansCard";
import { EmptyStateCard } from "./cards/EmptyStateCard";

// Hooks
import { useFinancialData } from "./hooks/useFinancialData";
import { useComponentOrder } from "./hooks/useComponentOrder";

// Types
import { DashboardComponent } from "./shared/types";

interface FinancialDashboardProps {
  profileId: Id<"profiles">;
}

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
      className={`group relative ${isDragOverlay ? 'shadow-glass-hover' : ''}`}
      {...attributes}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-60 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-all duration-200 z-10 p-2 rounded-lg hover:bg-glass-green/20 hover:shadow-financial"
        title="Drag to reorder"
      >
        <svg className="w-4 h-4 text-secondary-light hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 4a1 1 0 000 2h1a1 1 0 100-2H7zM7 8a1 1 0 000 2h1a1 1 0 100-2H7zM8 13a1 1 0 01-1-1 1 1 0 00-2 0 3 3 0 003 3h1a1 1 0 100-2H8zM12 4a1 1 0 000 2h1a1 1 0 100-2h-1zM12 8a1 1 0 000 2h1a1 1 0 100-2h-1zM13 12a1 1 0 10-2 0 1 1 0 00-1 1 3 3 0 003 3h1a1 1 0 100-2h-1a1 1 0 01-1-1z" />
        </svg>
      </div>
      {children}
    </div>
  );
}

export function FinancialDashboard({ profileId }: FinancialDashboardProps) {
  // Custom hooks for data and state management
  const { financialData, monthlyBalance, pendingFacts, isLoading } = useFinancialData(profileId);
  const { componentOrder, handleDragEnd } = useComponentOrder(profileId);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-background-primary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if component should be rendered based on data availability
  const shouldRenderComponent = (type: DashboardComponent['type']) => {
    if (!financialData) return false;
    
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
    if (!shouldRenderComponent(component.type) || !financialData || !monthlyBalance) return null;

    switch (component.type) {
      case 'balance':
        return <BalanceCard monthlyBalance={monthlyBalance} />;
      case 'insights':
        return <InsightsCard profileId={profileId} financialData={financialData} />;
      case 'income':
        return <IncomeCard incomes={financialData.incomes} />;
      case 'expenses':
        return <ExpensesCard expenses={financialData.expenses} />;
      case 'loans':
        return <LoansCard loans={financialData.loans} />;
      default:
        return null;
    }
  };

  // Get components that should be displayed
  const visibleComponents = componentOrder.filter(comp => 
    comp.visible && shouldRenderComponent(comp.type)
  );

  return (
    <div className="h-full overflow-y-auto bg-transparent">
      {/* Dashboard Header - Floating Island */}
      <div className="m-4 p-4 sm:p-5 bg-white/5 backdrop-blur-2xl rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Financial Dashboard</h3>
            <p className="text-sm text-white/60">Real-time view of your budget • Drag cards to reorder</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/80 to-primary-light/80 flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-bento">
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
          <EmptyStateCard />
        )}
      </div>
    </div>
  );
}

