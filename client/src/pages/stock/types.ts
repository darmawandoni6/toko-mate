import { StokAPI } from '../../repository/stock/types';

export type StokView = {
  list: StokAPI[];
  loading: boolean;
  last: boolean;
  page: number;
  limit: number;
  form: boolean;
  increment: boolean;
};
