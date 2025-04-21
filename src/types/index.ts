
export interface Book {
  id: string;
  title: string;
  subject: string;
  grade: string;
  created_at: string;
  downloads?: number;
}

export interface Announcement {
  id?: string;
  title: string;
  description: string;
  date: string;
  category: string;
  created_at?: string;
}
