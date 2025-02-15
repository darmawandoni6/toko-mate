import { useEffect, useMemo, useState } from 'react';

import { PropagateLoader } from 'react-spinners';

import Header from '../../components/header';
import ScrollElement from '../../components/scroll-element';
import { listItem, listTransaksiSuccess } from '../../repository/transaksi';
import { TransaksiAPI } from '../../repository/transaksi/types';
import { dateValue } from '../../utils/date';
import { currency } from '../../utils/number';
import Receipt from '../pos/receipt';
import { ReceiptView, TransaksiView } from './types';

function Transaksi() {
  const [transaksi, setTransaksi] = useState<TransaksiView>({
    list: [],
    page: 1,
    limit: 50,
    last: false,
    loading: false,
  });
  const [receipt, setReceipt] = useState<ReceiptView>({ show: false, transaksi: null, items: [] });

  const calculate = useMemo(() => {
    if (receipt.transaksi) {
      const { sub_total, total_diskon, total } = receipt.transaksi;

      return {
        subTotal: sub_total,
        diskon: total_diskon,
        total: total,
      };
    }
    return {
      subTotal: 0,
      diskon: 0,
      total: 0,
    };
  }, [receipt.transaksi]);

  useEffect(() => {
    fetchTransaksi(1);
  }, []);

  const fetchTransaksi = async (page: number) => {
    try {
      setTransaksi(prev => ({
        ...prev,
        loading: true,
      }));

      const res = await listTransaksiSuccess({ page, pageSize: transaksi.limit });

      setTransaksi(prev => ({
        ...prev,
        last: res.length < prev.limit,
        list: page === 1 ? res : [...prev.list, ...res],
        page,
      }));
    } finally {
      setTransaksi(prev => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const onShow = async (items: TransaksiAPI) => {
    const res = await listItem(items.id);
    setReceipt(prev => ({
      ...prev,
      show: true,
      items: res,
      transaksi: items,
    }));
  };
  return (
    <>
      <Header title="Transaksi" />
      <Receipt
        show={receipt.show}
        setShow={() => setReceipt(prev => ({ ...prev, show: false }))}
        items={receipt.items}
        calculate={calculate}
        transaksi={{ kembalian: receipt.transaksi?.kembalian ?? 0, pembayaran: receipt.transaksi?.pembayaran ?? 0 }}
      />
      <ScrollElement
        next={() => fetchTransaksi(transaksi.page + 1)}
        loader={
          <div className="w-full flex justify-center h-6 mb-6">
            <PropagateLoader color="var(--primary)" />
          </div>
        }
        className="p-2 mb-4"
        last={transaksi.last}
        isLoading={transaksi.loading}
        dataLength={transaksi.list.length}
      >
        {transaksi.list.map((item, i) => (
          <ScrollElement.Body index={i} className="flex items-center border-b py-2" key={i}>
            <div className="flex-auto ">
              <h1 className="text-base font-bold">{item.no_faktur}</h1>
              <div className="text-sm">
                <p>Total Pembayaran: {currency(item.total)}</p>
                <p>{`Create Time: ${dateValue(new Date(item.updated_at))}`}</p>
              </div>
            </div>
            <div className="w-8 aspect-square text-center" role="button" onClick={() => onShow(item)}>
              <i className="fa-solid fa-chevron-right"></i>
            </div>
          </ScrollElement.Body>
        ))}
      </ScrollElement>
    </>
  );
}

export default Transaksi;
