import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { EthnicPattern } from './EthnicPattern';
import { motion, AnimatePresence } from 'motion/react';
import type { Language } from '../i18n/translations';
import { useTranslations } from '../i18n/translations';

interface Message {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
}

interface SupportScreenProps {
  language: Language;
  onBack: () => void;
}

export function SupportScreen({ language, onBack }: SupportScreenProps) {
  const t = useTranslations(language);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t.support.aiGreeting,
      isAI: true,
      timestamp: new Date(),
    },
    {
      id: '2',
      text: t.support.aiHelp,
      isAI: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const faqQuestions = [
    t.support.faq1,
    t.support.faq2,
    t.support.faq3,
    t.support.faq4,
    t.support.faq5,
    t.support.faq6,
  ];

  const getAIResponse = (question: string): string => {
    const responses: Record<string, Record<string, string>> = {
      ru: {
        'Как создать мероприятие?': 'Для создания мероприятия нажмите на кнопку "Создать мероприятие" на главном экране. Заполните информацию о мероприятии: название, дату, время, количество гостей и бюджет. После этого вы сможете выбрать площадку и добавить гостей.',
        'Как забронировать площадку?': 'Перейдите в раздел "Найти площадку", выберите подходящую площадку из списка. Ознакомьтесь с деталями, ценой и доступностью. Нажмите "Забронировать" и подтвердите бронирование.',
        'Как добавить гостей?': 'В панели мероприятия выберите раздел "Гости". Нажмите "Добавить гостя" и заполните информацию: имя, фамилию, телефон. Вы можете группировать гостей по семьям для удобства.',
        'Как управлять бюджетом?': 'В разделе "Бюджет" вы можете отслеживать все расходы на мероприятие. Добавляйте расходы по категориям: площадка, еда, декор, музыка и фото. Система автоматически покажет остаток бюджета.',
        'Как связаться с владельцем?': 'После создания брони вы можете открыть чат с владельцем площадки прямо в приложении. Также доступен контакт через WhatsApp.',
        'Как изменить данные профиля?': 'Перейдите в "Профиль" → "Настройки" → "Редактировать профиль". Здесь вы можете изменить имя, фамилию, телефон, email и фото профиля.',
      },
      kg: {
        'Иш-чараны кантип түзүү керек?': 'Иш-чара түзүү үчүн башкы экрандагы "Иш-чара түзүү" баскычын басыңыз. Иш-чара жөнүндө маалымат толтуруңуз: аталышы, датасы, убактысы, конок саны жана бюджет. Андан кийин сиз жайды тандап, конокторду кошо аласыз.',
        'Жайды кантип брондоо керек?': '"Жай табуу" бөлүмүнө өтүңүз, тизмеден ылайыктуу жайды тандаңыз. Деталдар, баа жана жеткиликтүүлүк менен таанышыңыз. "Брондоо" баскычын басып, брондоону ырастаңыз.',
        'Конокторду кантип кошуу керек?': 'Иш-чара панелинде "Конок" бөлүмүн тандаңыз. "Конок кошуу" баскычын басып, маалымат толтуруңуз: аты, фамилиясы, телефон. Ыңгайлуу болушу үчүн конокторду үй-бүлөлөр боюнча топтой аласыз.',
        'Бюджетти кантип башкаруу керек?': '"Бюджет" бөлүмүндө сиз иш-чарага чыгымдардын баарын көзөмөлдөй аласыз. Категориялар боюнча чыгымдарды кошуңуз: жай, тамак, безендирүү, музыка жана сүрөт. Система автоматтык түрдө бюджеттин калдыгын көрсөтөт.',
        'Жай ээси менен кантип байланышуу керек?': 'Брондоо түзгөндөн кийин сиз тике тиркемеде жай ээси менен чатты аче аласыз. Ошондой эле WhatsApp аркылуу байланышуу мүмкүн.',
        'Профиль маалыматтарын кантип өзгөртүү керек?': '"Профиль" → "Тууралоолор" → "Профилди түзөтүү" бөлүмүнө өтүңүз. Бул жерде аты, фамилиясы, телефон, email жана профиль сүрөтүн өзгөртө аласыз.',
      },
      en: {
        'How to create an event?': 'To create an event, click the "Create Event" button on the home screen. Fill in the event information: name, date, time, guest count, and budget. After that, you can select a venue and add guests.',
        'How to book a venue?': 'Go to the "Find Venue" section, select a suitable venue from the list. Review the details, price, and availability. Click "Book" and confirm the booking.',
        'How to add guests?': 'In the event dashboard, select the "Guests" section. Click "Add Guest" and fill in the information: first name, last name, phone. You can group guests by families for convenience.',
        'How to manage budget?': 'In the "Budget" section, you can track all expenses for the event. Add expenses by categories: venue, food, decor, music, and photo. The system will automatically show the remaining budget.',
        'How to contact venue owner?': 'After creating a booking, you can open a chat with the venue owner directly in the app. You can also contact them via WhatsApp.',
        'How to edit profile data?': 'Go to "Profile" → "Settings" → "Edit Profile". Here you can change your first name, last name, phone, email, and profile photo.',
      },
    };

    const langResponses = responses[language] || responses['en'];
    return langResponses[question] || 'Спасибо за ваш вопрос! Я постараюсь помочь вам. Пожалуйста, выберите один из частых вопросов или опишите вашу проблему подробнее.';
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isAI: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(text),
        isAI: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleFAQClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
            <h1 className="flex-1 text-center">{t.support.title}</h1>
            <div className="w-10" />
          </div>
          
          <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <p className="font-medium">{t.support.chatWithAI}</p>
              <p className="text-[#A7D8F0] text-sm">AI Assistant</p>
            </div>
            <Sparkles className="w-5 h-5 ml-auto text-accent animate-pulse" />
          </div>
        </div>
      </div>

      {/* FAQ Cards */}
      <div className="px-6 py-4 border-b border-border bg-card">
        <h3 className="text-muted-foreground mb-3">{t.support.faqTitle}</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {faqQuestions.map((question, index) => (
            <motion.button
              key={index}
              onClick={() => handleFAQClick(question)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors whitespace-nowrap"
            >
              {question}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex gap-3 ${!message.isAI ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.isAI
                    ? 'bg-gradient-to-br from-primary to-[#3B6EA5] text-white'
                    : 'bg-accent text-white'
                }`}
              >
                {message.isAI ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              {/* Message bubble */}
              <div className={`flex-1 max-w-[75%] ${!message.isAI ? 'flex justify-end' : ''}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.isAI
                      ? 'bg-card text-card-foreground shadow-sm'
                      : 'bg-primary text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isAI ? 'text-muted-foreground' : 'text-white/70'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString(language === 'ru' ? 'ru-RU' : language === 'kg' ? 'ky-KG' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputText);
              }
            }}
            placeholder={t.support.typeMessage}
            className="flex-1 rounded-full border-border bg-background"
          />
          <Button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim()}
            className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-white p-0 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
