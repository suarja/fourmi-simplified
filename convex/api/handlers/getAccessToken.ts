import { httpAction } from "../../_generated/server";
import { SchematicClient } from "@schematichq/schematic-typescript-node";

const apiKey = process.env.SCHEMATIC_API_KEY;

export const getAccessToken = httpAction(async (ctx, request) => {
    const schematicClient = new SchematicClient({ apiKey });
    
    // CORS headers - match the OPTIONS handler
    const corsHeaders = {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
        "Vary": "origin",
    };
    
    const { auth } = ctx;
    
    async function getUser() {
        try {
            return await auth.getUserIdentity();
        } catch(e) {
            console.log("Auth error:", e);
            return null;
        }
    }
    
    const user = await getUser();
    
    console.log({ user });
    
    if (!user) {
        console.log("No authenticated user");
        return new Response(JSON.stringify({ success: false, error: "Not authenticated" }), {
            status: 401,
            headers: { "Content-Type": "application/json", ...corsHeaders }
        });
    }
    
    if (!user.email) {
        console.log("No email address found");
        return new Response(JSON.stringify({ success: false, error: "No email address" }), {
            status: 401,
            headers: { "Content-Type": "application/json", ...corsHeaders }
        });
    }
    
    try {
        const resp = await schematicClient.accesstokens.issueTemporaryAccessToken({
            lookup: {
                'email': user.email,
            },
        });
        
        // Fix: Use actual token value, not string
        const accessToken = resp.data?.token;
        
        if (!accessToken) {
            console.log("Failed to get access token from Schematic");
            return new Response(JSON.stringify({ success: false, error: "Failed to generate token" }), {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        }
        
        return new Response(JSON.stringify({ success: true, accessToken }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders }
        });
    } catch (error) {
        console.error("Schematic API error:", error);
        return new Response(JSON.stringify({ success: false, error: "API error" }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
        });
    }
});