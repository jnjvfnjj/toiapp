import React, { useState } from 'react';
import { ArrowLeft, Calendar, DollarSign, ChevronRight, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { EthnicPattern } from './EthnicPattern';
import { Event, BudgetItem } from '../App';
import { useTranslations } from '../i18n/translations';
import { useLanguage } from '../i18n/LanguageContext';
import { BudgetScreen } from './BudgetScreen';
import type { Language } from '../i18n/translations';

interface BudgetEventsScreenProps {
  events: Event[];
  budgetItems: BudgetItem[];
  onSelectEvent: (event: Event) => void;
  onAddItem: (item: BudgetItem, eventId: string) => void;
  onBack: () => void;
  onCreateEvent: () => void;
}

export function BudgetEventsScreen({
  events,
  budgetItems,
  onSelectEvent,
  onAddItem,
  onBack,
  onCreateEvent,
}: BudgetEventsScreenProps) {
  const t = useTranslations();
  const { language } = useLanguage();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Функция для форматирования даты в зависимости от языка
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const localeMap: Record<Language, string> = {
      ru: 'ru-RU',
      kg: 'ky-KG',
      en: 'en-US',
    };
    return date.toLocaleDateString(localeMap[language] || 'ru-RU');
  };

  // Функция для правильного склонения слов
  const getExpenseWord = (count: number): string => {
    if (count === 1) return t.budgetScreen.expenseItem;
    if (count < 5) return t.budgetScreen.expenseItems;
    return t.budgetScreen.expenseItemsMany;
  };

  // Если выбрано мероприятие, показываем его бюджет
  if (selectedEventId) {
    const selectedEvent = events.find(e => e.id === selectedEventId);
    const eventBudgetItems = budgetItems.filter(b => b.eventId === selectedEventId);
    
    if (selectedEvent) {
      return (
        <BudgetScreen
          budgetItems={eventBudgetItems}
          totalBudget={selectedEvent.budget}
          onAddItem={(item) => onAddItem(item, selectedEventId)}
          onBack={() => {
            setSelectedEventId(null);
            onSelectEvent(selectedEvent);
          }}
          eventName={selectedEvent.name}
        />
      );
    }
  }

  // Вычисляем статистику по каждому мероприятию
  const eventsWithBudget = events.map(event => {
    const eventItems = budgetItems.filter(b => b.eventId === event.id);
    const totalSpent = eventItems.reduce((sum, item) => sum + item.amount, 0);
    const remaining = event.budget - totalSpent;
    const percentage = event.budget > 0 ? (totalSpent / event.budget) * 100 : 0;
    
    return {
      ...event,
      totalSpent,
      remaining,
      percentage,
      itemsCount: eventItems.length,
    };
  });

  const totalBudget = eventsWithBudget.reduce((sum, e) => sum + e.budget, 0);
  const totalSpent = eventsWithBudget.reduce((sum, e) => sum + e.totalSpent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-[#3B6EA5] text-white">
        <div className="opacity-20 pointer-events-none">
          <EthnicPattern className="w-full h-16" />
        </div>
        <div className="px-6 -mt-8 pb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="flex-1 text-center text-xl font-semibold">{t.budgetScreen.title}</h1>
            <button
              onClick={onCreateEvent}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {/* Общая статистика */}
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                <span className="text-sm opacity-90">{t.budgetScreen.totalBudget}</span>
              </div>
              <span className="text-2xl font-bold">{totalBudget.toLocaleString()} {t.budgetScreen.currency}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="opacity-80">{t.budgetScreen.spentLabel}</span>
                <span className="font-medium">{totalSpent.toLocaleString()} {t.budgetScreen.currency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-80">{t.budgetScreen.remainingLabel}</span>
                <span className={`font-medium ${totalRemaining >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {totalRemaining.toLocaleString()} {t.budgetScreen.currency}
                </span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-white transition-all"
                  style={{ width: `${totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Список мероприятий */}
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          {t.budgetScreen.budgetEventsTitle} ({eventsWithBudget.length})
        </h2>

        {eventsWithBudget.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">{t.budgetScreen.noEventsTitle}</p>
            <Button onClick={onCreateEvent} className="bg-primary text-white">
              {t.budgetScreen.createEventBtn}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {eventsWithBudget.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEventId(event.id)}
                className="w-full bg-card border border-border rounded-2xl p-4 hover:border-primary/50 transition-all hover:shadow-md text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{event.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                      <span className="mx-1">•</span>
                      <span>{event.time}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
                </div>

                {/* Прогресс бюджета */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.budgetScreen.budgetLabel}</span>
                    <span className="font-medium text-foreground">{event.budget.toLocaleString()} {t.budgetScreen.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.budgetScreen.spentLabel}</span>
                    <span className="font-medium text-foreground">{event.totalSpent.toLocaleString()} {t.budgetScreen.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{t.budgetScreen.remainingLabel}</span>
                    <span className={`font-medium ${event.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {event.remaining.toLocaleString()} {t.budgetScreen.currency}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        event.percentage > 100 ? 'bg-red-500' : event.percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(event.percentage, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {event.itemsCount} {getExpenseWord(event.itemsCount)} {t.budgetScreen.expensesCount}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Spacing for bottom nav */}
      <div className="h-20 pb-[env(safe-area-inset-bottom)]"></div>
    </div>
  );
}
