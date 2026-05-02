import { Sparkles, Calendar, MapPin, Wallet, User, Plus } from 'lucide-react';
import { EthnicPattern } from './EthnicPattern';
import { PromoBanner } from './PromoBanner';
import { Button } from './ui/button';
import { Event } from '../App';
import { useTranslations } from '../i18n/translations';
import { APP_NAME } from '../constants';

interface HomeScreenProps {
  onCreateEvent: () => void;
  onMyEvents: () => void;
  onFindVenue: () => void;
  onNavigate: (screen: string) => void;
  events: Event[];
  user?: any;
}

export function HomeScreen({ onCreateEvent, onMyEvents, onFindVenue, onNavigate, events, user }: HomeScreenProps) {
  const t = useTranslations();
  const recommendedVenues = [
    { name: 'Ала-Тоо Plaza', capacity: 200, price: 50000, rating: 4.8 },
    { name: 'Silk Road Hall', capacity: 150, price: 40000, rating: 4.9 },
    { name: 'Manas Garden', capacity: 300, price: 70000, rating: 4.7 }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with ethnic pattern */}
      <div className="bg-gradient-to-r from-primary to-[#3B6EA5] text-white pb-6">
        <div className="opacity-20">
          <EthnicPattern className="w-full h-16" />
        </div>
        <div className="px-6 -mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <h1 className="text-white truncate">{APP_NAME}</h1>
                <p className="text-[#A7D8F0] truncate">
                  {user?.name ? t.common.greeting.replace('{name}', user.name) : t.common.welcome}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main actions */}
      <div className="px-6 -mt-4">
        <div className="bg-card rounded-3xl shadow-lg p-6 space-y-3">
          <Button
            onClick={onCreateEvent}
            className="w-full bg-gradient-to-r from-primary to-[#3B6EA5] hover:from-primary/90 hover:to-[#3B6EA5]/90 text-white py-6 rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t.events.createEvent}
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onMyEvents}
              variant="outline"
              className="py-8 rounded-xl border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="flex flex-col items-center">
                <Calendar className="w-6 h-6 mb-2 text-primary" />
                <span className="text-foreground">{t.events.myEvents}</span>
              </div>
            </Button>
            
            <Button
              onClick={onFindVenue}
              variant="outline"
              className="py-8 rounded-xl border-2 border-[#3B6EA5]/30 hover:border-[#3B6EA5] hover:bg-[#3B6EA5]/5 transition-all"
            >
              <div className="flex flex-col items-center">
                <MapPin className="w-6 h-6 mb-2 text-[#3B6EA5]" />
                <span className="text-foreground">{t.nav.venues}</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Recommended venues */}
      <div className="px-6 mt-8">
        {/* Promo Banner */}
        <div className="mb-6">
          <PromoBanner onBannerClick={(id) => {
            // Handle banner click
          }} />
        </div>

        <h3 className="mb-4 text-foreground">{t.venues.findVenue}</h3>
        
        <div className="space-y-3">
          {recommendedVenues.map((venue, index) => (
            <div
              key={index}
              onClick={onFindVenue}
              className="bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-card-foreground mb-1">{venue.name}</h4>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span>👥 {venue.capacity}</span>
                    <span>⭐ {venue.rating}</span>
                  </div>
                  <p className="text-primary mt-1">от {venue.price.toLocaleString()} сом</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spacing for fixed bottom nav + safe area (notched phones) */}
      <div className="h-20 pb-[env(safe-area-inset-bottom)]"></div>
    </div>
  );
}