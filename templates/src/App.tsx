import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { BottomNav } from './components/BottomNav';
import type { Language } from './i18n/translations';
import { Toaster } from './components/ui/sonner';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { useTranslations } from './i18n/translations';

// Auth screens
import { RoleSelection } from './components/auth/RoleSelection';
import { PhoneAuth } from './components/auth/PhoneAuth';
import OwnerAuthChoice from './components/auth/OwnerAuthChoice';
import { OrganizerRegistration } from './components/auth/OrganizerRegistration';
import { OwnerRegistration } from './components/auth/OwnerRegistration';
import { OwnerGoogleRegister } from './components/auth/OwnerGoogleRegister';
import { OwnerSignIn } from './components/auth/OwnerSignIn';

// Main app screens
import { WelcomeScreen } from './components/WelcomeScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { HomeScreen } from './components/HomeScreen';
import { CreateEventWizard } from './components/CreateEventWizard';
import { VenueList } from './components/VenueList';
import { VenueDetail } from './components/VenueDetail';
import { EventDashboard } from './components/EventDashboard';
import { GuestsScreen } from './components/GuestsScreen';
import { BudgetScreen } from './components/BudgetScreen';
import { BudgetEventsScreen } from './components/BudgetEventsScreen';
import { ProfileScreen } from './components/ProfileScreen';
// DesignSystem removed
import { MyEventsScreen } from './components/MyEventsScreen';

import { FamilyDetailScreen } from './components/FamilyDetailScreen';

// Owner screens
import { OwnerDashboard } from './components/OwnerDashboard';
import { AddVenueScreen } from './components/AddVenueScreen';
import { MyVenuesScreen } from './components/MyVenuesScreen';
import { OwnerBookingsScreen } from './components/OwnerBookingsScreen';
import { ChatScreen } from './components/ChatScreen';

// Settings and utility screens
import { SettingsScreen } from './components/SettingsScreen';
import { SupportScreen } from './components/SupportScreen';
import { LanguageSelector } from './components/LanguageSelector';
import { getUser, getAccessToken, setTokens, setUser as setStoredUser, clearAuth, api } from './api';
import type { VerifyResult } from './components/auth/PhoneAuth';
import { toast } from 'sonner';

export interface User {
  id: string;
  role: 'organizer' | 'owner';
  name: string;
  surname?: string;
  phone?: string;
  email?: string;
  photoUrl?: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  budget: number;
  type: string;
  venue?: any;
  ownerId: string;
}

export interface Guest {
  id: string;
  eventId: string; // Привязка к конкретному мероприятию
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  familyId?: string;
  role?: 'head' | 'parent' | 'child' | 'relative' | 'other';
  rsvpStatus?: 'confirmed' | 'maybe' | 'declined' | 'pending';
  photoUrl?: string;
  relationshipType?: string; // мать, отец, брат, сестра и т.д.
}

export interface Family {
  id: string;
  lastName: string;
  headOfFamilyId?: string;
  memberIds: string[];
  contactPhone?: string;
  photoUrl?: string;
  notes?: string;
}

export interface BudgetItem {
  id: string;
  eventId: string; // Привязка к конкретному мероприятию
  category: 'venue' | 'food' | 'decor' | 'music' | 'photo' | 'other';
  amount: number;
  description: string;
  date?: string;
}

/** Удобства заведения — владелец отмечает, что есть */
export interface VenueAmenities {
  music?: boolean;
  catering?: boolean;
  parking?: boolean;
  ac?: boolean;
  decor?: boolean;
  photo?: boolean;
}

export interface Venue {
  id: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  description: string;
  photos: string[];
  mainPhoto: string;
  ownerId: string;
  whatsapp: string;
  phone: string;
  /** Удобства: что есть в заведении (указывает владелец при добавлении) */
  amenities?: VenueAmenities;
}

export interface Booking {
  id: string;
  venueId: string;
  eventId: string;
  organizerId: string;
  organizerName: string;
  organizerPhone: string;
  eventName: string;
  date: string;
  time: string;
  guestsCount: number;
  status: 'pending' | 'approved' | 'cancelled';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  photoUrl?: string;
}

