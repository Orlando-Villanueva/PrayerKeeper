import { createClient } from "@supabase/supabase-js";

// For Vite, environment variables are accessed through import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // Set site URL to ensure redirects work correctly
        site: appUrl
    }
});
