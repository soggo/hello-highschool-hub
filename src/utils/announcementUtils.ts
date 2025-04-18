
import announcements from '../data/announcements.json';

export type Announcement = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  created_at: string;
};

// Get announcements from the JSON file
export const getAnnouncements = (): Promise<Announcement[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(announcements as Announcement[]);
    }, 300);
  });
};

// When an admin adds a new announcement through Netlify CMS:
// 1. The changes are committed to Git
// 2. This triggers a new build on Netlify
// 3. The new announcement appears after the build
export const addAnnouncement = async (announcement: Omit<Announcement, 'id' | 'created_at'>): Promise<Announcement> => {
  const newAnnouncement = {
    ...announcement,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  
  console.log('Adding announcement:', newAnnouncement);
  console.log('This change will be committed to Git through Netlify CMS');
  
  return newAnnouncement;
};

// Updates are handled through Netlify CMS and Git commits
export const updateAnnouncement = async (announcement: Announcement): Promise<void> => {
  console.log('Updating announcement:', announcement);
  console.log('This change will be committed to Git through Netlify CMS');
};

// Deletions are handled through Netlify CMS and Git commits
export const deleteAnnouncement = async (id: string): Promise<void> => {
  console.log('Deleting announcement:', id);
  console.log('This change will be committed to Git through Netlify CMS');
};

