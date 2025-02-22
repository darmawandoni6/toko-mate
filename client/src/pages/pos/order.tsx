import { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Header from '../../components/header';
import { listItem, listTransaksiPending, removeItem, removeTransaksi, updateItem } from '../../repository/transaksi';
import { TransaksiDetailAPI } from '../../repository/transaksi/types';
import { currency } from '../../utils/number';

let time: number;

function PostOrder() {
  const navigate = useNavigate();

  const [trxId, setTrxId] = useState<string>('');
  const [items, setItem] = useState<TransaksiDetailAPI[]>([]);
  const [check, setCheck] = useState<boolean>(false);

  const subTotal = useMemo(() => {
    const res = items.reduce((acc, data) => {
      const harga = Number(data.produk_harga_jual) - Number(data.diskon_total);
      acc += data.qty * harga;
      return acc;
    }, 0);

    return currency(res);
  }, [items]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const t = await listTransaksiPending();
    if (!t[0]) {
      navigate('/', { replace: true });
    }
    const item = await listItem(t[0].id);
    setItem(item);
    setTrxId(t[0].id);
  };

  const updateProduk = async (item: TransaksiDetailAPI, qty: number) => {
    await updateItem(item.id, item.transaksi_id, { qty, produk_harga_jual: Number(item.produk_harga_jual) });
  };

  const handleValue = (i: number, item: TransaksiDetailAPI, val: number) => {
    setItem(prev => {
      if (val === 0) {
        prev.splice(i, 1);
      } else {
        prev[i].qty = val;
      }
      return [...prev];
    });

    clearTimeout(time);
    time = setTimeout(() => {
      updateProduk(item, val < 0 ? 0 : val);
    }, 2000);
  };

  const onAllChecked = () => {
    setCheck(prev => !prev);
  };

  const onRemoveItem = async (i: number, item: TransaksiDetailAPI) => {
    setItem(prev => {
      prev.splice(i, 1);
      return [...prev];
    });
    await removeItem(item.id, item.transaksi_id);
  };

  const onRemoveAll = async () => {
    await removeTransaksi(trxId);
    setItem([]);
  };

  return (
    <div className="flex flex-col flex-1">
      <Header title="POS - Checkout" />
      <div className="flex flex-col gap-2 p-2 flex-1">
        <section className="flex justify-between">
          <label htmlFor="all" className="flex items-center gap-2">
            <input id="all" type="checkbox" checked={check} onClick={onAllChecked} />
            <span className="text-xs">{`Pili semua (${items.length}) produk`}</span>
          </label>
          {check && (
            <button className="text-red-600 text-xs" onClick={onRemoveAll}>
              Hapus semua
            </button>
          )}
        </section>

        <section className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div className="flex gap-2  items-start" key={i}>
              <div className="border rounded-lg p-1 w-full flex gap-3 overflow-x-hidden">
                <div className="h-16 flex shrink-0 aspect-square bg-gray-300 rounded-lg overflow-hidden">
                  {item.produk.image ? (
                    <img
                      src={`${config.baseUrl}/${item.produk.image}`}
                      alt={item.produk_nama}
                      height={64}
                      width={64}
                      className="aspect-square max-w-full max-h-16 object-cover m-auto"
                    />
                  ) : (
                    <i className="fa-regular fa-image m-auto text-5 xl"></i>
                  )}
                </div>

                <div className="flex-1 overflow-hidden flex flex-col gap-4">
                  <div className="flex-auto overflow-hidden">
                    <p className="text-base font-bold truncate">{item.produk_nama}</p>
                    <p className="text-sm font-semibold">
                      {currency(Number(item.produk_harga_jual) - Number(item.diskon_total))}
                    </p>
                  </div>
                  <footer className="flex gap-7 w-full mb-2">
                    <button
                      className="text-xs text-red-600 h-8 shadow aspect-square"
                      onClick={() => onRemoveItem(i, item)}
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                    <div className="flex gap-1">
                      <div className="flex flex-1 gap-2 ">
                        <button
                          className="shadow rounded h-8 aspect-square text-xs font-bold"
                          onClick={() => handleValue(i, item, item.qty - 1)}
                        >
                          <i className="fa-solid fa-minus"></i>
                        </button>
                        <input
                          value={item.qty}
                          readOnly
                          className="text-center w-1/3 max-w-full block text-xs font-bold"
                        />
                        <button
                          id="plus"
                          className="shadow rounded h-8 aspect-square text-xs font-bold"
                          onClick={() => handleValue(i, item, item.qty + 1)}
                        >
                          <i className="fa-solid fa-plus"></i>
                        </button>
                      </div>
                    </div>
                  </footer>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
      <footer className="flex justify-between p-2 shadow border-t sticky bottom-0 bg-white">
        <section>
          <p className="text-xs">Total harga:</p>
          <p className="text-red-600 text-base font-bold">{subTotal}</p>
        </section>
        <button className="bg-primary text-white h-9 rounded-lg text-sm px-4" onClick={() => navigate('/pos/checkout')}>
          Checkout
        </button>
      </footer>
    </div>
  );
}

export default PostOrder;
