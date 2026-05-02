import { useEffect } from 'react';

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: GoogleOAuthConfig) => void;
          renderButton: (element: HTMLElement, options: GoogleButtonOptions) => void;
          prompt: (callback: (notification: any) => void) => void;
        };
      };
    };
  }
}

interface GoogleOAuthConfig {
  client_id: string;
  callback: (response: GoogleOAuthResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface GoogleButtonOptions {
  theme: 'outline' | 'filled_blue' | 'filled_black';
  size: 'large' | 'medium' | 'small';
  width?: string;
}

export interface GoogleOAuthResponse {
  credential: string;
  clientId: string;
}

export interface GoogleUserInfo {
  email: string;
  name: string;
  picture?: string;
}

/**
 * Парсит JWT токен от Google для получения информации о пользователе
 */
export function parseGoogleToken(token: string): GoogleUserInfo | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return {
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      picture: payload.picture,
    };
  } catch (error) {
    console.error('Failed to parse Google token:', error);
    return null;
  }
}

/**
 * Хук для инициализации Google OAuth
 */
export function useGoogleAuth(clientId: string | undefined, onSuccess: (response: GoogleOAuthResponse) => void) {
  useEffect(() => {
    if (!clientId) {
      console.warn('Google Client ID not set. Set VITE_GOOGLE_CLIENT_ID environment variable.');
      return;
    }

    const initializeGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: onSuccess,
        });
      }
    };

    // Если Google SDK еще не загружен, ждем
    if (window.google?.accounts?.id) {
      initializeGoogle();
    } else {
      // Подписываемся на событие загрузки SDK
      window.addEventListener('load', initializeGoogle);
      return () => window.removeEventListener('load', initializeGoogle);
    }
  }, [clientId, onSuccess]);
}

/**
 * Отрисовывает Google Sign-In кнопку в указанном элементе
 */
export function renderGoogleButton(elementId: string, options?: Partial<GoogleButtonOptions>) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    return;
  }

  if (window.google?.accounts?.id) {
    window.google.accounts.id.renderButton(element, {
      theme: 'outline',
      size: 'large',
      width: '100%',
      ...options,
    });
  }
}
