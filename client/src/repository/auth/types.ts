export interface RegisterAPI {
  nama: string;
  alamat: string;
  hp: string;
  user: {
    email: string;
    password: string;
  };
}
export interface LoginPayload {
  email: string;
  password: string;
}

export type LoginForm = LoginPayload;

export interface ProfileAPI {
  email: string;
  nama: string;
  password: string;
  toko_id: string;
  created_at: Date;
  updated_at: Date;
  toko: {
    id: string;
    nama: string;
    alamat: string;
    hp: string;
    created_at: Date;
    updated_at: Date;
  };
}

export type ProfilePayload = Pick<ProfileAPI['toko'], 'nama' | 'alamat' | 'hp'> & {
  user: Pick<ProfileAPI, 'email' | 'nama'> & {
    password?: string;
  };
};
export type ProfileForm = Pick<ProfileAPI['toko'], 'nama' | 'alamat' | 'hp'> &
  Pick<ProfileAPI, 'email' | 'password'> & {
    namaUser: string;
  };
