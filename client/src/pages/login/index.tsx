import { useState } from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import FormInput from '../../components/form-input';
import { authLogin } from '../../repository/auth';
import { LoginForm } from '../../repository/auth/types';

const Login = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: 'darmawandoni6',
      password: 'kiasu123',
    },
  });

  const onSubmit: SubmitHandler<LoginForm> = async data => {
    try {
      setLoading(true);
      await authLogin(data);

      navigate('/');
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-white p-3 flex flex-col justify-center">
      <div className="mb-6 text-center">
        <h3 className="mb-2 text-2xl text-black">Sign In</h3>
        <h4 className="text-sm font-normal">Access the Toko-mate panel using your username and password.</h4>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput id="email" label="Email" message={errors.email?.message}>
          <input type="text" {...register('email', { required: true })} />
        </FormInput>
        <FormInput id="password" label="password" message={errors.password?.message}>
          <input type="password" {...register('password', { required: true })} />
        </FormInput>
        <div className="mb-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full  text-sm bg-primary border[#FF9F43] p-2 rounded-sm text-white font-normal disabled:opacity-65"
          >
            {loading ? 'Loading....' : 'Sign In'}
          </button>
        </div>
      </form>
      <h4>
        New on our platform?{' '}
        <Link to="/register" className="font-bold">
          Create an account
        </Link>
      </h4>
    </div>
  );
};

export default Login;
