import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, ChefHat, CheckCircle2, Truck, RefreshCw, Clock, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { apiFetch } from '@/lib/api';
import { formatCents } from '@/lib/stripe';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  order_number: number;
  customer_id?: string;
  guest_email?: string;
  guest_name?: string;
  type: 'pickup' | 'delivery';
  status: string;
  items: string;
  subtotal_cents: number;
  delivery_fee_cents: number;
  total_cents: number;
  delivery_address?: string;
  delivery_phone?: string;
  delivery_notes?: string;
  created_at: string;
}

const COLUMNS = [
  { key: 'received', label: 'Received', icon: Package, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  { key: 'preparing', label: 'Preparing', icon: ChefHat, color: 'text-info', bg: 'bg-info/10 border-info/20' },
  { key: 'ready', label: 'Ready / Out', icon: Truck, color: 'text-emerald', bg: 'bg-emerald/10 border-emerald/20' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-muted-foreground', bg: 'bg-muted/10 border-muted/20' },
];

const NEXT_STATUS: Record<string, string> = {
  received: 'preparing',
  preparing: 'ready',
  ready: 'out_for_delivery',
  out_for_delivery: 'completed',
};

export const OrdersAdmin = () => {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['admin-orders'],
    queryFn: () => apiFetch('/admin/orders'),
    refetchInterval: 5_000, // real-time polling every 5s
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiFetch(`/admin/orders/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/admin/orders/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  });

  const getColumnOrders = (key: string) => {
    if (key === 'ready') {
      return orders.filter((o) => o.status === 'ready' || o.status === 'out_for_delivery');
    }
    return orders.filter((o) => o.status === key);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif-display text-3xl">Order Management</h2>
          <p className="text-sm text-muted-foreground font-mono-data uppercase">
            Live feed · Auto-refreshing every 5s
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-orders'] })}
          className="gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((col) => {
          const colOrders = getColumnOrders(col.key);
          const Icon = col.icon;

          return (
            <div key={col.key} className={cn('rounded-lg border p-3', col.bg)}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className={cn('h-4 w-4', col.color)} />
                <h3 className="font-mono-data text-xs font-semibold uppercase tracking-wider">
                  {col.label}
                </h3>
                <Badge variant="outline" className="ml-auto font-mono-data text-[10px]">
                  {colOrders.length}
                </Badge>
              </div>

              <ScrollArea className="max-h-[calc(100vh-280px)]">
                <div className="space-y-2">
                  {colOrders.length === 0 && (
                    <p className="text-center text-xs text-muted-foreground py-4">
                      No orders
                    </p>
                  )}
                  {colOrders.map((order) => {
                    const items =
                      typeof order.items === 'string'
                        ? JSON.parse(order.items)
                        : order.items;
                    const customerName = order.guest_name || 'Customer';
                    const customerEmail = order.guest_email || '';

                    return (
                      <div
                        key={order.id}
                        className="rounded-md border border-border/15 bg-background p-3 space-y-2"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono-data text-sm font-bold">
                            #{order.order_number}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              'font-mono-data text-[10px]',
                              order.type === 'delivery'
                                ? 'border-info/40 text-info'
                                : 'border-emerald/40 text-emerald'
                            )}
                          >
                            {order.type}
                          </Badge>
                        </div>

                        {/* Customer */}
                        <div className="text-xs text-muted-foreground">
                          <p className="font-semibold text-foreground text-sm">{customerName}</p>
                          {customerEmail && <p className="text-[10px]">{customerEmail}</p>}
                        </div>

                        {/* Items */}
                        <div className="space-y-0.5">
                          {items.map((item: any, idx: number) => (
                            <p key={idx} className="font-mono-data text-[11px] text-muted-foreground">
                              {item.quantity}× {item.name}
                              {item.variant && ` (${item.variant})`}
                            </p>
                          ))}
                        </div>

                        {/* Delivery info */}
                        {order.type === 'delivery' && order.delivery_address && (
                          <div className="rounded bg-secondary/30 p-2 space-y-1">
                            <div className="flex items-start gap-1.5">
                              <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
                              <p className="text-[10px] text-muted-foreground">{order.delivery_address}</p>
                            </div>
                            {order.delivery_phone && (
                              <div className="flex items-center gap-1.5">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <p className="text-[10px] text-muted-foreground">{order.delivery_phone}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Total + time */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono-data text-sm font-semibold text-emerald">
                            {formatCents(order.total_cents)}
                          </span>
                          <span className="flex items-center gap-1 font-mono-data text-[10px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(order.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        {/* Actions */}
                        {col.key !== 'completed' && (
                          <div className="flex gap-2 pt-1">
                            {NEXT_STATUS[order.status] && (
                              <Button
                                size="sm"
                                className="flex-1 bg-emerald text-[#15191a] font-mono-data text-xs hover:bg-emerald/90"
                                disabled={updateMutation.isPending}
                                onClick={() =>
                                  updateMutation.mutate({
                                    id: order.id,
                                    status: NEXT_STATUS[order.status],
                                  })
                                }
                              >
                                Advance →
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="font-mono-data text-xs text-destructive border-destructive/30 hover:bg-destructive hover:text-white"
                              disabled={cancelMutation.isPending}
                              onClick={() => cancelMutation.mutate(order.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>
    </div>
  );
};
