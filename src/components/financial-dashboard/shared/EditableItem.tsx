import { useState } from "react";
import { toast } from "sonner";

interface EditableItemProps<T> {
  item: T;
  onSave: (item: T, updates: Partial<T>) => Promise<void>;
  onDelete?: (item: T) => Promise<void>;
  renderView: (item: T, onEdit: () => void) => React.ReactNode;
  renderEdit: (item: T, onChange: (updates: Partial<T>) => void, onSave: () => void, onCancel: () => void) => React.ReactNode;
  canDelete?: boolean;
}

export function EditableItem<T extends { _id: string }>({
  item,
  onSave,
  onDelete,
  renderView,
  renderEdit,
  canDelete = true
}: EditableItemProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState<Partial<T>>({});

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({});
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(item, editData);
      setIsEditing(false);
      setEditData({});
      toast.success("Changes saved successfully");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    setIsLoading(true);
    try {
      await onDelete(item);
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (updates: Partial<T>) => {
    setEditData(prev => ({ ...prev, ...updates }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="group relative">
        {renderEdit(item, onChange, handleSave, handleCancel)}
      </div>
    );
  }

  return (
    <div className="group relative">
      {renderView(item, handleEdit)}
      {canDelete && onDelete && (
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-600/20 text-red-400 hover:text-red-300 transition-all"
          title="Delete item"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}