import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { DishId, StringKey } from "@/i18n/translations";

export interface DbDish {
  id: string;
  code: string;
  name: string;
  description: string | null;
  translations?: Record<string, any>;
  price_cents: number;
  trace: string | null;
  sticker_url: string | null;
  dietary: string[];
  tags: string[];
  spice_level: number;
  seasonal: boolean;
  shared_grill: boolean;
  raw_warning: boolean;
  sort_order: number;
  collection_id: string;
}

export interface MenuItem {
  id: DishId;
  dbId: string;
  name: string;
  name_vi?: string;
  name_pl?: string;
  name_de?: string;
  description: string | null;
  description_vi?: string;
  description_pl?: string;
  description_de?: string;
  price: string;
  trace?: string;
  sticker?: string;
  dietary: string[];
  spice: number;
  seasonal: boolean;
  sharedGrill: boolean;
  rawWarning: boolean;
  tags: string[];
  sortOrder: number;
  showImage?: boolean;
  image?: string;
  hasVariants?: boolean;
  variants?: {
    id: string;
    name: string;
    name_vi?: string;
    name_pl?: string;
    name_de?: string;
    price_cents: number;
    dietary?: string[];
    spice_level?: number;
    seasonal?: boolean;
    shared_grill?: boolean;
    raw_warning?: boolean;
  }[];
}

export interface MenuCollection {
  dbId: string;
  key: string;
  labelKey: StringKey;
  subKey: StringKey;
  label: string;
  subtitle?: string;
  items: MenuItem[];
}

export const useMenu = () => {
  return useQuery({
    queryKey: ["menu"],
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: async () => {
      const [{ collections: collectionsData, dishes: dishesData }, settings] = await Promise.all([
        apiFetch("/menu"),
        apiFetch("/settings")
      ]);

      const menuImages = settings.menu_images || {};

      // 4. Map dishes and collections to frontend formats
      const collections: MenuCollection[] = (collectionsData || []).map((col: any) => {
        const colDishes = (dishesData || [])
          .filter((dish: any) => dish.collection_id === col.id)
          .map((dish: any) => {
            const imgConfig = (menuImages as any)[dish.id];
            const imageUrl = imgConfig ? imgConfig.image_url : (dish.sticker_url || "");
            const showImage = imgConfig ? imgConfig.show_image : !!imageUrl;

            const translations: any = dish.translations || {};
            return {
              id: dish.code as DishId,
              dbId: dish.id,
              name: dish.name,
              name_vi: translations?.vi?.name,
              name_pl: translations?.pl?.name,
              name_de: translations?.de?.name,
              description: dish.description,
              description_vi: translations?.vi?.description,
              description_pl: translations?.pl?.description,
              description_de: translations?.de?.description,
              price: `€${(dish.price_cents / 100).toFixed(2)}`,
              trace: dish.trace || undefined,
              sticker: dish.sticker_url || undefined,
              dietary: dish.dietary || [],
              spice: dish.spice_level || 0,
              seasonal: dish.seasonal,
              sharedGrill: dish.shared_grill,
              rawWarning: dish.raw_warning,
              tags: dish.tags || [],
              sortOrder: dish.sort_order,
              showImage: showImage,
              image: imageUrl,
              hasVariants: dish.has_variants,
              variants: dish.variants || [],
            };
          });

        return {
          dbId: col.id,
          key: col.key,
          labelKey: `menu.col.${col.key}.label` as StringKey,
          subKey: `menu.col.${col.key}.sub` as StringKey,
          label: col.label,
          subtitle: col.subtitle || undefined,
          items: colDishes,
        };
      });

      return collections;
    },
  });
};
