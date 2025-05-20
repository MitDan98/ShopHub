
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { Order } from "@/types/database.types";
import { orderItemsTable } from "@/integrations/supabase/customClient";
import { useLanguage } from "@/hooks/useLanguage";

export const useCheckout = () => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { t } = useLanguage();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);

      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: t('pleaseSignIn'),
          description: t('signInRequired'),
        });
        navigate("/signin");
        return;
      }

      console.log("Creating order for user:", session.user.id);
      
      // Create a new order object with explicit user_id
      const newOrder = {
        total_amount: total,
        status: "completed",
        user_id: session.user.id
      };
      
      // Insert the order directly using supabase client for more control
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert(newOrder)
        .select()
        .single();

      if (orderError) {
        console.error("Order creation error:", orderError);
        throw orderError;
      }
      
      console.log("Order created successfully:", orderData);
      
      if (!orderData) {
        throw new Error("Failed to create order - no data returned");
      }
      
      // We have the order object directly from the single() call
      const order = orderData;
        
      console.log("Order created:", order);

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        title: item.title
      }));

      const { error: itemsError } = await orderItemsTable.insert(orderItems);

      if (itemsError) {
        console.error("Order items creation error:", itemsError);
        throw itemsError;
      }

      console.log("Order items created");

      // Send confirmation email to the customer
      console.log("Sending order confirmation email to:", session.user.email);
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
        toast({
          title: t('orderSuccess'),
          description: "Your order has been placed, but there was an issue sending the confirmation email.",
        });
      } else {
        console.log("Order confirmation email sent successfully");
        toast({
          title: t('orderSuccess'),
          description: t('emailConfirmation'),
        });
      }

      // Clear cart after successful order
      clearCart();
      
      // Navigate to the profile page with orders tab active
      navigate("/profile", { state: { activeTab: "orders" }, replace: true });
    } catch (error: any) {
      console.error("Error processing order:", error);
      toast({
        variant: "destructive",
        title: t('orderError'),
        description: error.message || t('tryAgain'),
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
