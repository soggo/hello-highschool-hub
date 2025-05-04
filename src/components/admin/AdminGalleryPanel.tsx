
import { useState, useRef } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  uploadGalleryImage,
  GalleryImage,
} from "@/utils/galleryUtils";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";

const AdminGalleryPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newImage, setNewImage] = useState({
    title: "",
    description: "",
    imageUrl: ""
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      // Clear any previous imageUrl when a file is selected
      setNewImage({...newImage, imageUrl: ""});
    }
  };

  const handleAddImage = async () => {
    try {
      if (!newImage.title || !newImage.description) {
        toast.error("Please fill title and description fields");
        return;
      }
      
      if (!uploadedFile && !newImage.imageUrl) {
        toast.error("Please upload an image or provide an image URL");
        return;
      }
      
      setIsUploading(true);
      
      // If we have a file to upload, upload it first
      let finalImageUrl = newImage.imageUrl;
      
      if (uploadedFile) {
        toast.loading("Uploading image...");
        const uploadResult = await uploadGalleryImage(uploadedFile);
        finalImageUrl = uploadResult.path;
        toast.dismiss();
      }
      
      // Add the gallery image with the final URL
      await addGalleryImage({
        title: newImage.title,
        description: newImage.description,
        imageUrl: finalImageUrl
      });
      
      toast.success("Image added successfully");
      setNewImage({
        title: "",
        description: "",
        imageUrl: ""
      });
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      setIsAddDialogOpen(false);
      refetchGallery();
    } catch (error) {
      console.error("Error adding image:", error);
      toast.error(`Failed to add image: ${error.message || "Unknown error"}`);
    } finally {
      setIsUploading(false);
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
      toast.error(`Failed to delete image: ${error.message || "Unknown error"}`);
    }
  };
  
  const handleToggleDialog = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      // Reset form when closing
      setNewImage({
        title: "",
        description: "",
        imageUrl: ""
      });
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
            
            <Dialog open={isAddDialogOpen} onOpenChange={handleToggleDialog}>
              <DialogTrigger asChild>
                <Button>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Add Image
                </Button>
              </DialogTrigger>
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
                    <Label>Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">
                        Upload image or provide URL
                      </p>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="mb-4"
                        onChange={handleFileChange}
                      />
                      {uploadedFile && (
                        <div className="text-sm text-green-600 mb-4">
                          Selected: {uploadedFile.name}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mb-2">OR</p>
                      <Input
                        id="imageUrl"
                        placeholder="Enter image URL (e.g., /dikorsal.jpeg)"
                        value={newImage.imageUrl}
                        onChange={(e) => setNewImage({...newImage, imageUrl: e.target.value})}
                        disabled={!!uploadedFile}
                      />
                    </div>
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
                  <Button onClick={handleAddImage} disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Add Image"}
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
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
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

export default AdminGalleryPanel;
