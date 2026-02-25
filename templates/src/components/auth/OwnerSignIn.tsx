import { useState } from 'react';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EthnicBorder } from '../EthnicPattern';
import { useTranslations } from '../../i18n/translations';

interface OwnerSignInProps {
  onComplete: (data: { email: string; password: string }) => void;
  onBack: () => void;
}

export function OwnerSignIn({ onComplete, onBack }: OwnerSignInProps) {
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Введите корректный email';
    }
    
    if (!password || password.length < 1) {
      newErrors.password = 'Введите пароль';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onComplete({ email, password });
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
          <h2 className="mb-3 text-foreground">Вход в аккаунт</h2>
          <div className="w-20 mx-auto mb-4">
            <EthnicBorder className="text-accent" />
          </div>
          <p className="text-muted-foreground">Введите email и пароль для входа</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block mb-2 text-foreground">Email *</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: '' });
                }}
                placeholder="Введите ваш email"
                className="pl-12 py-6 rounded-2xl border-2 focus:border-accent"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-destructive flex items-center gap-2">
                <span>⚠️</span>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-foreground">Пароль *</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: '' });
                }}
                placeholder="Введите ваш пароль"
                className="pl-12 py-6 rounded-2xl border-2 focus:border-accent"
              />
            </div>
            {errors.password && (
              <p className="mt-2 text-destructive flex items-center gap-2">
                <span>⚠️</span>
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot password link */}
          <div className="text-right">
            <button 
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => alert('Функция восстановления пароля будет доступна позже')}
            >
              Забыли пароль?
            </button>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-accent to-[#B88A16] hover:from-accent/90 hover:to-[#B88A16]/90 text-white py-6 rounded-2xl shadow-lg mt-8"
          >
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
}

export default OwnerSignIn;
