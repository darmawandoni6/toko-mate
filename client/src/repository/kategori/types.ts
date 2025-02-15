export interface KategoriAPI {
  id: string;
  nama: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

export type KategoriPayload = Pick<KategoriAPI, 'nama' | 'status'>;
export type KategoriForm = Pick<KategoriAPI, 'id' | 'nama' | 'status'>;
export interface KategoriList {
  filter: KategoriAPI[];
  list: KategoriAPI[];
}
