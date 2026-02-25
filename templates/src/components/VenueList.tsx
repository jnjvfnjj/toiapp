import { useState } from 'react';
import { ArrowLeft, Search, MapPin, Users, DollarSign, Star, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useTranslations } from '../i18n/translations';
import { useLanguage } from '../i18n/LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Venue } from '../App';

export interface VenueListItem {
  id: string | number;
  name: string;
  capacity: number;
  price: number;
  rating?: number;
  location: string;
  image: string;
  description: { ru: string; kg: string; en: string };
}

interface VenueListProps {
  onSelectVenue: (venue: any) => void;
  onBack: () => void;
  /** Площадки с бэкенда (если переданы — показываем их вместо демо-списка) */
  venuesFromApi?: Venue[];
}

type SortKey = 'price' | 'capacity' | 'location' | 'rating' | null;

const DEFAULT_VENUES: VenueListItem[] = [];

export function VenueList({ onSelectVenue, onBack, venuesFromApi }: VenueListProps) {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>(null);
  const [sortValue, setSortValue] = useState('');

  const venues: VenueListItem[] = venuesFromApi && venuesFromApi.length > 0
    ? venuesFromApi.map((v) => ({
        id: v.id,
        name: v.name,
        capacity: v.capacity,
        price: v.price,
        rating: 4.5,
        location: typeof v.location === 'object' ? v.location?.address ?? '' : (v.location ?? ''),
        image: v.mainPhoto ?? '',
        description: { ru: v.description ?? '', kg: v.description ?? '', en: v.description ?? '' },
      }))
    : DEFAULT_VENUES;

  const { language } = useLanguage();

  const filteredBySearch = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (venue.location && String(venue.location).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredVenues = [...filteredBySearch].sort((a, b) => {
    if (!sortBy) return 0;
    const locStr = (v: any) => (v?.location && typeof v.location === 'object' ? v.location.address : String(v?.location ?? ''));
    switch (sortBy) {
      case 'price': {
        const target = Number(sortValue) || 0;
        const distA = Math.abs((a.price ?? 0) - target);
        const distB = Math.abs((b.price ?? 0) - target);
        return distA - distB;
      }
      case 'capacity': {
        const target = Number(sortValue) || 0;
        const distA = Math.abs((a.capacity ?? 0) - target);
        const distB = Math.abs((b.capacity ?? 0) - target);
        return distA - distB;
      }
      case 'location': {
        const q = (sortValue || '').trim().toLowerCase();
        if (!q) return String(locStr(a)).localeCompare(locStr(b));
        const strA = locStr(a).toLowerCase();
        const strB = locStr(b).toLowerCase();
        const matchA = strA.includes(q) ? 0 : 1;
        const matchB = strB.includes(q) ? 0 : 1;
        if (matchA !== matchB) return matchA - matchB;
        return strA.localeCompare(strB);
      }
      case 'rating': {
        const target = Number(sortValue) || 0;
        const distA = Math.abs((a.rating ?? 0) - target);
        const distB = Math.abs((b.rating ?? 0) - target);
        return distA - distB;
      }
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-muted/10 rounded-full">
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h2 className="flex-1 text-card-foreground">{t.nav.venues}</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-cyan-50 rounded-full"
          >
            <SlidersHorizontal className="w-6 h-6 text-cyan-600" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder={t.common.search + '...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500"
          />
        </div>

        {/* Сортировка по критерию: пользователь вводит значение, первыми — ближе к нему */}
        {showFilters && (
            <div className="mt-4 p-4 bg-popover rounded-xl space-y-4">
            <p className="text-sm text-muted-foreground">{t.venues?.sortBy ?? 'Сортировать по:'}</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className={`rounded-full whitespace-nowrap border-2 text-gray-800 dark:text-gray-100 ${sortBy === 'price' ? 'bg-cyan-100 dark:bg-cyan-900/40 border-cyan-500' : 'border-gray-400 dark:border-gray-500 hover:border-cyan-500'}`}
                onClick={() => { setSortBy(sortBy === 'price' ? null : 'price'); setSortValue(''); }}
              >
                {t.venues.price}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`rounded-full whitespace-nowrap border-2 text-gray-800 dark:text-gray-100 ${sortBy === 'capacity' ? 'bg-cyan-100 dark:bg-cyan-900/40 border-cyan-500' : 'border-gray-400 dark:border-gray-500 hover:border-cyan-500'}`}
                onClick={() => { setSortBy(sortBy === 'capacity' ? null : 'capacity'); setSortValue(''); }}
              >
                {t.venues.capacity}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`rounded-full whitespace-nowrap border-2 text-gray-800 dark:text-gray-100 ${sortBy === 'location' ? 'bg-cyan-100 dark:bg-cyan-900/40 border-cyan-500' : 'border-gray-400 dark:border-gray-500 hover:border-cyan-500'}`}
                onClick={() => { setSortBy(sortBy === 'location' ? null : 'location'); setSortValue(''); }}
              >
                {t.venues.location}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`rounded-full whitespace-nowrap border-2 text-gray-800 dark:text-gray-100 ${sortBy === 'rating' ? 'bg-cyan-100 dark:bg-cyan-900/40 border-cyan-500' : 'border-gray-400 dark:border-gray-500 hover:border-cyan-500'}`}
                onClick={() => { setSortBy(sortBy === 'rating' ? null : 'rating'); setSortValue(''); }}
              >
                {t.venues.rating ?? 'Рейтинг'}
              </Button>
            </div>
            {sortBy && (
              <div className="pt-2 border-t border-border">
                <label className="block text-sm text-muted-foreground mb-2">
                  {sortBy === 'price' && (t.venues.enterPrice ?? 'Введите желаемую сумму (сом)')}
                  {sortBy === 'capacity' && (t.venues.enterCapacity ?? 'Введите вместимость (чел)')}
                  {sortBy === 'location' && (t.venues.enterLocation ?? 'Введите район или адрес')}
                  {sortBy === 'rating' && (t.venues.enterRating ?? 'Введите рейтинг (1–5)')}
                </label>
                <Input
                  type={sortBy === 'location' ? 'text' : 'number'}
                  placeholder={
                    sortBy === 'price' ? '50000' :
                    sortBy === 'capacity' ? '150' :
                    sortBy === 'rating' ? '4.5' :
                    'Бишкек, центр'
                  }
                  min={sortBy === 'rating' ? 1 : undefined}
                  max={sortBy === 'rating' ? 5 : undefined}
                  step={sortBy === 'rating' ? 0.1 : undefined}
                  value={sortValue}
                  onChange={(e) => setSortValue(e.target.value)}
                  className="rounded-xl border-2 focus:border-cyan-500"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t.venues?.sortClosest ?? 'Первыми показываются заведения ближе к введённому значению'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map placeholder */}
      <div className="h-48 bg-gradient-to-br from-cyan-100 to-blue-100 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin className="w-16 h-16 text-cyan-500 opacity-50" />
        </div>
        <div className="absolute bottom-4 left-4 bg-card rounded-full px-4 py-2 shadow-lg">
          <p className="text-card-foreground">Карта площадок</p>
        </div>
      </div>

      {/* Venue cards */}
      <div className="px-6 py-6 pb-24 space-y-4">
        {filteredVenues.length === 0 && (
          <div className="bg-card rounded-2xl p-8 text-center">
            <MapPin className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-card-foreground mb-1">Площадки не найдены</p>
            <p className="text-muted-foreground">Добавьте реальные площадки в базе данных или измените фильтры.</p>
          </div>
        )}
        {filteredVenues.map((venue) => (
          <div
            key={venue.id}
            onClick={() => onSelectVenue(venuesFromApi?.length ? (venuesFromApi.find((v) => String(v.id) === String(venue.id)) ?? venue) : venue)}
            className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="h-48 relative">
              <ImageWithFallback
                src={venue.image}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-card rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-card-foreground">{venue.rating ?? '—'}</span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="mb-2 text-card-foreground">{venue.name}</h3>
              <p className="text-muted-foreground mb-3">{venue.description?.[language] ?? venue.description?.ru}</p>
              
              <div className="flex items-center gap-4 text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{venue.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{venue.capacity}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-primary">
                  <DollarSign className="w-5 h-5" />
                  <span>{t.venues.from} {venue.price.toLocaleString()} {t.budgetPie.currency}</span>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl"
                >
                  {t.bookings.viewDetails}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
