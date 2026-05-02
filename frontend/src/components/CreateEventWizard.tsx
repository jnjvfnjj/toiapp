import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Users, DollarSign, Sparkles, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { EthnicBorder } from './EthnicPattern';
import { Event } from '../App';
import { useTranslations } from '../i18n/translations';

interface CreateEventWizardProps {
  onComplete: (event: Event) => void;
  onBack: () => void;
}

export function CreateEventWizard({ onComplete, onBack }: CreateEventWizardProps) {
  const t = useTranslations();
  const [step, setStep] = useState(1);
  const [isDark, setIsDark] = useState(false);
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    time: '',
    guests: '',
    budget: 100000,
    type: ''
  });

  // Определяем текущую тему
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    // Слушаем изменения темы
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);

  const eventTypes = [
    { id: 'той', key: 'toy' as const, emoji: '🎊' },
    { id: 'wedding', key: 'wedding' as const, emoji: '💒' },
    { id: 'kyz-uzatu', key: 'kyzUzatu' as const, emoji: '👰' },
    { id: 'birthday', key: 'birthday' as const, emoji: '🎂' },
    { id: 'picnic', key: 'picnic' as const, emoji: '🏞️' },
    { id: 'corporate', key: 'corporate' as const, emoji: '🏢' },
    { id: 'other', key: 'other' as const, emoji: '🎉' }
  ];

  const quickGuestOptions = [50, 100, 200, 250, 400, 500];

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      onComplete({
        id: Date.now().toString(),
        ...eventData,
        guests: Number(eventData.guests) || 0
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return eventData.name.trim().length > 0;
      case 2:
        return eventData.date && eventData.time;
      case 3:
        return Number(eventData.guests) > 0;
      case 4:
        return eventData.budget > 0;
      case 5:
        return eventData.type.length > 0;
      default:
        return true;
    }
  };

  // Функция для валидации ввода только цифр
  const MAX_GUESTS = 1000000;
  const MAX_BUDGET = 100000000000000000;

  const handleGuestsInput = (value: string) => {
    // Удаляем все нецифровые символы
    const numericValue = value.replace(/\D/g, '');
    // Применяем лимит
    const limitedValue = numericValue ? Math.min(Number(numericValue), MAX_GUESTS).toString() : '';
    setEventData({ ...eventData, guests: limitedValue });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Header */}
      <div className="bg-card shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <ArrowLeft className="w-6 h-6 text-cyan-700" />
          </button>
          <div className="flex-1 mx-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full ${
                    s <= step ? 'bg-cyan-500' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          <span className="text-muted-foreground">{t.events.stepLabel.replace('{step}', step.toString())}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-cyan-500" />
              <h2 className="mb-2 text-card-foreground">{t.events.eventName}</h2>
              <div className="w-20 mx-auto">
                <EthnicBorder className="text-cyan-400" />
              </div>
            </div>
            <Input
              placeholder={t.events.eventNamePlaceholder}
              value={eventData.name}
              onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
              className="py-6 rounded-xl border-2 border-cyan-200 focus:border-cyan-500"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <h2 className="mb-2 text-card-foreground">{t.events.eventDate} • {t.events.eventTime}</h2>
              <div className="w-20 mx-auto">
                <EthnicBorder className="text-cyan-400" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-muted-foreground">{t.events.dateLabel}</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <Input
                    type="date"
                    value={eventData.date}
                    onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                    className="py-6 pl-12 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 bg-card text-foreground"
                    style={{
                      colorScheme: isDark ? 'dark' : 'light'
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-muted-foreground">{t.events.timeLabel}</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <Input
                    type="time"
                    value={eventData.time}
                    onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                    className="py-6 pl-12 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 bg-card text-foreground"
                    style={{
                      colorScheme: isDark ? 'dark' : 'light'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-indigo-500" />
              <h2 className="mb-2 text-card-foreground">{t.events.guestsCount}</h2>
              <div className="w-20 mx-auto">
                <EthnicBorder className="text-cyan-400" />
              </div>
            </div>
            
            {/* Поле ввода количества гостей */}
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={t.events.guestsPlaceholder}
                value={eventData.guests}
                onChange={(e) => handleGuestsInput(e.target.value)}
                className="py-6 pl-12 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 text-center text-2xl font-bold"
              />
            </div>
            
            {/* Кнопки быстрого ввода */}
            <div className="grid grid-cols-3 gap-3">
              {quickGuestOptions.map((count) => (
                <Button
                  key={count}
                  onClick={() => setEventData({ ...eventData, guests: count.toString() })}
                  variant={eventData.guests === count.toString() ? 'default' : 'outline'}
                  className={`py-4 rounded-xl text-lg font-medium ${
                    eventData.guests === count.toString()
                      ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                      : 'hover:bg-popover hover:border-cyan-400'
                  }`}
                >
                  {count}
                </Button>
              ))}
            </div>


          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <DollarSign className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h2 className="mb-2 text-card-foreground">{t.events.budget}</h2>
              <div className="w-20 mx-auto">
                <EthnicBorder className="text-cyan-400" />
              </div>
            </div>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
              <Input
                type="number"
                placeholder={t.events.budget}
                value={eventData.budget}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  const limitedValue = Math.min(value, MAX_BUDGET);
                  setEventData({ ...eventData, budget: limitedValue });
                }}
                max={MAX_BUDGET}
                className="py-6 pl-12 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 text-center text-2xl font-bold"
              />
            </div>
            <p className="text-center text-muted-foreground">
              {eventData.budget.toLocaleString()} сом
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[50000, 100000, 200000, 300000, 500000, 1000000].map((amount) => (
                <Button
                  key={amount}
                  onClick={() => setEventData({ ...eventData, budget: amount })}
                  variant="outline"
                  className="py-4 rounded-xl hover:bg-popover hover:border-cyan-400"
                >
                  {(amount / 1000).toFixed(0)}k
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="mb-2 text-card-foreground">{t.events.eventType}</h2>
              <div className="w-20 mx-auto">
                <EthnicBorder className="text-cyan-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {eventTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setEventData({ ...eventData, type: type.id })}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    eventData.type === type.id
                      ? 'border-cyan-500 bg-popover shadow-lg scale-105'
                      : 'border-border bg-card hover:border-cyan-300'
                  }`}
                >
                  <div className="text-4xl mb-2">{type.emoji}</div>
                  <div className="text-card-foreground">{t.events.eventTypes[type.key]}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-8">
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step === 5 ? t.events.createEvent : t.common.next}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
