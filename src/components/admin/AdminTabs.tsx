
import { EmptyState } from './EmptyState';
import { OrdersTable } from './OrdersTable';
import { ItemsManagement } from './ItemsManagement';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

interface AdminTabsProps {
  orders: any[];
  onOrdersUpdate: () => Promise<void>;
}

export const AdminTabs = ({ orders, onOrdersUpdate }: AdminTabsProps) => {
  return (
    <Tabs defaultValue="orders">
      <TabsList className="mb-4">
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="items">Items</TabsTrigger>
        <TabsTrigger value="customers">Customers</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      
      <TabsContent value="orders" className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">All Orders</h2>
        
        {orders.length === 0 ? (
          <EmptyState message="No orders available." />
        ) : (
          <OrdersTable orders={orders} onOrdersUpdate={onOrdersUpdate} />
        )}
      </TabsContent>

      <TabsContent value="items" className="bg-white rounded-lg shadow p-4">
        <ItemsManagement />
      </TabsContent>
      
      <TabsContent value="customers" className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Customer Management</h2>
        <EmptyState message="Customer management features coming soon." />
      </TabsContent>
      
      <TabsContent value="analytics" className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Analytics</h2>
        <EmptyState message="Analytics features coming soon." />
      </TabsContent>
    </Tabs>
  );
};
