
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ordersTable } from "@/integrations/supabase/customClient";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { LoadingState } from "@/components/admin/LoadingState";

const AdminDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const { loading, profile } = useAdminAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && profile) {
      fetchAllOrders();
    }
  }, [loading, profile]);

  const fetchAllOrders = async () => {
    try {
      const { data, error } = await ordersTable.getAllOrders();
      
      if (error) throw error;
      
      if (data) {
        setOrders(data);
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not load orders",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8">
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-500 mb-6">Manage orders and customer data.</p>
        
        <AdminTabs 
          orders={orders}
          onOrdersUpdate={fetchAllOrders}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
