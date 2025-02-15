import { FC, useEffect, useMemo, useState } from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';

import FooterButton from '../../components/footer-button';
import FormInput from '../../components/form-input';
import Modal from '../../components/modal';
import { DiskonAPI, DiskonForm, DiskonPayload } from '../../repository/diskon/types';
import { dateValue } from '../../utils/date';

const now = new Date();

interface Props {
  show: boolean;
  setShow: VoidFunction;
  row?: DiskonAPI;
  submit: (payload: DiskonPayload) => Promise<void>;
}

const FormDiskon: FC<Props> = ({ show, setShow, submit, row }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DiskonForm>({ defaultValues: { type: 'percent' } });

  const [loading, setLoading] = useState(false);

  const minEndDate = useMemo(() => {
    const start = watch('start_diskon');
    if (start) {
      const calc = new Date(start);
      const dt = new Date(calc.getFullYear(), calc.getMonth(), calc.getDate() + 7);
      return dateValue(dt);
    }
    return undefined;
  }, [watch('start_diskon')]);

  useEffect(() => {
    if (row) {
      setValue('nama', row.nama);
      setValue('type', row.type);
      setValue('value', row.value);
      setValue('start_diskon', dateValue(new Date(row.start_diskon)));
      if (row.end_diskon) {
        setValue('end_diskon', dateValue(new Date(row.end_diskon)));
      }
    }
  }, [row]);

  const onSubmit: SubmitHandler<DiskonForm> = async data => {
    try {
      setLoading(true);
      if (!data.end_diskon) {
        data.end_diskon = null;
      }
      await submit(data);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    if (loading) return;
    reset();
    setShow();
  };

  return (
    <Modal show={show} setShow={onClose}>
      <Modal.Header title={row ? 'Update Diskon' : 'Create Diskon'} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <FormInput id="nama" label="Nama" message={errors.nama?.message}>
            <input
              type="text"
              className="capitalize"
              placeholder="input nama diskon"
              {...register('nama', { required: true })}
            />
          </FormInput>
          <FormInput id="type" label="Type" message={errors.type?.message}>
            <select {...register('type', { required: true })} className="capitalize">
              <option value="percent">percent</option>
              <option value="rupiah">rupiah</option>
            </select>
          </FormInput>
          <FormInput id="value" label="Value" message={errors.value?.message}>
            <input type="text" placeholder="input value diskon" {...register('value', { required: true })} />
          </FormInput>
          <FormInput id="start_diskon" label="Start Date" message={errors.start_diskon?.message}>
            <input type="date" min={dateValue(now)} {...register('start_diskon', { required: true })} />
          </FormInput>
          <FormInput id="end_diskon" label="End Date" message={errors.end_diskon?.message}>
            <input type="date" disabled={!watch('start_diskon')} min={minEndDate} {...register('end_diskon')} />
          </FormInput>
        </Modal.Body>
        <FooterButton onClose={onClose} loading={loading} />
      </form>
    </Modal>
  );
};

export default FormDiskon;
