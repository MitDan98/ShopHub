
import { Profile } from "@/types/database.types";
import { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

interface ProfileDisplayProps {
  profile: Partial<Profile> | null;
  session: Session | null;
  onEdit: () => void;
}

export const ProfileDisplay = ({ profile, session, onEdit }: ProfileDisplayProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <Button variant="outline" size="sm" onClick={onEdit}>
          Edit Profile
        </Button>
      </div>

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
    </div>
  );
};
