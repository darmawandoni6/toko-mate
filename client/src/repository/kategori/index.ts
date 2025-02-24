import { toast } from 'react-toastify';

import { HttpFetch } from '../../config/http-fetch';
import { KategoriAPI, KategoriList, KategoriPayload } from './types';

const http = HttpFetch.init();

export async function listKategori(): Promise<KategoriList['list']> {
  const data = await http.GET<KategoriAPI[]>('/kategori');
  if (!data) {
    return [];
  }
  return data;
}

export async function createKategori(payload: Pick<KategoriPayload, 'nama'>): Promise<void> {
  await http.POST('/kategori', payload);
}
export async function updateKategori(id: string, payload: Partial<KategoriPayload>): Promise<void> {
  await http.PUT(`/kategori/${id}`, payload);
}
export async function removeKategori(id: string): Promise<void> {
  await http.DELETE(`/kategori/${id}`);
  toast.success('Success menghapus data');
}
