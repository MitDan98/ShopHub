import { ProductCard } from "./ProductCard";
import { useToast } from "@/components/ui/use-toast";

const FEATURED_PRODUCTS = [
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
  {
    id: 5,
    title: "Professional Camera Kit",
    price: 899.99,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    category: "Electronics",
  },
  {
    id: 6,
    title: "Designer Sunglasses",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
    category: "Accessories",
  },
  {
    id: 7,
    title: "Running Shoes",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    category: "Fashion",
  },
  {
    id: 8,
    title: "Smart Home Speaker",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230",
    category: "Electronics",
  },
];

export const FeaturedProducts = () => {
  const { toast } = useToast();

  const handleAddToCart = (productId: number) => {
    const product = FEATURED_PRODUCTS.find(p => p.id === productId);
    if (product) {
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
          {FEATURED_PRODUCTS.map((product) => (
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