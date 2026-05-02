import { useMemo, useState } from 'react';
import { ArrowLeft, Users, Copy, Check, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { Event, Family, Guest } from '../App';

type RecipientGroup = 'all' | 'family' | 'friends';

const DEFAULT_TEMPLATES = [
  {
    id: 'default',
    title: 'Стандартное',
    text:
      'Приглашаем вас на {event}!\n' +
      'Дата: {date}\n' +
      'Время: {time}\n' +
      '{venueLine}\n' +
      'Будем рады видеть вас!',
  },
  {
    id: 'short',
    title: 'Короткое',
    text: 'Приглашаем на {event}! {date} в {time}. {venueLine}',
  },
  {
    id: 'formal',
    title: 'Официальное',
    text:
      'Уважаемые гости!\n' +
      'Приглашаем вас на мероприятие «{event}».\n' +
      'Дата: {date}\n' +
      'Время: {time}\n' +
      '{venueLine}\n' +
      'С уважением, организаторы.',
  },
];

function buildMessage(template: string, e: Event) {
  const venueLine = e.venue?.name ? `Площадка: ${e.venue.name}` : '';
  return template
    .replaceAll('{event}', e.name)
    .replaceAll('{date}', e.date)
    .replaceAll('{time}', e.time)
    .replaceAll('{venueLine}', venueLine)
    .replaceAll('\n\n', '\n'); // avoid empty line if venue missing
}

function isFriend(g: Guest): boolean {
  const rel = (g.relationshipType || '').toLowerCase();
  return rel.includes('friend') || rel.includes('друг');
}

function normalizePhoneForWhatsapp(phone: string): string | null {
  const digits = (phone || '').replace(/[^\d]/g, '');
  if (!digits) return null;
  // WhatsApp uses international format without '+'
  return digits;
}

function whatsappUrl(phoneDigits: string, text: string): string {
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${phoneDigits}?text=${encoded}`;
}

export function InviteScreen({
  event,
  guests,
  families,
  onMarkInvited,
  onBack,
}: {
  event: Event;
  guests: Guest[];
  families: Family[];
  onMarkInvited: (guestIds: string[]) => void;
  onBack: () => void;
}) {
  const [group, setGroup] = useState<RecipientGroup>('all');
  const [templateId, setTemplateId] = useState(DEFAULT_TEMPLATES[0].id);
  const [customText, setCustomText] = useState('');
  const [justCopied, setJustCopied] = useState(false);

  const selectedGuests = useMemo(() => {
    if (group === 'all') return guests;
    if (group === 'family') return guests.filter((g) => !!g.familyId);
    return guests.filter((g) => isFriend(g));
  }, [group, guests]);

  const template = DEFAULT_TEMPLATES.find((t) => t.id === templateId) ?? DEFAULT_TEMPLATES[0];
  const message = useMemo(() => buildMessage(customText.trim() ? customText : template.text, event), [customText, template.text, event]);

  const invitedCount = selectedGuests.filter((g) => g.invited).length;
  const totalCount = selectedGuests.length;

  const familiesCount = useMemo(() => {
    const ids = new Set(selectedGuests.map((g) => g.familyId).filter(Boolean) as string[]);
    return ids.size;
  }, [selectedGuests]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setJustCopied(true);
      window.setTimeout(() => setJustCopied(false), 1500);
    } catch {
      // ignore (some browsers block clipboard)
    }
  };

  const handleMarkInvited = () => {
    onMarkInvited(selectedGuests.map((g) => g.id));
  };

  const selectedGuestsWithPhones = useMemo(() => {
    return selectedGuests
      .map((g) => ({ guest: g, phoneDigits: g.phone ? normalizePhoneForWhatsapp(g.phone) : null }))
      .filter((x) => !!x.phoneDigits);
  }, [selectedGuests]);

  const startWhatsappSend = async () => {
    if (selectedGuestsWithPhones.length === 0) return;
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      // ignore
    }
    // Open all WhatsApp chats at once
    selectedGuestsWithPhones.forEach((item, index) => {
      // Add small delay to avoid overwhelming the browser
      setTimeout(() => {
        window.open(whatsappUrl(item.phoneDigits as string, message), '_blank', 'noopener,noreferrer');
      }, index * 500); // 500ms delay between each open
    });
    // Mark all as sent (optional, or keep the manual marking)
    // onMarkInvited(selectedGuests.map((g) => g.id));
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-gradient-to-r from-primary to-[#3B6EA5] text-white px-6 py-6">
        <button onClick={onBack} className="mb-4 p-2 hover:bg-white/10 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="mb-1">Приглашения</h1>
        <p className="text-white/80">{event.name}</p>
      </div>

      <div className="px-6 -mt-4 space-y-4">
        <div className="bg-card rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-popover flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground">Получатели</p>
              <p className="text-foreground font-medium">
                {totalCount} гостей{familiesCount ? ` • ${familiesCount} семей` : ''}{invitedCount ? ` • приглашено: ${invitedCount}` : ''}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Button variant={group === 'all' ? 'default' : 'outline'} className="rounded-xl" onClick={() => setGroup('all')}>
              Всем
            </Button>
            <Button variant={group === 'family' ? 'default' : 'outline'} className="rounded-xl" onClick={() => setGroup('family')}>
              Семья
            </Button>
            <Button variant={group === 'friends' ? 'default' : 'outline'} className="rounded-xl" onClick={() => setGroup('friends')}>
              Друзья
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <p className="text-muted-foreground mb-3">Шаблон приглашения</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {DEFAULT_TEMPLATES.map((t) => (
              <Button
                key={t.id}
                variant={templateId === t.id ? 'default' : 'outline'}
                className="rounded-xl"
                onClick={() => setTemplateId(t.id)}
              >
                {t.title}
              </Button>
            ))}
          </div>

          <p className="text-muted-foreground mb-2">Или свой текст</p>
          <Input
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Напишите свой текст (опционально)"
            className="rounded-xl"
          />

          <div className="mt-4">
            <p className="text-muted-foreground mb-2">Предпросмотр</p>
            <div className="bg-popover rounded-xl p-4 whitespace-pre-wrap text-foreground text-sm">
              {message}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button onClick={handleCopy} variant="outline" className="rounded-xl flex-1">
              <Copy className="w-4 h-4 mr-2" />
              {justCopied ? 'Скопировано' : 'Скопировать'}
            </Button>
            <Button onClick={startWhatsappSend} className="rounded-xl flex-1">
              <MessageCircle className="w-4 h-4 mr-2" />
              Отправить в WhatsApp
            </Button>
          </div>

          {selectedGuestsWithPhones.length !== selectedGuests.length && (
            <p className="text-muted-foreground text-xs mt-2">
              В WhatsApp будут отправлены только гости с указанным номером телефона.
            </p>
          )}
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <p className="text-muted-foreground mb-2">Подсказка</p>
          <p className="text-foreground text-sm">
            Нажмите «Отправить в WhatsApp» — откроются чаты со всеми гостями и готовым текстом. Отправьте сообщения в каждом чате.
          </p>
        </div>
      </div>
    </div>
  );
}

export default InviteScreen;

