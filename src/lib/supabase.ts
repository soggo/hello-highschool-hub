
import { createClient } from '@supabase/supabase-js';
import { Event } from '@/components/home/UpcomingEvents';

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

// Storage keys
export const STORAGE_KEYS = {
  ANNOUNCEMENTS: 'announcements',
  AUTH: 'dikor_auth'
};

// Function to get announcements from Supabase
export const getLocalAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const { data, error } = await supabase
      .from(STORAGE_KEYS.ANNOUNCEMENTS)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching announcements:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      // Create fallback announcements in Supabase if none exist
      const fallbackAnnouncements = [
        {
          "id": "1",
          "title": "Easter Break",
          "description": "School will close for Easter break on March 28th and resume on April 8th. Students are advised to complete their assignments before resumption.",
          "date": "March 28, 2025",
          "category": "Holiday",
          "created_at": new Date().toISOString()
        },
        {
          "id": "2",
          "title": "Second Term Interhouse Sports",
          "description": "The second term Interhouse Sports competition will take place on May 20th. All students should participate in their respective houses' training sessions.",
          "date": "May 20, 2025",
          "category": "Sports",
          "created_at": new Date().toISOString()
        },
        {
          "id": "3",
          "title": "Entrance Examination",
          "description": "The entrance examination for new students will be held on September 14th. Registration closes on September 10th at the school office.",
          "date": "September 14, 2025",
          "category": "Admissions",
          "created_at": new Date().toISOString()
        },
      ];
      
      // Initialize Supabase with fallback data
      const { error: insertError } = await supabase
        .from(STORAGE_KEYS.ANNOUNCEMENTS)
        .insert(fallbackAnnouncements);
      
      if (insertError) {
        console.error('Error creating fallback announcements:', insertError);
        return fallbackAnnouncements;
      }
      
      // Re-fetch data after initialization
      const { data: newData } = await supabase
        .from(STORAGE_KEYS.ANNOUNCEMENTS)
        .select('*')
        .order('created_at', { ascending: false });
      
      return newData || fallbackAnnouncements;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getLocalAnnouncements:', error);
    
    // Return fallback data if Supabase fails
    return [
      {
        "id": "1",
        "title": "Easter Break",
        "description": "School will close for Easter break on March 28th and resume on April 8th. Students are advised to complete their assignments before resumption.",
        "date": "March 28, 2025",
        "category": "Holiday",
        "created_at": new Date().toISOString()
      },
      {
        "id": "2",
        "title": "Second Term Interhouse Sports",
        "description": "The second term Interhouse Sports competition will take place on May 20th. All students should participate in their respective houses' training sessions.",
        "date": "May 20, 2025",
        "category": "Sports",
        "created_at": new Date().toISOString()
      },
      {
        "id": "3",
        "title": "Entrance Examination",
        "description": "The entrance examination for new students will be held on September 14th. Registration closes on September 10th at the school office.",
        "date": "September 14, 2025",
        "category": "Admissions",
        "created_at": new Date().toISOString()
      },
    ];
  }
};

// Function to add a new announcement to Supabase
export const addLocalAnnouncement = async (announcement: Omit<Announcement, 'id' | 'created_at'>): Promise<Announcement> => {
  const newAnnouncement: Announcement = {
    ...announcement,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from(STORAGE_KEYS.ANNOUNCEMENTS)
    .insert([newAnnouncement])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding announcement:', error);
    throw error;
  }
  
  return data || newAnnouncement;
};

// Function to update an announcement in Supabase
export const updateLocalAnnouncement = async (announcement: Announcement): Promise<void> => {
  const { error } = await supabase
    .from(STORAGE_KEYS.ANNOUNCEMENTS)
    .update(announcement)
    .eq('id', announcement.id);
  
  if (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
};

// Function to delete an announcement from Supabase
export const deleteLocalAnnouncement = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from(STORAGE_KEYS.ANNOUNCEMENTS)
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
};

// Auth functions using local storage instead of Supabase
export const loginLocalUser = (email: string, password: string): boolean => {
  // Simple mock login functionality
  if (email.endsWith("@school.edu") && password === "password") {
    const authData = { email, isAuthenticated: true };
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
    return true;
  }
  return false;
};

export const logoutLocalUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
};

export const getLocalAuthStatus = (): { isAuthenticated: boolean, email: string | null } => {
  const authData = localStorage.getItem(STORAGE_KEYS.AUTH);
  if (authData) {
    return JSON.parse(authData);
  }
  return { isAuthenticated: false, email: null };
};
