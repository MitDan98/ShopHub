
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ordersTable } from "@/integrations/supabase/customClient";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { LoadingState } from "@/components/admin/LoadingState";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { loading: authLoading, profile, error: authError } = useAdminAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && profile && !authError) {
      console.log("Admin profile loaded:", profile);
      fetchAllOrders();
    }
  }, [authLoading, profile, authError]);

  const fetchAllOrders = async () => {
    try {
      console.log("Fetching all orders...");
      setIsLoading(true);
      const { data, error } = await ordersTable.getAllOrders();
      
      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
      
      if (data) {
        console.log("Orders fetched successfully:", data.length);
        setOrders(data);
      } else {
        console.log("No orders found");
        setOrders([]);
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not load orders",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileClick = () => {
    // Use replace: true to avoid adding to history stack and prevent refresh loops
    navigate('/profile', { state: { activeTab: 'profile' }, replace: true });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8">
          <LoadingState error={authError} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button 
            onClick={handleProfileClick}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            My Profile
          </button>
        </div>
        <p className="text-gray-500 mb-6">Manage orders and customer data.</p>
        
        {isLoading ? (
          <LoadingState />
        ) : (
          <AdminTabs 
            orders={orders}
            onOrdersUpdate={fetchAllOrders}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
