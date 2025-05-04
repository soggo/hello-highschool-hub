
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  supabase, 
  Book,
  getLocalAuthStatus,
  logoutLocalUser
} from "@/lib/supabase";
import { 
  getAnnouncements, 
  Announcement
} from "@/utils/announcementUtils";
import { getGalleryImages, GalleryImage } from "@/utils/galleryUtils";

// Admin components
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSummaryCards from "@/components/admin/AdminSummaryCards";
import AdminBooksPanel from "@/components/admin/AdminBooksPanel";
import AdminAnnouncementsPanel from "@/components/admin/AdminAnnouncementsPanel";
import AdminGalleryPanel from "@/components/admin/AdminGalleryPanel";

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

const fetchBooksAdmin = async (): Promise<Book[]> => {
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

const fetchAnnouncements = async (): Promise<Announcement[]> => {
  // Using our new function to get announcements from JSON
  return getAnnouncements();
};

const fetchGalleryImages = async (): Promise<GalleryImage[]> => {
  return getGalleryImages();
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [booksSearchTerm, setBooksSearchTerm] = useState("");
  const [announcementSearchTerm, setAnnouncementSearchTerm] = useState("");

  // Fetch books from Supabase
  const { data: books = [], isLoading: isBooksLoading, refetch: refetchBooks } = useQuery({
    queryKey: ["admin-books"],
    queryFn: fetchBooksAdmin,
    enabled: isAuthenticated,
  });
  
  // Fetch announcements from JSON file
  const { data: announcements = [], isLoading: isAnnouncementsLoading, refetch: refetchAnnouncements } = useQuery({
    queryKey: ["admin-announcements"],
    queryFn: fetchAnnouncements,
    enabled: isAuthenticated,
  });

  // Fetch gallery images
  const { data: galleryImages = [], isLoading: isGalleryLoading, refetch: refetchGallery } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: fetchGalleryImages,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    // Check authentication status using local storage
    const checkAuth = async () => {
      const { isAuthenticated: authStatus, email } = getLocalAuthStatus();
      
      // Check Supabase as a fallback
      if (!authStatus) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email || "");
          setIsLoading(false);
          return;
        }
      }
      
      setIsAuthenticated(authStatus);
      setUserEmail(email || "");
      setIsLoading(false);
      
      // Redirect if not authenticated
      if (!authStatus) {
        toast.error("Please log in to access the admin dashboard");
        navigate("/login");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Try to sign out from Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Supabase logout error:", error);
    }
    
    // Clear local storage
    logoutLocalUser();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via the useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <AdminHeader userEmail={userEmail} handleLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <AdminSummaryCards 
          booksCount={books.length}
          announcementsCount={announcements.length}
          galleryCount={galleryImages.length}
          refetchBooks={refetchBooks}
        />
        
        {/* Main Tabs */}
        <Tabs defaultValue="books" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="books">Manage Books</TabsTrigger>
            <TabsTrigger value="announcements">Manage Announcements</TabsTrigger>
            <TabsTrigger value="gallery">Manage Gallery</TabsTrigger>
          </TabsList>
          
          {/* Books Tab */}
          <TabsContent value="books">
            <AdminBooksPanel
              books={books}
              isLoading={isBooksLoading}
              searchTerm={booksSearchTerm}
              setSearchTerm={setBooksSearchTerm}
              refetchBooks={refetchBooks}
            />
          </TabsContent>
          
          {/* Announcements Tab */}
          <TabsContent value="announcements">
            <AdminAnnouncementsPanel 
              announcements={announcements}
              isLoading={isAnnouncementsLoading}
              searchTerm={announcementSearchTerm}
              setSearchTerm={setAnnouncementSearchTerm}
              refetchAnnouncements={refetchAnnouncements}
            />
          </TabsContent>
          
          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <AdminGalleryPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
