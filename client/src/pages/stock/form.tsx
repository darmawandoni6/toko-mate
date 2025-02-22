import { FC, useState } from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';

import FooterButton from '../../components/footer-button';
import FormInput from '../../components/form-input';
import Modal from '../../components/modal';
import { searchProduk } from '../../repository/produk';
import { StokForm, StokPayload } from '../../repository/stock/types';
import { inputCurrency, thousandSeparator, toNumber } from '../../utils/number';

interface Props {
  show: boolean;
  setShow: VoidFunction;
  setSubmit: (payload: StokPayload) => Promise<void>;
  increment: boolean;
}

const Form: FC<Props> = ({ show, setShow, setSubmit, increment }) => {
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    resetField,
    watch,
    formState: { errors },
  } = useForm<StokForm>();

  const onSubmit: SubmitHandler<StokForm> = async data => {
    try {
      setLoading(true);
      const payload: StokPayload = {
        produk_id: data.produk_id,
        deskripsi: data.deskripsi,
        qty: toNumber(data.qty),
        produk: {
          harga_jual: toNumber(data.harga_jual),
          harga_beli: toNumber(data.harga_beli),
        },
      };
      await setSubmit(payload);
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    reset();
    setShow();
  };

  const findProduk = async () => {
    const v = getValues('search');
    resetField('produk_id');
    resetField('harga_beli');
    resetField('harga_jual');

    if (!v) return;
    try {
      setLoading(true);
      const res = await searchProduk({ search: v });
      if (res) {
        setCheck(true);
        setValue('produk_id', res.id);
        setValue('harga_beli', thousandSeparator(res.harga_beli.toString()));
        setValue('harga_jual', thousandSeparator(res.harga_jual.toString()));
      }
    } finally {
      setLoading(false);
    }
  };

  const onBlurProduk = () => {
    if (check) return;
    resetField('produk_id');
    resetField('harga_beli');
    resetField('harga_jual');
  };

  return (
    <Modal show={show} setShow={handleClose}>
      <Modal.Header title={increment ? 'Penambahan Stock' : 'Pengurangan Stock'} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <FormInput id="search" label="Produk" message={errors.search?.message}>
            <div className="flex items-center gap-2 form-container">
              <input
                type="text"
                placeholder="input nominal"
                inputMode="numeric"
                className="w-full"
                {...register('search', { required: true, onChange: () => setCheck(false), onBlur: onBlurProduk })}
              />
              <button
                className="rounded w-7  h-7 shrink-0 bg-primary text-white"
                type="button"
                disabled={!getValues('search') || loading}
                onClick={findProduk}
              >
                <i className="fa-solid fa-check"></i>
              </button>
            </div>
          </FormInput>
          <FormInput id="harga_beli" label="Harga Beli" message={errors.harga_beli?.message}>
            <input
              type="text"
              placeholder="input nominal"
              inputMode="numeric"
              disabled={!watch('harga_beli')}
              {...register('harga_beli', { required: true, onChange: inputCurrency })}
            />
          </FormInput>
          <FormInput id="harga_jual" label="Harga Jual" message={errors.harga_jual?.message}>
            <input
              type="text"
              inputMode="numeric"
              placeholder="input nominal"
              disabled={!watch('harga_jual')}
              {...register('harga_jual', { required: true, onChange: inputCurrency })}
            />
          </FormInput>
          <FormInput id="qty" label="Qty" message={errors.qty?.message}>
            <input type="text" inputMode="numeric" {...register('qty', { required: true, onChange: inputCurrency })} />
          </FormInput>
          <FormInput id="deskripsi" label="Description" message={errors.deskripsi?.message}>
            <textarea rows={3} {...register('deskripsi', { required: true })} />
          </FormInput>
        </Modal.Body>
        <FooterButton onClose={handleClose} loading={loading} />
      </form>
    </Modal>
  );
};

export default Form;
