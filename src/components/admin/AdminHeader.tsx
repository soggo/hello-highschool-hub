
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { logoutLocalUser } from "@/lib/supabase";

interface AdminHeaderProps {
  userEmail: string;
}

export const AdminHeader = ({ userEmail }: AdminHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Try to sign out from Supabase (kept for compatibility)
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Supabase logout error:", error);
    }
    
    // Clear local storage
    logoutLocalUser();
    toast.success("Logged out successfully");
    navigate("/login");
  };

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

// Add missing import for BookIcon and supabase
import { Book as BookIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
