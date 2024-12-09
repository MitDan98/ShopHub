import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/components/UserProfile";

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/signin');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <UserProfile />
    </div>
  );
};

export default Profile;