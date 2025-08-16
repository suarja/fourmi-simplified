

import { EmbedProvider, SchematicEmbed } from "@schematichq/schematic-components";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";

export const SchematicComponent = () => {
  const getAccessToken = useAction(api.schematic.getAccessToken);

  const [accessToken, setAccessToken] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAccessToken()
      .then((value) => {
        if (value.error) {
          setError(true);
          console.error("Schematic token error:", value.error);
        } else if (value.success && value.accessToken) {
          setAccessToken(value.accessToken);
          console.log("Schematic token received successfully");
        }
      })
      .catch((e) => {
        console.error("Failed to get Schematic token:", e);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getAccessToken]);

  const componentId = import.meta.env.VITE_SCHEMATIC_COMPONENT_ID;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-white">Loading billing portal...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-400 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">Unable to load billing portal</h3>
          <p className="text-gray-400">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-400">
          <h3 className="text-lg font-medium text-white mb-2">Billing portal unavailable</h3>
          <p>Access token not available. Please sign in again.</p>
        </div>
      </div>
    );
  }

  return (
    <EmbedProvider>
      <div className="bg-white rounded-xl overflow-hidden">
        <SchematicEmbed accessToken={accessToken} id={componentId} />
      </div>
    </EmbedProvider>
  );
};
