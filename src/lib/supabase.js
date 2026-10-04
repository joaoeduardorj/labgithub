// Cliente do Supabase, único para o app inteiro.
// A URL e a chave pública vêm do .env.local (na Vercel, das Environment Variables).
// Sem elas, `supabase` fica null e o app segue funcionando, só sem login.
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const chave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = url && chave ? createClient(url, chave) : null;
