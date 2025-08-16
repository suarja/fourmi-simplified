import { useEffect, useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useSchematicToken() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const getSchematicToken = useAction(api.schematic.getAccessToken);
  
  useEffect(() => {
    async function fetchToken() {
      try {
        setLoading(true);
        const result = await getSchematicToken();
        
        if (result.success && result.accessToken) {
          setToken(result.accessToken);
          setError(null);
        } else {
          setError(result.error || "Failed to get access token");
          setToken(null);
        }
      } catch (err) {
        console.error("Error fetching Schematic token:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setToken(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchToken();
  }, [getSchematicToken]);
  
  return { token, loading, error };
}