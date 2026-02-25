import { Users, Building2, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { EthnicPattern, EthnicBorder } from '../EthnicPattern';
import { useTranslations } from '../../i18n/translations';
import { APP_NAME } from '../../constants';

interface RoleSelectionProps {
  onSelectRole: (role: 'organizer' | 'owner') => void;
}

export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  const t = useTranslations();
  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-[#A7D8F0]/20 to-background">
      {/* Ethnic pattern header */}
      <div className="text-primary opacity-30">
        <EthnicPattern className="w-full h-20" />
      </div>

      {/* Logo and title */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-12">
        <div className="relative mb-8">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-[#3B6EA5] flex items-center justify-center shadow-xl">
            <Sparkles className="w-14 h-14 text-white" />
          </div>
          <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-accent border-4 border-background"></div>
        </div>

        <h1 className="text-center mb-3 text-foreground">{APP_NAME}</h1>
        
        <p className="text-center text-muted-foreground mb-2">{t.events.createEvent}</p>

        <div className="w-20 mb-12">
          <EthnicBorder className="text-primary" />
        </div>

        {/* Role selection cards */}
        <div className="w-full space-y-4 max-w-sm">
          <div
            onClick={() => onSelectRole('organizer')}
            className="bg-card rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-[#3B6EA5] flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-card-foreground mb-1">{t.profile.organizer}</h3>
                <p className="text-muted-foreground">{t.addVenue.basicInfoDesc}</p>
              </div>
            </div>
              <div className="flex items-center gap-2 text-primary">
              <span>{t.auth.enterPhone}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div
            onClick={() => onSelectRole('owner')}
            className="bg-card rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-accent hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-[#B88A16] flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-card-foreground mb-1">{t.profile.owner}</h3>
                <p className="text-muted-foreground">{t.venues.myVenues}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-accent">
              <span>{t.auth.getCode}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom pattern */}
      <div className="text-primary opacity-20 mb-8">
        <EthnicPattern className="w-full h-16" />
      </div>
    </div>
  );
}
