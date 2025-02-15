import { FC, useEffect, useState } from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';

import FooterButton from '../../components/footer-button';
import FormInput from '../../components/form-input';
import Modal from '../../components/modal';
import { ProfileAPI, ProfileForm, ProfilePayload } from '../../repository/auth/types';

interface Props {
  show: boolean;
  setShow: VoidFunction;
  data: ProfileAPI;
  submit: (payload: ProfilePayload) => Promise<void>;
}

const FormProfile: FC<Props> = ({ show, setShow, data, submit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileForm>();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setValue('nama', data.toko.nama);
    setValue('alamat', data.toko.alamat);
    setValue('hp', data.toko.hp);
    setValue('email', data.email);
    setValue('namaUser', data.nama);
    setValue('password', data.password);
  }, [data]);

  const onSubmit: SubmitHandler<ProfileForm> = async data => {
    try {
      setLoading(true);
      await submit({
        nama: data.nama,
        alamat: data.alamat,
        hp: data.hp,
        user: {
          email: data.email,
          nama: data.namaUser,
          password: data.password,
        },
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    if (loading) return;
    setShow();
  };
  return (
    <Modal show={show} setShow={onClose}>
      <Modal.Header title="Profil" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <FormInput id="name" label="Nama" message={errors.namaUser?.message}>
            <input type="text" {...register('namaUser', { required: true })} />
          </FormInput>
          <FormInput id="name" label="Username" message={errors.email?.message}>
            <input type="text" {...register('email', { required: true })} readOnly />
          </FormInput>
          <FormInput id="name" label="password" message={errors.password?.message}>
            <input type="password" {...register('password')} />
          </FormInput>
          <FormInput id="name" label="Nama Toko" message={errors.nama?.message}>
            <input type="text" {...register('nama', { required: true })} />
          </FormInput>
          <FormInput id="name" label="Alamat Toko" message={errors.alamat?.message}>
            <input type="text" {...register('alamat', { required: true })} />
          </FormInput>
          <FormInput id="name" label="No. Telp Toko" message={errors.hp?.message}>
            <input type="text" inputMode="numeric" {...register('hp', { required: true })} />
          </FormInput>
        </Modal.Body>
        <FooterButton onClose={onClose} loading={loading} />
      </form>
    </Modal>
  );
};

export default FormProfile;
