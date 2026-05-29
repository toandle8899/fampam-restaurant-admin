import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Store } from 'lucide-react';
import { useMenu } from '@/hooks/useMenu';
import { ProductCard } from '@/components/pos/ProductCard';
import { CartFAB } from '@/components/pos/CartFAB';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const OrderMenu = () => {
  const { data: collections, isLoading } = useMenu();
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Filter items by search
  const filteredCollections = useMemo(() => {
    if (!collections) return [];
    const q = search.toLowerCase().trim();
    return collections
      .map((col) => ({
        ...col,
        items: col.items.filter(
          (item) =>
            (!q ||
              item.name.toLowerCase().includes(q) ||
              item.description?.toLowerCase().includes(q) ||
              item.tags.some((t) => t.toLowerCase().includes(q))) &&
            (!activeCollection || col.dbId === activeCollection)
        ),
      }))
      .filter((col) => col.items.length > 0);
  }, [collections, search, activeCollection]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="hairline-b sticky top-0 z-30 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-mono-data text-xs hidden sm:inline">Back</span>
            </Link>
            <div className="h-5 w-px bg-border/15" />
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-emerald" />
              <h1 className="font-serif-display text-lg">Order Online</h1>
            </div>
          </div>

          <Link
            to="/account"
            className="font-mono-data text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero banner */}
      <div className="border-b border-border/10 bg-gradient-to-b from-secondary/40 to-background">
        <div className="container mx-auto max-w-5xl px-4 py-8 text-center">
          <h2 className="font-serif-display text-3xl md:text-4xl mb-2">Fampam Menu</h2>
          <p className="text-sm text-muted-foreground font-mono-data">
            Browse our menu and order for pickup or delivery
          </p>

          {/* Search */}
          <div className="mt-6 mx-auto max-w-md relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes..."
              className="pl-10 bg-background border-border/20 font-mono-data text-sm"
            />
          </div>
        </div>
      </div>

      {/* Collection tabs */}
      <div className="hairline-b sticky top-[53px] z-20 bg-background/95 backdrop-blur">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex gap-1 overflow-x-auto py-2 hide-scrollbar">
            <button
              onClick={() => setActiveCollection(null)}
              className={cn(
                'whitespace-nowrap rounded-full px-4 py-1.5 font-mono-data text-xs transition-colors',
                !activeCollection
                  ? 'bg-emerald text-[#15191a] font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}
            >
              All
            </button>
            {collections?.map((col) => (
              <button
                key={col.dbId}
                onClick={() => setActiveCollection(col.dbId)}
                className={cn(
                  'whitespace-nowrap rounded-full px-4 py-1.5 font-mono-data text-xs transition-colors',
                  activeCollection === col.dbId
                    ? 'bg-emerald text-[#15191a] font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                {col.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu grid */}
      <div className="container mx-auto max-w-5xl px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : filteredCollections.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-serif-display text-xl text-muted-foreground">No items found</p>
            <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="space-y-10">
            {filteredCollections.map((col) => (
              <section key={col.dbId}>
                <div className="mb-4">
                  <h2 className="font-serif-display text-2xl">{col.label}</h2>
                  {col.subtitle && (
                    <p className="font-mono-data text-xs text-muted-foreground uppercase tracking-wider">
                      {col.subtitle}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {col.items.map((item) => (
                    <ProductCard key={item.dbId} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <CartFAB />
    </main>
  );
};

export default OrderMenu;
