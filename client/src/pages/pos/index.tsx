import { useEffect, useState } from 'react';

import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';

import Header from '../../components/header';
import ScrollElement from '../../components/scroll-element';
import { listKategori } from '../../repository/kategori';
import { listProduk } from '../../repository/produk';
import { QueryProduk } from '../../repository/produk/types';
import { addItem, createTransaksi, listItem, listTransaksiPending } from '../../repository/transaksi';
import { TransaksiItemPayload } from '../../repository/transaksi/types';
import { currency } from '../../utils/number';
import { calculationDiskon } from '../produk/utils';
import Keranjang from './keranjang';
import { ProdukView, TransaksiView, kategoriView } from './types';

function POS() {
  const navigate = useNavigate();

  const [kategori, setKategori] = useState<kategoriView>({ list: [], active: 'semua' });
  const [produk, setProduk] = useState<ProdukView>({
    list: [],
    page: 1,
    limit: 50,
    loading: false,
    last: false,
    form: false,
  });
  const [transaksi, setTransaksi] = useState<TransaksiView>({ trx_id: '', item: [], keranjang: null, count: 0 });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const k = await listKategori();
    setKategori(prev => ({ ...prev, list: k }));
    await fetchProduk(1);
    const t = await listTransaksiPending();
    if (t[0]) {
      const item = await listItem(t[0].id);
      setTransaksi(prev => ({ ...prev, trx_id: t[0].id, item, count: item.length }));
    }
  };

  const fetchProduk = async (page: number, option?: Partial<Pick<QueryProduk, 'kategori' | 'search'>>) => {
    try {
      setProduk(prev => ({
        ...prev,
        loading: true,
      }));

      const res = await listProduk({ page: page.toString(), pageSize: produk.limit.toString(), ...option });
      const last = res.length !== produk.limit;
      setProduk(prev => ({
        ...prev,
        last,
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

  const addKeranjang = async (request: TransaksiItemPayload) => {
    let id = '';
    let count = false;
    const { transaksi_id, ...payload } = request;
    if (!transaksi_id) {
      id = await createTransaksi(payload);
      count = true;
    } else {
      await addItem(request);
    }
    setTransaksi(prev => {
      const find = prev.item.find(item => item.produk_id === request.produk_id);
      return { ...prev, count: find && !count ? prev.count : prev.count + 1, trx_id: id };
    });
  };

  return (
    <div className="flex flex-col">
      <Keranjang
        show={!!transaksi.keranjang}
        setShow={() => setTransaksi(prev => ({ ...prev, keranjang: null }))}
        transaksi_id={transaksi.trx_id}
        addItem={addKeranjang}
        produk={transaksi.keranjang}
      />
      <Header title="POS">
        <button
          className="relative h-8 aspect-square"
          onClick={() => {
            if (transaksi.count > 0) navigate('/pos/order');
          }}
        >
          <i className="fa-solid fa-cart-shopping"></i>
          <span className="absolute top-0 -right-1.5 border text-[0.7rem] bg-white text-primary leading-4 h-4 aspect-square text-center rounded-full font-bold">
            {transaksi.count > 9 ? '9+' : transaksi.count}
          </span>
        </button>
      </Header>
      <div className="flex flex-col gap-2">
        <section className="px-2 py-2 flex gap-2 items-center bg-white">
          <div className="border w-full overflow-hidden h-8 rounded-full">
            <input
              type="text"
              inputMode="search"
              placeholder="Cari ...."
              className="w-full text-sm px-4 h-full outline-none"
            />
          </div>
          <button className="h-8 aspect-square">
            <i className="fa-solid fa-expand"></i>
          </button>
        </section>
        <section className="px-2">
          <h2 className="mb-2 font-bold">Kategori</h2>
          <div className="overflow-auto flex gap-2 pb-2">
            <button
              className={clsx('border rounded text-sm px-2 py-0.5 whitespace-nowrap', {
                ['border-primary text-primary']: kategori.active === 'semua',
              })}
              onClick={() => onKategori('semua')}
            >
              Semua
            </button>
            {kategori.list.map(item => (
              <button
                className={clsx('border rounded text-sm px-2 py-0.5 whitespace-nowrap', {
                  ['border-primary text-primary']: kategori.active === item.id,
                })}
                key={item.id}
                onClick={() => onKategori(item.id)}
              >
                {item.nama}
              </button>
            ))}
          </div>
        </section>
        <section className="px-2">
          <h2 className="mb-2 font-bold">Produk</h2>

          <ScrollElement
            next={() => fetchProduk(produk.page + 1)}
            loader={
              <div className="w-full flex justify-center h-6 mb-6">
                <PropagateLoader color="var(--primary)" />
              </div>
            }
            className="flex flex-col gap-2"
            last={produk.last}
            isLoading={produk.loading}
            dataLength={produk.list.length}
          >
            {produk.list.map((item, i) => {
              const hargaDiskon = item.harga_jual - calculationDiskon(item);
              return (
                <ScrollElement.Body index={i} className="border rounded p-1 flex gap-3 relative" key={i}>
                  {item.total_stok > 0 ? (
                    <button
                      className="absolute bottom-1 right-1 bg-primary text-xs py-1 px-2 rounded-sm text-white"
                      onClick={() => setTransaksi(prev => ({ ...prev, keranjang: item }))}
                    >
                      +Keranjang
                    </button>
                  ) : (
                    <div className="absolute bottom-1 right-1 bg-gray-200 text-xs py-1 px-2 rounded-sm ">
                      Stok habis
                    </div>
                  )}
                  <div className="h-16 aspect-square flex bg-gray-300 rounded-lg overflow-hidden">
                    {item.nama ? (
                      <img
                        src={`http://localhost:4000/${item.image}`}
                        alt={item.nama}
                        height={64}
                        width={64}
                        className="aspect-square max-w-full max-h-16 object-cover m-auto"
                      />
                    ) : (
                      <i className="fa-regular fa-image m-auto text-5"></i>
                    )}
                  </div>
                  <div className="flex-auto overflow-hidden">
                    <p className="text-base font-bold truncate">{item.nama}</p>
                    <p className="text-xs font-medium mb-1 capitalize">{item.kategori ? item.kategori.nama : '-'}</p>
                    <p className="text-sm font-bold">{currency(hargaDiskon)}</p>
                  </div>
                </ScrollElement.Body>
              );
            })}
          </ScrollElement>
        </section>
      </div>
    </div>
  );
}

export default POS;
