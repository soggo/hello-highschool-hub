
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, getLocalAuthStatus } from "@/lib/supabase";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCards } from "@/components/admin/StatsCards";
import { BooksTable } from "@/components/admin/BooksTable";
import { AnnouncementsTable } from "@/components/admin/AnnouncementsTable";
import { 
  getAnnouncements, 
  addAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement,
} from "@/utils/announcementUtils";
import { fetchBooksAdmin } from "@/utils/bookUtils";
import type { Announcement } from "@/types";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch books from Supabase
  const { data: books = [], isLoading: isBooksLoading, refetch: refetchBooks } = useQuery({
    queryKey: ["admin-books"],
    queryFn: fetchBooksAdmin,
    enabled: isAuthenticated,
  });
  
  // Fetch announcements from JSON file
  const { data: announcements = [], isLoading: isAnnouncementsLoading, refetch: refetchAnnouncements } = useQuery({
    queryKey: ["admin-announcements"],
    queryFn: getAnnouncements,
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
      <AdminHeader userEmail={userEmail} />
      
      <main className="container mx-auto px-4 py-8">
        <StatsCards 
          books={books} 
          announcements={announcements} 
          refetchBooks={refetchBooks} 
        />
        
        <Tabs defaultValue="books" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="books">Manage Books</TabsTrigger>
            <TabsTrigger value="announcements">Manage Announcements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="books">
            <BooksTable 
              books={books} 
              refetchBooks={refetchBooks}
              isBooksLoading={isBooksLoading}
            />
          </TabsContent>
          
          <TabsContent value="announcements">
            <AnnouncementsTable 
              announcements={announcements}
              refetchAnnouncements={refetchAnnouncements}
              isAnnouncementsLoading={isAnnouncementsLoading}
              addAnnouncement={addAnnouncement}
              updateAnnouncement={updateAnnouncement}
              deleteAnnouncement={deleteAnnouncement}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;

// Add missing import for supabase
import { supabase } from "@/lib/supabase";
