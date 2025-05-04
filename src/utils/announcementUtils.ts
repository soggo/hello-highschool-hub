
import announcements from '../data/announcements.json';

export type Announcement = {
  id: string;
  title: string;
  description: string;
  date: string;
  created_at: string;
};

// Cache for optimistic updates
let announcementCache: Announcement[] = [];

// Helper function to parse dates into a Date object
const parseDate = (dateString: string): Date => {
  // Handle ISO format (should work automatically)
  // Handle formats like MM/DD/YYYY
  // Handle formats like MM-DD-YYYY
  if (/^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}$/.test(dateString)) {
    const parts = dateString.split(/[/-]/);
    // Assuming MM/DD/YYYY format
    const month = parseInt(parts[0]) - 1; // JS months are 0-indexed
    const day = parseInt(parts[1]);
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  }
  
  // Default: try to parse as is
  return new Date(dateString);
};

// Helper function to sort announcements by date
export const sortAnnouncementsByDate = (a: Announcement, b: Announcement): number => {
  const dateA = parseDate(a.date);
  const dateB = parseDate(b.date);
  
  // Sort from earliest to latest
  return dateA.getTime() - dateB.getTime();
};

// Get all announcements, sorted by date
export const getAnnouncements = async (): Promise<Announcement[]> => {
  // Initialize cache if empty
  if (announcementCache.length === 0) {
    announcementCache = [...announcements];
  }
  
  // Return a sorted copy
  return Promise.resolve([...announcementCache].sort(sortAnnouncementsByDate));
};

// Add a new announcement
export const addAnnouncement = async (announcement: Omit<Announcement, 'id' | 'created_at'>): Promise<Announcement> => {
  // In a real app, this would call an API
  // For now, we'll simulate this with our local cache
  
  // Create a new announcement with a unique ID
  const newAnnouncement: Announcement = {
    ...announcement,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  
  // Add to cache
  announcementCache = [...announcementCache, newAnnouncement];
  
  console.log('Added announcement:', newAnnouncement);
  
  // Return the new announcement object
  return Promise.resolve(newAnnouncement);
};

// Delete an announcement
export const deleteAnnouncement = async (id: string): Promise<void> => {
  // In a real app, this would call an API
  // For now, we'll simulate this with our local cache
  
  // Remove from cache
  announcementCache = announcementCache.filter(announcement => announcement.id !== id);
  
  console.log('Deleted announcement with ID:', id);
  
  // Return a resolved promise
  return Promise.resolve();
};
