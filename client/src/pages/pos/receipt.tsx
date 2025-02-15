import { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import Modal from '../../components/modal';
import { TransaksiDetailAPI, TransaksiPaymentPayload } from '../../repository/transaksi/types';
import { dateValue } from '../../utils/date';
import { useGetValue } from '../../utils/provider';

interface Props {
  show: boolean;
  setShow: VoidFunction;
  items: TransaksiDetailAPI[];
  calculate: {
    subTotal: number;
    diskon: number;
    total: number;
  };
  transaksi: TransaksiPaymentPayload;
  to?: string;
}
const Receipt: FC<Props> = ({ show, setShow, items, calculate, transaksi, to }) => {
  const profile = useGetValue(state => state.profile);
  const navigate = useNavigate();

  if (!profile) return;

  return (
    <Modal show={show} setShow={setShow}>
      <Modal.Body>
        <div className="text-center">
          <h1 className="font-bold text-xl">{profile.toko.nama}</h1>
          <p className="text-xs">{profile.toko.alamat}</p>
          <p className="text-xs">{profile.toko.hp}</p>
        </div>
        <div className="grid grid-cols-2 text-xs py-2 border-b border-dashed">
          <p>{dateValue(new Date())}</p>
          <p></p>
          <p>Kasir</p>
          <p className="text-end">{profile.nama || profile.email}</p>
        </div>
        <div className="py-2 border-b border-dashed">
          {items.map(item => (
            <div key={item.id} className="flex gap-1 mb-1">
              <p className="flex-1">{item.produk_nama}</p>
              <p className="w-5 shrink-0 text-right">{item.qty}</p>
              <p className="w-12 shrink-0 text-right">
                {(Number(item.produk_harga_jual) - Number(item.diskon_total)).toLocaleString('id-ID')}
              </p>
              <p className="w-12 shrink-0 text-right">
                {(item.qty * Number(item.produk_harga_jual)).toLocaleString('id-ID')}
              </p>
            </div>
          ))}
        </div>
        <div className="py-2 grid grid-cols-2 border-b border-dashed">
          <p>Sub-Total</p>
          <p className="text-right">{Number(calculate.subTotal).toLocaleString('id-ID')}</p>
          <p>Diskon</p>
          <p className="text-right">{Number(calculate.diskon).toLocaleString('id-ID')}</p>
        </div>
        <div className="py-2 grid grid-cols-2">
          <p className="font-bold">Total</p>
          <p className="text-right font-bold">{Number(calculate.total).toLocaleString('id-ID')}</p>
          <p className="font-bold">Pembayaran</p>
          <p className="text-right font-bold">{Number(transaksi.pembayaran).toLocaleString('id-ID')}</p>
          <p className="font-bold">Kembalian</p>
          <p className="text-right font-bold">{Number(transaksi.kembalian).toLocaleString('id-ID')}</p>
        </div>
        <div className="py-2 text-center">
          <p>Terima kasih!</p>
        </div>

        <div className="flex justify-center gap-2 py-2">
          <button className="py-1 px-2 bg-primary rounded text-white w-16 font-semibold">Cetak</button>
          <button
            className="py-1 px-2 border border-primary rounded text-primary w-16 font-semibold"
            onClick={() => (to === undefined ? setShow() : navigate(to || '/pos'))}
          >
            Close
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Receipt;
