import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, ChefHat, Truck, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { apiFetch } from '@/lib/api';
import { formatCents } from '@/lib/stripe';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  order_number: number;
  type: 'pickup' | 'delivery';
  status: string;
  items: { name: string; variant?: string; quantity: number; price_cents: number }[];
  subtotal_cents: number;
  delivery_fee_cents: number;
  total_cents: number;
  delivery_address?: string;
  created_at: string;
}

const STATUS_STEPS = [
  { key: 'received', label: 'Received', icon: Package },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'ready', label: 'Ready', icon: CheckCircle2 },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'completed', label: 'Completed', icon: CheckCircle2 },
];

const getStatusIndex = (status: string) => {
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
};

const OrderTracking = () => {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['order', id],
    queryFn: () => apiFetch(`/orders/${id}`),
    refetchInterval: 10_000, // poll every 10s for live updates
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground p-8">
        <div className="container mx-auto max-w-2xl space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
        <p className="font-serif-display text-2xl">Order not found</p>
        <Link to="/order" className="font-mono-data text-sm text-emerald hover:underline">
          ← Back to menu
        </Link>
      </main>
    );
  }

  const currentIdx = getStatusIndex(order.status);
  const isCancelled = order.status === 'cancelled';
  const isDelivery = order.type === 'delivery';
  const steps = isDelivery
    ? STATUS_STEPS
    : STATUS_STEPS.filter((s) => s.key !== 'out_for_delivery');

  const parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="hairline-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex items-center gap-3 px-4 py-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono-data text-xs">Orders</span>
          </Link>
          <div className="h-5 w-px bg-border/15" />
          <h1 className="font-serif-display text-lg">Order #{order.order_number}</h1>
        </div>
      </header>

      <div className="container mx-auto max-w-2xl px-4 py-8 space-y-8">
        {/* Status timeline */}
        {isCancelled ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center">
            <XCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
            <p className="font-serif-display text-xl text-destructive">Order Cancelled</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border/15 bg-secondary/20 p-6">
            <h2 className="font-serif-display text-xl mb-6 text-center">Order Status</h2>
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => {
                const stepIdx = STATUS_STEPS.findIndex((s) => s.key === step.key);
                const isActive = stepIdx <= currentIdx;
                const isCurrent = stepIdx === currentIdx;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex flex-1 flex-col items-center relative">
                    {/* Connector line */}
                    {idx > 0 && (
                      <div
                        className={cn(
                          'absolute top-5 right-1/2 w-full h-0.5',
                          isActive ? 'bg-emerald' : 'bg-border/20'
                        )}
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <div
                      className={cn(
                        'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                        isCurrent
                          ? 'border-emerald bg-emerald/20 text-emerald scale-110'
                          : isActive
                          ? 'border-emerald bg-emerald text-[#15191a]'
                          : 'border-border/20 bg-secondary/30 text-muted-foreground'
                      )}
                    >
                      {isCurrent ? (
                        <div className="relative">
                          <Icon className="h-5 w-5" />
                          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald anim-blink-soft" />
                        </div>
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={cn(
                        'mt-2 text-center font-mono-data text-[10px] uppercase tracking-wider',
                        isCurrent ? 'text-emerald font-semibold' : 'text-muted-foreground'
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order details */}
        <div className="rounded-lg border border-border/15 bg-secondary/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display text-lg">Order Details</h3>
            <Badge
              variant="outline"
              className={cn(
                'font-mono-data text-[10px]',
                isDelivery
                  ? 'border-info/40 text-info'
                  : 'border-emerald/40 text-emerald'
              )}
            >
              {isDelivery ? 'Delivery' : 'Pick-up'}
            </Badge>
          </div>

          <Table>
            <TableBody>
              {parsedItems.map((item: any, idx: number) => (
                <TableRow key={idx} className="border-border/10">
                  <TableCell className="py-2 pl-0 font-mono-data text-xs text-muted-foreground w-8">
                    {item.quantity}×
                  </TableCell>
                  <TableCell className="py-2 text-sm">
                    {item.name}
                    {item.variant && (
                      <span className="block text-[10px] text-muted-foreground font-mono-data">
                        {item.variant}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-2 pr-0 text-right font-mono-data text-sm">
                    {formatCents(item.price_cents * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Separator className="bg-border/10" />

          <div className="space-y-1">
            <div className="flex justify-between font-mono-data text-xs text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCents(order.subtotal_cents)}</span>
            </div>
            {order.delivery_fee_cents > 0 && (
              <div className="flex justify-between font-mono-data text-xs text-muted-foreground">
                <span>Delivery</span>
                <span>{formatCents(order.delivery_fee_cents)}</span>
              </div>
            )}
            <Separator className="bg-border/10" />
            <div className="flex justify-between font-serif-display text-lg">
              <span>Total</span>
              <span className="text-emerald">{formatCents(order.total_cents)}</span>
            </div>
          </div>

          {order.delivery_address && (
            <>
              <Separator className="bg-border/10" />
              <div>
                <p className="font-mono-data text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  Delivery Address
                </p>
                <p className="text-sm">{order.delivery_address}</p>
              </div>
            </>
          )}

          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono-data">
            <Clock className="h-3 w-3" />
            <span>Placed {new Date(order.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderTracking;
