
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { Order } from "@/types/database.types";

export const useCheckout = () => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);

      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Please sign in",
          description: "You need to be signed in to complete your order",
        });
        navigate("/signin");
        return;
      }

      console.log("Creating order for user:", session.user.id);

      // Create order - the trigger will automatically set user_id
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          total_amount: total,
          status: "completed"
        })
        .select()
        .single();

      if (orderError) {
        console.error("Order creation error:", orderError);
        throw orderError;
      }
      
      if (!orderData) throw new Error("Failed to create order");

      const order = orderData as Order;
      console.log("Order created:", order);

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        title: item.title
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error("Order items creation error:", itemsError);
        throw itemsError;
      }

      console.log("Order items created");

      // Send confirmation email
      const { error: emailError } = await supabase.functions.invoke("send-order-confirmation", {
        body: {
          to: session.user.email,
          orderDetails: {
            id: order.id,
            items: cartItems.map(item => ({
              title: item.title,
              quantity: item.quantity,
              price: item.price
            })),
            total: total
          }
        }
      });

      if (emailError) {
        console.error("Error sending email:", emailError);
        // Don't throw error here, as the order was still successful
      }

      clearCart();
      toast({
        title: "Order placed successfully!",
        description: "You will receive a confirmation email shortly.",
      });
      navigate("/profile", { state: { activeTab: "orders" }, replace: true });
    } catch (error: any) {
      console.error("Error processing order:", error);
      toast({
        variant: "destructive",
        title: "Error processing order",
        description: "Please try again later",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return {
    isCheckingOut,
    total,
    handleCheckout
  };
};
