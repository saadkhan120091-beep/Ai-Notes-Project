import { createClient } from '@supabase/supabase-js';

// ====== PASTE YOUR SUPABASE CONFIGURATION HERE ======
// Replace these values with your actual Supabase Project URL and Anon Public Key
const SUPABASE_URL = "https://plnlvkujpwshqjxetvvm.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_HHmL0-Wetpycm3QcWeArfw_YWI-VdDm";
// ===================================================

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
