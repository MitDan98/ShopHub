
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { profilesTable } from "@/integrations/supabase/customClient";
import { useNavigate } from "react-router-dom";
import { EditProfileForm } from "./EditProfileForm";
import { Home, Package, User, Settings } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { Profile } from "@/types/database.types";

interface UserProfileProps {
  session: Session | null;
}

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
      <div className="flex gap-4 mb-6 border-b">
        <button
          className={`pb-2 px-4 flex items-center gap-1 ${activeTab === 'profile' ? 'border-b-2 border-primary font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('profile')}
        >
          <User className="w-4 h-4" />
          Profile
        </button>
        <button
          className={`pb-2 px-4 flex items-center gap-1 ${activeTab === 'orders' ? 'border-b-2 border-primary font-medium' : 'text-gray-500'}`}
          onClick={() => {
            navigate('/orders');
          }}
        >
          <Package className="w-4 h-4" />
          Orders
        </button>
        <button
          className={`pb-2 px-4 flex items-center gap-1 ${activeTab === 'settings' ? 'border-b-2 border-primary font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
        
        {/* Admin Dashboard Link - only visible for admins */}
        {profile?.role === 'admin' && (
          <button
            className="ml-auto pb-2 px-4 text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => navigate('/admin')}
          >
            Admin Dashboard
          </button>
        )}
      </div>

      {/* Profile Information */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>

          {isEditing ? (
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
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="text-gray-900 bg-gray-50 p-2 rounded">
                  {profile?.full_name || 'Not set'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="text-gray-900 bg-gray-50 p-2 rounded">
                  {profile?.email || session?.user?.email || 'Not set'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="text-gray-900 bg-gray-50 p-2 rounded">
                  {profile?.phone || 'Not set'}
                </div>
              </div>

              {profile?.role && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type
                  </label>
                  <div className="text-gray-900 bg-gray-50 p-2 rounded capitalize">
                    {profile.role}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Settings Tab Content */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};
