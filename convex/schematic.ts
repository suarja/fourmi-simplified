import { action } from "./_generated/server";
import { SchematicClient } from "@schematichq/schematic-typescript-node";

const apiKey = process.env.SCHEMATIC_API_KEY;

export const getAccessToken = action({
  args: {},
  handler: async (ctx) => {
    try {
      // Get the authenticated user
      const identity = await ctx.auth.getUserIdentity();
      
      if (!identity) {
        throw new Error("Not authenticated");
      }
      
      if (!identity.email) {
        throw new Error("No email address found for user");
      }
      
      if (!apiKey) {
        throw new Error("SCHEMATIC_API_KEY not configured");
      }
      
      // Initialize Schematic client
      const schematicClient = new SchematicClient({ apiKey });
      
      // Issue temporary access token for the user
      const resp = await schematicClient.accesstokens.issueTemporaryAccessToken({
        lookup: {
          'email': identity.email,
        },
      });
      
      const accessToken = resp.data?.token;
      
      if (!accessToken) {
        throw new Error("Failed to generate access token");
      }
      
      return {
        success: true,
        accessToken,
        email: identity.email
      };
    } catch (error) {
      console.error("Error generating Schematic access token:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        accessToken: null
      };
    }
  },
});