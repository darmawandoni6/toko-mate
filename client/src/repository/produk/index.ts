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
  const res: ProdukAPI | null = await http.POST('/produk-search', payload);
  return res;
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

export const uploadFile = async (id: string, file: FormData) => {
  const res = await fetch(`http://localhost:4000/api-v1/produk-file/${id}`, {
    method: 'POST',
    body: file,
    credentials: 'include',
  });
  console.log(res);
};
