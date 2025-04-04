
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

export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  created_at: string;
};

// Local storage keys
export const STORAGE_KEYS = {
  ANNOUNCEMENTS: 'dikor_announcements',
  EVENTS: 'dikor_events',
  AUTH: 'dikor_auth'
};

// Function to get announcements from localStorage
export const getLocalAnnouncements = (): Announcement[] => {
  const storedAnnouncements = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
  if (storedAnnouncements) {
    return JSON.parse(storedAnnouncements);
  }
  
  // Fallback data in case localStorage is empty
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
  
  // Initialize localStorage with fallback data
  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(fallbackAnnouncements));
  
  return fallbackAnnouncements;
};

// Function to get events from localStorage
export const getLocalEvents = (): Event[] => {
  const storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
  if (storedEvents) {
    return JSON.parse(storedEvents);
  }
  
  // Fallback data in case localStorage is empty
  const fallbackEvents = [
    {
      "id": "1",
      "title": "Back to School Night",
      "date": "April 15, 2025",
      "time": "6:00 PM - 8:00 PM",
      "location": "Main Auditorium",
      "category": "School Event",
      "created_at": new Date().toISOString()
    },
    {
      "id": "2",
      "title": "Varsity Football vs. Westside High",
      "date": "April 22, 2025",
      "time": "7:00 PM",
      "location": "Home Field",
      "category": "Athletics",
      "created_at": new Date().toISOString()
    },
    {
      "id": "3",
      "title": "Fall Arts Festival",
      "date": "May 5, 2025",
      "time": "10:00 AM - 4:00 PM",
      "location": "Student Center",
      "category": "Arts",
      "created_at": new Date().toISOString()
    },
    {
      "id": "4",
      "title": "College Fair",
      "date": "May 15, 2025",
      "time": "1:00 PM - 5:00 PM",
      "location": "Gymnasium",
      "category": "College Prep",
      "created_at": new Date().toISOString()
    },
  ];
  
  // Initialize localStorage with fallback data
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(fallbackEvents));
  
  return fallbackEvents;
};

// Function to save announcements to localStorage
export const saveLocalAnnouncements = (announcements: Announcement[]): void => {
  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
};

// Function to save events to localStorage
export const saveLocalEvents = (events: Event[]): void => {
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
};

// Function to add a new announcement to localStorage
export const addLocalAnnouncement = (announcement: Omit<Announcement, 'id' | 'created_at'>): Announcement => {
  const announcements = getLocalAnnouncements();
  
  const newAnnouncement: Announcement = {
    ...announcement,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  
  announcements.push(newAnnouncement);
  saveLocalAnnouncements(announcements);
  
  return newAnnouncement;
};

// Function to add a new event to localStorage
export const addLocalEvent = (event: Omit<Event, 'id' | 'created_at'>): Event => {
  const events = getLocalEvents();
  
  const newEvent: Event = {
    ...event,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  
  events.push(newEvent);
  saveLocalEvents(events);
  
  return newEvent;
};

// Function to update an announcement in localStorage
export const updateLocalAnnouncement = (announcement: Announcement): void => {
  const announcements = getLocalAnnouncements();
  const index = announcements.findIndex(a => a.id === announcement.id);
  
  if (index !== -1) {
    announcements[index] = announcement;
    saveLocalAnnouncements(announcements);
  }
};

// Function to update an event in localStorage
export const updateLocalEvent = (event: Event): void => {
  const events = getLocalEvents();
  const index = events.findIndex(e => e.id === event.id);
  
  if (index !== -1) {
    events[index] = event;
    saveLocalEvents(events);
  }
};

// Function to delete an announcement from localStorage
export const deleteLocalAnnouncement = (id: string): void => {
  const announcements = getLocalAnnouncements();
  const updatedAnnouncements = announcements.filter(a => a.id !== id);
  saveLocalAnnouncements(updatedAnnouncements);
};

// Function to delete an event from localStorage
export const deleteLocalEvent = (id: string): void => {
  const events = getLocalEvents();
  const updatedEvents = events.filter(e => e.id !== id);
  saveLocalEvents(updatedEvents);
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
