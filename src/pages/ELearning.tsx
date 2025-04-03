import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Book as BookIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { Book, getLocalBooks, incrementBookDownloads } from "@/lib/supabase";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const fetchBooks = async (): Promise<Book[]> => {
  console.log('Fetching books from localStorage');
  // Simulate network delay for a more realistic experience
  await new Promise(resolve => setTimeout(resolve, 500));
  return getLocalBooks();
};

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
  
  console.log('Books in component:', books);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);
  
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewBook = (book: Book) => {
    if (book.fileUrl) {
      // Increment download count before opening
      incrementBookDownloads(book.id);
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">Error loading books. Please try again later.</p>
            </div>
          ) : (
            <>
              {filteredBooks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No books found matching your search criteria.</p>
                  {books.length === 0 && (
                    <p className="text-gray-500 mt-2">There are currently no books in the library.</p>
                  )}
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
                        <p className="text-sm text-gray-500 line-clamp-3">{book.description || "No description available."}</p>
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
