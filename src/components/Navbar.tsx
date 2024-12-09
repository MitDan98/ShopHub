import { ShoppingCart, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Search",
      description: `Searching for: ${searchQuery}`,
    });
    console.log("Searching for:", searchQuery);
  };

  const handleCategoryClick = () => {
    navigate("/products");
    toast({
      title: "Categories",
      description: "Viewing all categories",
    });
  };

  const handleDealsClick = () => {
    navigate("/products");
    toast({
      title: "Deals",
      description: "Viewing current deals",
    });
  };

  const handleCartClick = () => {
    toast({
      title: "Cart",
      description: "Cart functionality coming soon!",
    });
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 
              className="text-2xl font-bold text-primary cursor-pointer" 
              onClick={() => navigate("/")}
            >
              ShopHub
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <form onSubmit={handleSearch} className="relative w-64">
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
            <Button variant="ghost" onClick={handleCategoryClick}>Categories</Button>
            <Button variant="ghost" onClick={handleDealsClick}>Deals</Button>
            <Button variant="ghost" onClick={handleCartClick}>
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button variant="secondary" onClick={handleSignIn}>Sign In</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </form>
              <Button variant="ghost" className="justify-start" onClick={handleCategoryClick}>
                Categories
              </Button>
              <Button variant="ghost" className="justify-start" onClick={handleDealsClick}>
                Deals
              </Button>
              <Button variant="ghost" className="justify-start" onClick={handleCartClick}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
              </Button>
              <Button variant="secondary" className="w-full" onClick={handleSignIn}>
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};