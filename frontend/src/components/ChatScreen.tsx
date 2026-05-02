import { useState } from 'react';
import { ArrowLeft, Camera, Phone, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Booking, ChatMessage, User } from '../App';

interface ChatScreenProps {
  booking: Booking;
  messages: ChatMessage[];
  currentUser: User | null;
  onSendMessage: (text: string, photoUrl?: string) => void;
  onBack: () => void;
}

export function ChatScreen({
  booking,
  messages,
  currentUser,
  onSendMessage,
  onBack,
}: ChatScreenProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openWhatsApp = () => {
    const phone = currentUser?.role === 'owner'
      ? booking.organizerPhone
      : booking.organizerPhone; // В реальности здесь будет номер владельца
    const cleanPhone = phone.replace(/[^\d]/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    }
  };

  // Group messages by date
  const groupedMessages: { [key: string]: ChatMessage[] } = {};
  messages.forEach((message) => {
    const dateKey = formatDate(message.timestamp);
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }
    groupedMessages[dateKey].push(message);
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-[#2A5A8A] pt-8 pb-4 px-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>

          <Button
            onClick={openWhatsApp}
            size="sm"
            className="bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl"
          >
            <Phone className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
        </div>

        <div>
          <h1 className="text-white mb-1">{booking.eventName}</h1>
          <p className="text-white/80">
            {currentUser?.role === 'owner' ? booking.organizerName : 'Владелец заведения'}
          </p>
        </div>
      </div>

      {/* Booking Info Card */}
      <div className="px-6 py-4 bg-muted/50 flex-shrink-0">
        <Card className="p-3 bg-card">
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-muted-foreground">Дата</p>
              <p className="text-foreground">
                {new Date(booking.date).toLocaleDateString('ru-RU')} в {booking.time}
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Гостей</p>
              <p className="text-foreground">{booking.guestsCount} чел</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Статус</p>
              <p className={`${
                booking.status === 'approved'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-yellow-600 dark:text-yellow-400'
              }`}>
                {booking.status === 'approved' ? 'Подтверждена' : 'Ожидание'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {Object.keys(groupedMessages).length > 0 ? (
          Object.keys(groupedMessages).map((dateKey) => (
            <div key={dateKey}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-4">
                <div className="px-3 py-1 bg-muted rounded-full">
                  <span className="text-muted-foreground">{dateKey}</span>
                </div>
              </div>

              {/* Messages for this date */}
              {groupedMessages[dateKey].map((message) => {
                const isCurrentUser = message.senderId === currentUser?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex mb-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        isCurrentUser
                          ? 'bg-gradient-to-r from-accent to-[#B88A16] text-white rounded-br-sm'
                          : 'bg-card text-foreground rounded-bl-sm'
                      }`}
                    >
                      {!isCurrentUser && (
                        <p className="text-xs text-muted-foreground mb-1">{message.senderName}</p>
                      )}
                      {message.photoUrl && (
                        <img
                          src={message.photoUrl}
                          alt="Attached"
                          className="w-full rounded-lg mb-2"
                        />
                      )}
                      <p className="break-words">{message.text}</p>
                      <p className={`text-xs mt-1 ${isCurrentUser ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Начните общение с организатором</p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 bg-card border-t border-border p-4">
        <div className="max-w-md mx-auto flex gap-2">
          <button className="p-3 hover:bg-muted rounded-full transition-colors">
            <Camera className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Напишите сообщение..."
              className="pr-12 rounded-2xl border-2 focus:border-accent"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={`p-3 rounded-full transition-all ${
              newMessage.trim()
                ? 'bg-gradient-to-r from-accent to-[#B88A16] text-white hover:scale-105'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
