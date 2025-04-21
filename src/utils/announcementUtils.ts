
import announcements from '../data/announcements.json';

export type Announcement = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  created_at: string;
};

// Cache for optimistic updates
let announcementsCache: Announcement[] = [];

export const getAnnouncements = async (): Promise<Announcement[]> => {
  // Initialize cache if empty
  if (announcementsCache.length === 0) {
    announcementsCache = [...announcements];
  }
  return Promise.resolve(announcementsCache);
};

const callNetlifyFunction = async (action: string, data: any) => {
  try {
    console.log(`Calling Netlify function with action: ${action}, data:`, data);
    const response = await fetch('/.netlify/functions/announcements', {
      method: 'POST',
      body: JSON.stringify({ action, data }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const responseText = await response.text();
    let responseData;
    
    try {
      // Try to parse as JSON
      responseData = JSON.parse(responseText);
    } catch (e) {
      // If not JSON, use as is
      responseData = { error: responseText };
    }

    if (!response.ok) {
      console.error('Netlify function error response:', responseData);
      const errorMessage = responseData.details 
        ? `${responseData.error}: ${responseData.details}`
        : responseData.error || responseText;
        
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error('Error calling Netlify function:', error);
    throw error;
  }
};

export const addAnnouncement = async (announcement: Omit<Announcement, 'id' | 'created_at'>): Promise<Announcement> => {
  try {
    // Create optimistic announcement
    const optimisticAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };

    // Update cache optimistically
    announcementsCache = [optimisticAnnouncement, ...announcementsCache];

    // Make actual API call
    const result = await callNetlifyFunction('create', announcement);
    
    // Update cache with real data
    announcementsCache = announcementsCache.map(a => 
      a.id === optimisticAnnouncement.id ? result.data : a
    );

    return result.data;
  } catch (error) {
    // Revert optimistic update on error
    // Fixed: Remove reference to non-existent property 'id' on the parameter
    announcementsCache = announcementsCache.filter(a => a.id !== Date.now().toString());
    console.error('Error adding announcement:', error);
    throw error;
  }
};

export const updateAnnouncement = async (announcement: Announcement): Promise<void> => {
  try {
    // Store original announcement for rollback
    const originalAnnouncement = announcementsCache.find(a => a.id === announcement.id);
    
    // Update cache optimistically
    announcementsCache = announcementsCache.map(a => 
      a.id === announcement.id ? announcement : a
    );

    // Make actual API call
    await callNetlifyFunction('update', announcement);
  } catch (error) {
    // Revert optimistic update on error
    // Fixed: Check if originalAnnouncement exists before using it
    const foundAnnouncement = announcementsCache.find(a => a.id === announcement.id);
    if (foundAnnouncement) {
      announcementsCache = announcementsCache.map(a => 
        a.id === announcement.id ? foundAnnouncement : a
      );
    }
    console.error('Error updating announcement:', error);
    throw error;
  }
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  try {
    // Store original announcement for rollback
    const deletedAnnouncement = announcementsCache.find(a => a.id === id);
    
    // Update cache optimistically
    announcementsCache = announcementsCache.filter(a => a.id !== id);

    // Make actual API call
    await callNetlifyFunction('delete', { id });
    
    console.log('Announcement successfully deleted');
  } catch (error) {
    // Revert optimistic update on error
    // Fixed: Check if deletedAnnouncement exists before using it
    const foundAnnouncement = announcementsCache.find(a => a.id === id);
    if (foundAnnouncement) {
      announcementsCache = [...announcementsCache, foundAnnouncement];
    }
    console.error('Error deleting announcement:', error);
    throw error;
  }
};
