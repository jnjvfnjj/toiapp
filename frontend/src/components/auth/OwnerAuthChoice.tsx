import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { EthnicBorder } from '../EthnicPattern';
import { useTranslations } from '../../i18n/translations';
import { GoogleAuth } from './GoogleAuth';
import { toast } from 'sonner';

interface OwnerAuthChoiceProps {
  onSignIn: () => void;
  onRegister: () => void;
  onBack: () => void;
}

export function OwnerAuthChoice({ onSignIn, onRegister, onBack }: OwnerAuthChoiceProps) {
  const t = useTranslations();

  const handleGoogleSuccess = (userData: any) => {
    console.log('Google registration success for owner:', userData);
    toast.success('Successfully registered with Google!');
    // Здесь можно добавить логику для владельца
    onSignIn(); // или onRegister(), в зависимости от вашей логики
  };

  const handleGoogleError = (error: string) => {
    console.error('Google auth error for owner:', error);
    toast.error(error);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      <div className="mb-8">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-full mb-6">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
      </div>

      <div className="flex-1">
        <div className="text-center mb-8">
          <h2 className="mb-3 text-foreground">{t.profile.owner}</h2>
          <div className="w-20 mx-auto mb-4">
            <EthnicBorder className="text-accent" />
          </div>
          <p className="text-muted-foreground">Выберите способ входа</p>
        </div>

        <div className="space-y-4">
          {/* Войти в аккаунт */}
          <Button
            onClick={onSignIn}
            variant="outline"
            className="w-full border-2 border-primary text-primary py-6 rounded-2xl"
          >
            Войти в аккаунт
          </Button>

          <div className="my-2" />

          {/* Зарегистрироваться */}
          <Button
            onClick={onRegister}
            className="w-full bg-gradient-to-r from-accent to-[#B88A16] text-white py-6 rounded-2xl shadow-lg"
          >
            {t.common.register}
          </Button>

          {/* Зарегистрироваться через Google */}
          <GoogleAuth
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            mode="register"
            role="owner"
          />
        </div>
      </div>
    </div>
  );
}

export default OwnerAuthChoice;