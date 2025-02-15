import { FC, useMemo, useState } from 'react';

import Modal from '../../components/modal';
import { ProdukAPI } from '../../repository/produk/types';
import { TransaksiItemPayload } from '../../repository/transaksi/types';
import { currency } from '../../utils/number';
import { calculationDiskon } from '../produk/utils';

interface Props {
  show: boolean;
  setShow: VoidFunction;
  produk: ProdukAPI | null;
  transaksi_id: string;
  addItem: (payload: TransaksiItemPayload) => Promise<void>;
}

const Keranjang: FC<Props> = ({ show, setShow, produk, addItem, transaksi_id }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<number>(1);

  const hargaDiskon = useMemo(() => {
    if (produk) return calculationDiskon(produk);
    return 0;
  }, [produk]);

  if (!produk) return null;

  const handleValue = (increment: boolean) => {
    setValue(prev => {
      const v = increment ? prev + 1 : prev - 1;
      if (v < 1) {
        return 1;
      }
      return v;
    });
  };

  const onAdd = async () => {
    try {
      setLoading(true);
      const payload: TransaksiItemPayload = {
        barcode: produk.barcode,
        produk_harga_beli: produk.harga_beli,
        produk_harga_jual: produk.harga_jual,
        produk_id: produk.id,
        produk_nama: produk.nama,
        qty: value,
        transaksi_id,
      };
      if (hargaDiskon) {
        const { id, nama } = produk.diskon!;
        payload.diskon_id = id;
        payload.diskon_nama = nama;
        payload.diskon_total = hargaDiskon;
      }
      await addItem(payload);
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setShow();
    setValue(1);
  };

  return (
    <Modal show={show} setShow={handleClose}>
      <Modal.Body>
        <div className="flex gap-2 items-center mb-2">
          <div className="h-12 w-12 bg-gray-300 rounded flex">
            <i className="fa-regular fa-image m-auto text-xl"></i>
          </div>
          <h1 className="flex-1 overflow-hidden ellipsis-2 text-base font-bold">{produk.nama}</h1>
        </div>
        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-400">Harga</p>
          <p className="font-bold text-lg text-primary">{currency(Number(produk.harga_jual) - hargaDiskon)}</p>
        </div>
        <div className="flex gap-2">
          <div className="flex w-2/5 gap-2 ">
            <button className="shadow rounded h-8 aspect-square text-xs font-bold" onClick={() => handleValue(false)}>
              <i className="fa-solid fa-minus"></i>
            </button>
            <input value={value} readOnly className="text-center w-full block text-xs font-bold" />
            <button
              id="plus"
              className="shadow rounded h-7 aspect-square text-xs font-bold"
              onClick={() => handleValue(true)}
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
          <button className="border h-8 rounded flex-1 bg-primary text-white shadow" onClick={onAdd} disabled={loading}>
            Tambah
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Keranjang;
