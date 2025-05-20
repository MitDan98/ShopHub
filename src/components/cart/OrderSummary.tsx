
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  total: number;
  onCheckout: () => void;
  isCheckingOut: boolean;
}

export const OrderSummary = ({ total, onCheckout, isCheckingOut }: OrderSummaryProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-fit">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <Button 
          className="w-full mt-4" 
          onClick={onCheckout}
          disabled={isCheckingOut}
        >
          {isCheckingOut ? "Processing..." : "Checkout"}
        </Button>
      </div>
    </div>
  );
};
