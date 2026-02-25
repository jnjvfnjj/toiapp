import { Building2, Calendar, MessageSquare, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { User, Venue, Booking } from '../App';
import { EthnicBorder } from './EthnicPattern';
import { useTranslations } from '../i18n/translations';

interface OwnerDashboardProps {
  user: User | null;
  venues: Venue[];
  bookings: Booking[];
  onNavigate: (screen: string, data?: any) => void;
}

export function OwnerDashboard({ user, venues, bookings, onNavigate }: OwnerDashboardProps) {
  const t = useTranslations();
  const userVenues = venues.filter(v => v.ownerId === user?.id);
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'approved').length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-[#2A5A8A] pt-12 pb-8 px-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6 min-w-0 gap-3">
          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="text-white/80 mb-1">{t.owner.welcome}</p>
            <h1 className="text-white truncate">
              {user?.name} {user?.surname}
            </h1>
          </div>
          {user?.photoUrl && (
            <div 
              onClick={() => onNavigate('ownerProfile')}
              className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/30 overflow-hidden cursor-pointer hover:scale-105 transition-transform"
            >
              <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="w-20">
          <EthnicBorder className="text-accent" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 -mt-6 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 bg-card border-2 border-accent/20">
            <div className="text-center">
              <Building2 className="w-6 h-6 text-accent mx-auto mb-2" />
              <div className="text-foreground mb-1">{userVenues.length}</div>
              <p className="text-muted-foreground">{t.owner.venuesLabel}</p>
            </div>
          </Card>

          <Card className="p-4 bg-card border-2 border-primary/20">
            <div className="text-center">
              <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-foreground mb-1">{confirmedBookings}</div>
              <p className="text-muted-foreground">{t.owner.bookingsLabel}</p>
            </div>
          </Card>

          <Card className="p-4 bg-card border-2 border-destructive/20">
            <div className="text-center">
              <MessageSquare className="w-6 h-6 text-destructive mx-auto mb-2" />
              <div className="text-foreground mb-1">{pendingBookings}</div>
              <p className="text-muted-foreground">{t.owner.pendingLabel}</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <h2 className="text-foreground mb-4">{t.owner.quickActions}</h2>
        
        <div className="space-y-3">
          <Button
            onClick={() => onNavigate('addVenue')}
            className="w-full bg-gradient-to-r from-accent to-[#B88A16] hover:from-accent/90 hover:to-[#B88A16]/90 text-white py-6 rounded-2xl shadow-lg justify-between"
          >
              <span className="flex items-center gap-3">
              <Plus className="w-5 h-5" />
              {t.owner.addVenueBtn}
            </span>
            <span className="text-white/80">→</span>
          </Button>

          <Button
            onClick={() => onNavigate('myVenues')}
            variant="outline"
            className="w-full py-6 rounded-2xl border-2 border-primary/30 hover:border-primary justify-between"
          >
              <span className="flex items-center gap-3 text-foreground">
              <Building2 className="w-5 h-5 text-primary" />
              {t.owner.myVenuesBtn}
            </span>
            <span className="text-muted-foreground">→</span>
          </Button>

          <Button
            onClick={() => onNavigate('ownerBookings')}
            variant="outline"
            className="w-full py-6 rounded-2xl border-2 border-primary/30 hover:border-primary justify-between"
          >
              <span className="flex items-center gap-3 text-foreground">
              <Calendar className="w-5 h-5 text-primary" />
              {t.owner.bookingsScheduleBtn}
            </span>
            {pendingBookings > 0 && (
              <span className="px-2 py-1 rounded-full bg-destructive text-white">
                {pendingBookings}
              </span>
            )}
            <span className="text-muted-foreground">→</span>
          </Button>
        </div>
      </div>

      {/* Recent Venues */}
      {userVenues.length > 0 && (
        <div className="px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground">{t.owner.myVenuesTitle}</h2>
            {userVenues.length > 2 && (
                <button
                onClick={() => onNavigate('myVenues')}
                className="text-primary hover:underline"
              >
                {t.owner.viewAll}
              </button>
            )}
          </div>

          <div className="space-y-3">
            {userVenues.slice(0, 2).map((venue) => (
              <Card
                key={venue.id}
                onClick={() => onNavigate('venueDetail', { venue })}
                className="p-4 bg-card hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={venue.mainPhoto}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-foreground mb-1 truncate">{venue.name}</h3>
                    <p className="text-muted-foreground mb-2">{venue.type}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-accent">{venue.price.toLocaleString()} сом</span>
                      <span className="text-muted-foreground">до {venue.capacity} чел</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {userVenues.length === 0 && (
        <div className="px-6 py-12 text-center">
          <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-foreground mb-2">{t.owner.noVenuesTitle}</h3>
          <p className="text-muted-foreground mb-6">{t.owner.noVenuesDesc}</p>
          <Button
            onClick={() => onNavigate('addVenue')}
            className="bg-gradient-to-r from-accent to-[#B88A16] hover:from-accent/90 hover:to-[#B88A16]/90 text-white px-8 py-6 rounded-2xl shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t.owner.addVenueBtn}
          </Button>
        </div>
      )}

      {/* Spacing for fixed bottom nav + safe area */}
      <div className="h-20 pb-[env(safe-area-inset-bottom)]"></div>
    </div>
  );
}
