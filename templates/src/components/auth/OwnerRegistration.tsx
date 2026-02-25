import { useState, useRef } from 'react';
import { ArrowLeft, Camera, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EthnicBorder } from '../EthnicPattern';
import { useTranslations } from '../../i18n/translations';

interface OwnerRegistrationProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

export function OwnerRegistration({ onComplete, onBack }: OwnerRegistrationProps) {
  const t = useTranslations();

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '+996 ',
    email: '',
    photoUrl: ''
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

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

  const validate = () => {
    const newErrors: any = {};
    
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Введите имя';
    }
    if (!formData.surname || formData.surname.length < 2) {
      newErrors.surname = 'Введите фамилию';
    }
    const cleanPhone = formData.phone.replace(/\s/g, '');
    if (cleanPhone.length < 13) {
      newErrors.phone = t.auth.phoneInvalid;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }
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
    if (validate()) {
      onComplete({
        ...formData,
        phone: formData.phone.replace(/\s/g, ''),
        password
      });
    }
  };

  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, photoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
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
          <h2 className="mb-3 text-foreground">{t.profile.owner} {t.addVenue.title}</h2>
          
          <div className="w-20 mx-auto mb-4">
            <EthnicBorder className="text-accent" />
          </div>
          
          <p className="text-muted-foreground">Заполните обязательные поля</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo upload */}
          <div className="flex flex-col items-center mb-8">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoFileChange}
              className="hidden"
            />
            <div
              onClick={() => photoInputRef.current?.click()}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-accent to-[#B88A16] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform mb-3 relative overflow-hidden"
            >
              {formData.photoUrl ? (
                <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-12 h-12 text-white" />
              )}
            </div>
            <Button type="button" onClick={() => photoInputRef.current?.click()} variant="outline" size="sm" className="rounded-xl">
              {formData.photoUrl ? t.common.edit : t.common.loading}
            </Button>
            <p className="text-muted-foreground mt-2">Рекомендуется</p>
          </div>

          {/* Name */}
          <div>
            <label className="block mb-2 text-foreground">{t.profile.firstName} *</label>
            <Input
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: '' });
              }}
              placeholder="Введите ваше имя"
              className="py-6 rounded-2xl border-2 focus:border-accent"
            />
            {errors.name && (
              <p className="mt-2 text-destructive flex items-center gap-2">
                <span>⚠️</span>
                {errors.name}
              </p>
            )}
          </div>

          {/* Surname */}
          <div>
            <label className="block mb-2 text-foreground">{t.profile.lastName} *</label>
            <Input
              value={formData.surname}
              onChange={(e) => {
                setFormData({ ...formData, surname: e.target.value });
                setErrors({ ...errors, surname: '' });
              }}
              placeholder="Введите вашу фамилию"
              className="py-6 rounded-2xl border-2 focus:border-accent"
            />
            {errors.surname && (
              <p className="mt-2 text-destructive flex items-center gap-2">
                <span>⚠️</span>
                {errors.surname}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-2 text-foreground">{t.profile.phone} *</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: formatPhone(e.target.value) });
                  setErrors({ ...errors, phone: '' });
                }}
                placeholder="+996 XXX XXX XXX"
                className="pl-12 py-6 rounded-2xl border-2 focus:border-accent"
                maxLength={17}
              />
            </div>
            {errors.phone && (
              <p className="mt-2 text-destructive flex items-center gap-2">
                <span>⚠️</span>
                {errors.phone}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-foreground">{t.profile.email} *</label>
            <Input
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setErrors({ ...errors, email: '' });
              }}
              placeholder="Введите ваш email"
              className="py-6 rounded-2xl border-2 focus:border-accent"
            />
            {errors.email && (
              <p className="mt-2 text-destructive flex items-center gap-2">
                <span>⚠️</span>
                {errors.email}
              </p>
            )}
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
            <label className="block mb-2 text-foreground">Подтвердите пароль *</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors({ ...errors, confirmPassword: '' });
              }}
              placeholder="Повторите пароль"
              className="py-6 rounded-2xl border-2 focus:border-accent"
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-destructive flex items-center gap-2">
                <span>⚠️</span>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-accent to-[#B88A16] hover:from-accent/90 hover:to-[#B88A16]/90 text-white py-6 rounded-2xl shadow-lg mt-8">
            {t.common.register}
          </Button>
        </form>
      </div>
    </div>
  );
}
