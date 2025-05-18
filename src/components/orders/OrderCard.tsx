
import { Order, OrderItem, OrderTracking } from "@/types/database.types";
import { Badge } from "@/components/ui/badge";
import { OrderStatusBadge } from "../admin/OrderStatusBadge";
import { OrderItem as OrderItemComponent } from "./OrderItem";
import { OrderTrackingHistory } from "./OrderTrackingHistory";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";

interface OrderCardProps {
  order: Order;
  orderItems: OrderItem[];
  orderTracking: OrderTracking[];
  formatDate: (dateString: string) => string;
}

export const OrderCard = ({ 
  order, 
  orderItems, 
  orderTracking,
  formatDate 
}: OrderCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <p className="text-sm text-gray-500">
            Order placed on {formatDate(order.created_at)}
          </p>
          <p className="text-sm font-medium">Order #{order.id.split('-')[0]}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Status:</span>
          <OrderStatusBadge status={order.status || 'pending'} />
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
                  {orderItems?.map(item => (
                    <OrderItemComponent key={item.id} item={item} />
                  ))}
                </TableBody>
                <tfoot className="border-t bg-muted/50 font-medium">
                  <tr>
                    <td colSpan={2} className="p-2 pl-4">Total</td>
                    <td className="p-2 pr-4 text-right">${order.total_amount.toFixed(2)}</td>
                  </tr>
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
                <OrderTrackingHistory tracking={orderTracking} formatDate={formatDate} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
