import { useEffect, useMemo, useState } from 'react';

import clsx from 'clsx';
import { Link } from 'react-router-dom';

import WeeklyEarning from '../../assets/images/weekly-earning.svg?react';
import AreaChart from '../../components/chart/area-chart';
import FormInput from '../../components/form-input';
import Header from '../../components/header';
import { transaksiReport } from '../../repository/transaksi';
import { TransaksiReportAPI } from '../../repository/transaksi/types';
import { dateValue } from '../../utils/date';
import { currency } from '../../utils/number';
import { useGetValue } from '../../utils/provider';
import { transform } from './utils';

function Report() {
  const profile = useGetValue(state => state.profile);

  const [date, setDate] = useState<string>(dateValue(new Date()));
  const [data, setData] = useState<TransaksiReportAPI | null>(null);

  const { revenueOfWeek, topProduk, weekRevenue } = transform(data);

  const calculate = useMemo(() => {
    const { thisWeek, lastWeek } = revenueOfWeek;
    if (lastWeek === 0) return 100; // Jika nilai sebelumnya 0, kenaikan dianggap 100%

    const increase = thisWeek - lastWeek;
    return (increase / lastWeek) * 100;
  }, [revenueOfWeek]);

  const chartData = useMemo(() => {
    const res: (string | number)[][] = [['Week', 'Sales']];
    weekRevenue.forEach((item, i) => {
      res.push([`Week ${i + 1}`, item]);
    });
    return res;
  }, [weekRevenue]);

  useEffect(() => {
    fetch(date);
  }, [date]);

  const fetch = async (date: string) => {
    const res = await transaksiReport(date);
    setData(res);
  };

  if (!profile) return;

  return (
    <div className="flex flex-col gap-2">
      <Header title="Report" />
      <div className="flex flex-col gap-2 p-2 mb-10">
        <section className="p-2 rounded-md bg-white border">
          <h1 className="text-base font-bold mb-2 capitalize">{`Hello, ${profile.data?.nama ?? '-'}`}</h1>
          <FormInput id="date">
            <input
              type="date"
              defaultValue={date}
              onChange={e => {
                setDate(e.target.value);
              }}
            />
          </FormInput>
        </section>
        <section className="p-2 rounded-md bg-white border flex justify-between gap-1">
          <div className="flex-auto">
            <h2 className="text-sm font-semibold text-primary mb-3">Pendapatan Mingguan</h2>
            <p className="font-bold text-xl">{currency(revenueOfWeek.thisWeek)}</p>
            <span className="text-xs">
              Peningkatan{' '}
              <span
                className={clsx('font-bold', calculate >= 0 ? 'text-green-600' : 'text-red-600')}
              >{`${calculate}% `}</span>
              dibandingkan minggu lalu
            </span>
          </div>
          <WeeklyEarning />
        </section>
        <section className="rounded-md bg-white border">
          <div className="p-2 border-b">
            <strong>10 Best Seller</strong>
          </div>
          <div className="p-2 flex flex-col gap-4">
            {Object.entries(topProduk).map(([key, val], i) => (
              <Link to={`/produk/${key}`} className="flex" key={i}>
                <div className="flex items-center gap-1 flex-auto overflow-hidden">
                  <div className=" min-w-12 aspect-square rounded-lg bg-gray-300 flex">
                    <i className="fa-regular fa-image m-auto text-lg"></i>
                  </div>
                  <div className="flex-auto flex flex-col overflow-hidden">
                    <p className="text-sm font-bold ellipsis-2">{val.produk_nama}</p>
                    <span className="text-xs">{`Total: ${currency(val.total)}`}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center p-2 min-w-fit">
                  <span className="text-sm">Total Jual</span>
                  <span className="text-xl font-bold">{val.qty.toLocaleString('id-ID')}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="rounded-md bg-white border">
          <div className="p-2 border-b">
            <strong>Sales Analytics</strong>
          </div>
          <div className="overflow-hidden">
            <div className="w-full m-auto overflow-hidden">
              <AreaChart data={chartData} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Report;
