import { useEffect, useState } from 'react';

import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

import { ProfileAPI } from '../../repository/auth/types';
import { transaksiPerHari } from '../../repository/transaksi';
import { currency } from '../../utils/number';
import { useGetValue } from '../../utils/provider';

const menu = [
  {
    icon: 'fa-solid fa-boxes-stacked',
    name: 'Produk',
    to: '/produk',
  },
  {
    icon: 'fa-solid fa-tags',
    name: 'Diskon',
    to: '/diskon',
  },
  {
    icon: 'fa-solid fa-list',
    name: 'Kategori',
    to: '/kategori',
  },
  {
    icon: 'fa-solid fa-cash-register',
    name: 'POS',
    to: '/pos',
  },
  {
    icon: 'fa-solid fa-cubes-stacked',
    name: 'Stock',
    to: '/stock',
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
];

const Home = () => {
  const profile = useGetValue(state => state.profile);
  const navigate = useNavigate();

  const [home, setHome] = useState<Pick<ProfileAPI['toko'], 'nama' | 'hp'>>({ hp: '-', nama: '-' });
  const [pendapatan, setPendapatan] = useState<number>(0);

  useEffect(() => {
    if (profile) {
      setHome({ hp: profile.toko.hp, nama: profile.toko.nama });
      fetch();
    }
  }, [profile]);

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
            <div className="flex flex-col">
              <span className="block text-base font-bold">{home.nama}</span>
              <span className="text-xs leading-none">{home.hp}</span>
            </div>
          </section>
          <section className="border px-3 py-1 rounded-full bg-red-600 text-white text-sm font-semibold">
            {currency(pendapatan)}
          </section>
        </div>
      </header>
      <div className="flex flex-wrap justify-center gap-4 px-4">
        {menu.map(item => (
          <button className="shadow p-2 rounded-lg w-24 aspect-square" key={item.to} onClick={() => navigate(item.to)}>
            <i className={clsx(item.icon, 'text-3xl mb-2')} />
            <span className="block font-bold text-sm">{item.name}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default Home;
