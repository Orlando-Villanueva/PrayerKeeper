import { createClient } from "@supabase/supabase-js";

// Environment variables for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Get deployment URL (works for both Vercel production and preview deployments)
const siteUrl = import.meta.env.VITE_APP_URL || window.location.origin;

// Enable debug in non-production environments
const isProduction = import.meta.env.PROD && !window.location.hostname.includes('vercel.app');

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'implicit', // Use implicit flow for OAuth
        storage: localStorage,
        storageKey: 'supabase-auth',
        debug: !isProduction, // Enable debug in development
        site: siteUrl
    }
});