interface BackendEvent {
  id: number;
  title: string;
  date: string;
  start_time: string;
  end_time?: string;
  organizer: number;
  venue: number | null;
  venue_name?: string;
  guest_count?: number;
}

interface BackendVenue {
  id: number;
  name: string;
  address: string;
  description: string;
  owner: number | null;
  capacity: number;
  price_per_hour: number | string;
  photos: string[];
  amenities?: unknown;
  phone?: string;
  whatsapp?: string;
}

interface BackendBooking {
  id: number;
  user: number;
  event: number;
  venue: number;
  status: 'pending' | 'approved' | 'cancelled' | 'rejected';
  created_at: string;
  user_name?: string;
  user_phone?: string;
  event_title?: string;
  event_date?: string;
  event_start_time?: string;
  event_guest_count?: number;
}

interface BackendUser {
  id: number;
  email: string;
  username: string;
  phone: string;
  role: 'admin' | 'user' | 'organizer' | 'owner';
}

function AppContent() {
  const extractApiErrorMessage = (err: unknown, fallback: string): string => {
    if (!err || typeof err !== 'object') return fallback;
    const maybe = err as { message?: string; data?: unknown };
    if (typeof maybe.message === 'string' && maybe.message.trim()) return maybe.message;
    if (maybe.data && typeof maybe.data === 'object') {
      const entries = Object.entries(maybe.data as Record<string, unknown>);
      for (const [field, value] of entries) {
        if (Array.isArray(value) && value.length > 0) {
          return `${field}: ${String(value[0])}`;
        }
        if (typeof value === 'string') {
          return `${field}: ${value}`;
        }
      }
    }
    return fallback;
  };

  const mapRole = (role?: string): 'organizer' | 'owner' => {
    if (role === 'owner') return 'owner';
    return 'organizer';
  };

  const mapBackendUser = (u: BackendUser, profile?: { name?: string; surname?: string; photoUrl?: string }): User => ({
    id: String(u.id),
    role: mapRole(u.role),
    name: profile?.name ?? u.username,
    surname: profile?.surname,
    phone: u.phone,
    email: u.email,
    photoUrl: profile?.photoUrl,
  });

  const { language, setLanguage } = useLanguage();
  const t = useTranslations(language);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('toi-app-theme');
    return saved === 'dark';
  });
  const [screen, setScreen] = useState('roleSelection');
  const [user, setUser] = useState<User | null>(null);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  
  // Sample data - preloaded
  const [guests, setGuests] = useState<Guest[]>([
  ]);

  const [families, setFamilies] = useState<Family[]>([]);
  
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  
  const [events, setEvents] = useState<Event[]>([]);

  // Owner-specific state
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  // Restore user from localStorage (backend tokens + user)
  useEffect(() => {
    const token = getAccessToken();
    const saved = getUser();
    if (token && saved) {
      const profileRaw = localStorage.getItem('toi-profile');
      const profile = profileRaw ? (() => { try { return JSON.parse(profileRaw); } catch { return {}; } })() : {};
      setUser(mapBackendUser(saved as BackendUser, profile));
      setScreen('home');
    }
  }, []);

  // Load events (organizer) and venues from backend when user is set
  useEffect(() => {
    if (!user?.id || !getAccessToken()) return;
    const load = async () => {
      try {
        if (user.role === 'organizer') {
          const data = await api.get<{ results?: BackendEvent[] }>(`events/`);
          const list = Array.isArray(data) ? data : (data.results ?? []);
          setEvents(list.map((e: BackendEvent) => ({
            id: String(e.id),
            name: e.title,
            date: e.date,
            time: (e.start_time || '').slice(0, 5),
            guests: e.guest_count ?? 0,
            budget: 0,
            type: '',
            venue: e.venue ? { id: e.venue, name: e.venue_name } : undefined,
            ownerId: String(e.organizer),
          })));
        }
        const venueData = await api.get<{ results?: BackendVenue[] } | BackendVenue[]>(`venues/`);
        const venueList = Array.isArray(venueData) ? venueData : (venueData.results ?? []);
        setVenues(venueList.map((v: BackendVenue) => ({
          id: String(v.id),
          name: v.name,
          type: 'venue',
          price: Number(v.price_per_hour),
          capacity: v.capacity,
          location: { lat: 0, lng: 0, address: v.address },
          description: v.description || '',
          photos: Array.isArray(v.photos) ? v.photos : [],
          mainPhoto: (Array.isArray(v.photos) && v.photos[0]) ? v.photos[0] : '',
          ownerId: v.owner ? String(v.owner) : '',
          whatsapp: v.whatsapp || '',
          phone: v.phone || '',
        })));
        const bookingData = await api.get<{ results?: BackendBooking[] } | BackendBooking[]>(`bookings/`);
        const bookingList = Array.isArray(bookingData) ? bookingData : (bookingData.results ?? []);
        setBookings(
          bookingList.map((b) => ({
            id: String(b.id),
            venueId: String(b.venue),
            eventId: String(b.event),
            organizerId: String(b.user),
            organizerName: b.user_name || 'Organizer',
            organizerPhone: b.user_phone || '',
            eventName: b.event_title || 'Event',
            date: b.event_date || new Date().toISOString().slice(0, 10),
            time: (b.event_start_time || '00:00:00').slice(0, 5),
            guestsCount: b.event_guest_count || 0,
            status: b.status === 'rejected' ? 'cancelled' : b.status,
            createdAt: b.created_at,
          }))
        );
      } catch {
        // ignore: e.g. 401 or network
      }
    };
    load();
  }, [user?.id, user?.role]);

  // Toggle dark mode
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }
    localStorage.setItem('toi-app-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('toi-app-language', language);
  }, [language]);

  const navigateTo = (screenName: string, data?: { event?: Event; venue?: Venue; familyId?: string; phone?: string; email?: string; name?: string; mode?: string }) => {
    setHistory((h) => [...h, screen]);
    setScreen(screenName);
    if (data?.event) setCurrentEvent(data.event);
    if (data?.venue) setSelectedVenue(data.venue);
    if (data?.familyId) setSelectedFamilyId(data.familyId);
  };

  const [history, setHistory] = useState<string[]>([]);

  const defaultBackMap: Record<string, string> = {
    venueList: 'home',
    venueDetail: 'venueList',
    budget: 'eventDashboard',
    profile: 'home',
    ownerBookings: 'ownerDashboard',
    myVenues: 'ownerDashboard',
    chat: 'ownerBookings',
  };

  const goBack = () => {
    setHistory((prev) => {
      if (prev.length > 0) {
        const last = prev[prev.length - 1];
        const newHist = prev.slice(0, -1);
        setScreen(last);
        return newHist;
      }

      const fallback = defaultBackMap[screen];
      if (fallback) {
        setScreen(fallback);
        return [];
      }

      setScreen('home');
      return [];
    });
  };

  const handleRoleSelection = (role: 'organizer' | 'owner') => {
    if (role === 'organizer') {
      navigateTo('phoneAuth');
    } else {
      navigateTo('ownerAuthChoice');
    }
  };

  const handlePhoneVerified = (data: VerifyResult) => {
    const u = data.user;
    setUser(mapBackendUser(u as BackendUser));
    if (data.isNewUser) {
      navigateTo('organizerRegistration', { phone: data.phone });
    } else {
      navigateTo('home');
    }
  };

  const handleGoogleAuth = (email: string, name: string) => {
    // After Google OAuth, offer register or sign-in for owners
    navigateTo('ownerAuthChoice', { email, name });
  };

  const handleOwnerGoogleRegister = async (data: { email: string; name: string; password: string }) => {
    try {
      const res = await api.post<{ user: BackendUser; access: string; refresh: string }>('register/', {
        email: data.email,
        username: data.name,
        phone: '',
        password: data.password,
        role: 'owner',
      });
      setTokens(res.access, res.refresh);
      setStoredUser(res.user);
      setUser(mapBackendUser(res.user));
      navigateTo('home');
    } catch (err: unknown) {
      const msg = extractApiErrorMessage(err, 'Registration failed');
      toast.error(msg);
    }
  };

  const handleOwnerSignIn = async (data: { email: string; password: string }) => {
    try {
      const auth = await api.post<{ access: string; refresh: string }>('token/', data);
      setTokens(auth.access, auth.refresh);
      const profile = await api.get<BackendUser>('profile/');
      setStoredUser(profile);
      setUser(mapBackendUser(profile));
      navigateTo('home');
    } catch (err: unknown) {
      const msg = extractApiErrorMessage(err, 'Login failed');
      toast.error(msg);
    }
  };

  const handleOrganizerRegistered = (userData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, name: userData.name ?? prev.name, surname: userData.surname, photoUrl: userData.photoUrl };
      localStorage.setItem('toi-profile', JSON.stringify({ name: next.name, surname: next.surname, photoUrl: next.photoUrl }));
      return next;
    });
    navigateTo('home');
  };

  const handleOwnerRegistered = async (userData: Partial<User> & { password?: string }) => {
    try {
      const response = await api.post<{ user: BackendUser; access: string; refresh: string }>('register/', {
        email: userData.email,
        username: userData.name,
        phone: userData.phone || '',
        password: userData.password,
        role: 'owner',
      });
      setTokens(response.access, response.refresh);
      setStoredUser(response.user);
      const profile = { name: userData.name, surname: userData.surname, photoUrl: userData.photoUrl };
      localStorage.setItem('toi-profile', JSON.stringify(profile));
      setUser(mapBackendUser(response.user, profile));
      navigateTo('home');
    } catch (err: unknown) {
      const msg = extractApiErrorMessage(err, 'Registration failed');
      toast.error(msg);
    }
  };

  const createEvent = async (eventData: Event) => {
    if (!user) return;
    const [h = 12, m = 0] = (eventData.time || '12:00').split(':').map(Number);
    const endH = (h + 2) % 24;
    const startTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
    const endTime = `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
    const body = {
      title: eventData.name,
      description: eventData.type || '',
      date: eventData.date,
      start_time: startTime,
      end_time: endTime,
      venue: selectedVenue?.id ? Number(selectedVenue.id) : null,
      status: 'draft',
      guest_count: eventData.guests || 0,
    };
    const e = await api.post<BackendEvent>('events/', body);
    const newEvent: Event = {
      id: String(e.id),
      name: e.title,
      date: e.date,
      time: (e.start_time || '').slice(0, 5),
      guests: e.guest_count ?? 0,
      budget: 0,
      type: eventData.type || '',
      venue: selectedVenue ?? undefined,
      ownerId: user.id,
    };
    setEvents((prev) => [...prev, newEvent]);
    setCurrentEvent(newEvent);
    setSelectedVenue(null);
    setSelectedFamilyId(null);
    navigateTo('eventDashboard');
  };

  const updateEvent = (eventData: Partial<Event>) => {
    if (currentEvent) {
      const updatedEvent = { ...currentEvent, ...eventData };
      setCurrentEvent(updatedEvent);
      setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    }
  };

  const addGuest = (guest: Guest) => {
    if (!currentEvent) return;
    
    const guestId = Date.now().toString();
    let familyId = guest.familyId;
    
    // Если familyId не указан, ищем или создаем семью по фамилии
    if (!familyId && guest.lastName) {
      // Ищем существующую семью по фамилии (с учетом разных окончаний)
      const existingFamily = families.find(f => {
        const familyLastName = f.lastName.toLowerCase();
        const guestLastName = guest.lastName.toLowerCase();
        return familyLastName === guestLastName ||
               familyLastName === guestLastName + 'ы' ||
               familyLastName === guestLastName + 'евы' ||
               familyLastName === guestLastName + 'овы' ||
               guestLastName === familyLastName.replace(/ы$|евы$|овы$/, '');
      });
      
      if (existingFamily) {
        familyId = existingFamily.id;
        // Обновляем семью, добавляя нового члена
        setFamilies(families.map(f => 
          f.id === familyId 
            ? { ...f, memberIds: [...f.memberIds, guestId] }
            : f
        ));
      } else {
        // Создаем новую семью
        const newFamilyId = `family_${Date.now()}`;
        familyId = newFamilyId;
        
        // Формируем фамилию семьи (добавляем окончание, если его нет)
        let familyLastName = guest.lastName;
        if (!familyLastName.match(/ы$|евы$|овы$/i)) {
          // Простое добавление окончания "ы" для кыргызских фамилий
          familyLastName = guest.lastName + 'ы';
        }
        
        const newFamily: Family = {
          id: newFamilyId,
          lastName: familyLastName,
          headOfFamilyId: guestId, // Первый добавленный становится главой семьи
          memberIds: [guestId],
          contactPhone: guest.phone || undefined
        };
        
        setFamilies([...families, newFamily]);
      }
    } else if (familyId) {
      // Если familyId указан, обновляем семью, добавляя нового члена
      setFamilies(families.map(f => 
        f.id === familyId 
          ? { ...f, memberIds: [...f.memberIds, guestId] }
          : f
      ));
    }
    
    // Добавляем гостя с правильным familyId
    setGuests([...guests, { 
      ...guest, 
      id: guestId, 
      eventId: currentEvent.id,
      familyId: familyId 
    }]);
  };

  const addBudgetItem = (item: BudgetItem, eventId?: string) => {
    const targetEventId = eventId || currentEvent?.id;
    if (!targetEventId) return;
    setBudgetItems([...budgetItems, { ...item, id: Date.now().toString(), eventId: targetEventId }]);
  };

  // Owner functions
  const addVenue = async (venueData: Omit<Venue, 'id'>) => {
    const body = {
      name: venueData.name,
      description: venueData.description || '',
      address: venueData.location?.address || '',
      capacity: venueData.capacity || 0,
      price_per_hour: venueData.price || 0,
      amenities: venueData.amenities ? Object.keys(venueData.amenities).filter((k) => (venueData.amenities as Record<string, boolean>)[k]) : [],
      photos: Array.isArray(venueData.photos) ? venueData.photos : [],
      phone: venueData.phone || '',
      whatsapp: venueData.whatsapp || '',
      is_active: true,
    };
    const v = await api.post<BackendVenue>('venues/', body);
    const newVenue: Venue = {
      ...venueData,
      id: String(v.id),
      photos: Array.isArray(v.photos) ? v.photos : [],
      mainPhoto: (Array.isArray(v.photos) && v.photos[0]) ? v.photos[0] : '',
      ownerId: v.owner ? String(v.owner) : user?.id || '',
    };
    setVenues((prev) => [...prev, newVenue]);
    navigateTo('ownerDashboard');
  };

  const createBooking = async (venueData: Venue) => {
    if (!currentEvent || !user) return;
    const b = await api.post<BackendBooking>('bookings/', {
      event: Number(currentEvent.id),
      venue: Number(venueData.id),
      status: 'pending',
    });
    const newBooking: Booking = {
      id: String(b.id),
      venueId: String(b.venue),
      eventId: String(b.event),
      organizerId: String(b.user),
      organizerName: b.user_name || `${user.name} ${user.surname || ''}`.trim(),
      organizerPhone: b.user_phone || user.phone || '',
      eventName: b.event_title || currentEvent.name,
      date: b.event_date || currentEvent.date,
      time: (b.event_start_time || `${currentEvent.time}:00`).slice(0, 5),
      guestsCount: b.event_guest_count || currentEvent.guests,
      status: b.status === 'rejected' ? 'cancelled' : b.status,
      createdAt: b.created_at,
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  const updateBookingStatus = async (bookingId: string, status: 'approved' | 'cancelled') => {
    await api.patch(`bookings/${bookingId}/`, { status });
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status } : b));
  };

  const sendChatMessage = (bookingId: string, text: string, photoUrl?: string) => {
    if (!user) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      bookingId,
      senderId: user.id,
      senderName: `${user.name} ${user.surname || ''}`.trim(),
      text,
      timestamp: new Date().toISOString(),
      photoUrl,
    };
    setChatMessages([...chatMessages, newMessage]);
  };
  
  const renderScreen = () => {
    // Auth flow
    if (screen === 'roleSelection') {
      return <RoleSelection onSelectRole={handleRoleSelection} />;
    }
    if (screen === 'phoneAuth') {
      return (
        <PhoneAuth
          onVerified={handlePhoneVerified}
          onBack={() => navigateTo('roleSelection')}
        />
      );
    }

    if (screen === 'ownerAuthChoice') {
      return (
        <OwnerAuthChoice
          onBack={() => navigateTo('roleSelection')}
          onGoogleRegister={() => navigateTo('ownerGoogleRegister')}
          onSignIn={() => navigateTo('ownerSignIn')}
          onRegister={() => navigateTo('ownerRegistration', { mode: 'register' })}
        />
      );
    }
    if (screen === 'ownerGoogleRegister') {
      return (
        <OwnerGoogleRegister
          onComplete={handleOwnerGoogleRegister}
          onBack={() => navigateTo('ownerAuthChoice')}
        />
      );
    }
    if (screen === 'ownerSignIn') {
      return (
        <OwnerSignIn
          onComplete={handleOwnerSignIn}
          onBack={() => navigateTo('ownerAuthChoice')}
        />
      );
    }
    if (screen === 'organizerRegistration') {
      return (
        <OrganizerRegistration
          onComplete={handleOrganizerRegistered}
          onBack={() => navigateTo('phoneAuth')}
        />
      );
    }
    if (screen === 'ownerRegistration') {
      return (
        <OwnerRegistration
          onComplete={handleOwnerRegistered}
          onBack={() => navigateTo('ownerAuthChoice')}
        />
      );
    }

    // Main app screens
    // DesignSystem screen removed

    switch (screen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onCreateEvent={() => navigateTo('createEvent')}
            onFindVenue={() => navigateTo('venueList')}
            onNext={() => {
              setOnboardingStep(1);
              navigateTo('onboarding');
            }}
          />
        );
      case 'onboarding':
        return (
          <OnboardingScreen
            step={onboardingStep}
            onNext={() => {
              if (onboardingStep < 2) {
                setOnboardingStep(onboardingStep + 1);
              } else {
                navigateTo('home');
              }
            }}
            onStart={() => navigateTo('home')}
          />
        );
      case 'home':
        // Different home for owner vs organizer
        if (user?.role === 'owner') {
          return (
            <OwnerDashboard
              user={user}
              venues={venues.filter(v => v.ownerId === user.id)}
              bookings={bookings.filter(b => venues.some(v => v.id === b.venueId && v.ownerId === user.id))}
              onNavigate={navigateTo}
            />
          );
        }
        return (
          <HomeScreen
            onCreateEvent={() => navigateTo('createEvent')}
            onMyEvents={() => navigateTo('myEvents')}
            onFindVenue={() => navigateTo('venueList')}
            onNavigate={navigateTo}
            events={events}
            user={user}
          />
        );
      case 'myEvents':
        return (
          <MyEventsScreen
            events={events}
            onSelectEvent={(event) => {
              setCurrentEvent(event);
              // Очищаем выбранные данные при переключении между мероприятиями
              setSelectedVenue(null);
              setSelectedFamilyId(null);
              navigateTo('eventDashboard');
            }}
            onCreateEvent={() => navigateTo('createEvent')}
            onBack={() => navigateTo('home')}
          />
        );
      case 'createEvent':
        return (
          <CreateEventWizard
            onComplete={createEvent}
            onBack={() => navigateTo('home')}
          />
        );
      case 'venueList':
        return (
          <VenueList
            venuesFromApi={venues}
            onSelectVenue={(venue) => navigateTo('venueDetail', { venue })}
            onBack={() => navigateTo('home')}
          />
        );
      case 'venueDetail':
        if (!selectedVenue) {
          const backScreen = user?.role === 'owner' ? 'ownerDashboard' : 'venueList';
          return (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">{t.common.venueNotSelected}</p>
              <button
                onClick={() => navigateTo(backScreen)}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
              >
                {t.common.back}
              </button>
            </div>
          );
        }
        const isOwnerViewingOwnVenue = user?.role === 'owner';
        return (
          <VenueDetail
            venue={selectedVenue}
            onBack={() => navigateTo(isOwnerViewingOwnVenue ? 'ownerDashboard' : 'venueList')}
            onSelect={() => {
              if (currentEvent) {
                updateEvent({ venue: selectedVenue });
              }
              navigateTo('eventDashboard');
            }}
            isOwnerView={isOwnerViewingOwnVenue}
          />
        );
      case 'eventDashboard':
        const currentEventGuests = currentEvent ? guests.filter(g => g.eventId === currentEvent.id) : [];
        const currentEventBudgetItems = currentEvent ? budgetItems.filter(b => b.eventId === currentEvent.id) : [];
        return (
          <EventDashboard
            event={currentEvent}
            onNavigate={navigateTo}
            guests={currentEventGuests}
            budgetItems={currentEventBudgetItems}
            onBack={() => navigateTo('home')}
          />
        );
      case 'guests':
        const currentEventGuestsForScreen = currentEvent ? guests.filter(g => g.eventId === currentEvent.id) : [];
        return (
          <GuestsScreen
            guests={currentEventGuestsForScreen}
            families={families}
            onAddGuest={addGuest}
            onViewFamily={(familyId) => {
              navigateTo('familyDetail', { familyId });
            }}
            onBack={() => navigateTo('eventDashboard')}
          />
        );
      case 'familyDetail':
        const selectedFamily = families.find(f => f.id === selectedFamilyId);
        const currentEventGuestsForFamily = currentEvent ? guests.filter(g => g.eventId === currentEvent.id) : [];
        if (!selectedFamily) {
          return (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">{t.common.familyNotFound}</p>
              <button
                onClick={() => navigateTo('guests')}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
              >
                {t.common.back}
              </button>
            </div>
          );
        }
        return (
          <FamilyDetailScreen
            family={selectedFamily}
            guests={currentEventGuestsForFamily}
            onBack={() => navigateTo('guests')}
          />
        );
      case 'eventBudget':
        // Бюджет конкретного мероприятия из EventDashboard
        const eventBudgetItems = currentEvent ? budgetItems.filter(b => b.eventId === currentEvent.id) : [];
        if (!currentEvent) {
          return (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">{t.common.notFound}</p>
              <button
                onClick={() => navigateTo('home')}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
              >
                {t.common.back}
              </button>
            </div>
          );
        }
        return (
          <BudgetScreen
            budgetItems={eventBudgetItems}
            totalBudget={currentEvent.budget}
            onAddItem={(item) => addBudgetItem(item, currentEvent.id)}
            onBack={() => navigateTo('eventDashboard')}
            eventName={currentEvent.name}
          />
        );
      case 'budget':
        return (
          <BudgetEventsScreen
            events={events}
            budgetItems={budgetItems}
            onSelectEvent={(event) => {
              setCurrentEvent(event);
            }}
            onAddItem={addBudgetItem}
            onBack={() => navigateTo('home')}
            onCreateEvent={() => navigateTo('createEvent')}
          />
        );

      case 'profile':
        return (
          <ProfileScreen
            user={user}
            language={language}
            onBack={() => navigateTo('home')}
            onNavigateToSettings={() => navigateTo('settings')}
            onNavigateToLanguage={() => navigateTo('languageSelector')}
            onNavigateToSupport={() => navigateTo('support')}
            onLogout={() => {
              clearAuth();
              localStorage.removeItem('toi-profile');
              setUser(null);
              setEvents([]);
              setGuests([]);
              setBudgetItems([]);
              setCurrentEvent(null);
              navigateTo('roleSelection');
            }}
          />
        );
      
      case 'settings':
        if (!user) return null;
        return (
          <SettingsScreen
            user={user}
            language={language}
            onBack={() => navigateTo('profile')}
            onUpdateUser={(userData) => {
              setUser({ ...user, ...userData });
            }}
          />
        );
      
      case 'languageSelector':
        return (
          <LanguageSelector
            currentLanguage={language}
            onBack={() => navigateTo('profile')}
            onSelectLanguage={(lang) => {
              setLanguage(lang);
              navigateTo('profile');
            }}
          />
        );
      
      case 'support':
        return (
          <SupportScreen
            language={language}
            onBack={() => navigateTo('profile')}
          />
        );
      
      // Owner routes
      case 'ownerDashboard':
        if (!user || user.role !== 'owner') {
          return <RoleSelection onSelectRole={handleRoleSelection} />;
        }
        return (
          <OwnerDashboard
            user={user}
            venues={venues.filter(v => v.ownerId === user.id)}
            bookings={bookings.filter(b => venues.some(v => v.id === b.venueId && v.ownerId === user.id))}
            onNavigate={navigateTo}
          />
        );
      
      case 'addVenue':
        return (
          <AddVenueScreen
            onComplete={addVenue}
            onBack={() => navigateTo('ownerDashboard')}
            userId={user?.id || ''}
          />
        );
      
      case 'myVenues':
        return (
          <MyVenuesScreen
            venues={venues.filter(v => v.ownerId === user?.id)}
            onAddVenue={() => navigateTo('addVenue')}
            onSelectVenue={(venue) => navigateTo('venueDetail', { venue })}
            onBack={() => navigateTo('ownerDashboard')}
          />
        );
      
      case 'ownerBookings':
        const ownerBookings = bookings.filter(b => venues.some(v => v.id === b.venueId && v.ownerId === user?.id));
        return (
          <OwnerBookingsScreen
            bookings={ownerBookings}
            venues={venues}
            onUpdateBooking={updateBookingStatus}
            onOpenChat={(bookingId) => {
              setSelectedBookingId(bookingId);
              navigateTo('chat');
            }}
            onBack={() => navigateTo('ownerDashboard')}
          />
        );
      
      case 'chat':
        const chatBooking = bookings.find(b => b.id === selectedBookingId);
        if (!chatBooking || !user) {
          return (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">{t.common.bookingNotFoundOrUnauthorized}</p>
              <button
                onClick={() => navigateTo('ownerBookings')}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
              >
                {t.common.back}
              </button>
            </div>
          );
        }
        return (
          <ChatScreen
            booking={chatBooking}
            messages={chatMessages.filter(m => m.bookingId === selectedBookingId)}
            currentUser={user}
            onSendMessage={(text, photoUrl) => sendChatMessage(selectedBookingId!, text, photoUrl)}
            onBack={() => navigateTo('ownerBookings')}
          />
        );
      
      case 'ownerProfile':
        return (
          <ProfileScreen
            user={user}
            language={language}
            onBack={() => navigateTo('ownerDashboard')}
            onNavigateToSettings={() => navigateTo('settings')}
            onNavigateToLanguage={() => navigateTo('languageSelector')}
            onNavigateToSupport={() => navigateTo('support')}
            onLogout={() => {
              clearAuth();
              localStorage.removeItem('toi-profile');
              setUser(null);
              setVenues([]);
              setBookings([]);
              setChatMessages([]);
              navigateTo('roleSelection');
            }}
          />
        );

      default:
        return <RoleSelection onSelectRole={handleRoleSelection} />;
    }
  };

  const children = (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto bg-background min-h-screen relative">
      {/* Theme toggle - fixed top right */}
      {user && screen !== 'roleSelection' && screen !== 'phoneAuth' && screen !== 'googleAuth' && (
        <button
          type="button"
          onClick={() => setIsDark(!isDark)}
          aria-label={isDark ? (t.settings?.lightTheme ?? 'Светлая тема') : (t.settings?.darkTheme ?? 'Тёмная тема')}
          className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-card shadow-lg flex items-center justify-center hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-accent" aria-hidden />
          ) : (
            <Moon className="w-5 h-5 text-primary" aria-hidden />
          )}
        </button>
      )}

      {/* Bottom navigation - показываем на всех основных экранах, кроме auth и детальных экранов */}
      {user && 
        !['roleSelection', 'phoneAuth', 'googleAuth', 'ownerAuthChoice', 'ownerGoogleRegister', 
          'ownerSignIn', 'organizerRegistration', 'ownerRegistration', 'welcome', 'onboarding',
          'venueDetail', 'familyDetail', 'chat', 'settings', 'languageSelector', 'support', 'addVenue'].includes(screen) && (
          <BottomNav 
            currentScreen={
              // Маппинг экранов на ключи навигации
              ['home', 'myEvents', 'createEvent', 'eventDashboard', 'guests', 'eventBudget', 'ownerDashboard'].includes(screen) 
                ? 'home' 
                : screen
            } 
            onNavigate={navigateTo} 
            isOwner={user.role === 'owner'} 
          />
        )
      }

      {/* Design System removed */}

      {renderScreen()}
      
      {/* Toast notifications */}
      <Toaster />
      </div>
    </div>
  );

  return children;
}

export default function App() {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('toi-app-language');
    return (saved as Language) || 'ru';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageProvider language={language} setLanguage={setLanguage}>
      <AppContent />
    </LanguageProvider>
  );
}