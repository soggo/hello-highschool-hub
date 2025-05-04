
import galleryImages from '../data/gallery.json';

export type GalleryImage = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  created_at: string;
};

// Cache for optimistic updates
let galleryCache: GalleryImage[] = [];

// Get all gallery images
export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  // Initialize cache if empty
  if (galleryCache.length === 0) {
    galleryCache = [...galleryImages];
  }
  
  return Promise.resolve(galleryCache);
};

// Helper function to call Netlify function
const callNetlifyFunction = async (action: string, data: any) => {
  try {
    console.log(`Calling Netlify function with action: ${action}, data:`, data);
    const response = await fetch('/.netlify/functions/gallery', {
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

// Upload an image file and get back the path
export const uploadGalleryImage = async (file: File): Promise<{path: string}> => {
  try {
    console.log('Uploading file:', file.name, 'size:', file.size);
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'gallery'); // Specify folder in public directory
    
    // Call Netlify function to upload the file
    const response = await fetch('/.netlify/functions/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload error response:', errorText);
      throw new Error(errorText || 'Failed to upload image');
    }
    
    const result = await response.json();
    console.log('Upload result:', result);
    return { path: result.path };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Add a new gallery image
export const addGalleryImage = async (image: Omit<GalleryImage, 'id' | 'created_at'>): Promise<GalleryImage> => {
  try {
    // Create optimistic image
    const optimisticImage: GalleryImage = {
      ...image,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };

    // Update cache optimistically
    galleryCache = [optimisticImage, ...galleryCache];

    // Make actual API call
    const result = await callNetlifyFunction('create', image);
    
    // Update cache with real data
    galleryCache = galleryCache.map(img => 
      img.id === optimisticImage.id ? result.data : img
    );

    return result.data;
  } catch (error) {
    // Revert optimistic update on error
    galleryCache = galleryCache.filter(img => img.id !== Date.now().toString());
    console.error('Error adding gallery image:', error);
    throw error;
  }
};

// Delete a gallery image
export const deleteGalleryImage = async (id: string): Promise<void> => {
  try {
    // Store original image for rollback
    const deletedImage = galleryCache.find(img => img.id === id);
    
    // Update cache optimistically
    galleryCache = galleryCache.filter(img => img.id !== id);

    // Make actual API call
    await callNetlifyFunction('delete', { id });
    
    console.log('Gallery image successfully deleted');
  } catch (error) {
    // Revert optimistic update on error
    if (galleryCache.find(img => img.id === id) === undefined) {
      const deletedImage = galleryImages.find(img => img.id === id);
      if (deletedImage) {
        galleryCache = [...galleryCache, deletedImage];
      }
    }
    console.error('Error deleting gallery image:', error);
    throw error;
  }
};
