import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export // Delete button component
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