
import announcements from '../data/announcements.json';

export type Announcement = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  created_at: string;
};

export const getAnnouncements = (): Promise<Announcement[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(announcements as Announcement[]);
    }, 300);
  });
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
    // For local immediate feedback, create a temporary version with a timestamp ID
    const tempId = Date.now().toString();
    const tempAnnouncement: Announcement = {
      ...announcement,
      id: tempId,
      created_at: new Date().toISOString()
    };
    
    // Call the API
    const result = await callNetlifyFunction('create', announcement);
    
    // Return the server version if available, otherwise the temp version
    return result.data || tempAnnouncement;
  } catch (error) {
    console.error('Error adding announcement:', error);
    throw error;
  }
};

export const updateAnnouncement = async (announcement: Announcement): Promise<Announcement> => {
  try {
    await callNetlifyFunction('update', announcement);
    return announcement;
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  try {
    console.log('Deleting announcement with ID:', id);
    await callNetlifyFunction('delete', { id });
    console.log('Announcement successfully deleted');
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
};
