import { DiskonAPI } from '../diskon/types';
import { KategoriAPI } from '../kategori/types';

export interface QueryProduk {
  page: string;
  pageSize: string;
  search?: string;
  kategori?: string;
}

export interface ProdukAPI {
  id: string;
  kategori_id: string;
  kategori: KategoriAPI;
  diskon_id: string | null;
  diskon: DiskonAPI | null;
  barcode: string;
  nama: string;
  harga_beli: number;
  harga_jual: number;
  total_stok: number;
  image: string | null;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}
export type ProdukOptionAPI = Pick<ProdukAPI, 'id' | 'nama' | 'barcode' | 'harga_beli' | 'harga_jual'>;

export type ProdukPayload = Pick<
  ProdukAPI,
  'barcode' | 'kategori_id' | 'nama' | 'harga_beli' | 'harga_jual' | 'total_stok' | 'diskon_id'
>;
export type ProdukForm = Pick<ProdukAPI, 'id' | 'barcode' | 'nama'> & {
  harga_beli: string;
  harga_jual: string;
  total_stok: string;
  kategori: {
    label: string;
    value: string;
  };
  diskon: {
    label: string;
    value: string;
  };
};
