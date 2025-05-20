
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

interface OrderSummaryProps {
  total: number;
  onCheckout: () => void;
  isCheckingOut: boolean;
}

export const OrderSummary = ({ total, onCheckout, isCheckingOut }: OrderSummaryProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-fit">
      <h2 className="text-xl font-bold mb-4">{t('orderSummary')}</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>{t('subtotal')}</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('shipping')}</span>
          <span>{t('free')}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold">
            <span>{t('total')}</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <Button 
          className="w-full mt-4" 
          onClick={onCheckout}
          disabled={isCheckingOut}
        >
          {isCheckingOut ? t('processing') : t('checkout')}
        </Button>
      </div>
    </div>
  );
};
