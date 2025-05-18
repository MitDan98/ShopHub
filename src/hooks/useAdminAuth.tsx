
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { profilesTable } from "@/integrations/supabase/customClient";
import { Profile } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";

const ADMIN_EMAIL = "danmititi@gmail.com";

export const useAdminAuth = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated and is admin
    const checkAuth = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No session found, redirecting to signin");
          navigate('/signin');
          return;
        }
        
        console.log("Current user email:", session.user.email);
        console.log("Admin email check:", session.user.email === ADMIN_EMAIL);
        
        // Check if user email is the admin email
        if (session.user.email !== ADMIN_EMAIL) {
          console.log("User is not admin, redirecting to home");
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You are not authorized to access the admin dashboard",
          });
          navigate('/');
          return;
        }
        
        // Check if user has admin role or set it if needed
        await checkAndSetupAdminRole(session.user.id, session.user.email);
      } catch (error) {
        console.error('Error in auth check:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please try signing in again",
        });
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/signin');
      } else if (session.user.email !== ADMIN_EMAIL) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You are not authorized to access the admin dashboard",
        });
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const checkAndSetupAdminRole = async (userId: string, email: string) => {
    try {
      console.log("Checking admin role for user:", userId, "with email:", email);
      const { data, error } = await profilesTable.getById(userId);
      
      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      console.log("Profile data:", data);
      
      if (data) {
        // If user is admin email but doesn't have admin role, update it
        if (email === ADMIN_EMAIL && data.role !== 'admin') {
          console.log("Setting admin role for user:", userId);
          const { error: updateError } = await profilesTable.update({
            id: userId,
            role: 'admin'
          });
          
          if (updateError) {
            console.error("Error updating role:", updateError);
            throw updateError;
          }
          
          console.log("Admin role set successfully");
          // Refresh profile data after update
          const { data: updatedData, error: refreshError } = await profilesTable.getById(userId);
          if (refreshError) throw refreshError;
          setProfile(updatedData);
        } else {
          setProfile(data);
        }
      } else {
        console.error("No profile found for user:", userId);
      }
    } catch (error: any) {
      console.error('Error checking admin role:', error);
      throw error;
    }
  };

  return { loading, profile };
};
