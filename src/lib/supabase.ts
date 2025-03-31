
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Books table types
export type Book = {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  coverUrl: string;
  fileUrl?: string;
  created_at: string;
  downloads?: number;
};
