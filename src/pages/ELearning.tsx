
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Book as BookIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { supabase, Book } from "@/lib/supabase";
import { toast } from "sonner";

const fetchBooks = async (): Promise<Book[]> => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching books:', error);
    throw new Error(error.message);
  }
  
  // If no data is found, return the mock data for demonstration
  if (!data || data.length === 0) {
    console.log('No books found in Supabase, using mock data');
    return mockBooks as unknown as Book[];
  }
  
  return data;
};

// Mock data for fallback when no books are found in Supabase
const mockBooks = [
  {
    id: 1,
    title: "Calculus Fundamentals",
    description: "A comprehensive guide to calculus for high school students.",
    subject: "Mathematics",
    grade: "12"
  },
  {
    id: 2,
    title: "English Literature Classics",
    description: "Analysis of classic literature works for advanced students.",
    subject: "English",
    grade: "11-12"
  },
  {
    id: 3,
    title: "Biology: The Living World",
    description: "Exploring the fundamentals of biology and life sciences.",
    subject: "Science",
    grade: "10"
  },
  {
    id: 4,
    title: "World History: Modern Era",
    description: "A detailed look at world history from the 18th century to present day.",
    subject: "History",
    grade: "11"
  },
  {
    id: 5,
    title: "Chemistry Essentials",
    description: "Core concepts in chemistry with practical experiments.",
    subject: "Science",
    grade: "11"
  },
  {
    id: 6,
    title: "Computer Science Principles",
    description: "Introduction to programming and computer science concepts.",
    subject: "Computer Science",
    grade: "9-12"
  }
];

const ELearning = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
    meta: {
      onError: (err: Error) => {
        console.error('Failed to fetch books:', err);
        toast.error('Failed to load books. Please try again later.');
      }
    }
  });
  
  useEffect(() => {
    if (error) {
      console.error('Error in books query:', error);
    }
  }, [error]);
  
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewBook = (book: Book) => {
    if (book.fileUrl) {
      window.open(book.fileUrl, '_blank');
    } else {
      toast.info('This book is not available for viewing yet.');
    }
  };

  return (
    <Layout>
      <div className="py-12 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">E-Learning Resources</h1>
            <p className="text-lg text-gray-600 mb-8">
              Access our collection of digital textbooks and learning materials to enhance your educational journey.
            </p>
            
            <div className="max-w-md mx-auto mb-12">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by title, subject, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
                <BookIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {filteredBooks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No books found matching your search criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredBooks.map((book) => (
                    <Card key={book.id} className="overflow-hidden transition-all duration-200 hover:shadow-lg">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="line-clamp-2">{book.title}</CardTitle>
                            <CardDescription className="mt-1">Grade {book.grade}</CardDescription>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {book.subject}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 line-clamp-3">{book.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" onClick={() => handleViewBook(book)}>View Book</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ELearning;
