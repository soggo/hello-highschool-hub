import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book as BookIcon, User, LogOut, BellRing } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { 
  supabase, 
  Book,
  getLocalAuthStatus,
  logoutLocalUser
} from "@/lib/supabase";
import FileUploadComponent from "@/components/FileUploadComponent";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  getAnnouncements, 
  addAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement,
  Announcement
} from "@/utils/announcementUtils";

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
  return getAnnouncements();
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [announcementSearchTerm, setAnnouncementSearchTerm] = useState("");
  
  // Local state to manage optimistic updates
  const [localAnnouncements, setLocalAnnouncements] = useState<Announcement[]>([]);
  const [isManuallyRefreshing, setIsManuallyRefreshing] = useState(false);
  
  // New announcement form state
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    description: "",
    date: "",
    category: "General"
  });
  
  // Edit announcement state
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  // Add state to track loading states for individual announcements
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});

  // Fetch books from Supabase
  const { data: books = [], isLoading: isBooksLoading, refetch: refetchBooks } = useQuery({
    queryKey: ["admin-books"],
    queryFn: fetchBooksAdmin,
    enabled: isAuthenticated,
  });
  
  // Fetch announcements from JSON file
  const { 
    data: announcements = [], 
    isLoading: isAnnouncementsLoading, 
    refetch: refetchAnnouncements,
    isFetching: isAnnouncementsFetching
  } = useQuery({
    queryKey: ["admin-announcements"],
    queryFn: fetchAnnouncements,
    enabled: isAuthenticated,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  // Initialize local announcements when server data arrives
  useEffect(() => {
    if (announcements.length > 0 && !isAnnouncementsFetching) {
      setLocalAnnouncements(announcements);
    }
  }, [announcements, isAnnouncementsFetching]);

  // Manual refresh function with loading indicator
  const handleRefreshAnnouncements = async () => {
    setIsManuallyRefreshing(true);
    await refetchAnnouncements();
    setIsManuallyRefreshing(false);
    toast.success("Announcements refreshed");
  };

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

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredAnnouncements = announcements.filter(announcement => 
    announcement.title.toLowerCase().includes(announcementSearchTerm.toLowerCase()) ||
    announcement.category.toLowerCase().includes(announcementSearchTerm.toLowerCase()) ||
    announcement.description.toLowerCase().includes(announcementSearchTerm.toLowerCase())
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
  
  const handleAddAnnouncement = async () => {
    try {
      if (!newAnnouncement.title || !newAnnouncement.description || !newAnnouncement.date) {
        toast.error("Please fill all required fields");
        return;
      }
      
      // Show loading toast
      toast.loading("Adding announcement...");
      
      // Add announcement using our function
      const newItem = await addAnnouncement({
        title: newAnnouncement.title,
        description: newAnnouncement.description,
        date: newAnnouncement.date,
        category: newAnnouncement.category
      });
      
      // Optimistically update local state
      setLocalAnnouncements(prev => [newItem, ...prev]);
      
      // Reset form
      setNewAnnouncement({
        title: "",
        description: "",
        date: "",
        category: "General"
      });
      
      // Clear loading toast and show success
      toast.dismiss();
      toast.success("Announcement added successfully");
      
      // Refresh in the background
      refetchAnnouncements();
    } catch (error) {
      toast.dismiss();
      console.error("Error adding announcement:", error);
      toast.error(`Failed to add announcement: ${error.message}`);
    }
  };
  
  const handleUpdateAnnouncement = async () => {
    if (!editingAnnouncement) return;
    
    try {
      // Set loading state for this announcement
      setLoadingStates(prev => ({ ...prev, [editingAnnouncement.id]: true }));
      
      // Show loading toast
      toast.loading("Updating announcement...");
      
      // Update announcement using our function
      await updateAnnouncement(editingAnnouncement);
      
      // Optimistically update local state
      setLocalAnnouncements(prev => 
        prev.map(item => item.id === editingAnnouncement.id ? editingAnnouncement : item)
      );
      
      // Clear loading states and dialog
      setLoadingStates(prev => ({ ...prev, [editingAnnouncement.id]: false }));
      setEditingAnnouncement(null);
      
      // Clear loading toast and show success
      toast.dismiss();
      toast.success("Announcement updated successfully");
      
      // Refresh in the background
      refetchAnnouncements();
    } catch (error) {
      // Clear loading state on error
      setLoadingStates(prev => ({ ...prev, [editingAnnouncement.id]: false }));
      
      toast.dismiss();
      console.error("Error updating announcement:", error);
      toast.error(`Failed to update announcement: ${error.message}`);
    }
  };
  
  const handleDeleteAnnouncement = async (id: string) => {
    try {
      // Set loading state for this announcement
      setLoadingStates(prev => ({ ...prev, [id]: true }));
      
      // Optimistically remove from local state
      setLocalAnnouncements(prev => prev.filter(item => item.id !== id));
      
      // Show loading toast
      toast.loading('Deleting announcement...');
      
      // Delete announcement using our function
      await deleteAnnouncement(id);
      
      // Clear loading state
      setLoadingStates(prev => ({ ...prev, [id]: false }));
      
      // Dismiss loading toast and show success
      toast.dismiss();
      toast.success("Announcement deleted successfully");
      
      // Refresh in the background
      refetchAnnouncements();
    } catch (error) {
      // Restore the item in case of error
      refetchAnnouncements();
      
      // Clear loading state on error
      setLoadingStates(prev => ({ ...prev, [id]: false }));
      
      toast.dismiss();
      console.error("Error deleting announcement:", error);
      toast.error(`Failed to delete announcement: ${error.message}`);
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
            <BookIcon className="h-6 w-6 text-primary" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
              <CardTitle className="text-lg font-medium">Announcements</CardTitle>
              <CardDescription>School updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BellRing className="h-8 w-8 text-primary mr-4" />
                <span className="text-3xl font-bold">{localAnnouncements.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-primary text-white md:col-span-2">
            <CardContent className="pt-6">
              <FileUploadComponent onUploadComplete={refetchBooks} />
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="books" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="books">Manage Books</TabsTrigger>
            <TabsTrigger value="announcements">Manage Announcements</TabsTrigger>
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
          
          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <CardTitle>Manage Announcements</CardTitle>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-64">
                      <Input 
                        type="text" 
                        placeholder="Search..." 
                        value={announcementSearchTerm}
                        onChange={(e) => setAnnouncementSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleRefreshAnnouncements}
                        disabled={isManuallyRefreshing || isAnnouncementsFetching}
                      >
                        {(isManuallyRefreshing || isAnnouncementsFetching) && (
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        )}
                        Refresh
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            Add Announcement
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Announcement</DialogTitle>
                            <DialogDescription>
                              Create a new announcement to be displayed on the school website.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="title">Title</Label>
                              <Input
                                id="title"
                                placeholder="Enter announcement title"
                                value={newAnnouncement.title}
                                onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                              />
                            </div>
                            
                            <div className="grid gap-2">
                              <Label htmlFor="date">Date</Label>
                              <Input
                                id="date"
                                placeholder="e.g., March 28, 2025"
                                value={newAnnouncement.date}
                                onChange={(e) => setNewAnnouncement({...newAnnouncement, date: e.target.value})}
                              />
                            </div>
                            
                            <div className="grid gap-2">
                              <Label htmlFor="category">Category</Label>
                              <Select
                                value={newAnnouncement.category}
                                onValueChange={(value) => setNewAnnouncement({...newAnnouncement, category: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="General">General</SelectItem>
                                  <SelectItem value="Academic">Academic</SelectItem>
                                  <SelectItem value="Sports">Sports</SelectItem>
                                  <SelectItem value="Holiday">Holiday</SelectItem>
                                  <SelectItem value="Admissions">Admissions</SelectItem>
                                  <SelectItem value="Event">Event</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="grid gap-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                placeholder="Enter announcement details"
                                rows={4}
                                value={newAnnouncement.description}
                                onChange={(e) => setNewAnnouncement({...newAnnouncement, description: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button onClick={handleAddAnnouncement}>
                              Add Announcement
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isAnnouncementsLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {localAnnouncements
                        .filter(announcement => 
                          announcement.title.toLowerCase().includes(announcementSearchTerm.toLowerCase()) ||
                          announcement.category.toLowerCase().includes(announcementSearchTerm.toLowerCase()) ||
                          announcement.description.toLowerCase().includes(announcementSearchTerm.toLowerCase())
                        )
                        .map((announcement) => (
                          <TableRow key={announcement.id} className={loadingStates[announcement.id] ? "opacity-50" : ""}>
                            <TableCell className="font-medium">{announcement.title}</TableCell>
                            <TableCell>{announcement.date}</TableCell>
                            <TableCell>{announcement.category}</TableCell>
                            <TableCell>{new Date(announcement.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      disabled={loadingStates[announcement.id]}
                                      onClick={() => setEditingAnnouncement(announcement)}
                                    >
                                      Edit
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Announcement</DialogTitle>
                                      <DialogDescription>
                                        Make changes to the announcement.
                                      </DialogDescription>
                                    </DialogHeader>
                                    
                                    {editingAnnouncement && (
                                      <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                          <Label htmlFor="edit-title">Title</Label>
                                          <Input
                                            id="edit-title"
                                            value={editingAnnouncement.title}
                                            onChange={(e) => setEditingAnnouncement({
                                              ...editingAnnouncement,
                                              title: e.target.value
                                            })}
                                          />
                                        </div>
                                        
                                        <div className="grid gap-2">
                                          <Label htmlFor="edit-date">Date</Label>
                                          <Input
                                            id="edit-date"
                                            value={editingAnnouncement.date}
                                            onChange={(e) => setEditingAnnouncement({
                                              ...editingAnnouncement,
                                              date: e.target.value
                                            })}
                                          />
                                        </div>
                                        
                                        <div className="grid gap-2">
                                          <Label htmlFor="edit-category">Category</Label>
                                          <Select
                                            value={editingAnnouncement.category}
                                            onValueChange={(value) => setEditingAnnouncement({
                                              ...editingAnnouncement,
                                              category: value
                                            })}
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="General">General</SelectItem>
                                              <SelectItem value="Academic">Academic</SelectItem>
                                              <SelectItem value="Sports">Sports</SelectItem>
                                              <SelectItem value="Holiday">Holiday</SelectItem>
                                              <SelectItem value="Admissions">Admissions</SelectItem>
                                              <SelectItem value="Event">Event</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        
                                        <div className="grid gap-2">
                                          <Label htmlFor="edit-description">Description</Label>
                                          <Textarea
                                            id="edit-description"
                                            rows={4}
                                            value={editingAnnouncement.description}
                                            onChange={(e) => setEditingAnnouncement({
                                              ...editingAnnouncement,
                                              description: e.target.value
                                            })}
                                          />
                                        </div>
                                      </div>
                                    )}
                                    
                                    <DialogFooter>
                                      <Button 
                                        onClick={handleUpdateAnnouncement}
                                        disabled={loadingStates[editingAnnouncement?.id || '']}
                                      >
                                        {loadingStates[editingAnnouncement?.id || ''] && (
                                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        )}
                                        Save Changes
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-500"
                                  disabled={loadingStates[announcement.id]}
                                  onClick={() => handleDeleteAnnouncement(announcement.id)}
                                >
                                  {loadingStates[announcement.id] && (
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                                  )}
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
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
