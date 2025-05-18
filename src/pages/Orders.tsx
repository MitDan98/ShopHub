
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ordersTable, orderItemsTable, orderTrackingTable } from "@/integrations/supabase/customClient";
import { Order, OrderItem, OrderTracking } from "@/types/database.types";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { OrderCard } from "@/components/orders/OrderCard";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [orderTracking, setOrderTracking] = useState<Record<string, OrderTracking[]>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/signin');
      } else {
        console.log("Fetching orders for user:", session.user.id);
        fetchOrders(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/signin');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchOrders = async (userId: string) => {
    try {
      setLoading(true);
      
      // Fetch all orders for this user
      console.log("Fetching orders for user ID:", userId);
      const { data: ordersData, error: ordersError } = await ordersTable.getByUserId(userId);
      
      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        throw ordersError;
      }
      
      if (ordersData) {
        console.log("Orders data:", ordersData);
        setOrders(ordersData);
        
        // Fetch items for each order
        const itemsPromises = ordersData.map(order => fetchOrderItems(order.id));
        await Promise.all(itemsPromises);
        
        // Fetch tracking history for each order
        const trackingPromises = ordersData.map(order => fetchOrderTracking(order.id));
        await Promise.all(trackingPromises);
      } else {
        console.log("No orders found for user:", userId);
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not load your orders",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (orderId: string) => {
    try {
      console.log("Fetching items for order:", orderId);
      const { data, error } = await orderItemsTable.getByOrderId(orderId);
      if (error) throw error;
      if (data) {
        console.log(`Items for order ${orderId}:`, data);
        setOrderItems(prev => ({
          ...prev,
          [orderId]: data
        }));
      }
    } catch (error: any) {
      console.error(`Error fetching items for order ${orderId}:`, error);
    }
  };

  const fetchOrderTracking = async (orderId: string) => {
    try {
      console.log("Fetching tracking for order:", orderId);
      const { data, error } = await orderTrackingTable.getByOrderId(orderId);
      if (error) throw error;
      if (data) {
        console.log(`Tracking for order ${orderId}:`, data);
        setOrderTracking(prev => ({
          ...prev,
          [orderId]: data
        }));
      }
    } catch (error: any) {
      console.error(`Error fetching tracking for order ${orderId}:`, error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-pulse">Loading your orders...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Button onClick={() => navigate('/products')}>Shop Now</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                orderItems={orderItems[order.id] || []} 
                orderTracking={orderTracking[order.id] || []} 
                formatDate={formatDate} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
