import { ChangeEvent } from 'react';

export const currency = (number: number) => {
  const v = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
    number,
  );
  return v;
};

export const thousandSeparator = (text: string): string => {
  return text.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const inputCurrency = (e: ChangeEvent<HTMLInputElement>) => {
  const text = e.target.value;
  e.target.value = thousandSeparator(text);
};

export const toNumber = (val: string): number => {
  const str = val.replace(/\D/g, '');

  return Number(str);
};
