import { ArrowLeft, Calendar, MapPin, Users, Plus, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Event } from '../App';
import { useTranslations } from '../i18n/translations';
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../i18n/translations';

interface MyEventsScreenProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
  onCreateEvent: () => void;
  onBack: () => void;
}

export function MyEventsScreen({ events, onSelectEvent, onCreateEvent, onBack }: MyEventsScreenProps) {
  const t = useTranslations();
  const { language } = useLanguage();
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date());
  const pastEvents = events.filter(e => new Date(e.date) < new Date());

  const getEventTypeEmoji = (type: string) => {
    const emojiMap: { [key: string]: string } = {
      'той': '🎊',
      'wedding': '💒',
      'kyz-uzatu': '👰',
      'birthday': '🎂',
      'picnic': '🏞️',
      'corporate': '🏢',
      'other': '🎉'
    };
    return emojiMap[type] || '🎉';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const localeMap: Record<Language, string> = {
      ru: 'ru-RU',
      kg: 'ky-KG',
      en: 'en-US',
    };
    return date.toLocaleDateString(localeMap[language] || 'ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-[#3B6EA5] text-white px-6 py-6 sticky top-0 z-10">
        <button onClick={onBack} className="mb-4 p-2 hover:bg-white/10 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-1">{t.events.myEvents}</h1>
            <p className="text-[#A7D8F0]">{events.length} {events.length === 1 ? t.events.eventSingular || 'мероприятие' : t.events.eventPlural || 'мероприятий'}</p>
          </div>
          <Button
            onClick={onCreateEvent}
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white rounded-xl"
          >
            <Plus className="w-5 h-5 mr-1" />
            {t.events.createEvent}
          </Button>
        </div>
      </div>

      <div className="px-6 py-6">
        {events.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-foreground">{t.events.noEventsTitle}</h3>
            <p className="text-muted-foreground mb-6">{t.events.noEventsDesc}</p>
            <Button
              onClick={onCreateEvent}
              className="bg-gradient-to-r from-primary to-[#3B6EA5] hover:from-primary/90 hover:to-[#3B6EA5]/90 text-white rounded-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t.events.createEvent}
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div>
                <h3 className="mb-4 text-foreground">{t.events.upcomingEvents}</h3>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => onSelectEvent(event)}
                      className="bg-card rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-primary"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-5xl">{getEventTypeEmoji(event.type)}</div>
                        <div className="flex-1">
                          <h4 className="text-card-foreground mb-2">{event.name}</h4>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{event.time}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users className="w-4 h-4" />
                              <span>{event.guests} гостей</span>
                            </div>
                            
                            {event.venue && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{event.venue.name}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-border">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Бюджет</span>
                              <span className="text-primary">{event.budget.toLocaleString()} сом</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div>
                <h3 className="mb-4 text-foreground">{t.events.pastEvents}</h3>
                <div className="space-y-3">
                  {pastEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => onSelectEvent(event)}
                      className="bg-card rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer opacity-75 hover:opacity-100"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl grayscale">{getEventTypeEmoji(event.type)}</div>
                        <div className="flex-1">
                          <h4 className="text-card-foreground mb-2">{event.name}</h4>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
