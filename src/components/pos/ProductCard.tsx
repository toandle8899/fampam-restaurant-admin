import { useState } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCartStore } from '@/stores/cartStore';
import { cn } from '@/lib/utils';
import type { MenuItem } from '@/hooks/useMenu';

interface ProductCardProps {
  item: MenuItem;
}

export const ProductCard = ({ item }: ProductCardProps) => {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    item.hasVariants && item.variants?.length ? item.variants[0].name : undefined
  );
  const [justAdded, setJustAdded] = useState(false);

  const getPrice = () => {
    if (item.hasVariants && selectedVariant) {
      const v = item.variants?.find((v) => v.name === selectedVariant);
      return v?.price_cents ?? 0;
    }
    const cleanedPrice = item.price.replace('€', '').replace(',', '.').trim();
    return Math.round(parseFloat(cleanedPrice) * 100) || 0;
  };

  const priceCents = getPrice();

  const cartItem = items.find(
    (i) =>
      i.dishId === item.dbId &&
      (selectedVariant ? i.variantName === selectedVariant : !i.variantName)
  );
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    addItem({
      dishId: item.dbId,
      code: item.id,
      name: item.name,
      variantName: selectedVariant,
      priceCents,
      image: item.image,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 600);
  };

  const dietaryColors: Record<string, string> = {
    VV: 'bg-green-800/40 text-green-300 border-green-700/50',
    V: 'bg-emerald/20 text-emerald border-emerald/30',
    GF: 'bg-amber/20 text-amber border-amber/30',
    NF: 'bg-orange-800/30 text-orange-300 border-orange-700/40',
    SF: 'bg-blue-800/30 text-blue-300 border-blue-700/40',
  };

  return (
    <div className="group relative rounded-lg border border-border/10 bg-secondary/30 p-4 transition-all duration-300 hover:border-emerald/20 hover:bg-secondary/50">
      {/* Image (if available) */}
      {item.showImage && item.image && (
        <div className="mb-3 aspect-[4/3] overflow-hidden rounded-md">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      {/* Header */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif-display text-base leading-tight text-foreground">
            {item.name}
          </h3>
          {item.description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
        <span className="font-mono-data text-sm font-semibold text-emerald whitespace-nowrap">
          {priceCents > 0 ? `€${(priceCents / 100).toFixed(2)}` : '—'}
        </span>
      </div>

      {/* Dietary badges */}
      {item.dietary.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {item.dietary.map((d) => (
            <Badge
              key={d}
              variant="outline"
              className={cn(
                'px-1.5 py-0 text-[10px] font-mono-data border',
                dietaryColors[d] || 'bg-muted text-muted-foreground'
              )}
            >
              {d}
            </Badge>
          ))}
          {item.spice > 0 && (
            <Badge variant="outline" className="px-1.5 py-0 text-[10px] font-mono-data border border-red-700/40 bg-red-900/30 text-red-300">
              {'🌶'.repeat(item.spice)}
            </Badge>
          )}
        </div>
      )}

      {/* Variant selector */}
      {item.hasVariants && item.variants && item.variants.length > 0 && (
        <div className="mb-3">
          <Select value={selectedVariant} onValueChange={setSelectedVariant}>
            <SelectTrigger className="h-8 text-xs font-mono-data bg-background border-border/20">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {item.variants.map((v) => (
                <SelectItem key={v.name} value={v.name} className="text-xs font-mono-data">
                  {v.name} — €{(v.price_cents / 100).toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Add to cart / quantity controls */}
      <div className="flex items-center gap-2">
        {quantity === 0 ? (
          <Button
            size="sm"
            onClick={handleAdd}
            className={cn(
              'w-full gap-2 bg-emerald text-[#15191a] font-mono-data text-xs hover:bg-emerald/90 transition-all',
              justAdded && 'scale-95'
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add to Cart
          </Button>
        ) : (
          <div className="flex w-full items-center justify-between rounded-md border border-emerald/30 bg-emerald/10 px-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-emerald hover:bg-emerald/20"
              onClick={() => updateQuantity(item.dbId, quantity - 1, selectedVariant)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="font-mono-data text-sm font-semibold text-emerald">
              {quantity}
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-emerald hover:bg-emerald/20"
              onClick={handleAdd}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
