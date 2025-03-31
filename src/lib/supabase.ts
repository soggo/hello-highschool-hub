
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://waximxjrumllmjbagnbp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndheGlteGpydW1sbG1qYmFnbmJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NTA2OTYsImV4cCI6MjA1OTAyNjY5Nn0.9-Y-V6bLsZNpt5FiiUY2eJUTDyI9UxGqz3Nd3mdKM00';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// Books table types
export type Book = {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  fileUrl?: string;
  created_at: string;
  downloads?: number;
};
