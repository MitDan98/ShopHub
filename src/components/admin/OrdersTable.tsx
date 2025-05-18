
import { Order } from "@/types/database.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderStatusDialog } from "./OrderStatusDialog";

interface OrdersTableProps {
  orders: any[];
  onOrdersUpdate: () => Promise<void>;
}

export const OrdersTable = ({ orders, onOrdersUpdate }: OrdersTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell>
                <OrderStatusDialog 
                  orderId={order.id} 
                  currentStatus={order.status} 
                  onStatusUpdate={onOrdersUpdate} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
