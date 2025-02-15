import { useState } from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import FormInput from '../../components/form-input';
import { authRegister } from '../../repository/auth';
import { RegisterForm, RegisterPayload } from '../../repository/auth/types';

const Register = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();

  const onSubmit: SubmitHandler<RegisterForm> = async data => {
    try {
      setLoading(true);
      const payload: RegisterPayload = {
        nama: data.nama,
        alamat: data.alamat,
        hp: data.hp,
        user: {
          nama: data.userNama,
          email: data.email,
          password: data.password,
        },
      };
      await authRegister(payload);
      navigate('/login');
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-white p-3 flex flex-col justify-center">
      <div className="mb-6 text-center">
        <h3 className="mb-2 text-2xl text-black">Register</h3>
        <h4 className="text-sm font-normal">Create New Toko-mate Account</h4>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput id="userNama" label="Nama" message={errors.userNama?.message}>
          <input type="text" {...register('userNama', { required: true })} />
        </FormInput>
        <FormInput id="email" label="Email" message={errors.email?.message}>
          <input type="text" autoComplete="username" {...register('email', { required: true })} />
        </FormInput>
        <FormInput id="name" label="password" message={errors.password?.message}>
          <input type="password" autoComplete="new-password" {...register('password', { required: true })} />
        </FormInput>
        <FormInput id="nama" label="Nama Toko" message={errors.nama?.message}>
          <input type="text" {...register('nama', { required: true })} />
        </FormInput>
        <FormInput id="alamat" label="Alamat Toko" message={errors.alamat?.message}>
          <input type="text" {...register('alamat', { required: true })} />
        </FormInput>
        <FormInput id="hp" label="No. Telp Toko" message={errors.hp?.message}>
          <input type="text" inputMode="numeric" {...register('hp', { required: true })} />
        </FormInput>
        <div className="mb-4">
          <button
            type="submit"
            className="w-full  text-sm bg-primary border[#FF9F43] p-2 rounded-sm text-white font-normal disabled:opacity-65"
            disabled={loading}
          >
            {loading ? 'Loading....' : 'Sign Up'}
          </button>
        </div>
      </form>

      <h4>
        Already have an account ?{' '}
        <Link to="/login" className="font-bold">
          Sign In Instead
        </Link>
      </h4>
    </div>
  );
};

export default Register;
