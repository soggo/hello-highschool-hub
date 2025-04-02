
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://waximxjrumllmjbagnbp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndheGlteGpydW1sbG1qYmFnbmJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NTA2OTYsImV4cCI6MjA1OTAyNjY5Nn0.9-Y-V6bLsZNpt5FiiUY2eJUTDyI9UxGqz3Nd3mdKM00';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isAdmin = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  // This is a simplified check - in production, you should validate against a user role
  // For now, we'll consider any authenticated user an admin
  return !!session;
};

export type Book = {
  id: string;
  title: string;
  description?: string;
  subject: string;
  grade: string;
  created_at: string;
  downloads: number;
  fileUrl?: string;
};

export type Announcement = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  created_at: string;
};
