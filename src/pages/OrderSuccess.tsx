import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const clearCart = useCartStore((s) => s.clearCart);

  // Clear cart on successful payment
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4">
      <div className="max-w-md text-center space-y-6">
        {/* Success icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald/15 border-2 border-emerald/30">
          <CheckCircle2 className="h-10 w-10 text-emerald" />
        </div>

        <div>
          <h1 className="font-serif-display text-3xl mb-2">Order Confirmed!</h1>
          <p className="text-sm text-muted-foreground">
            Thank you for your order. We'll start preparing it right away.
          </p>
        </div>

        {/* Order ID */}
        {orderId && (
          <div className="rounded-lg border border-border/15 bg-secondary/20 p-4 inline-block">
            <p className="font-mono-data text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
              Order Reference
            </p>
            <p className="font-mono-data text-sm text-emerald">{orderId.slice(0, 8)}...</p>
          </div>
        )}

        {/* Confirmation message */}
        <div className="rounded-lg border border-emerald/20 bg-emerald/5 p-4">
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent. You can track your order status in real-time.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {orderId && (
            <Button asChild className="gap-2 bg-emerald text-[#15191a] font-mono-data hover:bg-emerald/90">
              <Link to={`/order/${orderId}`}>
                Track Order
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" className="gap-2 font-mono-data">
            <Link to="/order">
              <ShoppingBag className="h-4 w-4" />
              Order More
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccess;
