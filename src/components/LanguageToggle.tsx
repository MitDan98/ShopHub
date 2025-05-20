
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ro' : 'en');
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="rounded-full px-3 text-xs" 
      onClick={toggleLanguage}
    >
      {language === 'en' ? 'RO' : 'EN'}
    </Button>
  );
};
