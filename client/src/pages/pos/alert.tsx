import { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import Modal from '../../components/modal';

interface Props {
  show: boolean;
  onReceipt: VoidFunction;
}

const Alert: FC<Props> = ({ show, onReceipt }) => {
  const navigate = useNavigate();

  return (
    <Modal show={show}>
      <Modal.Body>
        <div className="text-center mb-3">
          <i className="fa-regular fa-circle-check text-green-500 text-5xl mb-2"></i>
          <h2 className="font-bold text-lg">Sukses Pembayaran</h2>
          <p>Cetak tanda terima untuk pesanan selesai?</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-primary text-white w-1/2 py-2 rounded font-semibold" onClick={onReceipt}>
            Cetak
          </button>
          <button
            className="border border-primary text-primary w-1/2 py-2 rounded font-semibold"
            onClick={() => navigate('/pos', { replace: true })}
          >
            Close
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Alert;
