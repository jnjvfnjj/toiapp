import { useState, useRef } from 'react';
import { ArrowLeft, Camera, Eye, EyeOff, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EthnicBorder } from '../EthnicPattern';
import { useTranslations } from '../../i18n/translations';
import { filterNameInput } from '../../utils/validation';

export interface RegistrationPayload {
  name: string;
  surname: string;
  phone: string;
  email: string;
  password: string;
  photoUrl?: string;
}

interface SimpleRegistrationFormProps {
  variant: 'organizer' | 'owner';
  title: string;
  subtitle?: string;
  onComplete: (data: RegistrationPayload) => void | Promise<void>;
  onBack: () => void;
}

function splitFullName(trimmed: string): { name: string; surname: string } {
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { name: '', surname: '' };
  if (parts.length === 1) return { name: parts[0], surname: parts[0] };
  return { name: parts[0], surname: parts.slice(1).join(' ') };
}

export function SimpleRegistrationForm({
  variant,
  title,
  subtitle = 'Email и пароль — для входа. Остальное по желанию.',
  onComplete,
  onBack,
}: SimpleRegistrationFormProps) {
  const t = useTranslations();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+996 ');
  const [photoUrl, setPhotoUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const isOwner = variant === 'owner';
  const borderClass = isOwner ? 'text-accent' : 'text-primary';
  const focusClass = isOwner ? 'focus:border-accent' : 'focus:border-primary';
  const buttonClass = isOwner
    ? 'bg-gradient-to-r from-accent to-[#B88A16] hover:from-accent/90 hover:to-[#B88A16]/90'
    : 'bg-gradient-to-r from-accent to-[#B88A16] text-white';

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/[^\d+]/g, '');
    if (!cleaned.startsWith('+996')) return '+996 ';
    let formatted = '+996 ';
    const digits = cleaned.slice(4);
    if (digits.length > 0) formatted += digits.slice(0, 3);
    if (digits.length > 3) formatted += ' ' + digits.slice(3, 6);
    if (digits.length > 6) formatted += ' ' + digits.slice(6, 9);
    return formatted;
  };

  const validate = () => {
    const next: Record<string, string> = {};
    const trimmedName = fullName.trim();
    if (trimmedName.length < 2) {
      next.fullName = 'Введите имя (можно с фамилией)';
    }
    const emailNorm = email.trim().toLowerCase();
    if (!emailNorm || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
      next.email = 'Введите корректный email';
    }
    if (!password || password.length < 8) {
      next.password = 'Минимум 8 символов';
    }
    const cleanPhone = phone.replace(/\s/g, '');
    if (cleanPhone.length >= 5 && cleanPhone.length < 13) {
      next.phone = t.auth.phoneInvalid;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || busy) return;
    const { name, surname } = splitFullName(fullName.trim());
    const cleanPhone = phone.replace(/\s/g, '');
    setBusy(true);
    try {
      await Promise.resolve(
        onComplete({
          name,
          surname,
          phone: cleanPhone.length >= 13 ? cleanPhone : '',
          email: email.trim().toLowerCase(),
          password,
          photoUrl: photoUrl || undefined,
        })
      );
    } finally {
      setBusy(false);
    }
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoUrl(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      <div className="mb-6">
        <button type="button" onClick={onBack} className="p-2 hover:bg-muted rounded-full mb-4">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
      </div>

      <div className="flex-1 max-w-md mx-auto w-full">
        <div className="text-center mb-6">
          <h2 className="mb-2 text-foreground text-xl font-semibold">{title}</h2>
          <div className="w-20 mx-auto mb-3">
            <EthnicBorder className={borderClass} />
          </div>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-foreground text-sm">Как вас зовут *</label>
            <Input
              value={fullName}
              onChange={(e) => {
                setFullName(filterNameInput(e.target.value));
                setErrors((prev) => ({ ...prev, fullName: '' }));
              }}
              placeholder="Например: Айгуль Асанова"
              autoComplete="name"
              className={`py-5 rounded-2xl border-2 ${focusClass}`}
            />
            {errors.fullName && <p className="mt-1 text-sm text-destructive">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block mb-2 text-foreground text-sm">Email *</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: '' }));
              }}
              placeholder="you@example.com"
              autoComplete="email"
              className={`py-5 rounded-2xl border-2 ${focusClass}`}
            />
            {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
          </div>

          <div>
            <label className="block mb-2 text-foreground text-sm">Пароль *</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: '' }));
                }}
                placeholder="Не короче 8 символов"
                autoComplete="new-password"
                className={`py-5 pr-12 rounded-2xl border-2 ${focusClass}`}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground p-1"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password}</p>}
          </div>

          <div>
            <label className="block mb-2 text-foreground text-sm">
              Телефон <span className="text-muted-foreground font-normal">(необязательно)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(formatPhone(e.target.value));
                  setErrors((prev) => ({ ...prev, phone: '' }));
                }}
                placeholder="+996 XXX XXX XXX"
                className={`pl-12 py-5 rounded-2xl border-2 ${focusClass}`}
                maxLength={17}
              />
            </div>
            {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone}</p>}
          </div>

          <div className="flex flex-col items-center pt-2 pb-1">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoFileChange}
              className="hidden"
            />
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && photoInputRef.current?.click()}
              onClick={() => photoInputRef.current?.click()}
              className={`w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.02] overflow-hidden ${
                isOwner ? 'bg-gradient-to-br from-accent to-[#B88A16]' : 'bg-gradient-to-br from-primary to-[#3B6EA5]'
              }`}
            >
              {photoUrl ? (
                <img src={photoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-10 h-10 text-white" />
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl mt-2"
              onClick={() => photoInputRef.current?.click()}
            >
              {photoUrl ? t.common.edit : t.common.add} фото
            </Button>
          </div>

          <Button
            type="submit"
            disabled={busy}
            className={`w-full text-white py-6 rounded-2xl shadow-lg ${buttonClass}`}
          >
            {busy ? '…' : t.common.register}
          </Button>
        </form>
      </div>
    </div>
  );
}
