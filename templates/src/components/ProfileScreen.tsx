import { ArrowLeft, User, Phone, Globe, Settings, HelpCircle, LogOut, ChevronRight, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { EthnicPattern } from './EthnicPattern';
import type { Language } from '../i18n/translations';
import { useTranslations } from '../i18n/translations';

interface ProfileScreenProps {
  user?: any;
  language: Language;
  onBack: () => void;
  onLogout: () => void;
  onNavigateToSettings: () => void;
  onNavigateToLanguage: () => void;
  onNavigateToSupport: () => void;
}

export function ProfileScreen({ user, language, onBack, onLogout, onNavigateToSettings, onNavigateToLanguage, onNavigateToSupport }: ProfileScreenProps) {
  const t = useTranslations(language);
  
  const menuItems = [
    {
      icon: Settings,
      label: t.profile.settings,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-100 dark:bg-cyan-900/30',
      action: onNavigateToSettings
    },
    {
      icon: Globe,
      label: t.profile.language,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      value: language === 'ru' ? t.languages.russian : language === 'kg' ? t.languages.kyrgyz : t.languages.english,
      action: onNavigateToLanguage
    },
    {
      icon: HelpCircle,
      label: t.profile.support,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      action: onNavigateToSupport
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with ethnic pattern */}
      <div className="bg-gradient-to-r from-primary to-[#3B6EA5] text-white pb-8 relative">
        <div className="opacity-20">
          <EthnicPattern className="w-full h-16" />
        </div>
        <div className="px-6 mt-4">
          <button onClick={onBack} className="absolute top-4 left-4 z-50 w-12 h-12 p-3 hover:bg-white/10 rounded-full flex items-center justify-center">
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          {/* Profile info */}
          <div className="flex items-center gap-4 min-w-0">
            {user?.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={user.name}
                className="w-20 h-20 rounded-full border-4 border-white/30 object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30 flex-shrink-0">
                <User className="w-10 h-10" />
              </div>
            )}
            <div className="flex-1 min-w-0 overflow-hidden">
              <h1 className="mb-1 truncate text-lg">
                {user?.name || t.profile.title}
                {user?.surname && ` ${user.surname}`}
              </h1>
              <p className="text-[#A7D8F0] text-sm truncate">
                {user?.role === 'organizer' ? t.profile.organizer : t.profile.owner}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User details */}
      <div className="px-6 mt-4">
        <div className="bg-card rounded-3xl p-6 shadow-lg space-y-4">
          {user?.name && (
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-muted-foreground">{t.profile.firstName}</p>
                <p className="text-card-foreground truncate">
                  {user.name}
                  {user.surname && ` ${user.surname}`}
                </p>
              </div>
            </div>
          )}
          
          {user?.phone && (
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
          
          {user?.email && (
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
        </div>
      </div>

      {/* Menu items */}
      <div className="px-6 py-6 space-y-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={item.action}
              className="w-full bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-3"
            >
              <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-card-foreground">{item.label}</p>
                {item.value && (
                  <p className="text-muted-foreground">{item.value}</p>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          );
        })}
      </div>

      {/* Logout button */}
      <div className="px-6 pb-8">
        <Button
          onClick={() => {
            if (confirm(t.profile.logoutConfirm)) {
              onLogout();
            }
          }}
          variant="outline"
          className="w-full border-2 border-destructive text-destructive hover:bg-destructive/10 hover:border-destructive rounded-2xl py-6"
        >
          <LogOut className="w-5 h-5 mr-2" />
          {t.profile.logout}
        </Button>
      </div>

      {/* App info */}
      <div className="px-6 pb-24 text-center">
        <div className="text-primary opacity-20 mb-4">
          <EthnicPattern className="w-full h-12" />
        </div>
        <p className="text-muted-foreground">{t.profile.appVersion}</p>
        <p className="text-muted-foreground">{t.profile.rightsReserved}</p>
      </div>
    </div>
  );
}