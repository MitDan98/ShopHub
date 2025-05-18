
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const EmptyCart = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <p className="text-gray-600">Your cart is empty</p>
      <Button 
        className="mt-4"
        onClick={() => navigate("/products")}
      >
        Continue Shopping
      </Button>
    </div>
  );
};
