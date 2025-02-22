import { TransaksiAPI, TransaksiDetailAPI } from '../../repository/transaksi/types';

export type TransaksiView = {
  list: TransaksiAPI[];
  loading: boolean;
  last: boolean;
  page: number;
  limit: number;
};

export type ReceiptView = {
  show: boolean;
  transaksi: TransaksiAPI | null;
  items: TransaksiDetailAPI[];
  loading: boolean;
};
