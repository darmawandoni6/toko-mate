import { toast } from 'react-toastify';

import { HttpFetch } from '../../config/http-fetch';
import { QueryStok, StokAPI, StokPayload } from './types';

const http = HttpFetch.init();

export const listStok = async (params: QueryStok): Promise<StokAPI[]> => {
  const res: StokAPI[] | null = await http.GET('/produk-stok', { params });
  if (!res) return [];
  return res;
};

export const createStok = async (payload: StokPayload): Promise<void> => {
  await http.POST('/produk-stok', payload);
  toast.success('success create stok');
};
