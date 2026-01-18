import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Heart } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth.service';
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';

interface SignupForm {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export function Signup() {
  const { t, isNepali } = useLanguage();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>();

  const onSubmit = async (data: SignupForm) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await authService.signup(data);
      setAuth(response.user, response.accessToken);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || t('auth.signupError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 ${isNepali ? 'font-nepali' : ''}`}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-10 h-10 text-primary fill-primary" />
            <span className="text-2xl font-bold">{t('app.name')}</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">{t('auth.signup')}</h2>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t('auth.name')}
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
            />

            <Input
              label={t('auth.email')}
              type="email"
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message}
            />

            <Input
              label={t('auth.phone')}
              type="tel"
              {...register('phone')}
            />

            <Input
              label={t('auth.password')}
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' }
              })}
              error={errors.password?.message}
            />

            <Button type="submit" isLoading={isLoading} className="w-full">
              {t('auth.signupButton')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('auth.haveAccount')}{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                {t('auth.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
