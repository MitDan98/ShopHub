import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound, Settings, LogOut, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const UserProfile = ({ session }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (session?.user?.id) {
      getProfile(session.user.id);
    }
  }, [session]);

  const getProfile = async (userId) => {
    try {
      setLoading(true);
      console.log("Fetching profile for user:", userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      console.log('Profile data:', data);
      setProfile(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching profile",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast({
      title: "Logged out successfully",
      description: "Come back soon!",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <Card className="p-6 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-secondary text-xl">
                  {profile?.username ? profile.username[0].toUpperCase() : <UserRound />}
                </AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">
                {profile?.username || 'Anonymous User'}
              </h2>
              <p className="text-gray-600 mb-2">
                Role: {profile?.role || 'User'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Member since: {new Date(profile?.created_at).toLocaleDateString()}
              </p>
              <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
                <Button 
                  variant="secondary" 
                  className="w-full md:w-auto"
                  onClick={() => navigate('/products')}
                >
                  View Products
                </Button>
                <Button 
                  variant="destructive"
                  className="w-full md:w-auto flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};