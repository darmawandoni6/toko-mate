import { ChangeEvent, FC, useMemo, useState } from 'react';

import Modal from '../../components/modal';
import { TransaksiPaymentPayload } from '../../repository/transaksi/types';
import { currency, inputCurrency, toNumber } from '../../utils/number';

interface Props {
  show: boolean;
  setShow: VoidFunction;
  total: number;
  onProses: (payload: TransaksiPaymentPayload) => Promise<void>;
}
const Payment: FC<Props> = ({ show, setShow, total, onProses }) => {
  const [payment, setPayment] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  const change = useMemo(() => {
    return Math.max(payment - total, 0);
  }, [payment]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    inputCurrency(e);

    const val = toNumber(e.target.value);

    setPayment(val);
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      await onProses({ pembayaran: payment, kembalian: change });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} setShow={setShow}>
      <Modal.Header title="Payment" />
      <Modal.Body>
        <div className="text-xl font-bold text-gray-700 text-center">Total Belanja</div>
        <div className="text-3xl font-semibold text-green-600 text-center">{currency(total)}</div>

        <div className="mt-4">
          <label className="block text-gray-600 mb-1">Pembayaran</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg outline-none"
            inputMode="numeric"
            placeholder="Masukkan jumlah pembayaran"
            value={payment.toLocaleString('id-ID')}
            onChange={onChange}
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-600 text-center mb-1">Kembalian</label>
          <div className="text-2xl font-semibold text-blue-600 text-center">{currency(change)}</div>
        </div>

        <button
          className="w-full bg-primary text-white py-2 mt-4 rounded-lg hover:bg-primary"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Proses Pembayaran'}
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default Payment;
