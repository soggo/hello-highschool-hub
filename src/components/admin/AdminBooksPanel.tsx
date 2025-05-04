
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
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Book } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";

interface AdminBooksPanelProps {
  books: Book[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  refetchBooks: () => void;
}

const AdminBooksPanel = ({ 
  books, 
  isLoading, 
  searchTerm, 
  setSearchTerm,
  refetchBooks 
}: AdminBooksPanelProps) => {
  
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

  return (
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
        {isLoading ? (
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
  );
};

export default AdminBooksPanel;
