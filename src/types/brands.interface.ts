export interface BrandsInterface {
  _id?: string;
  name: string;
  icon: string;
  is_active?: boolean;
  type: TypeBrands;
  count_news?: number;
  count_used?: number;
}

export enum TypeBrands {
  vehicle = "vehicle",
  product = "product",
}
