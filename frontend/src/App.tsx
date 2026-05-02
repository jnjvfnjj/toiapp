// App.tsx
import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Moon, Sun } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { GOOGLE_CLIENT_ID } from './config/googleConfig';

// auth screens
import { RoleSelection } from './components/auth/RoleSelection';
import OrganizerAuthChoice from './components/auth/OrganizerAuthChoice';
import OwnerAuthChoice from './components/auth/OwnerAuthChoice';
import OrganizerSignIn from './components/auth/OrganizerSignIn';
import OrganizerRegistrationForm from './components/auth/OrganizerRegistrationForm';
import { OwnerSignIn } from './components/auth/OwnerSignIn';
import { OwnerRegistration } from './components/auth/OwnerRegistration';

// main screens
import { HomeScreen } from './components/HomeScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { BottomNav } from './components/BottomNav';
import { VenueList } from './components/VenueList';
import { BudgetScreen } from './components/BudgetScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { MyVenuesScreen } from './components/MyVenuesScreen';
import { OwnerBookingsScreen } from './components/OwnerBookingsScreen';

// Types
interface BudgetItem {
  id: string;
  category: string;
  amount: number;
  description: string;
}

interface Booking {
  id: string;
  eventName: string;
  venueId: string;
  date: string;
  time: string;
  guestsCount: number;
  organizerName: string;
  organizerPhone: string;
  status: 'pending' | 'approved' | 'cancelled';
}

interface Venue {
  id: string;
  name: string;
  capacity: number;
  price: number;
  location: string | { address: string };
  mainPhoto: string;
  type: string;
  description?: string;
}

