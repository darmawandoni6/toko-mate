import { lazy, useEffect } from 'react';

import { Route, Routes, useNavigate } from 'react-router-dom';

import { getProfile } from './repository/auth';
import { useSetValue } from './utils/provider';

const Home = lazy(() => import('./pages/home'));
const Produk = lazy(() => import('./pages/produk'));
const Diskon = lazy(() => import('./pages/diskon'));
const ProdukDetail = lazy(() => import('./pages/produk/detail'));
const Kategori = lazy(() => import('./pages/kategori'));
const Pos = lazy(() => import('./pages/pos'));
const PosOrder = lazy(() => import('./pages/pos/order'));
const PosCheckout = lazy(() => import('./pages/pos/checkout'));
const Stock = lazy(() => import('./pages/stock'));
const Report = lazy(() => import('./pages/report'));
const Transaksi = lazy(() => import('./pages/transaksi'));
const Profile = lazy(() => import('./pages/profile'));

const App = () => {
  const setValue = useSetValue();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const data = await getProfile();
      if (!data) {
        navigate(-1);
        return;
      }
      setValue({ profile: data });
    };

    fetch();
  }, []);

  return (
    <>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Produk />} path="/produk" />
        <Route element={<Diskon />} path="/diskon" />
        <Route element={<ProdukDetail />} path="/produk/:id" />
        <Route element={<Kategori />} path="/kategori" />
        <Route element={<Pos />} path="/pos" />
        <Route element={<PosOrder />} path="/pos/order" />
        <Route element={<PosCheckout />} path="/pos/checkout" />
        <Route element={<Stock />} path="/stock" />
        <Route element={<Report />} path="/report" />
        <Route element={<Transaksi />} path="/transaksi" />
        <Route element={<Profile />} path="/profil" />
      </Routes>
    </>
  );
};

export default App;
