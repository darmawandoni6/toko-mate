import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import { PropagateLoader } from 'react-spinners';

import Header from '../../components/header';
import ScrollElement from '../../components/scroll-element';
import { config } from '../../config/base';
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
  const refSearch = useRef<HTMLInputElement | null>(null);

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

  const filter = useMemo(() => {
    const params: Partial<Omit<QueryProduk, 'page' | 'pageSize'>> = {};
    if (kategori.active !== 'semua') params.kategori = kategori.active;
    return params;
  }, [kategori.active]);

  useEffect(() => {
    allFetch();
  }, []);

  const allFetch = async () => {
    const k = await listKategori();
    setKategori(prev => ({ ...prev, list: k }));

    await fetchProduk(1, produk.limit);
    const d = await AllListDiskon();
    setDiskon(d);
  };

  const fetchProduk = async (
    page: number,
    pageSize: number,
    options?: Partial<Omit<QueryProduk, 'page' | 'pageSize'>>,
  ) => {
    try {
      setProduk(prev => ({
        ...prev,
        loading: true,
      }));

      const res = await listProduk({ page, pageSize, ...options });
      setProduk(prev => ({
        ...prev,
        last: res.length < prev.limit,
        list: page === 1 ? res : [...prev.list, ...res],
        page: page,
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
    filter.kategori = type !== 'semua' ? type : undefined;
    fetchProduk(1, produk.limit, filter);
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
    await fetchProduk(1, produk.limit, filter);
  };

  const onForm = () => {
    setProduk(prev => ({
      ...prev,
      form: !prev.form,
    }));
  };

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    console.log(produk.limit);

    if (e.currentTarget.value) {
      filter.search = e.currentTarget.value.trim();
    }
    fetchProduk(1, produk.limit, filter);
  };

  return (
    <div className="flex flex-col gap-2">
      <Header title="Produk" />

      <FormProduk show={produk.form} setShow={onForm} diskon={diskon} kategori={kategori.list} setSubmit={onSubmit} />

      <section className="h-12 border-b flex items-center px-2 gap-2">
        <div className="border flex-auto overflow-hidden h-8 rounded-full">
          <input
            ref={refSearch}
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
      </section>
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
            className={clsx('py-1 px-2 border rounded text-xs font-semibold capitalize', {
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
        next={() => fetchProduk(produk.page + 1, produk.limit, filter)}
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
                {item.image ? (
                  <img
                    src={`${config.baseUrl}/${item.image}`}
                    alt={item.nama}
                    width={144}
                    height={144}
                    className="aspect-square object-fill m-auto"
                  />
                ) : (
                  <i className="fa-regular fa-image m-auto text-5 xl"></i>
                )}
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
