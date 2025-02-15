import { TransaksiReportAPI } from '../../repository/transaksi/types';

export const transform = (data: TransaksiReportAPI | null): TransaksiReportAPI => {
  const res: TransaksiReportAPI = {
    revenueOfWeek: {
      lastWeek: 0,
      thisWeek: 0,
    },
    topProduk: {},
    weekRevenue: [],
  };
  if (!data) return res;

  return data;
};
