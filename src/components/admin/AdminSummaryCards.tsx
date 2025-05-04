
import { Book as BookIcon, BellRing, ImageIcon } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import FileUploadComponent from "@/components/FileUploadComponent";

interface AdminSummaryCardsProps {
  booksCount: number;
  announcementsCount: number;
  galleryCount: number;
  refetchBooks: () => void;
}

const AdminSummaryCards = ({ booksCount, announcementsCount, galleryCount, refetchBooks }: AdminSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total Books</CardTitle>
          <CardDescription>Available in library</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <BookIcon className="h-8 w-8 text-primary mr-4" />
            <span className="text-3xl font-bold">{booksCount}</span>
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
            <span className="text-3xl font-bold">{announcementsCount}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Gallery Images</CardTitle>
          <CardDescription>School photos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <ImageIcon className="h-8 w-8 text-primary mr-4" />
            <span className="text-3xl font-bold">{galleryCount}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-primary text-white md:col-span-3">
        <CardContent className="pt-6">
          <FileUploadComponent onUploadComplete={refetchBooks} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSummaryCards;
