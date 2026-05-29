import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { CartDrawer } from './CartDrawer';
import { cn } from '@/lib/utils';

export const CartFAB = () => {
  const [open, setOpen] = useState(false);
  const count = useCartStore((s) => s.itemCount());

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full',
          'bg-emerald text-[#15191a] shadow-lg shadow-emerald/25',
          'transition-all duration-300 hover:scale-110 hover:shadow-emerald/40',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          count > 0 && 'animate-fade-up'
        )}
        aria-label={`Open cart (${count} items)`}
      >
        <ShoppingCart className="h-6 w-6" />

        {/* Badge */}
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white font-mono-data">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      <CartDrawer open={open} onOpenChange={setOpen} />
    </>
  );
};
