import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Cliente para el frontend (respeta RLS)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Cliente para el servidor (bypasea RLS, solo usar en API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);