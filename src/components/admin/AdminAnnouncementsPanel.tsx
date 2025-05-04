
import { useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Announcement,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/utils/announcementUtils";

interface AdminAnnouncementsPanelProps {
  announcements: Announcement[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  refetchAnnouncements: () => void;
}

const AdminAnnouncementsPanel = ({ 
  announcements, 
  isLoading, 
  searchTerm, 
  setSearchTerm,
  refetchAnnouncements 
}: AdminAnnouncementsPanelProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    description: "",
    date: "",
    category: "General"
  });
  
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  
  const filteredAnnouncements = announcements.filter(announcement => 
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddAnnouncement = async () => {
    try {
      if (!newAnnouncement.title || !newAnnouncement.description || !newAnnouncement.date) {
        toast.error("Please fill all required fields");
        return;
      }
      
      await addAnnouncement({
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
      
      setIsAddDialogOpen(false);
      refetchAnnouncements();
    } catch (error) {
      console.error("Error adding announcement:", error);
      toast.error("Failed to add announcement");
    }
  };
  
  const handleUpdateAnnouncement = async (close: () => void) => {
    if (!editingAnnouncement) return;
    
    try {
      await updateAnnouncement(editingAnnouncement);
      
      close();
      
      setEditingAnnouncement(null);
      
      toast.success("Announcement updated successfully");
      
      refetchAnnouncements();
    } catch (error) {
      console.error("Error updating announcement:", error);
      toast.error("Failed to update announcement");
    }
  };
    
  const handleDeleteAnnouncement = async (id: string) => {
    try {
      toast.loading('Deleting announcement...');
      
      await deleteAnnouncement(id);
      
      toast.dismiss();
      toast.success("Announcement deleted successfully");
      
      refetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.dismiss();
      toast.error(`Failed to delete announcement: ${error.message}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle>Manage Announcements</CardTitle>
          <div className="flex gap-4">
            <div className="w-64">
              <Input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                Add Announcement
              </Button>
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
        {isLoading ? (
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
                            <DialogClose asChild>
                              <Button 
                                onClick={() => handleUpdateAnnouncement(() => {})}
                                type="button"
                              >
                                Save Changes
                              </Button>
                            </DialogClose>
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
  );
};

export default AdminAnnouncementsPanel;
