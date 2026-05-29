import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Download, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { apiFetch } from '@/lib/api';
import { formatCents } from '@/lib/stripe';

export const InvoicesAdmin = () => {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery<any[]>({
    queryKey: ['admin-orders-for-invoices'],
    queryFn: () => apiFetch('/admin/orders'),
  });

  const generateMutation = useMutation({
    mutationFn: (orderId: string) =>
      apiFetch(`/admin/invoices/${orderId}/generate`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders-for-invoices'] });
    },
  });

  // Only show completed/paid orders
  const completedOrders = orders.filter(
    (o) => o.status === 'completed' || o.paid_at
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif-display text-3xl">Invoices</h2>
          <p className="text-sm text-muted-foreground font-mono-data uppercase">
            Generate and manage order invoices
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-orders-for-invoices'] })}
          className="gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-md" />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-border/20">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    No completed orders yet
                  </TableCell>
                </TableRow>
              ) : (
                completedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono-data text-sm font-bold">
                      #{order.order_number}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{order.guest_name || 'Customer'}</span>
                      <span className="block text-[10px] text-muted-foreground">
                        {order.guest_email || ''}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono-data text-[10px] capitalize">
                        {order.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono-data text-sm text-emerald">
                      {formatCents(order.total_cents)}
                    </TableCell>
                    <TableCell className="font-mono-data text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.invoice_number ? (
                        <Badge className="bg-emerald/20 text-emerald border-emerald/30 font-mono-data text-[10px]">
                          {order.invoice_number}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.invoice_number ? (
                        <Button size="sm" variant="outline" className="gap-1.5 font-mono-data text-xs">
                          <Download className="h-3 w-3" />
                          PDF
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="gap-1.5 bg-emerald text-[#15191a] font-mono-data text-xs hover:bg-emerald/90"
                          disabled={generateMutation.isPending}
                          onClick={() => generateMutation.mutate(order.id)}
                        >
                          <FileText className="h-3 w-3" />
                          Generate
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
