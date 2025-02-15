import { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Header from '../../components/header';
import { listItem, listTransaksiPending, paymentTransaksi } from '../../repository/transaksi';
import { TransaksiDetailAPI, TransaksiPaymentPayload } from '../../repository/transaksi/types';
import { currency } from '../../utils/number';
import Alert from './alert';
import Payment from './payment';
import Receipt from './receipt';

function PosCheckout() {
  const navigate = useNavigate();

  const [trxId, setTrxId] = useState<string>('');
  const [items, setItem] = useState<TransaksiDetailAPI[]>([]);
  const [transaksi, setTransaksi] = useState<TransaksiPaymentPayload>({ pembayaran: 0, kembalian: 0 });
  const [show, setShow] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<boolean>(false);

  const calculate = useMemo(() => {
    let subTotal = 0;
    let diskon = 0;
    let total = 0;
    for (const v of items) {
      subTotal += v.qty * Number(v.produk_harga_jual);
      diskon += Number(v.diskon_total) * v.qty;
    }

    total = subTotal - diskon;

    return {
      subTotal,
      diskon,
      total,
    };
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

  const onSubmit = async (payload: TransaksiPaymentPayload) => {
    try {
      await paymentTransaksi(trxId, payload);
      setTransaksi(payload);
      setShow(false);
      setAlert(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <Header title="POS - Checkout" />
      <Payment total={calculate.total} show={show} setShow={() => setShow(false)} onProses={onSubmit} />
      <Alert show={alert} onReceipt={() => setReceipt(true)} />
      <Receipt
        show={receipt}
        setShow={() => setReceipt(false)}
        items={items}
        calculate={calculate}
        transaksi={transaksi}
      />
      <div className="flex flex-col gap-2 flex-1">
        <section className="p-2">
          <h2 className="font-bold mb-2">Produk list</h2>
          {items.map((item, i) => (
            <div className="flex gap-2 items-start mb-2" key={i}>
              <div className="border rounded-lg p-1 flex gap-3 flex-auto overflow-hidden">
                <div className="h-16 aspect-square flex bg-gray-300 rounded-lg">
                  <i className="fa-regular fa-image m-auto text-5 xl"></i>
                </div>
                <div className="flex-auto overflow-hidden flex flex-col gap-1">
                  <p className="text-base font-bold truncate">{item.produk_nama}</p>
                  <div className="text-xs grid grid-cols-2">
                    <span>{`${item.qty} Pcs`}</span>
                    <p className="text-right">
                      {Number(item.diskon_total) > 0 && (
                        <span className="line-through text-gray-200 me-2">{currency(item.produk_harga_jual)}</span>
                      )}
                      <span>{currency(Number(item.produk_harga_jual) - Number(item.diskon_total))}</span>
                    </p>
                    <span className="font-bold">Total</span>
                    <span className="text-right font-bold">
                      {currency(item.qty * Number(item.produk_harga_jual) - Number(item.diskon_total))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
        <section className="border-t-4 p-2">
          <h2 className="font-bold mb-2">Rincian Pembayaran</h2>
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{currency(calculate.subTotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Diskon Produk</span>
            <span className="text-red-600">-{currency(calculate.diskon)}</span>
          </div>
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{currency(calculate.total)}</span>
          </div>
        </section>
      </div>
      <footer className="flex justify-between p-2 shadow border-t sticky bottom-0 bg-white">
        <section>
          <p className="text-xs">Total harga:</p>
          <p className="text-red-600 text-base font-bold">{currency(calculate.total)}</p>
        </section>
        <button className="bg-primary text-white h-9 rounded-lg text-sm px-4" onClick={() => setShow(true)}>
          Bayar
        </button>
      </footer>
    </div>
  );
}

export default PosCheckout;
