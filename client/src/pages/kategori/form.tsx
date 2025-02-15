import { FC, useEffect, useState } from 'react';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import FooterButton from '../../components/footer-button';
import FormInput from '../../components/form-input';
import Modal from '../../components/modal';
import ReactSwitch from '../../components/switch';
import { KategoriAPI, KategoriForm } from '../../repository/kategori/types';

interface Props {
  show: boolean;
  setShow: VoidFunction;
  row?: KategoriAPI;
  submit: (data: KategoriForm) => Promise<void>;
}
const FormKategori: FC<Props> = ({ show, setShow, row, submit }) => {
  const {
    register,
    handleSubmit,
    setValue: setValueForm,
    control,
    reset,
    formState: { errors },
  } = useForm<KategoriForm>();

  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (show) {
      return () => {
        reset();
        setLoading(false);
      };
    }
  }, [show]);

  useEffect(() => {
    if (row) {
      setValueForm('id', row.id);
      setValueForm('nama', row.nama);
      setValueForm('status', row.status);
    }
  }, [row]);

  const onSubmit: SubmitHandler<KategoriForm> = async data => {
    setLoading(true);
    await submit(data);
  };

  const handleClose = () => {
    if (isLoading) return;
    setShow();
  };
  return (
    <Modal show={show} setShow={handleClose}>
      <Modal.Header title={row ? 'Update Kategori' : 'Create Kategori'} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <FormInput id="nama" label="Nama" message={errors.nama?.message}>
            <input
              type="text"
              className="capitalize"
              placeholder="input nama produk"
              {...register('nama', { required: true })}
            />
          </FormInput>
          {row && (
            <Controller
              name="status"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <ReactSwitch checked={value} onChange={val => onChange(val)} />
              )}
            />
          )}
        </Modal.Body>
        <FooterButton onClose={handleClose} loading={isLoading} />
      </form>
    </Modal>
  );
};

export default FormKategori;
