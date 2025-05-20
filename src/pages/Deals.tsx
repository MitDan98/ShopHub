
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { NavbarWithLanguage } from "@/components/NavbarWithLanguage";

const Deals = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarWithLanguage />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Deals</h1>
        <div className="mb-8">
          <p className="text-lg text-gray-600">Check out our latest special offers and discounts!</p>
        </div>
        <FeaturedProducts />
      </main>
    </div>
  );
};

export default Deals;
