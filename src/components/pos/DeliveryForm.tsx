import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCartStore } from '@/stores/cartStore';

export const DeliveryForm = () => {
  const deliveryInfo = useCartStore((s) => s.deliveryInfo);
  const setDeliveryInfo = useCartStore((s) => s.setDeliveryInfo);

  return (
    <div className="space-y-4 rounded-lg border border-border/15 bg-secondary/20 p-4">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-emerald anim-blink-soft" />
        <h3 className="label-kicker">Delivery Details</h3>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="delivery-address" className="font-mono-data text-xs text-muted-foreground">
            Delivery Address *
          </Label>
          <Input
            id="delivery-address"
            value={deliveryInfo.address}
            onChange={(e) => setDeliveryInfo({ address: e.target.value })}
            placeholder="Lietzenburger Str. 77, 10719 Berlin"
            className="bg-background border-border/20 font-mono-data text-sm"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="delivery-phone" className="font-mono-data text-xs text-muted-foreground">
            Phone Number *
          </Label>
          <Input
            id="delivery-phone"
            type="tel"
            value={deliveryInfo.phone}
            onChange={(e) => setDeliveryInfo({ phone: e.target.value })}
            placeholder="+49 30 123 4567"
            className="bg-background border-border/20 font-mono-data text-sm"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="delivery-notes" className="font-mono-data text-xs text-muted-foreground">
            Delivery Notes (optional)
          </Label>
          <Textarea
            id="delivery-notes"
            value={deliveryInfo.notes}
            onChange={(e) => setDeliveryInfo({ notes: e.target.value })}
            placeholder="Floor, buzzer code, instructions..."
            className="bg-background border-border/20 font-mono-data text-sm min-h-[60px]"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};
