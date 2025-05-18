import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Package, User, Settings } from "lucide-react";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
}

export const ProfileTabs = ({ activeTab, setActiveTab, isAdmin }: ProfileTabsProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle tab click to prevent refresh loops
  const handleTabClick = (tab: string) => {
    // If we're already on the profile page, just switch tabs
    if (location.pathname === '/profile') {
      setActiveTab(tab);
    } else {
      // Otherwise navigate to profile page with the selected tab
      navigate('/profile', { state: { activeTab: tab }, replace: true });
    }
  };

  // Handle admin navigation separately to avoid refresh loops
  const handleAdminClick = () => {
    // Use replace: true to avoid adding to history stack
    navigate('/admin', { replace: true });
  };

  return (
    <div className="flex gap-4 mb-6 border-b">
      <button
        className={`pb-2 px-4 flex items-center gap-1 ${activeTab === 'profile' ? 'border-b-2 border-primary font-medium' : 'text-gray-500'}`}
        onClick={() => handleTabClick('profile')}
      >
        <User className="w-4 h-4" />
        Profile
      </button>
      <button
        className={`pb-2 px-4 flex items-center gap-1 ${activeTab === 'orders' ? 'border-b-2 border-primary font-medium' : 'text-gray-500'}`}
        onClick={() => navigate('/orders', { replace: true })}
      >
        <Package className="w-4 h-4" />
        Orders
      </button>
      <button
        className={`pb-2 px-4 flex items-center gap-1 ${activeTab === 'settings' ? 'border-b-2 border-primary font-medium' : 'text-gray-500'}`}
        onClick={() => handleTabClick('settings')}
      >
        <Settings className="w-4 h-4" />
        Settings
      </button>
      
      {/* Admin Dashboard Link - only visible for specific admin email */}
      {isAdmin && (
        <button
          className="ml-auto pb-2 px-4 text-blue-600 hover:text-blue-800 font-medium"
          onClick={handleAdminClick}
        >
          Admin Dashboard
        </button>
      )}
    </div>
  );
};
