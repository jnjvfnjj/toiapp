import { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EthnicBorder } from '../EthnicPattern';
import { useTranslations } from '../../i18n/translations';

interface GoogleAuthProps {
  onAuthenticated: (email: string, name: string) => void;
  onBack: () => void;
  onRegister?: () => void;
}

export function GoogleAuth({ onAuthenticated, onBack, onRegister }: GoogleAuthProps) {
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = () => {
    setError('');
    const popupUrl = `${window.location.origin}/google-oauth-sim.html`;
    const popup = window.open(popupUrl, 'google_oauth', 'width=500,height=600');
    if (!popup) {
      setError('Popup blocked. Разрешите всплывающие окна для этого сайта.');
      return;
    }

    setLoading(true);

    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const data = e.data as any;
      if (data && data.type === 'google-auth' && data.email) {
        window.removeEventListener('message', handleMessage);
        setLoading(false);
        onAuthenticated(data.email, data.name || data.email.split('@')[0]);
      }
    };

    window.addEventListener('message', handleMessage);

    // Fallback: if popup is closed without message, stop loading
    const poll = setInterval(() => {
      if (popup.closed) {
        clearInterval(poll);
        window.removeEventListener('message', handleMessage);
        if (loading) {
          setLoading(false);
          setError(t.auth.verifying || 'Аутентификация прервана');
        }
      }
    }, 300);
  };

  const handleEmailSignIn = () => {
    setError('');
    
    if (!email.includes('@gmail.com')) {
      setError(t.auth.emailMustBeGmail);
      return;
    }

    setLoading(true);
    // Simulate email verification
    setTimeout(() => {
      setLoading(false);
      onAuthenticated(email, email.split('@')[0]);
    }, 1500);
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
          
          <h2 className="mb-3 text-foreground">{t.profile.owner} - вход</h2>
          
          <div className="w-20 mx-auto mb-4">
            <EthnicBorder className="text-accent" />
          </div>
          
          <p className="text-muted-foreground">{t.auth.getCode} {t.languages?.english ?? ''}</p>
        </div>

          <div className="space-y-4">
            {/* Google Sign-In Button */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 py-6 rounded-2xl shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  {t.auth.sendingCode}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {/* Google logo */}
                  <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M43.611 20.083H42V20H24v8h11.3C34.9 32.89 30.06 36 24 36c-7.18 0-13-5.82-13-13s5.82-13 13-13c3.26 0 6.22 1.24 8.48 3.26l5.66-5.66C33.5 4.9 29.09 3 24 3 12.95 3 4 11.95 4 23s8.95 20 20 20 20-8.95 20-20c0-1.34-.12-2.65-.389-3.917z" fill="#EA4335"/>
                  </svg>
                  {t.auth.signInWithGoogle}
                </div>
              )}
            </Button>

            {/* Register Button (replaces manual Gmail input — next) */}
            <Button
              onClick={() => {
                onRegister?.();
              }}
              className="w-full bg-gradient-to-r from-accent to-[#B88A16] hover:from-accent hover:to-[#B88A16] text-white py-6 rounded-2xl shadow-lg"
            >
              {t.common.register}
            </Button>
          </div>

          <p className="text-center text-muted-foreground mt-6">{t.auth.demoNote}</p>
        </div>
      </div>
  );
}
