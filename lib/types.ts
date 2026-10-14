export type Category = {
  id: string;
  name: string;
  slug: string;
  photo_url: string | null;
  sort_order: number | null;
  is_hidden: boolean;
};

export type Product = {
  id: string;
  name: string;
  code: string;
  category_id: string | null;
  price: number | null;
  stock: number | null;
  photo_urls: string[] | null;
  is_hidden: boolean;
  is_best_seller?: boolean | null;
  description?: string | null;
};

export type CartLine = {
  id: string;
  name: string;
  code: string;
  price: number | null;
  photo: string | null;
  qty: number;
};
