
import { useState } from "react";
import { Order } from "@/types/database.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ordersTable, orderTrackingTable } from "@/integrations/supabase/customClient";

interface OrdersTableProps {
  orders: any[];
  onOrdersUpdate: () => Promise<void>;
}

export const OrdersTable = ({ orders, onOrdersUpdate }: OrdersTableProps) => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [statusDescription, setStatusDescription] = useState<string>("");
  const [newStatus, setNewStatus] = useState<string>("");
  const [statusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();

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
      onOrdersUpdate();
      
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

  return (
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
  );
};
