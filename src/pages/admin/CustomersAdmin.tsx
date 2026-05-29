import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Users, ShoppingBag, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { apiFetch } from '@/lib/api';
import { formatCents } from '@/lib/stripe';
import { cn } from '@/lib/utils';

interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  default_address?: string;
  created_at: string;
  order_count?: number;
  total_spent?: number;
  last_order_at?: string;
}

export const CustomersAdmin = () => {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ['admin-customers'],
    queryFn: () => apiFetch('/admin/customers'),
  });

  const { data: customerOrders } = useQuery<any[]>({
    queryKey: ['admin-customer-orders', expandedId],
    queryFn: () => apiFetch(`/admin/customers/${expandedId}`),
    enabled: !!expandedId,
  });

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif-display text-3xl">Customers</h2>
          <p className="text-sm text-muted-foreground font-mono-data uppercase">
            {customers.length} registered customer{customers.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="pl-10 bg-secondary/20 border-border/20 font-mono-data text-sm"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-md" />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-border/20">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((customer) => (
                  <>
                    <TableRow
                      key={customer.id}
                      className={cn(
                        'cursor-pointer transition-colors hover:bg-secondary/20',
                        expandedId === customer.id && 'bg-secondary/20'
                      )}
                      onClick={() =>
                        setExpandedId(expandedId === customer.id ? null : customer.id)
                      }
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">{customer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono-data text-xs">
                        {customer.phone || '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono-data text-[10px]">
                          <ShoppingBag className="h-3 w-3 mr-1" />
                          {customer.order_count ?? 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono-data text-sm text-emerald">
                        {customer.total_spent ? formatCents(customer.total_spent) : '€0.00'}
                      </TableCell>
                      <TableCell className="font-mono-data text-xs text-muted-foreground">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {expandedId === customer.id ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                    </TableRow>

                    {/* Expanded row — order history */}
                    {expandedId === customer.id && (
                      <TableRow key={`${customer.id}-detail`}>
                        <TableCell colSpan={6} className="bg-secondary/10 p-4">
                          <h4 className="font-serif-display text-sm mb-3">Recent Orders</h4>
                          {!customerOrders || customerOrders.length === 0 ? (
                            <p className="text-xs text-muted-foreground">No orders yet</p>
                          ) : (
                            <div className="space-y-2">
                              {customerOrders.map((order: any) => (
                                <div
                                  key={order.id}
                                  className="flex items-center justify-between rounded border border-border/10 bg-background p-2"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="font-mono-data text-xs font-bold">
                                      #{order.order_number}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className="font-mono-data text-[10px] capitalize"
                                    >
                                      {order.status.replace(/_/g, ' ')}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {order.type}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="font-mono-data text-xs text-emerald">
                                      {formatCents(order.total_cents)}
                                    </span>
                                    <span className="flex items-center gap-1 font-mono-data text-[10px] text-muted-foreground">
                                      <Clock className="h-3 w-3" />
                                      {new Date(order.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
