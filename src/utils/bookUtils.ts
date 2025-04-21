
import { supabase, Book } from "@/lib/supabase";

// Mock data fallback
const mockBooks = [
  {
    id: "1",
    title: "Calculus Fundamentals",
    subject: "Mathematics",
    grade: "12",
    created_at: "2023-10-15T00:00:00Z",
    downloads: 145
  },
  {
    id: "2",
    title: "English Literature Classics",
    subject: "English",
    grade: "11-12",
    created_at: "2023-09-22T00:00:00Z",
    downloads: 97
  },
  {
    id: "3",
    title: "Biology: The Living World",
    subject: "Science",
    grade: "10",
    created_at: "2023-11-05T00:00:00Z",
    downloads: 208
  },
  {
    id: "4",
    title: "World History: Modern Era",
    subject: "History",
    grade: "11",
    created_at: "2024-01-12T00:00:00Z",
    downloads: 76
  },
  {
    id: "5",
    title: "Chemistry Essentials",
    subject: "Science",
    grade: "11",
    created_at: "2024-02-03T00:00:00Z",
    downloads: 119
  },
];

export const fetchBooksAdmin = async (): Promise<Book[]> => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching books for admin:', error);
    throw new Error(error.message);
  }
  
  // If no data is found, return the mock data for demonstration
  if (!data || data.length === 0) {
    console.log('No books found in Supabase for admin, using mock data');
    return mockBooks as unknown as Book[];
  }
  
  return data;
};
