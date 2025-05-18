
import { Navbar } from "@/components/Navbar";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/components/cart/CartItem";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { useCheckout } from "@/hooks/useCheckout";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const { total, isCheckingOut, handleCheckout } = useCheckout();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  price={item.price}
                  image={item.image}
                  quantity={item.quantity}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </div>
            <OrderSummary
              total={total}
              onCheckout={handleCheckout}
              isCheckingOut={isCheckingOut}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
