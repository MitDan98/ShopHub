
import { ProductCard } from "./ProductCard";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/hooks/useCart";
import { useState, useEffect } from "react";

interface Item {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
}

const FALLBACK_PRODUCTS = [
  {
    id: 1,
    title: "Premium Wireless Headphones",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    category: "Electronics",
  },
  {
    id: 2,
    title: "Organic Cotton T-Shirt",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    category: "Fashion",
  },
  {
    id: 3,
    title: "Smart Watch Series 5",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    category: "Electronics",
  },
  {
    id: 4,
    title: "Leather Crossbody Bag",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
    category: "Accessories",
  },
];

export const FeaturedProducts = () => {
  const [products, setProducts] = useState<Item[]>(FALLBACK_PRODUCTS);
  const { toast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    // Load items from localStorage (where admin items are stored)
    const savedItems = localStorage.getItem('admin_items');
    if (savedItems) {
      const adminItems = JSON.parse(savedItems);
      if (adminItems.length > 0) {
        setProducts(adminItems);
      }
    }
  }, []);

  const handleAddToCart = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image
      });
      
      toast({
        title: "Added to Cart",
        description: `${product.title} has been added to your cart.`,
      });
      console.log("Added to cart:", product);
    }
  };

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              {...product} 
              onAddToCart={() => handleAddToCart(product.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