function AppContent() {
  const mainRef = React.useRef<HTMLDivElement>(null);
  const [currentScreen, setCurrentScreen] = useState('roleSelection');
  const [isDark, setIsDark] = useState(false);
  const [userRole, setUserRole] = useState<'organizer' | 'owner' | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [language, setLanguage] = useState<'ru' | 'kg' | 'en'>('ru');
  
  // State для BudgetScreen
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [totalBudget, setTotalBudget] = useState(500000);
  
  // State для MyVenuesScreen
  const [myVenues, setMyVenues] = useState<Venue[]>([]);
  
  // State для OwnerBookingsScreen
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // State для пользователя
  const [user, setUser] = useState<any>({
    name: 'Адилет',
    surname: 'Асанбеков',
    email: 'adilet@example.com',
    phone: '+996 700 123 456',
    role: 'organizer'
  });

  // Получаем роль пользователя
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserRole(userData.role);
        setUser(userData);
      } catch (e) {
        console.error(e);
      }
    }
  }, [currentScreen]);

  // Прокрутка
  useEffect(() => {
    window.scrollTo(0, 0);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [currentScreen]);

  // Тема
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const navigateTo = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handleRoleSelection = (role: 'organizer' | 'owner') => {
    setUserRole(role);
    if (role === 'organizer') {
      navigateTo('organizerAuthChoice');
    } else {
      navigateTo('ownerAuthChoice');
    }
  };

  const handleSelectVenue = (venue: any) => {
    setSelectedVenue(venue);
    navigateTo('venueDetail');
  };

  const handleAddBudgetItem = (item: BudgetItem) => {
    setBudgetItems([...budgetItems, item]);
  };

  const handleAddVenue = () => {
    navigateTo('addVenue');
  };

  const handleSelectMyVenue = (venue: Venue) => {
    setSelectedVenue(venue);
    navigateTo('venueDetail');
  };

  const handleUpdateBooking = (bookingId: string, status: 'approved' | 'cancelled') => {
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, status } : b
    ));
  };

  const handleOpenChat = (bookingId: string) => {
    console.log('Open chat for booking:', bookingId);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    setUserRole(null);
    setUser(null);
    navigateTo('roleSelection');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'roleSelection':
        return <RoleSelection onSelectRole={handleRoleSelection} />;
      
      case 'organizerAuthChoice':
        return <OrganizerAuthChoice onBack={() => navigateTo('roleSelection')} onSignIn={() => navigateTo('organizerSignIn')} onRegister={() => navigateTo('organizerRegister')} />;
      
      case 'organizerSignIn':
        return <OrganizerSignIn onBack={() => navigateTo('organizerAuthChoice')} onComplete={() => navigateTo('home')} />;
      
      case 'organizerRegister':
        return <OrganizerRegistrationForm onBack={() => navigateTo('organizerAuthChoice')} onComplete={() => navigateTo('home')} />;
      
      case 'ownerAuthChoice':
        return <OwnerAuthChoice onBack={() => navigateTo('roleSelection')} onSignIn={() => navigateTo('ownerSignIn')} onRegister={() => navigateTo('ownerRegister')} />;
      
      case 'ownerSignIn':
        return <OwnerSignIn onBack={() => navigateTo('ownerAuthChoice')} onComplete={() => navigateTo('home')} />;
      
      case 'ownerRegister':
        return <OwnerRegistration onBack={() => navigateTo('ownerAuthChoice')} onComplete={() => navigateTo('home')} />;
      
      case 'welcome':
        return <WelcomeScreen onCreateEvent={() => navigateTo('createEvent')} onFindVenue={() => navigateTo('venueList')} onNext={() => navigateTo('onboarding')} />;
      
      case 'onboarding':
        return <OnboardingScreen step={1} onNext={() => navigateTo('onboarding2')} onStart={() => navigateTo('home')} />;
      
      case 'onboarding2':
        return <OnboardingScreen step={2} onNext={() => navigateTo('home')} onStart={() => navigateTo('home')} />;
      
      case 'home':
        return <HomeScreen onCreateEvent={() => navigateTo('createEvent')} onMyEvents={() => navigateTo('myEvents')} onFindVenue={() => navigateTo('venueList')} onNavigate={navigateTo} events={[]} user={user} />;
      
      case 'venueList':
        return <VenueList onSelectVenue={handleSelectVenue} onBack={() => navigateTo('home')} />;
      
      case 'venueDetail':
        return (
          <div className="p-4 pb-24">
            <button onClick={() => navigateTo('venueList')} className="mb-4 p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold mb-4">{selectedVenue?.name || 'Детали площадки'}</h1>
            <pre className="bg-gray-100 p-4 rounded-lg">{JSON.stringify(selectedVenue, null, 2)}</pre>
          </div>
        );
      
      case 'budget':
        return <BudgetScreen budgetItems={budgetItems} totalBudget={totalBudget} onAddItem={handleAddBudgetItem} onBack={() => navigateTo('home')} />;
      
      case 'profile':
        return <ProfileScreen user={user} language={language} onBack={() => navigateTo('home')} onLogout={handleLogout} onNavigateToSettings={() => navigateTo('settings')} onNavigateToLanguage={() => navigateTo('language')} onNavigateToSupport={() => navigateTo('support')} />;
      
      case 'myVenues':
        return <MyVenuesScreen venues={myVenues} onAddVenue={handleAddVenue} onSelectVenue={handleSelectMyVenue} onBack={() => navigateTo('home')} />;
      
      case 'ownerBookings':
        return <OwnerBookingsScreen bookings={bookings} venues={myVenues} onUpdateBooking={handleUpdateBooking} onOpenChat={handleOpenChat} onBack={() => navigateTo('home')} />;
      
      case 'ownerProfile':
        return <ProfileScreen user={user} language={language} onBack={() => navigateTo('home')} onLogout={handleLogout} onNavigateToSettings={() => navigateTo('settings')} onNavigateToLanguage={() => navigateTo('language')} onNavigateToSupport={() => navigateTo('support')} />;
      
      case 'createEvent':
        return <div className="p-4 pb-24"><h1 className="text-2xl font-bold">Создание события</h1><button onClick={() => navigateTo('home')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Назад</button></div>;
      
      case 'myEvents':
        return <div className="p-4 pb-24"><h1 className="text-2xl font-bold">Мои события</h1><button onClick={() => navigateTo('home')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Назад</button></div>;
      
      case 'settings':
        return <div className="p-4 pb-24"><h1 className="text-2xl font-bold">Настройки</h1><button onClick={() => navigateTo('profile')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Назад</button></div>;
      
      case 'language':
        return <div className="p-4 pb-24"><h1 className="text-2xl font-bold">Выбор языка</h1><button onClick={() => navigateTo('profile')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Назад</button></div>;
      
      case 'support':
        return <div className="p-4 pb-24"><h1 className="text-2xl font-bold">Поддержка</h1><button onClick={() => navigateTo('profile')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Назад</button></div>;
      
      case 'addVenue':
        return <div className="p-4 pb-24"><h1 className="text-2xl font-bold">Добавление площадки</h1><button onClick={() => navigateTo('myVenues')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Назад</button></div>;
      
      default:
        return <RoleSelection onSelectRole={handleRoleSelection} />;
    }
  };

  const showNav = userRole && ['home', 'venueList', 'budget', 'profile', 'myVenues', 'ownerBookings', 'ownerProfile', 'createEvent', 'myEvents'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div ref={mainRef} className="max-w-md mx-auto min-h-screen relative pb-20">
        <button
          onClick={() => setIsDark(!isDark)}
          className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white shadow dark:bg-gray-800 flex items-center justify-center"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        {renderScreen()}
        
        {showNav && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={navigateTo}
            isOwner={userRole === 'owner'}
          />
        )}
        
        <Toaster />
      </div>
    </div>
  );
}

// Импортируем ArrowLeft для venueDetail
import { ArrowLeft } from 'lucide-react';

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppContent />
    </GoogleOAuthProvider>
  );
}