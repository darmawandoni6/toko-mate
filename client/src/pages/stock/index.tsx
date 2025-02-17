import { useEffect, useState } from 'react';

import { PropagateLoader } from 'react-spinners';

import Header from '../../components/header';
import ScrollElement from '../../components/scroll-element';
import { createStok, listStok } from '../../repository/stock';
import { StokPayload } from '../../repository/stock/types';
import { currency } from '../../utils/number';
import Form from './form';
import { StokView } from './types';

function Stock() {
  const [stok, setStok] = useState<StokView>({
    page: 1,
    limit: 20,
    last: false,
    list: [],
    form: false,
    loading: false,
    increment: true,
  });

  useEffect(() => {
    fetchStok(1);
  }, []);

  const fetchStok = async (page: number) => {
    try {
      setStok(prev => ({
        ...prev,
        loading: true,
      }));

      const res = await listStok({ page: page, pageSize: stok.limit });

      setStok(prev => ({
        ...prev,
        last: res.length !== prev.limit,
        list: page === 1 ? res : [...prev.list, ...res],
        page,
      }));
    } finally {
      setStok(prev => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const onSubmit = async (payload: StokPayload) => {
    try {
      setStok(prev => ({ ...prev, loading: true }));

      if (!stok.increment) {
        payload.qty = payload.qty * -1;
      }
      await createStok(payload);
      await fetchStok(1);
    } finally {
      setStok(prev => ({ ...prev, loading: false }));
    }
  };

  const onClose = () => {
    if (stok.loading) return;
    setStok(prev => ({ ...prev, form: false }));
  };
  return (
    <div className="flex flex-col">
      <Form show={stok.form} setShow={onClose} setSubmit={onSubmit} />

      <Header title="Stock" />

      <section className="p-2 flex flex-col gap-1 flex-auto">
        <header className="grid grid-cols-2 gap-2 mb-2">
          <button
            className="h-8 aspect-square border w-full rounded text-xs font-semibold bg-green-600 text-white"
            onClick={() => setStok(prev => ({ ...prev, increment: true, form: true }))}
          >
            <i className="fa-solid fa-plus me-2"></i>
            <span>Stock</span>
          </button>
          <button
            className="h-8 aspect-square border w-full rounded text-xs font-semibold bg-red-600 text-white"
            onClick={() => setStok(prev => ({ ...prev, increment: false, form: true }))}
          >
            <i className="fa-solid fa-minus me-2"></i>
            <span>Stock</span>
          </button>
        </header>
        <ScrollElement
          next={() => fetchStok(stok.page + 1)}
          loader={
            <div className="w-full flex justify-center h-6 mb-6">
              <PropagateLoader color="var(--primary)" />
            </div>
          }
          className="flex flex-col gap-2"
          last={stok.last}
          isLoading={stok.loading}
          dataLength={stok.list.length}
        >
          {stok.list.map((item, i) => (
            <ScrollElement.Body index={i} className="flex gap-2 items-start " key={i}>
              <div className="border rounded-lg p-1 flex gap-3 flex-auto overflow-hidden">
                <div className="h-16 aspect-square flex bg-gray-300 rounded-lg">
                  {item.produk.image ? (
                    <img
                      src={`http://localhost:4000/${item.produk.image}`}
                      alt={item.produk.nama}
                      height={64}
                      width={64}
                      className="aspect-square max-w-full max-h-16 object-cover m-auto"
                    />
                  ) : (
                    <i className="fa-regular fa-image m-auto text-5 xl"></i>
                  )}
                </div>
                <div className="flex-auto overflow-hidden flex flex-col gap-1">
                  <p className="text-base font-bold truncate">{item.produk.nama}</p>
                  <div className="text-xs flex justify-between gap-2">
                    <div className="flex flex-col gap-1 text-xs">
                      <span>{`Stock: ${item.qty} Pcs`}</span>
                      <span>{`Modal: ${currency(item.produk.harga_beli)}`}</span>
                      <span>{`Jual: ${currency(item.produk.harga_jual)}`}</span>
                      <span>{`Deskripsi: ${item.deskripsi}`}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollElement.Body>
          ))}
        </ScrollElement>
      </section>
    </div>
  );
}

export default Stock;
