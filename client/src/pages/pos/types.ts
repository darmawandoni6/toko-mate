import { KategoriAPI } from '../../repository/kategori/types';
import { ProdukAPI } from '../../repository/produk/types';
import { TransaksiDetailAPI } from '../../repository/transaksi/types';

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
export type TransaksiView = {
  trx_id: string;
  item: TransaksiDetailAPI[];
  count: number;
  keranjang: ProdukAPI | null;
  mockItem: string[];
};
