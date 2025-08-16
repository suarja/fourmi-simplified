import React, { createContext, useContext, useEffect } from "react";
import { useSchematicEvents } from "@schematichq/schematic-react";
import { useAuth } from "@clerk/clerk-react";

const SchematicCtx = createContext({});

export const SchematicContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { identify } = useSchematicEvents();
  const {
    userId,
    isLoaded,
    isSignedIn
  }= useAuth()

  useEffect(() => {
    if (!isLoaded || !userId || !isSignedIn) return
    identify({
      company: {
        keys: { id: userId },
      },
      keys: {"id": userId},
      traits: {"authenticated": isSignedIn}
    });
  }, [identify, isLoaded, userId, isSignedIn]);

  return (
    <SchematicCtx.Provider value={{}}>
      {children}
    </SchematicCtx.Provider>
  );
};

// Optional: custom hook for consuming the context
export const useSchematicCtx = () => useContext(SchematicCtx);
