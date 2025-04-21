
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Announcement } from "@/types";

interface AnnouncementDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  announcement: Announcement | null;
  onSave: (announcement: Announcement) => Promise<void>;
  title: string;
  description: string;
  isNewAnnouncement?: boolean;
}

export const AnnouncementDialog = ({
  isOpen,
  setIsOpen,
  announcement,
  onSave,
  title,
  description,
  isNewAnnouncement = false,
}: AnnouncementDialogProps) => {
  const [formData, setFormData] = useState(
    announcement || {
      title: "",
      description: "",
      date: "",
      category: "General",
    }
  );

  const handleSave = async () => {
    try {
      await onSave(formData);
      setIsOpen(false); // Close the dialog after successful save
    } catch (error) {
      console.error("Error saving announcement:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter announcement title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              placeholder="e.g., March 28, 2025"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({...formData, category: value})}
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
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleSave}>
              {isNewAnnouncement ? "Add Announcement" : "Save Changes"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
