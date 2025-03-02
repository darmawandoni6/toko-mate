import { FC, useEffect, useState } from 'react';

import clsx from 'clsx';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import FooterButton from '../../components/footer-button';
import FormInput from '../../components/form-input';
import Modal from '../../components/modal';
import SelectOption from '../../components/select-option';
import useBarcode from '../../hooks/use-barcode';
import { DiskonAPI } from '../../repository/diskon/types';
import { KategoriAPI } from '../../repository/kategori/types';
import { ProdukAPI, ProdukForm } from '../../repository/produk/types';
import { inputCurrency, thousandSeparator } from '../../utils/number';

interface Props {
  show: boolean;
  setShow: VoidFunction;
  row?: ProdukAPI;
  kategori: KategoriAPI[];
  diskon: DiskonAPI[];
  setSubmit: (data: ProdukForm) => Promise<void>;
}

const FormProduk: FC<Props> = ({ show, setShow, row, kategori, diskon, setSubmit }) => {
  const { text, wrapper, onScanner, openScan } = useBarcode();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProdukForm>();

  // state
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (text) {
      setValue('barcode', text);
    }
  }, [text]);

  useEffect(() => {
    if (row) {
      setValue('barcode', row.barcode);
      setValue('harga_beli', thousandSeparator(row.harga_beli.toString()));
      setValue('harga_jual', thousandSeparator(row.harga_jual.toString()));

      setValue('kategori', { label: row.kategori.nama, value: row.kategori.id });
      setValue('id', row.id);
      setValue('nama', row.nama);
      setValue('total_stok', thousandSeparator(row.total_stok.toString()));
    }
  }, [row]);

  const onSubmit: SubmitHandler<ProdukForm> = async data => {
    try {
      setLoading(true);
      await setSubmit(data);
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    reset();
    setShow();
    if (openScan) {
      onScanner();
    }
  };

  return (
    <Modal show={show} setShow={handleClose}>
      <Modal.Header title={row ? 'Update Produk' : 'Create Produk'} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={clsx('flex aspect-square', openScan ? 'block' : 'hidden')}>{wrapper}</div>
        {!openScan && (
          <Modal.Body>
            <FormInput
              id="barcode"
              label="Barcode"
              message={errors.barcode?.message}
              prefix={
                <button type="button" className="border aspect-square shrink-0 w-8 rounded" onClick={onScanner}>
                  <i className="fa-solid fa-barcode"></i>
                </button>
              }
            >
              <input type="text" placeholder="input barcode" {...register('barcode', { required: true })} />
            </FormInput>

            <FormInput id="nama" label="Nama" message={errors.nama?.message}>
              <input type="text" placeholder="input nama produk" {...register('nama', { required: true })} />
            </FormInput>
            <FormInput id="kategori" label="Kategori" message={errors.kategori?.message}>
              <Controller
                control={control}
                name="kategori"
                rules={{ required: true }}
                render={({ field: { onChange, ref, value } }) => (
                  <SelectOption
                    ref={ref}
                    value={value}
                    options={kategori.map(item => ({ label: item.nama, value: item.id }))}
                    onChange={val => onChange(val)}
                  />
                )}
              />
            </FormInput>
            <FormInput id="diskon" label="Diskon" message={errors.diskon?.message}>
              <Controller
                control={control}
                name="diskon"
                rules={{ required: false }}
                render={({ field: { onChange, ref, value } }) => (
                  <SelectOption
                    ref={ref}
                    value={value}
                    options={diskon.map(item => ({ label: item.nama, value: item.id }))}
                    onChange={val => onChange(val)}
                  />
                )}
              />
            </FormInput>
            <FormInput id="harga_beli" label="Harga Beli" message={errors.harga_beli?.message}>
              <input
                type="text"
                inputMode="numeric"
                placeholder="input nominal"
                {...register('harga_beli', { required: true, onChange: inputCurrency })}
              />
            </FormInput>
            <FormInput id="harga_jual" label="Harga Jual" message={errors.harga_jual?.message}>
              <input
                type="text"
                inputMode="numeric"
                placeholder="input nominal"
                {...register('harga_jual', { required: true, onChange: inputCurrency })}
              />
            </FormInput>
            {!row && (
              <FormInput id="total_stok" label="Stok" message={errors.total_stok?.message}>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="input nominal"
                  {...register('total_stok', { required: true, onChange: inputCurrency })}
                />
              </FormInput>
            )}
          </Modal.Body>
        )}
        {!openScan && <FooterButton onClose={handleClose} loading={loading} />}
      </form>
    </Modal>
  );
};

export default FormProduk;
