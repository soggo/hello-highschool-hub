import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book as BookIcon, BookOpen, User, LogOut, BellRing, PlusCircle } from "lucide-react";
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
import { 
  Book, 
  Announcement, 
  getLocalAnnouncements, 
  addLocalAnnouncement, 
  updateLocalAnnouncement, 
  deleteLocalAnnouncement,
  getLocalAuthStatus,
  logoutLocalUser,
  getLocalBooks,
  deleteLocalBook
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

const fetchBooksAdmin = async (): Promise<Book[]> => {
  // Simulate network delay for a more realistic experience
  await new Promise(resolve => setTimeout(resolve, 500));
  return getLocalBooks();
};

const fetchAnnouncements = async (): Promise<Announcement[]> => {
  // Using local storage instead of Supabase
  return getLocalAnnouncements();
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [announcementSearchTerm, setAnnouncementSearchTerm] = useState("");
  
  // New announcement form state
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    description: "",
    date: "",
    category: "General"
  });
  
  // Edit announcement state
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Fetch books from local storage
  const { data: books = [], isLoading: isBooksLoading, refetch: refetchBooks } = useQuery({
    queryKey: ["admin-books"],
    queryFn: fetchBooksAdmin,
    enabled: isAuthenticated,
  });
  
  // Fetch announcements from local storage
  const { data: announcements = [], isLoading: isAnnouncementsLoading, refetch: refetchAnnouncements } = useQuery({
    queryKey: ["admin-announcements"],
    queryFn: fetchAnnouncements,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    // Check authentication status using local storage
    const checkAuth = () => {
      const { isAuthenticated: authStatus, email } = getLocalAuthStatus();
      
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

  const handleLogout = () => {
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

  const handleDeleteBook = (id: string) => {
    try {
      // Delete book from local storage
      deleteLocalBook(id);
      
      toast.success("Book deleted successfully");
      refetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book");
    }
  };
  
  const handleAddAnnouncement = () => {
    try {
      if (!newAnnouncement.title || !newAnnouncement.description || !newAnnouncement.date) {
        toast.error("Please fill all required fields");
        return;
      }
      
      // Add announcement to local storage
      addLocalAnnouncement({
        title: newAnnouncement.title,
        description: newAnnouncement.description,
        date: newAnnouncement.date,
        category: newAnnouncement.category
      });
      
      toast.success("Announcement added successfully");
      setNewAnnouncement({
        title: "",
        description: "",
        date: "",
        category: "General"
      });
      refetchAnnouncements();
    } catch (error) {
      console.error("Error adding announcement:", error);
      toast.error("Failed to add announcement");
    }
  };
  
  const handleUpdateAnnouncement = () => {
    if (!editingAnnouncement) return;
    
    try {
      // Update announcement in local storage
      updateLocalAnnouncement(editingAnnouncement);
      
      toast.success("Announcement updated successfully");
      setEditingAnnouncement(null);
      refetchAnnouncements();
    } catch (error) {
      console.error("Error updating announcement:", error);
      toast.error("Failed to update announcement");
    }
  };
  
  const handleDeleteAnnouncement = (id: string) => {
    try {
      // Delete announcement from local storage
      deleteLocalAnnouncement(id);
      
      toast.success("Announcement deleted successfully");
      refetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.error("Failed to delete announcement");
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
              <CardTitle className="text-lg font-medium">Announcements</CardTitle>
              <CardDescription>School updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BellRing className="h-8 w-8 text-primary mr-4" />
                <span className="text-3xl font-bold">{announcements.length}</span>
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
                <div className="flex items-center justify-between">
                  <CardTitle>Manage Announcements</CardTitle>
                  <div className="flex gap-4">
                    <div className="w-64">
                      <Input 
                        type="text" 
                        placeholder="Search announcements..." 
                        value={announcementSearchTerm}
                        onChange={(e) => setAnnouncementSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <PlusCircle className="h-4 w-4 mr-2" />
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
                      {filteredAnnouncements.map((announcement) => (
                        <TableRow key={announcement.id}>
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
                                    <Button onClick={handleUpdateAnnouncement}>
                                      Save Changes
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-500"
                                onClick={() => handleDeleteAnnouncement(announcement.id)}
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
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
