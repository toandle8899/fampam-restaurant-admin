import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  dishId: string;
  code: string;
  name: string;
  variantName?: string;
  quantity: number;
  priceCents: number; // per-unit
  image?: string;
}

export type OrderType = 'pickup' | 'delivery';

interface DeliveryInfo {
  address: string;
  phone: string;
  notes: string;
}

interface CartState {
  items: CartItem[];
  orderType: OrderType;
  deliveryInfo: DeliveryInfo;
  deliveryFeeCents: number;

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (dishId: string, variantName?: string) => void;
  updateQuantity: (dishId: string, quantity: number, variantName?: string) => void;
  clearCart: () => void;
  setOrderType: (type: OrderType) => void;
  setDeliveryInfo: (info: Partial<DeliveryInfo>) => void;
  setDeliveryFee: (cents: number) => void;

  // Computed-like helpers
  itemCount: () => number;
  subtotalCents: () => number;
  totalCents: () => number;
}

const itemKey = (dishId: string, variantName?: string) =>
  variantName ? `${dishId}::${variantName}` : dishId;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      orderType: 'pickup',
      deliveryInfo: { address: '', phone: '', notes: '' },
      deliveryFeeCents: 350,

      addItem: (item) =>
        set((state) => {
          const key = itemKey(item.dishId, item.variantName);
          const existing = state.items.find(
            (i) => itemKey(i.dishId, i.variantName) === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.dishId, i.variantName) === key
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (dishId, variantName) =>
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.dishId, i.variantName) !== itemKey(dishId, variantName)
          ),
        })),

      updateQuantity: (dishId, quantity, variantName) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (i) => itemKey(i.dishId, i.variantName) !== itemKey(dishId, variantName)
              ),
            };
          }
          return {
            items: state.items.map((i) =>
              itemKey(i.dishId, i.variantName) === itemKey(dishId, variantName)
                ? { ...i, quantity }
                : i
            ),
          };
        }),

      clearCart: () => set({ items: [], deliveryInfo: { address: '', phone: '', notes: '' } }),

      setOrderType: (type) => set({ orderType: type }),

      setDeliveryInfo: (info) =>
        set((state) => ({
          deliveryInfo: { ...state.deliveryInfo, ...info },
        })),

      setDeliveryFee: (cents) => set({ deliveryFeeCents: cents }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotalCents: () =>
        get().items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0),

      totalCents: () => {
        const sub = get().subtotalCents();
        const fee = get().orderType === 'delivery' ? get().deliveryFeeCents : 0;
        return sub + fee;
      },
    }),
    {
      name: 'fampam-cart',
    }
  )
);
