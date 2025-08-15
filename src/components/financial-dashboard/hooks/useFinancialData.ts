import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export function useFinancialData(profileId: Id<"profiles">) {
  const financialData = useQuery(api.profiles.getFinancialData, { profileId });
  const monthlyBalance = useQuery(api.profiles.getMonthlyBalance, { profileId });
  const pendingFacts = useQuery(api.domain.facts.getPendingFacts, { profileId });

  return {
    financialData,
    monthlyBalance,
    pendingFacts,
    isLoading: financialData === undefined || monthlyBalance === undefined,
  };
}