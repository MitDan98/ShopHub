import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ordersTable, orderItemsTable, orderTrackingTable } from "@/integrations/supabase/customClient";
import { Order, OrderItem, OrderTracking } from "@/types/database.types";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      const { data: ordersData, error: ordersError } = await ordersTable.getByUserId(userId);
      
      if (ordersError) throw ordersError;
      if (ordersData) {
        setOrders(ordersData);
        
        // Fetch items for each order
        const itemsPromises = ordersData.map(order => fetchOrderItems(order.id));
        await Promise.all(itemsPromises);
        
        // Fetch tracking history for each order
        const trackingPromises = ordersData.map(order => fetchOrderTracking(order.id));
        await Promise.all(trackingPromises);
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
      const { data, error } = await orderItemsTable.getByOrderId(orderId);
      if (error) throw error;
      if (data) {
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
      const { data, error } = await orderTrackingTable.getByOrderId(orderId);
      if (error) throw error;
      if (data) {
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order placed on {formatDate(order.created_at)}
                    </p>
                    <p className="text-sm font-medium">Order #{order.id.split('-')[0]}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Status:</span>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="px-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="items">
                      <AccordionTrigger className="py-2">
                        Order Items
                      </AccordionTrigger>
                      <AccordionContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead className="text-right">Quantity</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orderItems[order.id]?.map(item => (
                              <TableRow key={item.id}>
                                <TableCell>{item.title}</TableCell>
                                <TableCell className="text-right">{item.quantity}</TableCell>
                                <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          <tfoot className="border-t bg-muted/50 font-medium">
                            <TableRow>
                              <TableCell colSpan={2}>Total</TableCell>
                              <TableCell className="text-right">${order.total_amount.toFixed(2)}</TableCell>
                            </TableRow>
                          </tfoot>
                        </Table>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="tracking">
                      <AccordionTrigger className="py-2">
                        Tracking History
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pb-4">
                          {orderTracking[order.id]?.length ? (
                            <div className="space-y-4">
                              {orderTracking[order.id].map((track, index) => (
                                <div key={track.id} className="border-l-2 border-blue-500 pl-4 py-1">
                                  <p className="text-sm font-medium">
                                    Status: <span className={`px-2 py-0.5 rounded ${getStatusColor(track.status)}`}>
                                      {track.status}
                                    </span>
                                  </p>
                                  {track.status_description && (
                                    <p className="text-sm text-gray-600 mt-1">{track.status_description}</p>
                                  )}
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatDate(track.created_at)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No tracking updates available.</p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
