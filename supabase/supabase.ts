import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://uukudqrtanandyzcnsaz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1a3VkcXJ0YW5hbmR5emNuc2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMzEyMjcsImV4cCI6MjA2MzkwNzIyN30.wsfSq45_-wRfVKK9zL7Ipb--H_CnFnPJ-KOHv-TrAhc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
