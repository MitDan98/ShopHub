
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available languages
export type Language = 'en' | 'ro';

// Define translations interface
type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

// Create translations object
export const translations: Translations = {
  en: {
    // General
    appName: "ShopHub",
    search: "Search",
    home: "Home",
    products: "Products",
    cart: "Cart",
    profile: "Profile",
    signIn: "Sign In",
    register: "Register",
    logout: "Logout",
    
    // Cart
    emptyCart: "Your cart is empty",
    startShopping: "Start Shopping",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
    free: "Free",
    checkout: "Checkout",
    processing: "Processing...",
    
    // Checkout
    orderSuccess: "Order placed successfully!",
    emailConfirmation: "You will receive a confirmation email shortly.",
    pleaseSignIn: "Please sign in",
    signInRequired: "You need to be signed in to complete your order",
    orderError: "Error processing order",
    tryAgain: "Please try again later",
  },
  ro: {
    // General
    appName: "ShopHub",
    search: "Căutare",
    home: "Acasă",
    products: "Produse",
    cart: "Coș",
    profile: "Profil",
    signIn: "Autentificare",
    register: "Înregistrare",
    logout: "Deconectare",
    
    // Cart
    emptyCart: "Coșul tău este gol",
    startShopping: "Începe Cumpărăturile",
    orderSummary: "Sumar Comandă",
    subtotal: "Subtotal",
    shipping: "Transport",
    total: "Total",
    free: "Gratuit",
    checkout: "Finalizare comandă",
    processing: "Se procesează...",
    
    // Checkout
    orderSuccess: "Comandă plasată cu succes!",
    emailConfirmation: "Vei primi un email de confirmare în curând.",
    pleaseSignIn: "Vă rugăm să vă autentificați",
    signInRequired: "Trebuie să fiți autentificat pentru a finaliza comanda",
    orderError: "Eroare la procesarea comenzii",
    tryAgain: "Vă rugăm să încercați din nou mai târziu",
  }
};

// Create the language context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create the provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to get saved language from localStorage or default to English
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language');
    return (savedLang === 'ro' || savedLang === 'en') ? savedLang : 'en';
  });

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
