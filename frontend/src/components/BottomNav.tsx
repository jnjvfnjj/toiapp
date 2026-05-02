// src/components/BottomNav.tsx
import React from 'react';
import { Home, MapPin, DollarSign, User, Calendar, Building2 } from 'lucide-react';

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  isOwner?: boolean;
}

export function BottomNav({ currentScreen, onNavigate, isOwner = false }: BottomNavProps) {
  const organizerItems = [
    { key: 'home', label: 'Главная', icon: Home },
    { key: 'venueList', label: 'Площадки', icon: MapPin },
    { key: 'budget', label: 'Бюджет', icon: DollarSign },
    { key: 'profile', label: 'Профиль', icon: User },
  ];

  const ownerItems = [
    { key: 'home', label: 'Главная', icon: Home },
    { key: 'myVenues', label: 'Мои площадки', icon: Building2 },
    { key: 'ownerBookings', label: 'Брони', icon: Calendar },
    { key: 'ownerProfile', label: 'Профиль', icon: User },
  ];

  const items = isOwner ? ownerItems : organizerItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 pb-2 shadow-lg">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                  isActive
                    ? 'text-orange-500 dark:text-orange-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}