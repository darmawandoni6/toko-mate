import { toast } from 'react-toastify';

import { HttpFetch } from '../../config/http-fetch';
import {
  TransaksiAPI,
  TransaksiDetailAPI,
  TransaksiItemPayload,
  TransaksiPayload,
  TransaksiPaymentPayload,
  TransaksiQuey,
  TransaksiReportAPI,
  TransaksiUpdateItemPayload,
} from './types';

const http = HttpFetch.init();

export const listTransaksiPending = async (): Promise<TransaksiAPI[]> => {
  try {
    const res: TransaksiAPI[] = await http.GET('/transaksi');
    return res;
  } catch {
    return [];
  }
};
export const listTransaksiSuccess = async (params: TransaksiQuey): Promise<TransaksiAPI[]> => {
  try {
    const res: TransaksiAPI[] = await http.GET('/transaksi-report', { params });
    return res;
  } catch {
    return [];
  }
};

export const createTransaksi = async (payload: TransaksiPayload): Promise<string> => {
  const res: { id: string } | null = await http.POST('/transaksi', payload);
  if (res) {
    toast.success('success create transaksi');
    return res.id;
  }
  return '';
};
export const removeTransaksi = async (id: string): Promise<void> => {
  await http.DELETE(`/transaksi/${id}`);
  toast.success('success hapus transaksi');
};
export const paymentTransaksi = async (id: string, payload: TransaksiPaymentPayload): Promise<void> => {
  await http.POST(`/transaksi-payment/${id}`, payload);
  toast.success('success pembayaran transaksi');
};

export const listItem = async (transaksi_id: string): Promise<TransaksiDetailAPI[]> => {
  const res: TransaksiDetailAPI[] | null = await http.GET(`/transaksi-detail/${transaksi_id}`);
  if (!res) return [];
  return res;
};

export const addItem = async (payload: TransaksiItemPayload): Promise<void> => {
  await http.POST('/transaksi-detail', payload);
  toast.success('success add item');
};
export const updateItem = async (
  id: string,
  transaksi_id: string,
  payload: TransaksiUpdateItemPayload,
): Promise<void> => {
  await http.PUT(`/transaksi-detail/${id}/${transaksi_id}`, payload);
  toast.success('success update item');
};
export const removeItem = async (id: string, transaksi_id: string): Promise<void> => {
  await http.DELETE(`/transaksi-detail/${id}/${transaksi_id}`);
  toast.success('success remove item');
};

export const transaksiPerHari = async (): Promise<number> => {
  try {
    const res: { total: number } = await http.GET('/transaksi-per-hari');
    return res.total;
  } catch {
    return 0;
  }
};

export const transaksiReport = async (date: string): Promise<TransaksiReportAPI | null> => {
  try {
    const res: TransaksiReportAPI = await http.GET(`/transaksi-report/${date}`);
    return res;
  } catch {
    return null;
  }
};
