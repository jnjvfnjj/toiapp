import { ArrowLeft, Check, Globe } from 'lucide-react';
import { EthnicPattern } from './EthnicPattern';
import { motion } from 'motion/react';
import type { Language } from '../i18n/translations';
import { useTranslations } from '../i18n/translations';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onBack: () => void;
  onSelectLanguage: (lang: Language) => void;
}

export function LanguageSelector({ currentLanguage, onBack, onSelectLanguage }: LanguageSelectorProps) {
  const t = useTranslations(currentLanguage);

  const languages: Array<{ code: Language; name: string; nativeName: string; flag: string }> = [
    { code: 'ru', name: t.languages.russian, nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'kg', name: t.languages.kyrgyz, nativeName: 'Кыргызча', flag: '🇰🇬' },
    { code: 'en', name: t.languages.english, nativeName: 'English', flag: '🇬🇧' },
  ];

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
            <h1 className="flex-1 text-center">{t.profile.language}</h1>
            <div className="w-10" />
          </div>

          {/* Language icon */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Globe className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Language options */}
      <div className="px-6 -mt-4 pb-8 space-y-3">
        {languages.map((lang, index) => {
          const isSelected = currentLanguage === lang.code;
          return (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                onSelectLanguage(lang.code);
              }}
              className={`w-full bg-card rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all flex items-center gap-4 ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
            >
              {/* Flag */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-[#3B6EA5]/10 flex items-center justify-center text-3xl">
                {lang.flag}
              </div>

              {/* Language info */}
              <div className="flex-1 text-left">
                <h3 className="text-card-foreground mb-1">{lang.nativeName}</h3>
                <p className="text-muted-foreground">{lang.name}</p>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Info text */}
      <div className="px-6 pb-8">
        <div className="bg-card rounded-2xl p-4 text-center">
          <p className="text-muted-foreground text-sm">
            {currentLanguage === 'ru' && 'Изменения применятся мгновенно'}
            {currentLanguage === 'kg' && 'Өзгөртүүлөр дароо колдонулат'}
            {currentLanguage === 'en' && 'Changes will apply instantly'}
          </p>
        </div>
      </div>

      {/* Ethnic pattern footer */}
      <div className="px-6 pb-8 text-center">
        <div className="text-primary opacity-20 mb-4">
          <EthnicPattern className="w-full h-12" />
        </div>
      </div>
    </div>
  );
}
