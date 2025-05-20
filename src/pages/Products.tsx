
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { NavbarWithLanguage } from "@/components/NavbarWithLanguage";
import { useLanguage } from "@/hooks/useLanguage";

const Products = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarWithLanguage />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('products')}</h1>
        <FeaturedProducts />
      </main>
    </div>
  );
};

export default Products;
