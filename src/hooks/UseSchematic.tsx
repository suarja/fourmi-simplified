
import { useSchematicIsPending, useSchematicEntitlement, CheckFlagReturn } from "@schematichq/schematic-react";

type SchematicFeatureKey = "basic_kpis" | "advanced_tools" | "csv_export" | "live_export" | "projects"| "simulations" | "projects_pdf_export_basic" | "timeline_export"; 

type SchematicFeatureEntitlement = Pick<CheckFlagReturn, "featureAllocation" | "featureUsage" | "featureUsageExceeded" | "value">

type UseSchematicFeatureReturn = {
  isPending: boolean;
  entitlement: SchematicFeatureEntitlement;
};

export function useSchematicFeature<T extends SchematicFeatureKey>(
  featureKey: T
): UseSchematicFeatureReturn {
  const isPending = useSchematicIsPending();
  const {
    featureAllocation,
    featureUsage,
    featureUsageExceeded,
    value,
  } = useSchematicEntitlement(featureKey);

  return {
    isPending,
    entitlement: {
      featureAllocation,
      featureUsage,
      featureUsageExceeded,
      value,
    },
  };
}
