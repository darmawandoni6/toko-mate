import { toast } from 'react-toastify';

import { HttpFetch } from '../../config/http-fetch';
import { ProdukAPI, ProdukPayload, QueryProduk } from './types';

const http = HttpFetch.init();

export const listProduk = async (params: QueryProduk) => {
  const res: ProdukAPI[] | null = await http.GET('/produk', { params });
  if (!res) return [];
  return res;
};
export const listProdukOption = async () => {
  const res: ProdukAPI[] | null = await http.GET('/produk', { params: { option: true } });
  if (!res) return [];
  return res;
};

export const detailProduk = async (id: string) => {
  const res: ProdukAPI | null = await http.GET(`/produk/${id}`);
  return res;
};

export const searchProduk = async (payload: { search: string }) => {
  try {
    const res: ProdukAPI | null = await http.POST('/produk-search', payload);
    if (!res) {
      toast.error('Data tidak ditemukan');
    }
    return res;
  } catch {
    return null;
  }
};

export const createProduk = async (payload: ProdukPayload) => {
  await http.POST('/produk', payload);
  toast.success('success create produk');
};

export const updateProduk = async (id: string, payload: ProdukPayload) => {
  await http.PUT(`/produk/${id}`, payload);
  toast.success('success update produk');
};
export const updateStatus = async (id: string, status: boolean) => {
  await http.PUT(`/produk/${id}`, { status });
  toast.success('success update status');
};

export const removeProduk = async (id: string) => {
  await http.DELETE(`/produk/${id}`);
  toast.success('success hapus produk');
};

export const uploadFile = async (id: string, file: FormData): Promise<string> => {
  try {
    await http.POST(`/produk-file/${id}`, file, {
      json: false,
      headers: {},
    });
    toast.success('success ubah image');
    return '';
  } catch (error) {
    return (error as Error).message;
  }
};
