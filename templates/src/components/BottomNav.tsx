import React from 'react';
import { Home, MapPin, DollarSign, User, Calendar } from 'lucide-react';
import { useTranslations } from '../i18n/translations';

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  isOwner?: boolean;
}

export function BottomNav({ currentScreen, onNavigate, isOwner }: BottomNavProps) {
  const t = useTranslations();

  // Для организатора (арендатора): Главная, Площадки, Бюджет, Профиль
  const organizerItems = [
    { key: 'home', label: t.nav.home, icon: Home },
    { key: 'venueList', label: t.nav.venues, icon: MapPin },
    { key: 'budget', label: t.nav.budget, icon: DollarSign },
    { key: 'profile', label: t.nav.profile, icon: User },
  ];

  // Для владельца (арендодателя): Главная, Мои площадки, Брони, Профиль
  // У владельца нет "Площадок" (поиска) и "Бюджета" - это функционал организатора
  const ownerItems = [
    { key: 'home', label: t.nav.home, icon: Home },
    { key: 'myVenues', label: t.nav.venues, icon: MapPin },
    { key: 'ownerBookings', label: t.nav.bookings, icon: Calendar },
    { key: 'ownerProfile', label: t.nav.profile, icon: User },
  ];

  const items = isOwner ? ownerItems : organizerItems;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 pb-[env(safe-area-inset-bottom)]"
      aria-label="Основная навигация"
    >
      <div className="max-w-md mx-auto px-6 py-3">
        <div className="grid grid-cols-4 gap-2">
          {items.map((it) => {
            const Icon = it.icon;
            const isActive = currentScreen === it.key;
            return (
              <button
                key={it.key}
                type="button"
                onClick={() => onNavigate(it.key)}
                aria-label={it.label}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center py-2 transition-all hover:scale-110 active:scale-95 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" aria-hidden />
                <span className="text-xs">{it.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
