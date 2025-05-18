
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Package, User, Settings } from "lucide-react";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
}

export const ProfileTabs = ({ activeTab, setActiveTab, isAdmin }: ProfileTabsProps) => {
  const navigate = useNavigate();

  return (
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
      
      {/* Admin Dashboard Link - only visible for specific admin email */}
      {isAdmin && (
        <button
          className="ml-auto pb-2 px-4 text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => navigate('/admin')}
        >
          Admin Dashboard
        </button>
      )}
    </div>
  );
};
