import { useState } from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import FormInput from '../../components/form-input';
import { Auth } from '../../repository/auth';
import { Register as RegisterType } from '../../repository/auth/types';

const auth = new Auth();

const Register = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterType>({
    defaultValues: {
      name: 'Doni Darmawan',
      username: 'darmawandoni6',
      password: 'kiasu123',
      toko: {
        nama: 'Toko Jaya Abadi',
        alamat: 'JL Beringin raya I',
        phone: '085761298781',
      },
    },
  });

  const onSubmit: SubmitHandler<RegisterType> = async data => {
    try {
      setLoading(true);
      await auth.register(data);

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
        <FormInput id="name" label="Nama" message={errors.name?.message}>
          <input type="text" {...register('name', { required: true })} />
        </FormInput>
        <FormInput id="username" label="Username" message={errors.username?.message}>
          <input type="text" autoComplete="username" {...register('username', { required: true })} />
        </FormInput>
        <FormInput id="name" label="password" message={errors.password?.message}>
          <input type="password" autoComplete="new-password" {...register('password', { required: true })} />
        </FormInput>
        <FormInput id="name" label="Nama Toko" message={errors.toko?.nama?.message}>
          <input type="text" {...register('toko.nama', { required: true })} />
        </FormInput>
        <FormInput id="name" label="Alamat Toko" message={errors.toko?.alamat?.message}>
          <input type="text" {...register('toko.alamat', { required: true })} />
        </FormInput>
        <FormInput id="name" label="No. Telp Toko" message={errors.toko?.phone?.message}>
          <input type="text" inputMode="numeric" {...register('toko.phone', { required: true })} />
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
