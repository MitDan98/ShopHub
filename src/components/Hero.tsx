import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative bg-primary text-white py-20">
      <div className="container">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeIn">
            Discover Amazing Products
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Shop the latest trends with our curated collection of premium products.
            Free shipping on orders over $50.
          </p>
          <Button variant="secondary" size="lg" className="animate-fadeIn">
            Shop Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8')] opacity-10 bg-cover bg-center" />
    </section>
  );
};