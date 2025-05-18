
import { useState } from "react";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Button } from "@/components/ui/button";
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
import { ordersTable, orderTrackingTable } from "@/integrations/supabase/customClient";
import { useToast } from "@/hooks/use-toast";

interface OrderStatusDialogProps {
  orderId: string;
  currentStatus: string;
  onStatusUpdate: () => Promise<void>;
}

export const OrderStatusDialog = ({ orderId, currentStatus, onStatusUpdate }: OrderStatusDialogProps) => {
  const [statusDescription, setStatusDescription] = useState<string>("");
  const [newStatus, setNewStatus] = useState<string>(currentStatus);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!orderId || !newStatus) return;
    
    try {
      // Update the order status
      const { error: orderError } = await ordersTable.update(orderId, {
        status: newStatus
      });
      
      if (orderError) throw orderError;
      
      // Insert tracking manually (though the trigger should handle this)
      const { error: trackingError } = await orderTrackingTable.insert({
        order_id: orderId,
        status: newStatus,
        status_description: statusDescription || undefined,
      });
      
      if (trackingError) throw trackingError;
      
      toast({
        title: "Status Updated",
        description: `Order status has been changed to ${newStatus}`,
      });
      
      setIsOpen(false);
      setStatusDescription("");
      
      // Refresh orders
      onStatusUpdate();
      
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update order status",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Update Status
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Change the status for order #{orderId.split('-')[0]}
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
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
