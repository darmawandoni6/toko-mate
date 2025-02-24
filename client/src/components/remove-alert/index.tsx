import { FC, useState } from 'react';

import Modal from '../modal';

interface Props {
  show: boolean;
  setShow: VoidFunction;
  name?: string;
  onSubmit: () => Promise<void>;
}
const RemoveAlert: FC<Props> = ({ show, setShow, name, onSubmit }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit();

      setShow();
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    if (loading) {
      return;
    }
    setShow();
  };

  return (
    <Modal show={show} setShow={handleClose}>
      <Modal.Body className="flex flex-col gap-2 items-center">
        <div className="h-20 w-20 rounded-full border-2 border-orange-200 text-orange-200 text-4xl leading-[5rem] text-center">
          <i className="fa-solid fa-exclamation"></i>
        </div>
        <div className="text-center mb-4">
          <h1 className="text-2xl font-semibold mb-2">Kamu Yakin ?</h1>
          <p>
            Anda yakin menghapus item<span className="font-bold">{` ${name || 'ini'}`}</span> ?
          </p>
        </div>
        <div className="flex gap-2">
          <button className=" px-2 py-1 rounded text-xs bg-blue-600 text-white font-medium" onClick={handleSubmit}>
            {loading ? 'Loading...' : 'Iya, Hapus!'}
          </button>
          <button className=" px-2 py-1 rounded text-xs bg-red-600 text-white font-medium" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveAlert;
