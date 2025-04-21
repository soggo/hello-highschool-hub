
import { BellRing, Book as BookIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Book, Announcement } from "@/types";
import FileUploadComponent from "@/components/FileUploadComponent";

interface StatsCardsProps {
  books: Book[];
  announcements: Announcement[];
  refetchBooks: () => void;
}

export const StatsCards = ({ books, announcements, refetchBooks }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total Books</CardTitle>
          <CardDescription>Available in library</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <BookIcon className="h-8 w-8 text-primary mr-4" />
            <span className="text-3xl font-bold">{books.length}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Announcements</CardTitle>
          <CardDescription>School updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <BellRing className="h-8 w-8 text-primary mr-4" />
            <span className="text-3xl font-bold">{announcements.length}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-primary text-white md:col-span-2">
        <CardContent className="pt-6">
          <FileUploadComponent onUploadComplete={refetchBooks} />
        </CardContent>
      </Card>
    </div>
  );
};
