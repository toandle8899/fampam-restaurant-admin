import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, Package, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/authStore';
import { apiFetch } from '@/lib/api';
import { formatCents } from '@/lib/stripe';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  received: 'border-yellow-500 text-yellow-500',
  preparing: 'border-info text-info',
  ready: 'border-emerald text-emerald',
  out_for_delivery: 'border-info text-info',
  completed: 'border-emerald/60 text-emerald/60',
  cancelled: 'border-destructive text-destructive',
};

const CustomerDashboard = () => {
  const customer = useAuthStore((s) => s.customer);
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const { data: orders, isLoading } = useQuery<any[]>({
    queryKey: ['my-orders'],
    queryFn: () =>
      apiFetch('/orders/my', {
        headers: { Authorization: `Bearer ${token}` },
      }),
    enabled: !!token,
  });

  if (!customer) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
        <p className="font-serif-display text-2xl">Please sign in</p>
        <Link to="/account" className="font-mono-data text-sm text-emerald hover:underline">
          Sign In →
        </Link>
      </main>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/order');
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="hairline-b sticky top-0 z-30 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              to="/order"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-mono-data text-xs">Menu</span>
            </Link>
            <div className="h-5 w-px bg-border/15" />
            <h1 className="font-serif-display text-lg">My Orders</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 font-mono-data text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </header>

      <div className="container mx-auto max-w-2xl px-4 py-8 space-y-6">
        {/* Greeting */}
        <div>
          <h2 className="font-serif-display text-2xl">Hello, {customer.name}</h2>
          <p className="font-mono-data text-xs text-muted-foreground">{customer.email}</p>
        </div>

        {/* Orders list */}
        <div>
          <h3 className="font-serif-display text-lg mb-4">Order History</h3>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="rounded-lg border border-border/15 bg-secondary/20 p-8 text-center">
              <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-serif-display text-lg">No orders yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your order history will appear here
              </p>
              <Link
                to="/order"
                className="inline-block mt-4 font-mono-data text-sm text-emerald hover:underline"
              >
                Browse menu →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order: any) => {
                const parsedItems =
                  typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                const itemCount = parsedItems.reduce(
                  (sum: number, i: any) => sum + i.quantity,
                  0
                );

                return (
                  <Link
                    key={order.id}
                    to={`/order/${order.id}`}
                    className="group flex items-center gap-4 rounded-lg border border-border/10 bg-secondary/20 p-4 transition-all hover:border-emerald/20 hover:bg-secondary/30"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono-data text-sm font-semibold">
                          #{order.order_number}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            'font-mono-data text-[10px] capitalize',
                            statusColors[order.status] || ''
                          )}
                        >
                          {order.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {itemCount} item{itemCount !== 1 ? 's' : ''} ·{' '}
                        {order.type === 'delivery' ? 'Delivery' : 'Pick-up'}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground font-mono-data">
                        <Clock className="h-3 w-3" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono-data text-sm font-semibold text-emerald">
                        {formatCents(order.total_cents)}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CustomerDashboard;
