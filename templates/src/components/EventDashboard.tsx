import { ArrowLeft, Edit, Users, DollarSign, MapPin, CheckCircle2, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Event, Guest, BudgetItem } from '../App';
import { EthnicBorder } from './EthnicPattern';
import { useTranslations } from '../i18n/translations';

interface EventDashboardProps {
  event: Event | null;
  onNavigate: (screen: string) => void;
  guests: Guest[];
  budgetItems: BudgetItem[];
  onBack: () => void;
}

export function EventDashboard({ event, onNavigate, guests, budgetItems, onBack }: EventDashboardProps) {
  const t = useTranslations();
  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">{t.events.noActiveEvent}</p>
          <Button onClick={onBack}>{t.common.goBack}</Button>
        </div>
      </div>
    );
  }

  const totalSpent = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const budgetRemaining = event.budget - totalSpent;
  const budgetPercentage = (totalSpent / event.budget) * 100;

  const checklist = [
    { id: 1, title: t.eventDashboard.checklistVenue, completed: !!event.venue },
    { id: 2, title: t.eventDashboard.checklistGuests, completed: guests.length > 0 },
    { id: 3, title: t.eventDashboard.checklistBudget, completed: budgetItems.length > 0 },
    { id: 4, title: t.eventDashboard.checklistInvites, completed: false }
  ];

  const completedTasks = checklist.filter(item => item.completed).length;
  const progressPercentage = (completedTasks / checklist.length) * 100;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-6">
        <button onClick={onBack} className="mb-4 p-2 hover:bg-white/10 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="mb-2">{event.name}</h1>
        <p className="text-cyan-100">{event.date} • {event.time}</p>
        <div className="mt-4">
          <EthnicBorder className="text-white" />
        </div>
      </div>

      {/* Progress */}
      <div className="px-6 -mt-6">
        <div className="bg-card rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground">{t.events.dashboard}</span>
            <span className="text-primary">{completedTasks}/{checklist.length}</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="px-6 py-6 space-y-4">
        {/* Budget */}
        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-popover flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-card-foreground">{t.budgetScreen.title}</h3>
                <p className="text-muted-foreground">{totalSpent.toLocaleString()} / {event.budget.toLocaleString()} сом</p>
              </div>
            </div>
            <Button
              onClick={() => onNavigate('eventBudget')}
              size="sm"
              variant="outline"
              className="rounded-xl"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            ></div>
          </div>
          {budgetRemaining < 0 && (
            <p className="mt-2 text-red-600">{t.budgetScreen.overspent.replace('{amount}', Math.abs(budgetRemaining).toLocaleString())}</p>
          )}
        </div>

        {/* Guests */}
        <div
          onClick={() => onNavigate('guests')}
          className="bg-card rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-popover flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-card-foreground">{t.guests.title}</h3>
                <p className="text-muted-foreground">{guests.length} {t.guests.addGuest} • {t.events.guestsCount}: {event.guests}</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="rounded-xl">
              {t.eventDashboard.open}
            </Button>
          </div>
        </div>

        {/* Venue */}
        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-popover flex items-center justify-center">
                <MapPin className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="text-card-foreground">{t.eventDashboard.venue}</h3>
                <p className="text-muted-foreground">
                  {event.venue ? event.venue.name : t.eventDashboard.venueNotSelected}
                </p>
              </div>
            </div>
          </div>
          {event.venue ? (
            <Button
              onClick={() => onNavigate('venueDetail')}
              variant="outline"
              className="w-full rounded-xl"
            >
              {t.eventDashboard.viewDetails}
            </Button>
          ) : (
            <Button
              onClick={() => onNavigate('venueList')}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl"
            >
              {t.eventDashboard.selectVenue}
            </Button>
          )}
        </div>

        {/* Checklist */}
        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-popover flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-card-foreground">{t.eventDashboard.checklist}</h3>
          </div>
          <div className="space-y-2">
            {checklist.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/10 cursor-pointer"
              >
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                  item.completed
                    ? 'bg-cyan-500 border-cyan-500'
                    : 'border-border'
                }`}>
                  {item.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <span className={item.completed ? 'text-muted-foreground line-through' : 'text-card-foreground'}>
                  {item.title}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}