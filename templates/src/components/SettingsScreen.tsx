import { useState, useRef } from 'react';
import { ArrowLeft, User, Phone, Mail, Camera, Trash2, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { EthnicPattern } from './EthnicPattern';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import type { User as UserType } from '../App';
import type { Language } from '../i18n/translations';
import { useTranslations } from '../i18n/translations';

interface SettingsScreenProps {
  user: UserType;
  language: Language;
  onBack: () => void;
  onUpdateUser: (userData: Partial<UserType>) => void;
}

export function SettingsScreen({ user, language, onBack, onUpdateUser }: SettingsScreenProps) {
  const t = useTranslations(language);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    surname: user.surname || '',
    phone: user.phone || '',
    email: user.email || '',
    photoUrl: user.photoUrl || '',
  });

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
    toast.success(t.settings.savedSuccessfully);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, photoUrl: reader.result as string }));
      toast.success(t.settings.updatePhoto);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDeletePhoto = () => {
    setFormData({ ...formData, photoUrl: '' });
    toast.success(t.settings.deletePhoto);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-[#3B6EA5] text-white pb-8">
        <div className="opacity-20 pointer-events-none">
          <EthnicPattern className="w-full h-16" />
        </div>
        <div className="px-6 -mt-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="flex-1 text-center">{t.settings.title}</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 pb-8">
        {/* Profile Photo Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl p-6 shadow-lg mb-4"
        >
          <div className="flex items-center gap-4">
            {/* Аватар: круг слева, кнопка камеры — на углу аватара */}
            <div className="relative flex-shrink-0 w-20 h-20">
              {formData.photoUrl ? (
                <img
                  src={formData.photoUrl}
                  alt={formData.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
                  <User className="w-10 h-10 text-primary" />
                </div>
              )}
              {isEditing && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoFileChange}
                    hidden
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-2 border-card"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </>
              )}
            </div>
            {/* Имя и роль: по центру, длинный текст обрезается */}
            <div className="flex-1 min-w-0 overflow-hidden pr-3">
              <h2 className="text-card-foreground font-semibold truncate">
                {formData.name} {formData.surname}
              </h2>
              <p className="text-muted-foreground text-sm truncate">
                {user.role === 'organizer' ? t.profile.organizer : t.profile.owner}
              </p>
            </div>
            {/* Кнопка удаления: справа, отдельно от текста */}
            {formData.photoUrl && isEditing && (
              <button
                type="button"
                onClick={handleDeletePhoto}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center hover:bg-destructive/10 rounded-full transition-colors"
              >
                <Trash2 className="w-5 h-5 text-destructive" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Edit/Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <Button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl py-6"
          >
            {isEditing ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                {t.common.save}
              </>
            ) : (
              t.profile.editProfile
            )}
          </Button>
        </motion.div>

        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {/* Name fields card */}
              <div className="bg-card rounded-3xl p-6 shadow-lg space-y-4">
                <h3 className="text-card-foreground mb-4">{t.settings.profileSettings}</h3>
                
                <div>
                  <Label htmlFor="name" className="text-muted-foreground mb-2 block">
                    {t.profile.firstName}
                  </Label>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <Input
                      id="name"
                      value={formData.name}
                      maxLength={80}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="flex-1 min-w-0 border-border rounded-xl bg-background"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="surname" className="text-muted-foreground mb-2 block">
                    {t.profile.lastName}
                  </Label>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <Input
                      id="surname"
                      value={formData.surname}
                      maxLength={80}
                      onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                      className="flex-1 min-w-0 border-border rounded-xl bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* Contact fields card */}
              <div className="bg-card rounded-3xl p-6 shadow-lg space-y-4">
                <h3 className="text-card-foreground mb-4">{t.settings.accountSettings}</h3>
                
                <div>
                  <Label htmlFor="phone" className="text-muted-foreground mb-2 block">
                    {t.profile.phone}
                  </Label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#3B6EA5]/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-[#3B6EA5]" />
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="flex-1 border-border rounded-xl bg-background"
                      placeholder="+996 XXX XXX XXX"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-muted-foreground mb-2 block">
                    {t.profile.email}
                  </Label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="flex-1 border-border rounded-xl bg-background"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Cancel Button */}
              <Button
                onClick={() => {
                  setFormData({
                    name: user.name || '',
                    surname: user.surname || '',
                    phone: user.phone || '',
                    email: user.email || '',
                    photoUrl: user.photoUrl || '',
                  });
                  setIsEditing(false);
                }}
                variant="outline"
                className="w-full border-2 rounded-2xl py-6"
              >
                {t.common.cancel}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="viewing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-card rounded-3xl p-6 shadow-lg space-y-4"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-muted-foreground">{t.profile.firstName}</p>
                  <p className="text-card-foreground truncate">{user.name} {user.surname}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="w-12 h-12 rounded-xl bg-[#3B6EA5]/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-[#3B6EA5]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground">{t.profile.phone}</p>
                    <p className="text-card-foreground">{user.phone}</p>
                  </div>
                </div>
              )}

              {user.email && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground">{t.profile.email}</p>
                    <p className="text-card-foreground">{user.email}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ethnic pattern footer */}
        <div className="mt-8 text-center">
          <div className="text-primary opacity-20 mb-4">
            <EthnicPattern className="w-full h-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
