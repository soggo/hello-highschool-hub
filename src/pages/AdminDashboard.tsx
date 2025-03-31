import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book as BookIcon, BookOpen, User, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase, Book } from "@/lib/supabase";
import FileUploadComponent from "@/components/FileUploadComponent";

// Mock data fallback
const mockBooks = [
  {
    id: 1,
    title: "Calculus Fundamentals",
    subject: "Mathematics",
    grade: "12",
    uploadedAt: "2023-10-15",
    downloads: 145
  },
  {
    id: 2,
    title: "English Literature Classics",
    subject: "English",
    grade: "11-12",
    uploadedAt: "2023-09-22",
    downloads: 97
  },
  {
    id: 3,
    title: "Biology: The Living World",
    subject: "Science",
    grade: "10",
    uploadedAt: "2023-11-05",
    downloads: 208
  },
  {
    id: 4,
    title: "World History: Modern Era",
    subject: "History",
    grade: "11",
    uploadedAt: "2024-01-12",
    downloads: 76
  },
  {
    id: 5,
    title: "Chemistry Essentials",
    subject: "Science",
    grade: "11",
    uploadedAt: "2024-02-03",
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch books from Supabase
  const { data: books = [], isLoading: isBooksLoading, refetch: refetchBooks } = useQuery({
    queryKey: ["admin-books"],
    queryFn: fetchBooksAdmin,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      // Try to get the session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email || "");
        setIsLoading(false);
        return;
      }
      
      // Fallback to local storage auth (for mock login)
      const authStatus = localStorage.getItem("isAuthenticated");
      const email = localStorage.getItem("userEmail");
      
      setIsAuthenticated(authStatus === "true");
      setUserEmail(email || "");
      setIsLoading(false);
      
      // Redirect if not authenticated
      if (authStatus !== "true" && !session) {
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
    
    // Clear local storage regardless
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteBook = async (id: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success("Book deleted successfully");
      refetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book");
    }
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
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span>{userEmail}</span>
            </div>
            
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Books</CardTitle>
              <CardDescription>Available in library</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BookIcon className="h-8 w-8 text-primary mr-4" />
                <span className="text-3xl font-bold">{books.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Downloads</CardTitle>
              <CardDescription>Past 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-primary mr-4" />
                <span className="text-3xl font-bold">
                  {books.reduce((sum, book) => sum + (book.downloads || 0), 0)}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-primary text-white">
            <CardContent className="pt-6">
              {/* Replace the old upload button with our new component */}
              <FileUploadComponent onUploadComplete={refetchBooks} />
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="books" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="books">Manage Books</TabsTrigger>
            <TabsTrigger value="students">User Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="books">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Book Library</CardTitle>
                  <div className="w-64">
                    <Input 
                      type="text" 
                      placeholder="Search books..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isBooksLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Uploaded</TableHead>
                        <TableHead>Downloads</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBooks.map((book) => (
                        <TableRow key={book.id}>
                          <TableCell className="font-medium">{book.title}</TableCell>
                          <TableCell>{book.subject}</TableCell>
                          <TableCell>{book.grade}</TableCell>
                          <TableCell>{new Date(book.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{book.downloads || 0}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">Edit</Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-500"
                                onClick={() => handleDeleteBook(book.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>User Analytics</CardTitle>
                <CardDescription>
                  Monitor user engagement and download statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center py-12 text-center text-gray-500">
                  <div>
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">Analytics Dashboard Coming Soon</p>
                    <p>This feature will be available in future updates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;