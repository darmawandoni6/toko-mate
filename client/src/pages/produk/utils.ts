import { ProdukAPI } from '../../repository/produk/types';

export const calculationDiskon = (item: ProdukAPI) => {
  const { diskon, harga_jual } = item;

  if (!diskon || !diskon.status) {
    return 0;
  }

  const now = new Date();
  const start = new Date(diskon.start_diskon);
  const end = diskon.end_diskon ? new Date(diskon.end_diskon) : null;

  if (now < start) {
    return 0;
  }

  if (end && now > end) {
    return 0;
  }

  const value = Number(diskon.value);
  if (diskon.type === 'percent') {
    const d = (harga_jual * value) / 100;
    return d;
  }
  return value;
};
