
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ordersTable, profilesTable, orderTrackingTable } from "@/integrations/supabase/customClient";
import { Order, Profile, OrderTracking } from "@/types/database.types";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ADMIN_EMAIL = "danmititi@gmail.com";

const AdminDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [statusDescription, setStatusDescription] = useState<string>("");
  const [newStatus, setNewStatus] = useState<string>("");
  const [statusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated and is admin
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/signin');
        return;
      }
      
      console.log("Current user email:", session.user.email);
      console.log("Admin email check:", session.user.email === ADMIN_EMAIL);
      
      // Check if user email is the admin email
      if (session.user.email !== ADMIN_EMAIL) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You are not authorized to access the admin dashboard",
        });
        navigate('/');
        return;
      }
      
      // Check if user has admin role or set it if needed
      checkAndSetupAdminRole(session.user.id, session.user.email);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/signin');
      } else if (session.user.email !== ADMIN_EMAIL) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You are not authorized to access the admin dashboard",
        });
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAndSetupAdminRole = async (userId: string, email: string) => {
    try {
      console.log("Checking admin role for user:", userId, "with email:", email);
      const { data, error } = await profilesTable.getById(userId);
      
      if (error) throw error;
      
      console.log("Profile data:", data);
      
      if (data) {
        // If user is admin email but doesn't have admin role, update it
        if (email === ADMIN_EMAIL && data.role !== 'admin') {
          console.log("Setting admin role for user:", userId);
          const { error: updateError } = await profilesTable.update({
            id: userId,
            role: 'admin'
          });
          
          if (updateError) throw updateError;
          
          console.log("Admin role set successfully");
        }
        
        setProfile(data);
        
        // Fetch orders regardless of role if the email matches admin email
        if (email === ADMIN_EMAIL) {
          fetchAllOrders();
        } else {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You don't have admin privileges",
          });
          navigate('/');
        }
      }
    } catch (error: any) {
      console.error('Error checking admin role:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not verify permissions",
      });
      navigate('/');
    }
  };

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      
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
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    
    try {
      // Update the order status
      const { error: orderError } = await ordersTable.update(selectedOrder, {
        status: newStatus
      });
      
      if (orderError) throw orderError;
      
      // Insert tracking manually (though the trigger should handle this)
      const { error: trackingError } = await orderTrackingTable.insert({
        order_id: selectedOrder,
        status: newStatus,
        status_description: statusDescription || undefined,
      });
      
      if (trackingError) throw trackingError;
      
      toast({
        title: "Status Updated",
        description: `Order status has been changed to ${newStatus}`,
      });
      
      setStatusDialogOpen(false);
      setStatusDescription("");
      setNewStatus("");
      
      // Refresh orders
      fetchAllOrders();
      
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update order status",
      });
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
            <div className="animate-pulse">Loading dashboard...</div>
          </div>
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
        
        <Tabs defaultValue="orders">
          <TabsList className="mb-4">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">All Orders</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No orders available.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id.split('-')[0]}
                        </TableCell>
                        <TableCell>
                          {order.profiles?.username || order.profiles?.email || "Unknown"}
                        </TableCell>
                        <TableCell>{formatDate(order.created_at)}</TableCell>
                        <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog open={statusDialogOpen && selectedOrder === order.id} 
                                  onOpenChange={(open) => {
                                    if (!open) setStatusDialogOpen(false);
                                    if (!open) setSelectedOrder(null);
                                  }}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order.id);
                                  setNewStatus(order.status);
                                  setStatusDialogOpen(true);
                                }}
                              >
                                Update Status
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Update Order Status</DialogTitle>
                                <DialogDescription>
                                  Change the status for order #{order.id.split('-')[0]}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <label htmlFor="status">Status</label>
                                  <Select 
                                    value={newStatus} 
                                    onValueChange={setNewStatus}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="processing">Processing</SelectItem>
                                      <SelectItem value="shipped">Shipped</SelectItem>
                                      <SelectItem value="delivered">Delivered</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="grid gap-2">
                                  <label htmlFor="description">Description (optional)</label>
                                  <Textarea
                                    id="description"
                                    value={statusDescription}
                                    onChange={(e) => setStatusDescription(e.target.value)}
                                    placeholder="Add any additional notes about this status change"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
                                <Button onClick={updateOrderStatus}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="customers" className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Customer Management</h2>
            <p className="text-gray-500 text-center py-8">
              Customer management features coming soon.
            </p>
          </TabsContent>
          
          <TabsContent value="analytics" className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Analytics</h2>
            <p className="text-gray-500 text-center py-8">
              Analytics features coming soon.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
