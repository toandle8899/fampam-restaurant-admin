import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Truck, Store, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { DeliveryForm } from '@/components/pos/DeliveryForm';
import { formatCents } from '@/lib/stripe';
import { getStripe } from '@/lib/stripe';
import { apiFetch } from '@/lib/api';

const Checkout = () => {
  const items = useCartStore((s) => s.items);
  const orderType = useCartStore((s) => s.orderType);
  const setOrderType = useCartStore((s) => s.setOrderType);
  const deliveryInfo = useCartStore((s) => s.deliveryInfo);
  const deliveryFee = useCartStore((s) => s.deliveryFeeCents);
  const subtotal = useCartStore((s) => s.subtotalCents());
  const total = useCartStore((s) => s.totalCents());
  const navigate = useNavigate();
  const customer = useAuthStore((s) => s.customer);
  const token = useAuthStore((s) => s.token);

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
        <p className="font-serif-display text-2xl">Cart is empty</p>
        <Link
          to="/order"
          className="font-mono-data text-sm text-emerald hover:underline"
        >
          ← Back to menu
        </Link>
      </main>
    );
  }

  const canCheckout = () => {
    if (!customer && (!guestName.trim() || !guestEmail.trim())) return false;
    if (orderType === 'delivery' && !deliveryInfo.address.trim()) return false;
    if (orderType === 'delivery' && !deliveryInfo.phone.trim()) return false;
    return true;
  };

  const handlePay = async () => {
    setLoading(true);
    setError('');

    try {
      const payload: any = {
        items: items.map((i) => ({
          dish_id: i.dishId,
          code: i.code,
          name: i.name,
          variant: i.variantName,
          quantity: i.quantity,
          price_cents: i.priceCents,
        })),
        order_type: orderType,
        subtotal_cents: subtotal,
        delivery_fee_cents: orderType === 'delivery' ? deliveryFee : 0,
        total_cents: total,
      };

      if (customer) {
        payload.customer_id = customer.id;
      } else {
        payload.guest_name = guestName;
        payload.guest_email = guestEmail;
      }

      if (orderType === 'delivery') {
        payload.delivery_address = deliveryInfo.address;
        payload.delivery_phone = deliveryInfo.phone;
        payload.delivery_notes = deliveryInfo.notes;
      }

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const { sessionId, mock, orderId } = await apiFetch('/stripe/create-checkout-session', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (mock) {
        navigate(`/mock-stripe?order_id=${orderId}&total=${total}`);
        return;
      }

      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      if (stripe && sessionId) {
        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
        if (stripeError) {
          setError(stripeError.message || 'Payment failed');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create checkout session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="hairline-b sticky top-0 z-30 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex items-center gap-3 px-4 py-3">
          <Link
            to="/order"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono-data text-xs">Menu</span>
          </Link>
          <div className="h-5 w-px bg-border/15" />
          <h1 className="font-serif-display text-lg">Checkout</h1>
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Order type */}
            <section>
              <h2 className="font-serif-display text-xl mb-3">Order Type</h2>
              <Tabs
                value={orderType}
                onValueChange={(v) => setOrderType(v as 'pickup' | 'delivery')}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="pickup" className="flex-1 gap-2">
                    <Store className="h-4 w-4" />
                    Pick-up
                  </TabsTrigger>
                  <TabsTrigger value="delivery" className="flex-1 gap-2">
                    <Truck className="h-4 w-4" />
                    Delivery
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pickup" className="mt-4">
                  <div className="rounded-lg border border-border/15 bg-secondary/20 p-4">
                    <p className="font-mono-data text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Pick-up Location
                    </p>
                    <p className="font-serif-display text-sm">
                      FamPam Restaurant
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Lietzenburger Str. 77, 10719 Berlin
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="delivery" className="mt-4">
                  <DeliveryForm />
                </TabsContent>
              </Tabs>
            </section>

            {/* Customer info */}
            {!customer && (
              <section>
                <h2 className="font-serif-display text-xl mb-3">Your Info</h2>
                <div className="space-y-3 rounded-lg border border-border/15 bg-secondary/20 p-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="guest-name" className="font-mono-data text-xs text-muted-foreground">
                      Name *
                    </Label>
                    <Input
                      id="guest-name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Your name"
                      className="bg-background border-border/20 font-mono-data text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="guest-email" className="font-mono-data text-xs text-muted-foreground">
                      Email *
                    </Label>
                    <Input
                      id="guest-email"
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="bg-background border-border/20 font-mono-data text-sm"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono-data">
                    Have an account?{' '}
                    <Link to="/account" className="text-emerald hover:underline">
                      Sign in
                    </Link>{' '}
                    for faster checkout
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* Right column — order summary */}
          <div className="space-y-4">
            <h2 className="font-serif-display text-xl">Order Summary</h2>
            <div className="rounded-lg border border-border/15 bg-secondary/20 p-4 space-y-3">
              <Table>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.variantName ? `${item.dishId}::${item.variantName}` : item.dishId} className="border-border/10">
                      <TableCell className="py-2 pl-0">
                        <span className="font-mono-data text-xs text-muted-foreground">{item.quantity}×</span>
                      </TableCell>
                      <TableCell className="py-2">
                        <span className="text-sm">{item.name}</span>
                        {item.variantName && (
                          <span className="block text-[10px] text-muted-foreground font-mono-data">
                            {item.variantName}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="py-2 pr-0 text-right font-mono-data text-sm">
                        {formatCents(item.priceCents * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator className="bg-border/10" />

              <div className="space-y-1">
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
              </div>

              <Separator className="bg-border/10" />

              <div className="flex justify-between font-serif-display text-lg">
                <span>Total</span>
                <span className="text-emerald">{formatCents(total)}</span>
              </div>
            </div>

            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
                <p className="font-mono-data text-xs text-destructive">{error}</p>
              </div>
            )}

            <Button
              onClick={handlePay}
              disabled={loading || !canCheckout()}
              className="w-full gap-2 bg-emerald text-[#15191a] font-mono-data hover:bg-emerald/90 h-12"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              {loading ? 'Processing...' : `Pay ${formatCents(total)}`}
            </Button>

            <p className="text-center text-[10px] text-muted-foreground font-mono-data">
              Secured by Stripe · Test mode
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
