import { KeyboardEvent, useEffect, useState } from 'react';

import clsx from 'clsx';
import { PropagateLoader } from 'react-spinners';

import ScrollElement from '../../components/scroll-element';
import { AllListDiskon } from '../../repository/diskon';
import { DiskonAPI } from '../../repository/diskon/types';
import { listKategori } from '../../repository/kategori';
import { createProduk, listProduk } from '../../repository/produk';
import { ProdukForm, ProdukPayload, QueryProduk } from '../../repository/produk/types';
import { currency, toNumber } from '../../utils/number';
import FormProduk from './form-produk';
import { ProdukView, kategoriView } from './types';
import { calculationDiskon } from './utils';

const Produk = () => {
  const [kategori, setKategori] = useState<kategoriView>({ list: [], active: 'semua' });
  const [diskon, setDiskon] = useState<DiskonAPI[]>([]);

  const [produk, setProduk] = useState<ProdukView>({
    list: [],
    page: 1,
    limit: 50,
    loading: false,
    last: false,
    form: false,
  });

  useEffect(() => {
    allFetch();
  }, []);

  const allFetch = async () => {
    const k = await listKategori();
    setKategori(prev => ({ ...prev, list: k }));
    await fetchProduk(1);
    const d = await AllListDiskon();
    setDiskon(d);
  };

  const fetchProduk = async (page: number, option?: Partial<Pick<QueryProduk, 'kategori' | 'search'>>) => {
    try {
      setProduk(prev => ({
        ...prev,
        loading: true,
      }));

      const res = await listProduk({ page: page.toString(), pageSize: produk.limit.toString(), ...option });
      setProduk(prev => ({
        ...prev,
        last: res.length < prev.limit,
        list: page === 1 ? res : [...prev.list, ...res],

        page,
      }));
    } finally {
      setProduk(prev => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const onKategori = (type: string) => {
    setKategori(prev => ({ ...prev, active: type }));

    if (type === 'semua') {
      fetchProduk(1);
    } else {
      fetchProduk(1, { kategori: type });
    }
  };

  const onSubmit = async (data: ProdukForm) => {
    const payload: ProdukPayload = {
      barcode: data.barcode,
      nama: data.nama,
      harga_beli: toNumber(data.harga_beli),
      harga_jual: toNumber(data.harga_jual),
      total_stok: toNumber(data.total_stok),
      kategori_id: data.kategori.value,
      diskon_id: data.diskon?.value,
    };

    await createProduk(payload);
    await fetchProduk(1);
  };

  const onForm = () => {
    setProduk(prev => ({
      ...prev,
      form: !prev.form,
    }));
  };

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const searchValue = e.currentTarget.value.trim(); // Trim whitespace

    const params: Pick<QueryProduk, 'kategori' | 'search'> = {};

    if (searchValue) params.search = searchValue;
    if (kategori.active !== 'semua') params.kategori = kategori.active;

    fetchProduk(1, params);
  };

  return (
    <div className="flex flex-col gap-2">
      <FormProduk show={produk.form} setShow={onForm} diskon={diskon} kategori={kategori.list} setSubmit={onSubmit} />

      <header className="h-12 border-b flex items-center px-2 gap-2">
        <div className="border flex-auto overflow-hidden h-8 rounded-full">
          <input
            type="text"
            inputMode="search"
            placeholder="Cari ...."
            className="w-full text-sm px-4 h-full outline-none"
            onKeyDown={handleSearch}
          />
        </div>
        <button className="h-8 aspect-square shrink-0" onClick={onForm}>
          <i className="fa-solid fa-plus"></i>
        </button>
      </header>
      <section className="px-2 flex gap-2 overflow-auto pb-2 text-nowrap">
        <button
          className={clsx('py-1 px-2 border rounded text-xs font-semibold', {
            ['text-primary border-primary']: kategori.active === 'semua',
          })}
          onClick={() => onKategori('semua')}
        >
          Semua
        </button>
        {kategori.list.map(item => (
          <button
            className={clsx('py-1 px-2 border rounded text-xs font-semibold', {
              ['text-primary border-primary']: kategori.active === item.id,
            })}
            key={item.id}
            onClick={() => onKategori(item.id)}
          >
            {item.nama}
          </button>
        ))}
      </section>

      <ScrollElement
        next={() => fetchProduk(produk.page + 1)}
        loader={
          <div className="w-full flex justify-center h-6 mb-6">
            <PropagateLoader color="var(--primary)" />
          </div>
        }
        className="px-2 pb-2 grid grid-cols-2 gap-4"
        last={produk.last}
        isLoading={produk.loading}
        dataLength={produk.list.length}
      >
        {produk.list.map((item, i) => {
          const hargaDiskon = calculationDiskon(item);

          return (
            <ScrollElement.Body
              to={`/produk/${item.id}`}
              className="shadow w-full rounded-sm overflow-hidden"
              key={i}
              index={i}
            >
              <div className="h-36 flex bg-gray-300">
                <i className="fa-regular fa-image m-auto text-5 xl"></i>
              </div>
              <div className="px-2 h-20 flex flex-col justify-center">
                <p className="ellipsis-2 text-xs mb-1 capitalize">{item.nama}</p>
                <p className="text-sm font-bold">{currency(Number(item.harga_jual) - hargaDiskon)}</p>
                <p className="text-xs font-bold line-through text-gray-300">
                  {hargaDiskon ? currency(Number(item.harga_jual)) : ''}
                </p>
              </div>
            </ScrollElement.Body>
          );
        })}
      </ScrollElement>
    </div>
  );
};

export default Produk;
