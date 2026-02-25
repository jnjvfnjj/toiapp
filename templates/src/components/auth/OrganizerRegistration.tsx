import { useState, useRef } from 'react';
import { ArrowLeft, User, Camera } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EthnicBorder } from '../EthnicPattern';
import { useTranslations } from '../../i18n/translations';
import { filterNameInput } from '../../utils/validation';

interface OrganizerRegistrationProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

export function OrganizerRegistration({ onComplete, onBack }: OrganizerRegistrationProps) {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    photoUrl: ''
  });
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = t.common.loading /* placeholder */;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onComplete(formData);
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
          <h2 className="mb-3 text-foreground">{t.addVenue.publish}</h2>
          
          <div className="w-20 mx-auto mb-4">
            <EthnicBorder className="text-primary" />
          </div>
          
          <p className="text-muted-foreground">{t.addVenue.basicInfoDesc}</p>
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
              className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-[#3B6EA5] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform mb-3 relative overflow-hidden"
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
            <p className="text-muted-foreground mt-2">Опционально</p>
          </div>

          {/* Name */}
          <div>
            <label className="block mb-2 text-foreground">{t.profile.firstName} *</label>
            <Input
              value={formData.name}
              onChange={(e) => {
                const filteredValue = filterNameInput(e.target.value);
                setFormData({ ...formData, name: filteredValue });
                setErrors({ ...errors, name: '' });
              }}
              placeholder="Введите ваше имя"
              className="py-6 rounded-2xl border-2 focus:border-primary"
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
            <label className="block mb-2 text-foreground">{t.profile.lastName}</label>
            <Input
              value={formData.surname}
              onChange={(e) => setFormData({ ...formData, surname: filterNameInput(e.target.value) })}
              placeholder="Введите вашу фамилию"
              className="py-6 rounded-2xl border-2 focus:border-primary"
            />
            <p className="mt-1 text-muted-foreground">Опционально</p>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-primary to-[#3B6EA5] hover:from-primary/90 hover:to-[#3B6EA5]/90 text-white py-6 rounded-2xl shadow-lg mt-8">
            {t.addVenue.publish}
          </Button>
        </form>
      </div>
    </div>
  );
}
