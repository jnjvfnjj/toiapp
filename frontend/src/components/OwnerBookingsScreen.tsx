import { useState } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, Check, Clock, MessageSquare, Phone, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Booking, Venue } from '../App';
import { EthnicBorder } from './EthnicPattern';
import { useTranslations } from '../i18n/translations';

interface OwnerBookingsScreenProps {
  bookings: Booking[];
  venues: Venue[];
  onUpdateBooking: (bookingId: string, status: 'approved' | 'cancelled') => void;
  onOpenChat: (bookingId: string) => void;
  onBack: () => void;
}

export function OwnerBookingsScreen({
  bookings,
  venues,
  onUpdateBooking,
  onOpenChat,
  onBack,
}: OwnerBookingsScreenProps) {
  const t = useTranslations();
  const [selectedTab, setSelectedTab] = useState('all');

  const getVenueName = (venueId: string) => {
    const venue = venues.find(v => v.id === venueId);
    return venue?.name || t.venues.findVenue;
  };

  const filteredBookings = bookings.filter(booking => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'pending') return booking.status === 'pending';
    if (selectedTab === 'confirmed') return booking.status === 'approved';
    return false;
  });

  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'approved').length;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = t.dates.monthsShort;
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-[#2A5A8A] pt-8 pb-6 px-6 rounded-b-3xl mb-6">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full mb-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        
        <h1 className="text-white mb-3">{t.owner.bookingsTitle}</h1>
        
        <div className="w-20 mb-4">
          <EthnicBorder className="text-accent" />
        </div>

        <p className="text-white/80">
          {bookings.length} {bookings.length === 1 ? t.owner.tabs?.all : t.owner.bookingsLabel}
        </p>
      </div>

      <div className="px-6">
        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted rounded-2xl p-1">
            <TabsTrigger value="all" className="rounded-xl">
              {t.owner.tabs?.all} ({bookings.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-xl">
              <Clock className="w-4 h-4 mr-1" />
              {t.owner.tabs?.pending} ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="rounded-xl">
              <Check className="w-4 h-4 mr-1" />
              {t.owner.tabs?.confirmed} ({confirmedCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-6">
            {filteredBookings.length > 0 ? (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <Card key={booking.id} className="bg-card overflow-hidden">
                    {/* Status Badge */}
                    <div className={`px-4 py-2 text-center ${
                      booking.status === 'approved'
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : booking.status === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}>
                      {booking.status === 'approved' && `✓ ${t.owner.status?.confirmed}`}
                      {booking.status === 'pending' && `⏳ ${t.owner.status?.pending}`}
                      {booking.status === 'cancelled' && `✕ ${t.owner.status?.cancelled}`}
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Event Info */}
                      <div>
                        <h3 className="text-foreground mb-2">{booking.eventName}</h3>
                        <p className="text-muted-foreground">{getVenueName(booking.venueId)}</p>
                      </div>

                      {/* Date & Time */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-foreground">
                          <CalendarIcon className="w-4 h-4 text-primary" />
                          <span>{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{booking.time}</span>
                        </div>
                      </div>

                      {/* Guests */}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{t.owner.guestsLabel}: {booking.guestsCount} {t.guests.familyMembers}</span>
                      </div>

                      {/* Organizer Info */}
                      <div className="pt-3 border-t border-border">
                        <p className="text-muted-foreground mb-2">{t.owner.organizerLabel}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-foreground">{booking.organizerName}</p>
                            <p className="text-muted-foreground">{booking.organizerPhone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => onOpenChat(booking.id)}
                          variant="outline"
                          className="flex-1 rounded-xl border-2"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          {t.owner.chat}
                        </Button>
                        <Button
                          onClick={() => openWhatsApp(booking.organizerPhone)}
                          className="flex-1 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          {t.owner.whatsapp}
                        </Button>
                      </div>

                      {/* Status Actions */}
                      {booking.status === 'pending' && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => onUpdateBooking(booking.id, 'approved')}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            {t.owner.confirmAction}
                          </Button>
                          <Button
                            onClick={() => onUpdateBooking(booking.id, 'cancelled')}
                            variant="outline"
                            className="flex-1 rounded-xl border-2 border-destructive text-destructive hover:bg-destructive/10"
                          >
                            <X className="w-4 h-4 mr-2" />
                            {t.owner.cancelAction}
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <CalendarIcon className="w-20 h-20 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-foreground mb-2">{t.owner.noBookingsTitle}</h3>
                <p className="text-muted-foreground">
                  {selectedTab === 'pending' && t.owner.noBookingsPending}
                  {selectedTab === 'confirmed' && t.owner.noBookingsConfirmed}
                  {selectedTab === 'all' && t.owner.noBookingsAll}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
