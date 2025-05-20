
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { AuthLinks } from "@/components/auth/AuthLinks";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const NavbarWithLanguage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { t } = useLanguage();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Add state and handlers for AuthLinks component
  const [email, setEmail] = useState("");
  const isResettingPassword = false;
  
  const handleResetPassword = () => {
    console.log("Password reset functionality would go here");
    // This is just a placeholder function since we're not implementing actual reset functionality here
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            {t('appName')}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-primary">
            {t('home')}
          </Link>
          <Link to="/products" className="text-gray-600 hover:text-primary">
            {t('products')}
          </Link>
          <AuthLinks 
            email={email}
            isResettingPassword={isResettingPassword}
            onResetPassword={handleResetPassword}
          />
          <Link to="/cart" className="relative">
            <ShoppingBag className="h-6 w-6 text-gray-600 hover:text-primary" />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {totalItems}
              </Badge>
            )}
          </Link>
          <LanguageToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 md:hidden">
          <Link to="/cart" className="relative">
            <ShoppingBag className="h-6 w-6 text-gray-600" />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {totalItems}
              </Badge>
            )}
          </Link>
          <LanguageToggle />
          <button onClick={toggleMobileMenu} className="text-gray-600">
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2 flex flex-col">
            <Link
              to="/"
              className="py-2 text-gray-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('home')}
            </Link>
            <Link
              to="/products"
              className="py-2 text-gray-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('products')}
            </Link>
            <div className="py-2">
              <AuthLinks 
                email={email}
                isResettingPassword={isResettingPassword}
                onResetPassword={handleResetPassword}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
