import { KategoriAPI } from '../../repository/kategori/types';
import { ProdukAPI } from '../../repository/produk/types';

export type ProdukView = {
  list: ProdukAPI[];
  loading: boolean;
  last: boolean;
  page: number;
  limit: number;
  form: boolean;
};
export type kategoriView = {
  list: KategoriAPI[];
  active: string;
};
