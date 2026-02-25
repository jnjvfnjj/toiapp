import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { EthnicBorder } from '../EthnicPattern';
import { useTranslations } from '../../i18n/translations';

interface OwnerAuthChoiceProps {
  onGoogleRegister: () => void;
  onSignIn: () => void;
  onRegister: () => void;
  onBack: () => void;
}

export function OwnerAuthChoice({ onGoogleRegister, onSignIn, onRegister, onBack }: OwnerAuthChoiceProps) {
  const t = useTranslations();

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
          {/* 1. Зарегистрироваться через Google */}
          <Button
            onClick={onGoogleRegister}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 py-6 rounded-2xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              {/* Google logo */}
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M43.611 20.083H42V20H24v8h11.3C34.9 32.89 30.06 36 24 36c-7.18 0-13-5.82-13-13s5.82-13 13-13c3.26 0 6.22 1.24 8.48 3.26l5.66-5.66C33.5 4.9 29.09 3 24 3 12.95 3 4 11.95 4 23s8.95 20 20 20 20-8.95 20-20c0-1.34-.12-2.65-.389-3.917z" fill="#EA4335"/>
                <path d="M6.306 14.691l6.571 4.82C14.08 15.08 18.82 12 24 12c3.26 0 6.22 1.24 8.48 3.26l5.66-5.66C33.5 4.9 29.09 3 24 3 16.18 3 9.415 7.925 6.306 14.691z" fill="#FBBC05"/>
                <path d="M24 44c5.93 0 11.09-2.04 14.82-5.52l-6.82-5.65C29.95 34.63 27.17 36 24 36c-6.06 0-11.27-4.1-13.1-9.64l-6.67 5.14C7.66 39.27 15.3 44 24 44z" fill="#34A853"/>
                <path d="M43.611 20.083H42V20H24v8h11.3c-1.36 4.02-4.97 6.9-8.9 7.58l6.82 5.65C36.17 39.25 44 33.52 44 23c0-1.34-.12-2.65-.389-3.917z" fill="#4285F4"/>
              </svg>
              <span className="font-medium">Зарегистрироваться через Google</span>
            </div>
          </Button>

          {/* 2. Войти в аккаунт */}
          <Button
            onClick={onSignIn}
            variant="outline"
            className="w-full border-2 border-primary text-primary py-6 rounded-2xl"
          >
            Войти в аккаунт
          </Button>

          {/* 3. Зарегистрироваться */}
          <Button
            onClick={onRegister}
            className="w-full bg-gradient-to-r from-accent to-[#B88A16] text-white py-6 rounded-2xl shadow-lg"
          >
            {t.common.register}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OwnerAuthChoice;
