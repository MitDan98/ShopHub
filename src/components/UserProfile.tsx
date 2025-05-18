
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { profilesTable } from "@/integrations/supabase/customClient";
import { useNavigate } from "react-router-dom";
import { EditProfileForm } from "./EditProfileForm";
import { Home } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { Profile } from "@/types/database.types";
import { ProfileTabs } from "./profile/ProfileTabs";
import { ProfileDisplay } from "./profile/ProfileDisplay";
import { ProfileSettings } from "./profile/ProfileSettings";

interface UserProfileProps {
  session: Session | null;
}

const ADMIN_EMAIL = "danmititi@gmail.com";

export const UserProfile = ({ session }: UserProfileProps) => {
  const [profile, setProfile] = useState<Partial<Profile> | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      setLoading(true);
      if (!session?.user?.id) {
        throw new Error("No user ID found");
      }
      
      console.log("Fetching profile for user:", session.user.id);
      
      const { data, error } = await profilesTable.getById(session.user.id);

      if (error) throw error;
      console.log('Profile data:', data);
      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Error fetching profile",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      getProfile();
    }
  }, [session?.user?.id]);

  // Check if current user is the admin
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast({
      title: "Logged out successfully",
      description: "Come back soon!",
    });
  };

  const handleHomeClick = () => {
    navigate('/');
    toast({
      title: "Navigation",
      description: "Returning to home page",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Account</h1>
        <Button
          variant="outline"
          onClick={handleHomeClick}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Return Home
        </Button>
      </div>
      
      {/* Tab Navigation */}
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} />

      {/* Profile Information */}
      {activeTab === 'profile' && (
        isEditing ? (
          <EditProfileForm 
            profile={profile}
            session={session}
            onSuccess={() => {
              setIsEditing(false);
              getProfile();
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ProfileDisplay profile={profile} session={session} onEdit={() => setIsEditing(true)} />
        )
      )}

      {/* Settings Tab Content */}
      {activeTab === 'settings' && (
        <ProfileSettings onLogout={handleLogout} />
      )}
    </div>
  );
};
