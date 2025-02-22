import { Dispatch } from 'react';

import { toast } from 'react-toastify';

import { HttpFetch } from '../../config/http-fetch';
import { Profile } from '../../utils/provider/action/profile';
import { ActionProfile, LoginPayload, ProfileAPI, ProfilePayload, RegisterPayload } from './types';

const http = HttpFetch.init();

export const authLogin = async (payload: LoginPayload) => {
  await http.POST('/login', payload);
};
export const authRegister = async (payload: RegisterPayload) => {
  await http.POST('/register', payload);
  toast.success('silakan login');
};

export const getProfile = () => {
  return async (dispatch: Dispatch<ActionProfile>) => {
    try {
      dispatch({ type: Profile.loading });
      const res = await http.GET<ProfileAPI>('/profile');
      dispatch({ type: Profile.success, payload: res });
      return res;
    } catch {
      toast.error('data tidak ditemukan');
      dispatch({ type: Profile.error });
    }
  };
};
export const updateProfile = async (payload: ProfilePayload) => {
  await http.PUT('/update-profile', payload);
  toast.success('profile berhasil di update');
};
