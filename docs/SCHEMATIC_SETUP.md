# Schematic Integration Setup

## Current Status ✅
The Schematic integration is working with basic feature flags using the publishable key.

## What's Working
- ✅ SchematicProvider is properly configured
- ✅ Feature flags work with `useSchematicFlag("flag_name")`
- ✅ No CORS issues (using publishable key only)
- ✅ Basic Schematic functionality available

## Advanced Setup (Optional)
For advanced features that require user-specific access tokens, you'll need a secret key.

## How to Fix

1. **Get your Schematic Secret Key:**
   - Go to [Schematic Dashboard](https://app.schematichq.com)
   - Navigate to Settings → API Keys
   - Generate or copy your **Secret Key** (NOT the publishable key)
   - Secret keys are longer and more secure than publishable keys

2. **Update the Convex environment variable:**
   ```bash
   npx convex env set SCHEMATIC_API_KEY "your-secret-key-here"
   ```

3. **Restart the dev server:**
   ```bash
   npm run dev
   ```

## How It Works

1. **Authentication Flow:**
   - User logs in via Clerk
   - `SchematicWrapper` component calls the `schematic.getAccessToken` Convex action
   - The action uses the user's email to generate a temporary access token
   - The token is passed to `SchematicProvider` for feature flag access

2. **Feature Flags:**
   - Use `useSchematicFlag("flag_name")` hook in components
   - Flags control feature visibility based on user's plan/subscription

## Files Involved

- `/convex/schematic.ts` - Convex action for generating access tokens
- `/src/providers/Providers.tsx` - SchematicWrapper component
- `/src/hooks/useSchematicToken.ts` - Custom hook for token management (optional)

## Environment Variables

- `SCHEMATIC_API_KEY` - Secret key for server-side API calls (Convex)
- `VITE_SCHEMATIC_PUBLISHABLE_KEY` - Publishable key for client-side SDK

## Testing

Once the secret key is set up, you should see:
1. Console log: "Schematic token result: {success: true, accessToken: '...', email: '...'}"
2. Feature flags should work correctly with `useSchematicFlag()`