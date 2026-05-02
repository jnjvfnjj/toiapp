import { useState, useRef } from 'react';
import { ArrowLeft, Camera } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EthnicBorder } from '../EthnicPattern';
import { useTranslations } from '../../i18n/translations';
import { filterNameInput } from '../../utils/validation';

interface OrganizerRegistrationProps {
  phone?: string;
  onComplete: (data: { name: string; surname?: string; photoUrl?: string }) => void;
  onBack: () => void;
}

export function OrganizerRegistration({ phone, onComplete, onBack }: OrganizerRegistrationProps) {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    photoUrl: '',
  });
  const [errors, setErrors] = useState<{ name?: string }>({});

  const validate = () => {
    const validationErrors: { name?: string } = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      validationErrors.name = 'Введите имя и фамилию или хотя бы имя';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onComplete({
      name: formData.name.trim(),
      surname: formData.surname.trim() || undefined,
      photoUrl: formData.photoUrl || undefined,
    });
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
      <div className="mb-8">
        <button type="button" onClick={onBack} className="p-2 hover:bg-muted rounded-full mb-6">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
      </div>

      <div className="flex-1 max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="mb-3 text-foreground text-xl font-semibold">{t.profile.organizer}</h2>
          <div className="w-20 mx-auto mb-4">
            <EthnicBorder className="text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">Расскажите немного о себе, чтобы завершить регистрацию.</p>
          {phone && (
            <p className="mt-3 text-sm text-muted-foreground">
              Номер телефона: <span className="font-medium text-foreground">{phone}</span>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-foreground">{t.profile.firstName} *</label>
            <Input
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: filterNameInput(e.target.value) });
                setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="Имя или имя и фамилия"
              autoComplete="name"
              className="py-5 rounded-2xl border-2 focus:border-primary"
            />
            {errors.name && <p className="mt-2 text-sm text-destructive">{errors.name}</p>}
          </div>

          <div>
            <label className="block mb-2 text-foreground">{t.profile.lastName}</label>
            <Input
              value={formData.surname}
              onChange={(e) => setFormData({ ...formData, surname: filterNameInput(e.target.value) })}
              placeholder="Фамилия (по желанию)"
              autoComplete="family-name"
              className="py-5 rounded-2xl border-2 focus:border-primary"
            />
            <p className="mt-1 text-sm text-muted-foreground">Можно оставить пустым</p>
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
              className="w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.02] overflow-hidden bg-gradient-to-br from-primary to-[#3B6EA5]"
            >
              {formData.photoUrl ? (
                <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-10 h-10 text-white" />
              )}
            </div>
            <Button type="button" variant="outline" size="sm" className="rounded-xl mt-2" onClick={() => photoInputRef.current?.click()}>
              {formData.photoUrl ? t.common.edit : 'Добавить фото'}
            </Button>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-primary to-[#3B6EA5] hover:from-primary/90 hover:to-[#3B6EA5]/90 text-white py-6 rounded-2xl shadow-lg mt-8">
            Завершить регистрацию
          </Button>
        </form>
      </div>
    </div>
  );
}
