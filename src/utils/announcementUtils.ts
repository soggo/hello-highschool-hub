
import announcements from '../data/announcements.json';

export type Announcement = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  created_at: string;
};

// This is a mock function as we can't directly write to JSON files in browser
// In a real app, this would be handled by a server-side API
export const getAnnouncements = (): Promise<Announcement[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(announcements as Announcement[]);
    }, 300);
  });
};

// Mock function for adding announcements
// In real implementation, this would call a backend API
export const addAnnouncement = async (announcement: Omit<Announcement, 'id' | 'created_at'>): Promise<Announcement> => {
  const newAnnouncement = {
    ...announcement,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  
  // In a real application, this would call a backend API to update the JSON file
  console.log('Adding announcement (mock):', newAnnouncement);
  
  // Return the announcement as if it was saved
  return newAnnouncement;
};

// Mock function for updating announcements
export const updateAnnouncement = async (announcement: Announcement): Promise<void> => {
  // In a real application, this would call a backend API to update the JSON file
  console.log('Updating announcement (mock):', announcement);
};

// Mock function for deleting announcements
export const deleteAnnouncement = async (id: string): Promise<void> => {
  // In a real application, this would call a backend API to update the JSON file
  console.log('Deleting announcement (mock):', id);
};
