import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to get the current user's access token
export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

// Helper to set the access token
export const setAccessToken = (token: string) => {
  localStorage.setItem("access_token", token);
};

// Helper to clear the access token (logout)
export const clearAccessToken = () => {
  localStorage.removeItem("access_token");
};
