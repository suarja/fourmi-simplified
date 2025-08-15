import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import { Id } from "../../../../convex/_generated/dataModel";
import { DashboardComponent, DEFAULT_COMPONENT_ORDER } from "../shared/types";

export function useComponentOrder(profileId: Id<"profiles">) {
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

  return {
    componentOrder,
    handleDragEnd,
  };
}