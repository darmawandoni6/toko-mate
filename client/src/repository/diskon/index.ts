import { toast } from 'react-toastify';

import { HttpFetch } from '../../config/http-fetch';
import { DiskonAPI, DiskonPayload, QueryDiskon } from './types';

const http = HttpFetch.init();

export const listDiskon = async (params: QueryDiskon): Promise<DiskonAPI[]> => {
  try {
    const res: DiskonAPI[] = await http.GET('/diskon', { params });
    return res;
  } catch {
    return [];
  }
};
export const AllListDiskon = async (): Promise<DiskonAPI[]> => {
  try {
    const res: DiskonAPI[] = await http.GET('/diskon-all');
    return res;
  } catch {
    return [];
  }
};

export const createDiskon = async (payload: DiskonPayload): Promise<void> => {
  await http.POST('/diskon', payload);
  toast.success('success create diskon');
};

export const updateDiskon = async (id: string, payload: DiskonPayload): Promise<void> => {
  await http.PUT(`/diskon/${id}`, payload);
  toast.success('success update diskon');
};

export const detailDiskon = async (id: string): Promise<DiskonAPI | null> => {
  try {
    const res: DiskonAPI | null = await http.GET(`/diskon/${id}`);
    return res;
  } catch {
    return null;
  }
};
export const removeDiskon = async (id: string): Promise<void> => {
  await http.DELETE(`/diskon/${id}`);
  toast.success('success hapus diskon');
};
