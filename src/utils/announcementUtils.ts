
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

// In a Netlify static site, when an admin adds a new announcement:
// 1. It will be displayed on the admin panel immediately
// 2. The admin will need to redeploy the site for the JSON file to be updated
// 3. Or set up a webhook that triggers a new build when changes are made
export const addAnnouncement = async (announcement: Omit<Announcement, 'id' | 'created_at'>): Promise<Announcement> => {
  const newAnnouncement = {
    ...announcement,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  
  // In production, this would:
  // 1. Submit to a Git-based CMS like Netlify CMS
  // 2. Or trigger a serverless function that commits to your repository
  // 3. Or use a webhook to trigger a rebuild with the new data
  console.log('Adding announcement:', newAnnouncement);
  console.log('To persist this change in production, you would need to:');
  console.log('- Use Netlify CMS to manage content');
  console.log('- Or set up a webhook to trigger a build when changes are made');
  console.log('- Or use Netlify Functions to update a Git repository');
  
  return newAnnouncement;
};

// Similar to addAnnouncement, this would need a strategy to persist changes
export const updateAnnouncement = async (announcement: Announcement): Promise<void> => {
  console.log('Updating announcement:', announcement);
  console.log('To persist this change in production, see addAnnouncement comments');
};

// Similar to addAnnouncement, this would need a strategy to persist changes
export const deleteAnnouncement = async (id: string): Promise<void> => {
  console.log('Deleting announcement:', id);
  console.log('To persist this change in production, see addAnnouncement comments');
};
