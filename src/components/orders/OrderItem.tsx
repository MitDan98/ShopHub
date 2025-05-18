
import { OrderItem as OrderItemType } from "@/types/database.types";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface OrderItemProps {
  item: OrderItemType;
}

export const OrderItem = ({ item }: OrderItemProps) => {
  return (
    <TableRow>
      <TableCell>{item.title}</TableCell>
      <TableCell className="text-right">{item.quantity}</TableCell>
      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
    </TableRow>
  );
};
