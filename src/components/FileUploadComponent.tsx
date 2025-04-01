
import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase, isAdmin } from '@/lib/supabase';

type FileUploadProps = {
  onUploadComplete: () => void;
};

const FileUploadComponent = ({ onUploadComplete }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [bookData, setBookData] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!bookData.title || !bookData.subject || !bookData.grade) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    
    try {
      // Check if user is admin before proceeding
      const adminStatus = await isAdmin();
      if (!adminStatus) {
        toast.error('You must be logged in as an admin to upload books');
        setIsUploading(false);
        return;
      }
      
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('books')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('books')
        .getPublicUrl(filePath);
      
      console.log('File uploaded successfully:', urlData.publicUrl);
      
      // Insert record into the books table with created_at timestamp
      const { error: dbError } = await supabase
        .from('books')
        .insert([
          {
            title: bookData.title,
            description: bookData.description,
            subject: bookData.subject,
            grade: bookData.grade,
            fileUrl: urlData.publicUrl,
            downloads: 0,
            created_at: new Date().toISOString(), // Add timestamp for created_at
          },
        ]);

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw dbError;
      }

      toast.success('Book uploaded successfully!');
      
      // Reset form
      setFile(null);
      setBookData({
        title: '',
        description: '',
        subject: '',
        grade: '',
      });
      
      // Refresh books list
      onUploadComplete();
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload book. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const fileName = file ? file.name : 'No file selected';

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Upload New Book</h3>
      
      <div>
        <Input 
          type="text"
          name="title"
          placeholder="Book Title *"
          value={bookData.title}
          onChange={handleInputChange}
          className="bg-white/10 border-white/20 placeholder:text-white/60 text-white"
          required
        />
      </div>
      
      <div>
        <Input 
          type="text"
          name="subject"
          placeholder="Subject *"
          value={bookData.subject}
          onChange={handleInputChange}
          className="bg-white/10 border-white/20 placeholder:text-white/60 text-white"
          required
        />
      </div>
      
      <div>
        <Input 
          type="text"
          name="grade"
          placeholder="Grade Level *"
          value={bookData.grade}
          onChange={handleInputChange}
          className="bg-white/10 border-white/20 placeholder:text-white/60 text-white"
          required
        />
      </div>
      
      <div>
        <Textarea 
          name="description"
          placeholder="Description (optional)"
          value={bookData.description}
          onChange={handleInputChange}
          className="bg-white/10 border-white/20 placeholder:text-white/60 text-white"
          rows={3}
        />
      </div>
      
      <div className="flex flex-col space-y-2">
        <div className="relative">
          <Button
            type="button"
            variant="secondary"
            className="w-full bg-white/10 hover:bg-white/20"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Select PDF File
          </Button>
          <Input
            id="file-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        
        <div className="flex items-center text-sm">
          <FileText className="h-4 w-4 mr-2" />
          <span className="truncate">{fileName}</span>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload Book'}
      </Button>
    </form>
  );
};

export default FileUploadComponent;
