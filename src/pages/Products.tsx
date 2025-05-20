
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Navbar } from "@/components/Navbar";

const Products = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Products</h1>
        <FeaturedProducts />
      </main>
    </div>
  );
};

export default Products;
