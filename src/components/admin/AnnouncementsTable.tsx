
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Announcement } from "@/types";
import { AnnouncementDialog } from "./AnnouncementDialog";

interface AnnouncementsTableProps {
  announcements: Announcement[];
  refetchAnnouncements: () => void;
  isAnnouncementsLoading: boolean;
  addAnnouncement: (announcement: Announcement) => Promise<void>;
  updateAnnouncement: (announcement: Announcement) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
}

export const AnnouncementsTable = ({
  announcements,
  refetchAnnouncements,
  isAnnouncementsLoading,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
}: AnnouncementsTableProps) => {
  const [announcementSearchTerm, setAnnouncementSearchTerm] = useState("");
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredAnnouncements = announcements.filter(announcement => 
    announcement.title.toLowerCase().includes(announcementSearchTerm.toLowerCase()) ||
    announcement.category.toLowerCase().includes(announcementSearchTerm.toLowerCase()) ||
    announcement.description.toLowerCase().includes(announcementSearchTerm.toLowerCase())
  );

  const handleAddAnnouncement = async (newAnnouncement: Announcement) => {
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
      refetchAnnouncements();
    } catch (error) {
      console.error("Error adding announcement:", error);
      toast.error("Failed to add announcement");
    }
  };
  
  const handleUpdateAnnouncement = async (announcement: Announcement) => {
    try {
      await updateAnnouncement(announcement);
      toast.success("Announcement updated successfully");
      refetchAnnouncements();
    } catch (error) {
      console.error("Error updating announcement:", error);
      toast.error("Failed to update announcement");
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      console.log(`Attempting to delete announcement with ID: ${id}`);
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
                value={announcementSearchTerm}
                onChange={(e) => setAnnouncementSearchTerm(e.target.value)}
              />
            </div>
            
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Add Announcement
            </Button>
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
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingAnnouncement(announcement);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      
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

      {/* Add Announcement Dialog */}
      <AnnouncementDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        announcement={null}
        onSave={handleAddAnnouncement}
        title="Add New Announcement"
        description="Create a new announcement to be displayed on the school website."
        isNewAnnouncement={true}
      />

      {/* Edit Announcement Dialog */}
      {editingAnnouncement && (
        <AnnouncementDialog
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          announcement={editingAnnouncement}
          onSave={handleUpdateAnnouncement}
          title="Edit Announcement"
          description="Make changes to the announcement."
        />
      )}
    </Card>
  );
};
