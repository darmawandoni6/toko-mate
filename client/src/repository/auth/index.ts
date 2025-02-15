import { toast } from 'react-toastify';

import { HttpFetch } from '../../config/http-fetch';
import { LoginPayload, ProfileAPI, ProfilePayload, RegisterPayload } from './types';

const http = HttpFetch.init();

export const authLogin = async (payload: LoginPayload) => {
  await http.POST('/login', payload);
};
export const authRegister = async (payload: RegisterPayload) => {
  await http.POST('/register', payload);
  toast.success('silakan login');
};

export const getProfile = async () => {
  try {
    const res = await http.GET<ProfileAPI>('/profile');
    return res;
  } catch {
    toast.error('data tidak ditemukan');
    return null;
  }
};
export const updateProfile = async (payload: ProfilePayload) => {
  await http.PUT('/update-profile', payload);
  toast.success('profile berhasil di update');
};
