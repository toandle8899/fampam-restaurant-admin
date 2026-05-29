import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCartStore } from '@/stores/cartStore';
import { formatCents } from '@/lib/stripe';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CartDrawer = ({ open, onOpenChange }: CartDrawerProps) => {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore((s) => s.subtotalCents());
  const orderType = useCartStore((s) => s.orderType);
  const deliveryFee = useCartStore((s) => s.deliveryFeeCents);
  const total = useCartStore((s) => s.totalCents());
  const navigate = useNavigate();

  const handleCheckout = () => {
    onOpenChange(false);
    navigate('/checkout');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col bg-background sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif-display text-2xl">Your Order</SheetTitle>
          <SheetDescription className="font-mono-data text-xs text-muted-foreground uppercase tracking-wider">
            {items.length} {items.length === 1 ? 'item' : 'items'} in cart
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-secondary/50 p-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <p className="font-serif-display text-lg text-foreground">Cart is empty</p>
              <p className="text-sm text-muted-foreground">Add items from the menu to get started</p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-3 py-2">
                {items.map((item) => {
                  const key = item.variantName
                    ? `${item.dishId}::${item.variantName}`
                    : item.dishId;
                  return (
                    <div
                      key={key}
                      className="group flex items-start gap-3 rounded-md border border-border/10 bg-secondary/20 p-3 transition-colors hover:border-border/20"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-serif-display text-sm leading-tight text-foreground">
                          {item.name}
                        </p>
                        {item.variantName && (
                          <p className="mt-0.5 font-mono-data text-[10px] text-muted-foreground">
                            {item.variantName}
                          </p>
                        )}
                        <p className="mt-1 font-mono-data text-xs text-emerald">
                          {formatCents(item.priceCents)} each
                        </p>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            updateQuantity(item.dishId, item.quantity - 1, item.variantName)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center font-mono-data text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            updateQuantity(item.dishId, item.quantity + 1, item.variantName)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Line total + delete */}
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-mono-data text-sm font-semibold text-foreground">
                          {formatCents(item.priceCents * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.dishId, item.variantName)}
                          className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="space-y-3 pt-4">
              <Separator className="bg-border/15" />

              {/* Totals */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono-data text-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCents(subtotal)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between font-mono-data text-xs text-muted-foreground">
                    <span>Delivery Fee</span>
                    <span>{formatCents(deliveryFee)}</span>
                  </div>
                )}
                <Separator className="bg-border/10" />
                <div className="flex justify-between font-serif-display text-lg">
                  <span>Total</span>
                  <span className="text-emerald">{formatCents(total)}</span>
                </div>
              </div>

              <SheetFooter className="flex-col gap-2 sm:flex-col">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-emerald text-[#15191a] font-mono-data hover:bg-emerald/90"
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="w-full text-xs text-muted-foreground hover:text-destructive"
                >
                  Clear Cart
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
