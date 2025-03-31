
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Book } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";

// Mock data for now - this would come from Supabase
const mockBooks = [
  {
    id: 1,
    title: "Calculus Fundamentals",
    description: "A comprehensive guide to calculus for high school students.",
    coverUrl: "https://placehold.co/400x600/e5deff/333333?text=Calculus",
    subject: "Mathematics",
    grade: "12"
  },
  {
    id: 2,
    title: "English Literature Classics",
    description: "Analysis of classic literature works for advanced students.",
    coverUrl: "https://placehold.co/400x600/d3e4fd/333333?text=English",
    subject: "English",
    grade: "11-12"
  },
  {
    id: 3,
    title: "Biology: The Living World",
    description: "Exploring the fundamentals of biology and life sciences.",
    coverUrl: "https://placehold.co/400x600/f2fce2/333333?text=Biology",
    subject: "Science",
    grade: "10"
  },
  {
    id: 4,
    title: "World History: Modern Era",
    description: "A detailed look at world history from the 18th century to present day.",
    coverUrl: "https://placehold.co/400x600/fef7cd/333333?text=History",
    subject: "History",
    grade: "11"
  },
  {
    id: 5,
    title: "Chemistry Essentials",
    description: "Core concepts in chemistry with practical experiments.",
    coverUrl: "https://placehold.co/400x600/ffdee2/333333?text=Chemistry",
    subject: "Science",
    grade: "11"
  },
  {
    id: 6,
    title: "Computer Science Principles",
    description: "Introduction to programming and computer science concepts.",
    coverUrl: "https://placehold.co/400x600/e5deff/333333?text=CS",
    subject: "Computer Science",
    grade: "9-12"
  }
];

// This would be replaced with a real Supabase query
const fetchBooks = async () => {
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockBooks;
};

const ELearning = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });
  
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <Book className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                      <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
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
                        <Button className="w-full">View Book</Button>
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
