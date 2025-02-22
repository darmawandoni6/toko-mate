import { Profile } from '../../utils/provider/action/profile';
import { Action } from '../../utils/provider/types';

export type ActionProfile = Action<Profile, ProfileAPI | null>;

export interface TokoAPI {
  id: string;
  nama: string;
  alamat: string;
  hp: string;
  created_at: Date;
  updated_at: Date;
}
export interface ProfileAPI {
  email: string;
  nama: string;
  password: string;
  toko_id: string;
  created_at: Date;
  updated_at: Date;
  toko: TokoAPI;
}

export type RegisterPayload = Pick<TokoAPI, 'nama' | 'alamat' | 'hp'> & {
  user: Pick<ProfileAPI, 'nama' | 'email' | 'password'>;
};
export type RegisterForm = Pick<TokoAPI, 'nama' | 'alamat' | 'hp'> &
  Pick<ProfileAPI, 'email' | 'password'> & {
    userNama: string;
  };

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginForm = LoginPayload;

export type ProfilePayload = Pick<TokoAPI, 'nama' | 'alamat' | 'hp'> & {
  user: Pick<ProfileAPI, 'email' | 'nama'> & {
    password?: string;
  };
};
export type ProfileForm = Pick<TokoAPI, 'nama' | 'alamat' | 'hp'> &
  Pick<ProfileAPI, 'email' | 'password'> & {
    namaUser: string;
  };
