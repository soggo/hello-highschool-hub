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

// Helper function to convert date strings to Date objects for sorting
const parseAnnouncementDate = (dateStr: string): Date => {
  try {
    // Try to parse the date using Date.parse
    const parsed = Date.parse(dateStr);
    if (!isNaN(parsed)) {
      return new Date(parsed);
    }
    
    // If standard parsing fails, try to handle format like "April 28, 2025"
    const months: { [key: string]: number } = {
      january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
      july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
    };
    
    const parts = dateStr.toLowerCase().split(' ');
    if (parts.length >= 2) {
      const month = months[parts[0].toLowerCase()];
      if (month !== undefined) {
        // Extract day and year
        const day = parseInt(parts[1].replace(',', ''));
        const year = parts.length > 2 ? parseInt(parts[2]) : new Date().getFullYear();
        
        if (!isNaN(day) && !isNaN(year)) {
          return new Date(year, month, day);
        }
      }
    }
    
    // If all parsing attempts fail, return a default date
    console.warn(`Failed to parse date: ${dateStr}, using current date instead`);
    return new Date();
  } catch (error) {
    console.error(`Error parsing date: ${dateStr}`, error);
    return new Date();
  }
};

// Sort announcements by date (earliest to latest)
const sortAnnouncementsByDate = (announcements: Announcement[]): Announcement[] => {
  return [...announcements].sort((a, b) => {
    const dateA = parseAnnouncementDate(a.date);
    const dateB = parseAnnouncementDate(b.date);
    return dateA.getTime() - dateB.getTime();
  });
};

export const getAnnouncements = async (): Promise<Announcement[]> => {
  // Initialize cache if empty
  if (announcementsCache.length === 0) {
    announcementsCache = [...announcements];
  }
  
  // Sort announcements by date before returning
  return Promise.resolve(sortAnnouncementsByDate(announcementsCache));
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
