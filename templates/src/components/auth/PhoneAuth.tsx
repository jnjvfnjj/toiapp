import { useState } from 'react';
import { ArrowLeft, Phone, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EthnicBorder } from '../EthnicPattern';
import { useTranslations } from '../../i18n/translations';
import { api, setTokens, setUser } from '../../api';

export interface VerifyResult {
  phone: string;
  user: { id: number; username: string; email: string; phone: string; role: string };
  isNewUser: boolean;
}

interface PhoneAuthProps {
  onVerified: (data: VerifyResult) => void;
  onBack: () => void;
}

export function PhoneAuth({ onVerified, onBack }: PhoneAuthProps) {
  const t = useTranslations();

  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('+996 ');
  const [code, setCode] = useState('');
  const [debugCode, setDebugCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ======================
  // FORMAT PHONE
  // ======================
  const formatPhone = (value: string) => {
    const cleaned = value.replace(/[^\d+]/g, '');

    if (!cleaned.startsWith('+996')) {
      return '+996 ';
    }

    let formatted = '+996 ';
    const digits = cleaned.slice(4);

    if (digits.length > 0) formatted += digits.slice(0, 3);
    if (digits.length > 3) formatted += ' ' + digits.slice(3, 6);
    if (digits.length > 6) formatted += ' ' + digits.slice(6, 9);

    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
    setError('');
    setDebugCode(null);
  };

  const cleanPhoneNumber = () => phone.replace(/\s/g, '');

  // ======================
  // SEND CODE
  // ======================
  const handleSendCode = async () => {
    setError('');
    const cleanPhone = cleanPhoneNumber();

    if (cleanPhone.length !== 13) {
      setError(t.auth.phoneInvalid);
      return;
    }

    try {
      setLoading(true);
      const data = await api.post<{ message?: string; error?: string; code?: string }>('send-code/', { phone: cleanPhone });
      if (data.code) {
        setDebugCode(data.code);
        setCode(data.code);
      } else {
        setDebugCode(null);
      }
      setStep('code');
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Failed to send code';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // VERIFY CODE
  // ======================
  const handleVerifyCode = async () => {
    setError('');

    if (code.length !== 6) {
      setError(t.auth.codeInvalid);
      return;
    }

    try {
      setLoading(true);
      const data = await api.post<{
        access: string;
        refresh: string;
        user: { id: number; username: string; email: string; phone: string; role: string };
        is_new_user: boolean;
      }>('verify-code/', { phone: cleanPhoneNumber(), code });

      setTokens(data.access, data.refresh);
      setUser(data.user);
      onVerified({
        phone: cleanPhoneNumber(),
        user: data.user,
        isNewUser: data.is_new_user,
      });
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Invalid code';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
    setError('');
  };

  // ======================
  // UI
  // ======================
  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">

      <div className="mb-8">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-full mb-6">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
      </div>

      <div className="flex-1 flex flex-col">

        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-[#3B6EA5] flex items-center justify-center mx-auto mb-6">
            {step === 'phone'
              ? <Phone className="w-10 h-10 text-white" />
              : <Shield className="w-10 h-10 text-white" />
            }
          </div>

          <h2 className="mb-3 text-foreground">
            {step === 'phone'
              ? t.auth.enterPhone
              : t.auth.enterCode
            }
          </h2>

          <div className="w-20 mx-auto mb-4">
            <EthnicBorder className="text-primary" />
          </div>

          <p className="text-muted-foreground">
            {step === 'phone'
              ? t.auth.sendingCode
              : `${t.auth.getCode} ${phone}`
            }
          </p>
        </div>

        {step === 'phone' ? (
          <div className="space-y-6">

            <div>
              <label className="block mb-2 text-foreground">
                {t.auth.phoneLabel}
              </label>

              <Input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+996 XXX XXX XXX"
                className="py-6 rounded-2xl border-2 focus:border-primary text-center text-xl"
                maxLength={17}
              />

              {error && (
                <p className="mt-2 text-destructive text-center">
                  ⚠️ {error}
                </p>
              )}
              {debugCode && (
                <p className="mt-2 text-primary text-center">
                  Тестовый код: <strong>{debugCode}</strong>
                </p>
              )}
            </div>

            <Button
              onClick={handleSendCode}
              disabled={loading || cleanPhoneNumber().length !== 13}
              className="w-full bg-gradient-to-r from-primary to-[#3B6EA5] text-white py-6 rounded-2xl shadow-lg"
            >
              {loading ? "Sending..." : t.auth.getCode}
            </Button>

          </div>
        ) : (

          <div className="space-y-6">

            <div>
              <label className="block mb-2 text-foreground">
                {t.auth.codeLabel}
              </label>

              <Input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={handleCodeChange}
                placeholder="000000"
                className="py-6 rounded-2xl border-2 focus:border-primary text-center text-2xl tracking-widest"
                maxLength={6}
                autoFocus
              />

              {error && (
                <p className="mt-2 text-destructive text-center">
                  ⚠️ {error}
                </p>
              )}
              {debugCode && (
                <p className="mt-2 text-primary text-center">
                  Тестовый код: <strong>{debugCode}</strong>
                </p>
              )}
            </div>

            <Button
              onClick={handleVerifyCode}
              disabled={loading || code.length !== 6}
              className="w-full bg-gradient-to-r from-primary to-[#3B6EA5] text-white py-6 rounded-2xl shadow-lg"
            >
              {loading ? "Verifying..." : t.auth.submit}
            </Button>

            <Button
              onClick={() => {
                setStep('phone');
                setCode('');
                setDebugCode(null);
              }}
              variant="ghost"
              className="w-full text-primary"
            >
              {t.auth.changeNumber}
            </Button>

          </div>
        )}

      </div>
    </div>
  );
}
