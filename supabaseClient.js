import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const SUPABASE_URL = 'https://udpiihvoohushrkfnvqy.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkcGlpaHZvb2h1c2hya2ZudnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDEwNzUsImV4cCI6MjA5MTkxNzA3NX0.tes2oOyZFyMNVix2UxKCiJrEXmW8zsy5nL1fN-1H5dQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function debugSupabase() {
  console.log('Supabase client initialized', {
    url: SUPABASE_URL,
    anonKeyLength: SUPABASE_ANON_KEY.length,
    anonKeyPrefix: SUPABASE_ANON_KEY.slice(0, 4),
  });
}
