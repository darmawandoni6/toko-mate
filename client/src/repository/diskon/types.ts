export type QueryDiskon = {
  page: number;
  pageSize: number;
};

export interface DiskonAPI {
  id: string;
  nama: string;
  type: 'percent' | 'rupiah';
  value: number;
  start_diskon: string;
  end_diskon: string | null;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

export type DiskonPayload = Pick<DiskonAPI, 'nama' | 'type' | 'value' | 'start_diskon' | 'end_diskon' | 'status'>;
export type DiskonForm = Omit<DiskonAPI, 'created_at' | 'updated_at'>;
