
import { useState } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  GalleryImage,
} from "@/utils/galleryUtils";

const AdminGalleryPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newImage, setNewImage] = useState({
    title: "",
    description: "",
    imageUrl: ""
  });

  // Fetch gallery images
  const {
    data: images = [],
    isLoading,
    refetch: refetchGallery,
  } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: getGalleryImages,
  });

  const filteredImages = images.filter(
    (image) =>
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddImage = async () => {
    try {
      if (!newImage.title || !newImage.description || !newImage.imageUrl) {
        toast.error("Please fill all required fields");
        return;
      }
      
      await addGalleryImage({
        title: newImage.title,
        description: newImage.description,
        imageUrl: newImage.imageUrl
      });
      
      toast.success("Image added successfully");
      setNewImage({
        title: "",
        description: "",
        imageUrl: ""
      });
      
      setIsAddDialogOpen(false);
      refetchGallery();
    } catch (error) {
      console.error("Error adding image:", error);
      toast.error("Failed to add image");
    }
  };
  
  const handleDeleteImage = async (id: string) => {
    try {
      toast.loading('Deleting image...');
      
      await deleteGalleryImage(id);
      
      toast.dismiss();
      toast.success("Image deleted successfully");
      
      refetchGallery();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.dismiss();
      toast.error(`Failed to delete image: ${error.message}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle>Manage Gallery</CardTitle>
          <div className="flex gap-4">
            <div className="w-64">
              <Input 
                type="text" 
                placeholder="Search images..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Add Image
            </Button>
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
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredImages.map((image) => (
                <TableRow key={image.id}>
                  <TableCell>
                    <img 
                      src={image.imageUrl} 
                      alt={image.title} 
                      className="w-16 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{image.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{image.description}</TableCell>
                  <TableCell>{new Date(image.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-500"
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Add Image Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Image</DialogTitle>
            <DialogDescription>
              Add a new image to the school gallery.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter image title"
                value={newImage.title}
                onChange={(e) => setNewImage({...newImage, title: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="Enter image URL or path (e.g., /image.jpg)"
                value={newImage.imageUrl}
                onChange={(e) => setNewImage({...newImage, imageUrl: e.target.value})}
              />
              <p className="text-xs text-gray-500">
                For school images, use paths like /dikorsal.jpeg
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter image description"
                rows={3}
                value={newImage.description}
                onChange={(e) => setNewImage({...newImage, description: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleAddImage}>
              Add Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminGalleryPanel;
