import { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { EthnicBorder } from '../EthnicPattern';
import { parseGoogleToken, type GoogleOAuthResponse } from '../../hooks/useGoogleAuth';

interface OwnerGoogleRegisterProps {
  onComplete: (data: { email: string; name: string; password: string }) => void;
  onBack: () => void;
}

export function OwnerGoogleRegister({ onComplete, onBack }: OwnerGoogleRegisterProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo_client_id';

  useEffect(() => {
    if (clientId && googleButtonRef.current) {
      const initializeGoogle = () => {
        if (window.google?.accounts?.id && googleButtonRef.current) {
          try {
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: handleGoogleResponse,
            });
            window.google.accounts.id.renderButton(googleButtonRef.current, {
              theme: 'outline',
              size: 'large',
              width: '100%',
            });
          } catch (err) {
            console.error('Failed to initialize Google:', err);
            setError('Ошибка при инициализации Google. Попробуйте позже.');
          }
        }
      };

      if (window.google?.accounts?.id) {
        initializeGoogle();
      } else {
        const timer = setTimeout(initializeGoogle, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [step, clientId]);

  const handleGoogleResponse = async (response: GoogleOAuthResponse) => {
    setError('');
    setLoading(true);

    try {
      const userInfo = parseGoogleToken(response.credential);
      if (!userInfo) {
        throw new Error('Failed to parse Google token');
      }
      setLoading(false);
      // For Google auth, use empty password - backend will set unusable_password
      onComplete({
        email: userInfo.email,
        name: userInfo.name,
        password: '', // Empty for Google auth
      });
    } catch (err) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : 'Google authentication failed';
      setError(msg);
      console.error('Google auth error:', err);
    }
  };

  const validatePassword = () => {
    const newErrors: { password?: string } = {};
    if (!password || password.length < 8) {
      newErrors.password = 'Пароль должен быть не короче 8 символов';
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
      <div className="flex-1 flex flex-col">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-[#B88A16] flex items-center justify-center mx-auto mb-6">
            <div className="w-10 h-10 rounded-full bg-white" />
          </div>
          
          <h2 className="mb-3 text-foreground">Регистрация через Google</h2>
          
          <div className="w-20 mx-auto mb-4">
            <EthnicBorder className="text-accent" />
          </div>
          
          <p className="text-muted-foreground">Выберите свой Google аккаунт для регистрации</p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Google Sign-In Button */}
          <div ref={googleButtonRef} className="flex justify-center" />
        </div>

        <p className="text-center text-muted-foreground mt-6 text-sm">
          Ваши данные используются только для регистрации аккаунта
        </p>
      </div>
    </div>
  );
}

export default OwnerGoogleRegister;
