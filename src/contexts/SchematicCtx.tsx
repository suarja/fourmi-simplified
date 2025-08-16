import React, { createContext, useContext, useEffect } from "react";
import { useSchematicEvents } from "@schematichq/schematic-react";
import { useAuth, useUser } from "@clerk/clerk-react";

const SchematicCtx = createContext({});

export const SchematicContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { identify } = useSchematicEvents();

  const {isLoaded, isSignedIn, user}= useUser()

  useEffect(() => {
    if (!isLoaded || !user || !isSignedIn) return
    identify({
      company: {
        keys: { id: user.id, email: (user.primaryEmailAddress?.emailAddress) || "" },
      },
      keys: {"id": user.id},
      traits: {"authenticated": isSignedIn}
    });
  }, [identify, isLoaded, user, isSignedIn]);

  return (
    <SchematicCtx.Provider value={{}}>
      {children}
    </SchematicCtx.Provider>
  );
};

// Optional: custom hook for consuming the context
export const useSchematicCtx = () => useContext(SchematicCtx);
