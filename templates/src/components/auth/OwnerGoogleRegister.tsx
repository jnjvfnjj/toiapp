import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EthnicBorder } from '../EthnicPattern';
import { useTranslations } from '../../i18n/translations';

interface OwnerGoogleRegisterProps {
  onComplete: (data: { email: string; name: string; password: string }) => void;
  onBack: () => void;
}

export function OwnerGoogleRegister({ onComplete, onBack }: OwnerGoogleRegisterProps) {
  const t = useTranslations();
  const [step, setStep] = useState<'google' | 'password'>('google');
  const [loading, setLoading] = useState(false);
  const [googleData, setGoogleData] = useState<{ email: string; name: string } | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const handleGoogleSignIn = () => {
    setLoading(true);
    const popupUrl = `${window.location.origin}/google-oauth-sim.html`;
    const popup = window.open(popupUrl, 'google_oauth', 'width=500,height=600');
    if (!popup) {
      setLoading(false);
      return;
    }

    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const data = e.data as any;
      if (data && data.type === 'google-auth' && data.email) {
        window.removeEventListener('message', handleMessage);
        setLoading(false);
        setGoogleData({ email: data.email, name: data.name || data.email.split('@')[0] });
        setStep('password');
      }
    };

    window.addEventListener('message', handleMessage);

    const poll = setInterval(() => {
      if (popup.closed) {
        clearInterval(poll);
        window.removeEventListener('message', handleMessage);
        setLoading(false);
      }
    }, 300);
  };

  const validatePassword = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};
    if (!password || password.length < 8) {
      newErrors.password = 'Пароль должен быть не короче 8 символов';
    } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      newErrors.password = 'Пароль должен содержать буквы и цифры';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePassword() && googleData) {
      onComplete({
        email: googleData.email,
        name: googleData.name,
        password
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-full mb-6">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="text-center mb-8">
          <h2 className="mb-3 text-foreground">
            {step === 'google' ? 'Регистрация через Google' : 'Придумайте пароль'}
          </h2>
          <div className="w-20 mx-auto mb-4">
            <EthnicBorder className="text-accent" />
          </div>
          <p className="text-muted-foreground">
            {step === 'google' 
              ? 'Выберите Google аккаунт для продолжения' 
              : 'Создайте пароль для защиты вашего аккаунта'}
          </p>
        </div>

        {step === 'google' && (
          <div className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 py-6 rounded-2xl shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Подключение...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {/* Google logo */}
                  <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M43.611 20.083H42V20H24v8h11.3C34.9 32.89 30.06 36 24 36c-7.18 0-13-5.82-13-13s5.82-13 13-13c3.26 0 6.22 1.24 8.48 3.26l5.66-5.66C33.5 4.9 29.09 3 24 3 12.95 3 4 11.95 4 23s8.95 20 20 20 20-8.95 20-20c0-1.34-.12-2.65-.389-3.917z" fill="#EA4335"/>
                    <path d="M6.306 14.691l6.571 4.82C14.08 15.08 18.82 12 24 12c3.26 0 6.22 1.24 8.48 3.26l5.66-5.66C33.5 4.9 29.09 3 24 3 16.18 3 9.415 7.925 6.306 14.691z" fill="#FBBC05"/>
                    <path d="M24 44c5.93 0 11.09-2.04 14.82-5.52l-6.82-5.65C29.95 34.63 27.17 36 24 36c-6.06 0-11.27-4.1-13.1-9.64l-6.67 5.14C7.66 39.27 15.3 44 24 44z" fill="#34A853"/>
                    <path d="M43.611 20.083H42V20H24v8h11.3c-1.36 4.02-4.97 6.9-8.9 7.58l6.82 5.65C36.17 39.25 44 33.52 44 23c0-1.34-.12-2.65-.389-3.917z" fill="#4285F4"/>
                  </svg>
                  <span className="font-medium">Выбрать Google аккаунт</span>
                </div>
              )}
            </Button>
          </div>
        )}

        {step === 'password' && googleData && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Показываем выбранный Google аккаунт */}
            <div className="bg-muted rounded-2xl p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Выбранный аккаунт:</p>
              <p className="font-medium text-foreground">{googleData.name}</p>
              <p className="text-sm text-muted-foreground">{googleData.email}</p>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-foreground">Придумайте пароль *</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: '' });
                }}
                placeholder="Минимум 8 символов, буквы и цифры"
                className="py-6 rounded-2xl border-2 focus:border-accent"
              />
              {errors.password && (
                <p className="mt-2 text-destructive flex items-center gap-2">
                  <span>⚠️</span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 text-foreground">Повторите пароль *</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors({ ...errors, confirmPassword: '' });
                }}
                placeholder="Введите пароль ещё раз"
                className="py-6 rounded-2xl border-2 focus:border-accent"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-destructive flex items-center gap-2">
                  <span>⚠️</span>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-accent to-[#B88A16] hover:from-accent/90 hover:to-[#B88A16]/90 text-white py-6 rounded-2xl shadow-lg mt-8"
            >
              Зарегистрироваться
            </Button>

            <Button 
              type="button"
              variant="outline"
              onClick={() => setStep('google')}
              className="w-full border-2 border-gray-300 py-6 rounded-2xl"
            >
              Выбрать другой аккаунт
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default OwnerGoogleRegister;
