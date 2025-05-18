
import { Button } from "@/components/ui/button";

interface ProfileSettingsProps {
  onLogout: () => void;
}

export const ProfileSettings = ({ onLogout }: ProfileSettingsProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <Button variant="destructive" onClick={onLogout}>
        Logout
      </Button>
    </div>
  );
};
