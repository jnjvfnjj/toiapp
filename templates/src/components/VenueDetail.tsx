import { ArrowLeft, MapPin, Users, DollarSign, Star, MessageCircle, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslations } from '../i18n/translations';
import { useLanguage } from '../i18n/LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface VenueDetailProps {
  venue: any;
  onBack: () => void;
  onSelect: () => void;
  /** Владелец смотрит своё заведение — не показывать кнопку «Выбрать» */
  isOwnerView?: boolean;
}

export function VenueDetail({ venue, onBack, onSelect, isOwnerView }: VenueDetailProps) {
  if (!venue) return null;
  const t = useTranslations();
  const { language } = useLanguage();

  // Поддержка и формата списка (image, location строка), и формата заведений владельца (mainPhoto, location.address)
  const imageSrc = venue.mainPhoto ?? venue.image;
  const locationText = typeof venue.location === 'object' && venue.location?.address
    ? venue.location.address
    : (venue.location ?? '');
  const rating = venue.rating ?? '—';

  const amenityConfig = [
    { key: 'music', emoji: '🎵', label: t.venues.featureMusic },
    { key: 'catering', emoji: '🍽️', label: t.venues.featureCatering },
    { key: 'parking', emoji: '🅿️', label: t.venues.featureParking },
    { key: 'ac', emoji: '❄️', label: t.venues.featureAC },
    { key: 'decor', emoji: '🎨', label: t.venues.featureDecor },
    { key: 'photo', emoji: '📸', label: t.venues.featurePhoto },
  ];
  const features = venue.amenities
    ? amenityConfig
        .filter((a) => venue.amenities[a.key as keyof typeof venue.amenities])
        .map((a) => `${a.emoji} ${a.label}`)
    : amenityConfig.map((a) => `${a.emoji} ${a.label}`);

  const handleWhatsApp = () => {
    const message = t.venues.contactMessage.replace('{name}', venue.name);
    window.open(`https://wa.me/996555123456?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Image header */}
      <div className="relative h-80">
        <ImageWithFallback
          src={imageSrc}
          alt={venue.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-lg hover:scale-105"
        >
          <ArrowLeft className="w-6 h-6 text-cyan-700" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Title and rating */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="mb-2 text-foreground">{venue.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{locationText}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 rounded-xl px-3 py-2 flex-shrink-0">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500 flex-shrink-0" />
            <span className="text-amber-900 dark:text-amber-200">{rating}</span>
          </div>
        </div>

        {/* Price and capacity */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 min-w-0 bg-card rounded-2xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="w-5 h-5 flex-shrink-0" />
              <span>{t.venues.price}</span>
            </div>
            <p className="text-foreground">{t.venues.from} {venue.price.toLocaleString()} {t.budgetPie.currency}</p>
          </div>
          <div className="flex-1 min-w-0 bg-card rounded-2xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="w-5 h-5" />
              <span>{t.venues.capacity}</span>
            </div>
            <p className="text-foreground">{t.venues.upTo} {venue.capacity} {t.guests.individuals}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="mb-3 text-foreground">{t.venues.descriptionTitle}</h3>
          <p className="text-muted-foreground leading-relaxed">
            {(() => {
              const desc = typeof venue.description === 'string'
                ? venue.description
                : (venue.description?.[language] ?? venue.description?.ru ?? '');
              return desc ? `${desc}. ${t.venues.descriptionBlurb}` : t.venues.descriptionBlurb;
            })()}
          </p>
        </div>

        {/* Features — только то, что указал владелец */}
        {features.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 text-foreground">{t.venues.featuresTitle}</h3>
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-card rounded-xl p-3 min-w-0"
                >
                  <Check className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                  <span className="text-muted-foreground truncate">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mini map */}
        <div className="mb-6">
          <h3 className="mb-3">{t.venues.location}</h3>
          <div className="h-48 bg-card rounded-2xl flex items-center justify-center">
            <MapPin className="w-12 h-12 text-cyan-500" />
          </div>
        </div>
      </div>

      {/* Fixed bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-4 safe-area-inset-bottom">
        <div className="max-w-md mx-auto flex gap-3">
          <Button
            onClick={handleWhatsApp}
            variant="outline"
            className="flex-1 min-w-0 py-6 rounded-xl border-2 border-cyan-500 text-cyan-700 hover:bg-cyan-50 dark:text-cyan-300 dark:border-cyan-400 dark:hover:bg-cyan-500/10"
          >
            <MessageCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            {t.venues.contact}
          </Button>
          {!isOwnerView && (
            <Button
              onClick={onSelect}
              className="flex-1 min-w-0 py-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg"
            >
              <Check className="w-5 h-5 mr-2 flex-shrink-0" />
              {t.venues.select}
            </Button>
          )}
        </div>
      </div>

      {/* Spacing for fixed footer */}
      <div className="h-24"></div>
    </div>
  );
}
