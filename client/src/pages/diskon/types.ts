import { DiskonAPI } from '../../repository/diskon/types';

export type DiskonView = {
  list: DiskonAPI[];
  loading: boolean;
  last: boolean;
  page: number;
  limit: number;
};
