
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface ProfileSettingsProps {
  onLogout: () => void;
}

export const ProfileSettings = ({ onLogout }: ProfileSettingsProps) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Get the current session first to ensure we have one
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "No active session",
          description: "You're not currently logged in.",
        });
        navigate("/signin");
        return;
      }
      
      console.log("Logging out user with session ID:", session.id);
      
      // Perform the logout
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast({
          variant: "destructive",
          title: "Logout failed",
          description: error.message,
        });
        return;
      }
      
      // Call the onLogout prop function from parent
      onLogout();
      
      // Redirect to sign in page
      toast({
        title: "Logged out successfully",
        description: "Come back soon!",
      });
      navigate("/signin");
    } catch (error: any) {
      console.error("Unexpected logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout error",
        description: error?.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <Button 
        variant="destructive" 
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
};
