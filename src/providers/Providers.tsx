import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { SchematicProvider } from "@schematichq/schematic-react";

interface ProvidersProps {
    children: ReactNode;
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

export function Providers({ children }: ProvidersProps) {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <SchematicProvider publishableKey={import.meta.env.VITE_SCHEMATIC_PUBLISHABLE_KEY}>
          {children}
        </SchematicProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}