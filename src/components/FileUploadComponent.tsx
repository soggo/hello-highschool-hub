import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

type FileUploadProps = {
  onUploadComplete: () => void;
};

const FileUploadComponent = ({ onUploadComplete }: FileUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bookDetails, setBookDetails] = useState({
    title: "",
    subject: "",
    grade: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 50 * 1024 * 1024) {
      // 50MB limit
      toast.error("File too large. Maximum size is 50MB.");
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `books/${fileName}`;
      
      // Manual progress tracking
      const chunkSize = 1024 * 1024; // 1MB chunks
      const totalChunks = Math.ceil(file.size / chunkSize);
      let uploadedChunks = 0;
      
      // We'll use the Raw HTTP upload to avoid the onUploadProgress issue
      const { data, error } = await supabase.storage
        .from('books')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        uploadedChunks++;
        const currentProgress = Math.min((uploadedChunks / totalChunks) * 100, 95);
        setProgress(currentProgress);
        
        if (uploadedChunks >= totalChunks) {
          clearInterval(progressInterval);
        }
      }, 300);

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('books')
        .getPublicUrl(filePath);

      // Save book metadata to database
      const { error: dbError } = await supabase.from('books').insert({
        title: bookDetails.title,
        subject: bookDetails.subject,
        grade: bookDetails.grade,
        file_path: filePath,
        public_url: publicUrlData.publicUrl,
        downloads: 0
      });

      if (dbError) throw dbError;

      // Complete the upload
      setProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setIsOpen(false);
        toast.success("Book uploaded successfully");
        onUploadComplete();
        // Reset form
        setBookDetails({ title: "", subject: "", grade: "" });
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 500);

    } catch (error: any) {
      console.error("Upload error:", error);
      setIsUploading(false);
      toast.error(`Upload failed: ${error.message}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookDetails((prev) => ({ ...prev, [name]: value }));
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Button 
        variant="secondary" 
        className="w-full" 
        onClick={() => setIsOpen(true)}
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload New Book
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload New Book</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Book Title</Label>
              <Input 
                id="title"
                name="title"
                value={bookDetails.title}
                onChange={handleInputChange}
                placeholder="Enter book title"
                disabled={isUploading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject"
                name="subject"
                value={bookDetails.subject}
                onChange={handleInputChange}
                placeholder="E.g. Mathematics, Science"
                disabled={isUploading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grade">Grade Level</Label>
              <Input 
                id="grade"
                name="grade"
                value={bookDetails.grade}
                onChange={handleInputChange}
                placeholder="E.g. 9, 10-12"
                disabled={isUploading}
              />
            </div>
            
            <div className="space-y-2">
              <Label>PDF File</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer" onClick={!isUploading ? triggerFileInput : undefined}>
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500 mb-1">Click to select PDF file</p>
                <p className="text-xs text-gray-400">Max size: 50MB</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileSelected}
                  disabled={isUploading}
                />
              </div>
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <Label>Upload Progress</Label>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-center text-gray-500">{Math.round(progress)}% complete</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={triggerFileInput}
              disabled={isUploading || !bookDetails.title || !bookDetails.subject || !bookDetails.grade}
            >
              {isUploading ? "Uploading..." : "Upload File"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileUploadComponent;