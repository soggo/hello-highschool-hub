
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
    const response = await fetch('/.netlify/functions/announcements', {
      method: 'POST',
      body: JSON.stringify({ action, data }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Netlify function error:', errorText);
      throw new Error(`Failed to process announcement: ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error calling Netlify function:', error);
    throw error;
  }
};

export const addAnnouncement = async (announcement: Omit<Announcement, 'id' | 'created_at'>): Promise<Announcement> => {
  const result = await callNetlifyFunction('create', announcement);
  return result.data;
};

export const updateAnnouncement = async (announcement: Announcement): Promise<void> => {
  await callNetlifyFunction('update', announcement);
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  console.log('Deleting announcement with ID:', id);
  await callNetlifyFunction('delete', { id });
};
