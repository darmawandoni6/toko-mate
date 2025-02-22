import { useEffect, useState } from 'react';

import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

import Footer from '../../components/footer';
import { transaksiPerHari } from '../../repository/transaksi';
import { currency } from '../../utils/number';
import { useGetValue } from '../../utils/provider';
import { useView } from './useView';

const menu = {
  produk: [
    {
      icon: 'fa-solid fa-boxes-stacked',
      name: 'Produk',
      to: '/produk',
    },
    {
      icon: 'fa-solid fa-list',
      name: 'Kategori',
      to: '/kategori',
    },

    {
      icon: 'fa-solid fa-tags',
      name: 'Diskon',
      to: '/diskon',
    },
    {
      icon: 'fa-solid fa-cubes-stacked',
      name: 'Stock',
      to: '/stock',
    },
  ],
  transaksi: [
    {
      icon: 'fa-solid fa-cash-register',
      name: 'POS',
      to: '/pos',
    },
    {
      icon: 'fa-regular fa-paste',
      name: 'Report',
      to: '/report',
    },
    {
      icon: 'fa-solid fa-hand-holding-dollar',
      name: 'Transaksi',
      to: '/transaksi',
    },
  ],
  user: [
    {
      icon: 'fa-solid fa-user',
      name: 'Profil',
      to: '/profil',
    },
    {
      icon: 'fa-solid fa-power-off',
      name: 'Log Out',
      to: '/log-out',
    },
  ],
};

const Home = () => {
  const profile = useGetValue(state => state.profile);
  const navigate = useNavigate();
  const home = useView(profile);

  const [pendapatan, setPendapatan] = useState<number>(0);

  useEffect(() => {
    const { data } = profile;
    if (data) {
      fetch();
    }
  }, [profile.data]);

  const fetch = async () => {
    const res = await transaksiPerHari();
    setPendapatan(res);
  };

  return (
    <>
      <header className="relative h-20 bg-red-600 rounded-b-3xl mb-16">
        <div className="w-11/12 mx-auto h-14 pt-3 flex justify-between items-start">
          <h1 className="text-white text-2xl font-bold">Tokomate</h1>
          <button className="text-white">
            <i className="fa-solid fa-bell"></i>
          </button>
        </div>
        <div className="w-11/12 mx-auto bg-white flex justify-between items-center rounded-xl p-4 shadow">
          <section className="flex items-center gap-2">
            <button className="text-4xl">
              <i className="fa-solid fa-circle-user"></i>
            </button>
            <div className="flex flex-col">{home}</div>
          </section>
          <section className="border px-3 py-1 rounded-full bg-red-600 text-white text-sm font-semibold">
            {currency(pendapatan)}
          </section>
        </div>
      </header>
      <div className="mb-6">
        {Object.entries(menu).map(([key, items], i) => (
          <div className="px-4" key={i}>
            <h1 className="font-semibold capitalize mb-2 text-gray-400 text-sm">{key}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {items.map(item => (
                <button
                  className="shadow rounded-lg w-16 aspect-square"
                  key={item.to}
                  onClick={() => navigate(item.to)}
                >
                  <i className={clsx(item.icon, 'text-xl mb-1')} />
                  <span className="block font-bold text-xs">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
};

export default Home;
