import { ArrowLeft, Building2, MapPin, Plus, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Venue } from '../App';
import { EthnicBorder } from './EthnicPattern';
import { useTranslations } from '../i18n/translations';

interface MyVenuesScreenProps {
  venues: Venue[];
  onAddVenue: () => void;
  onSelectVenue: (venue: Venue) => void;
  onBack: () => void;
}

export function MyVenuesScreen({
  venues,
  onAddVenue,
  onSelectVenue,
  onBack,
}: MyVenuesScreenProps) {
  const t = useTranslations();
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-[#2A5A8A] pt-8 pb-6 px-6 rounded-b-3xl mb-6">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full mb-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        
        <h1 className="text-white mb-3">{t.owner.myVenuesTitle}</h1>
        
        <div className="w-20 mb-4">
          <EthnicBorder className="text-accent" />
        </div>

        <p className="text-white/80">
          {venues.length} {venues.length === 1 ? t.owner.venueSingular || 'заведение' : t.owner.venuePlural || 'заведений'}
        </p>
      </div>

      <div className="px-6">
        {/* Add Button */}
        <Button
          onClick={onAddVenue}
          className="w-full bg-gradient-to-r from-accent to-[#B88A16] hover:from-accent/90 hover:to-[#B88A16]/90 text-white py-6 rounded-2xl shadow-lg mb-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t.owner.addVenueBtn}
        </Button>

        {/* Venues List */}
        {venues.length > 0 ? (
          <div className="space-y-4">
            {venues.map((venue) => (
              <Card
                key={venue.id}
                onClick={() => onSelectVenue(venue)}
                className="bg-card hover:shadow-lg transition-all cursor-pointer overflow-hidden border-2 border-transparent hover:border-accent/30"
              >
                {/* Image */}
                <div className="aspect-video w-full bg-muted overflow-hidden">
                  <img
                    src={venue.mainPhoto}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-foreground mb-1">{venue.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-accent/10 text-accent rounded-lg">
                          {venue.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{t.venues.upTo} {venue.capacity} {t.common.people || 'чел'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-accent">
                      <span>{venue.price.toLocaleString()} {t.budgetScreen.currency}</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{venue.location.address}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Building2 className="w-20 h-20 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-foreground mb-2">{t.owner.noVenuesTitle}</h3>
            <p className="text-muted-foreground mb-6">
              {t.owner.noVenuesDesc}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
