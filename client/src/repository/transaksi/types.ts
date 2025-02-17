import { ProdukAPI } from '../produk/types';

export interface TransaksiQuey {
  page: number;
  pageSize: number;
}
export interface TransaksiAPI {
  id: string;
  created_at: Date;
  updated_at: Date;
  email: string;
  mark: string;
  sub_total: number;
  total_diskon: number;
  total: number;
  pembayaran: number;
  kembalian: number;
  no_faktur: string;
  updated_by: string;
}
export interface TransaksiDetailAPI {
  id: string;
  created_at: Date;
  updated_at: Date;
  produk_id: string;
  produk: ProdukAPI;
  qty: number;
  sub_total: number;
  diskon_id: string;
  barcode: string;
  transaksi_id: string;
  produk_nama: string;
  produk_harga_beli: number;
  produk_harga_jual: number;
  diskon_nama: string;
  diskon_total: number;
}

export interface TransaksiReportAPI {
  revenueOfWeek: {
    thisWeek: number;
    lastWeek: number;
  };
  weekRevenue: number[];
  topProduk: {
    [K: string]: {
      produk_nama: string;
      qty: number;
      total: number;
    };
  };
}

export type TransaksiPayload = Pick<
  TransaksiDetailAPI,
  'barcode' | 'produk_id' | 'produk_nama' | 'produk_harga_beli' | 'produk_harga_jual' | 'qty'
> & {
  diskon_id?: string;
  diskon_nama?: string;
  diskon_total?: number;
};
export type TransaksiItemPayload = Pick<TransaksiDetailAPI, 'transaksi_id'> & TransaksiPayload;

export type TransaksiUpdateItemPayload = Pick<
  TransaksiPayload,
  'qty' | 'produk_harga_jual' | 'diskon_id' | 'diskon_nama' | 'diskon_total'
>;

export type TransaksiPaymentPayload = Pick<TransaksiAPI, 'pembayaran' | 'kembalian'>;
