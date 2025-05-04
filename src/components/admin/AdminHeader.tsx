
import { Button } from "@/components/ui/button";
import { LogOut, User, BookIcon } from "lucide-react";

interface AdminHeaderProps {
  userEmail: string;
  handleLogout: () => void;
}

const AdminHeader = ({ userEmail, handleLogout }: AdminHeaderProps) => {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 text-gray-500" />
            <span>{userEmail}</span>
          </div>
          
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
