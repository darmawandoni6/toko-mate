import { ProdukAPI } from '../produk/types';

export type QueryStok = {
  page: number;
  pageSize: number;
};

export interface StokAPI {
  id: string;
  created_at: Date;
  updated_at: Date;
  qty: number;
  deskripsi: string;
  email: string;
  produk_id: string;
  produk: ProdukAPI;
  mark: string;
}

export type StokPayload = Pick<StokAPI, 'produk_id' | 'qty' | 'deskripsi'> & {
  produk: Pick<ProdukAPI, 'harga_beli' | 'harga_jual'>;
};

export type StokForm = Pick<StokAPI, 'id' | 'produk_id' | 'deskripsi'> & {
  search: string;
  qty: string;
  harga_beli: string;
  harga_jual: string;
};
