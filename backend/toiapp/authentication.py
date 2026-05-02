"""
Кастомная аутентификация для работы с моделью Register
"""
from rest_framework import authentication
from rest_framework import exceptions
from .models import Register


class RegisterAuthentication(authentication.BaseAuthentication):
    """
    Кастомная аутентификация для модели Register
    Использует JWT токен для получения пользователя из Register модели
    """
    
    def authenticate(self, request):
        # Получаем токен из заголовка
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header.split(' ')[1]
        
        try:
            from rest_framework_simplejwt.tokens import AccessToken
            from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
            
            # Декодируем access токен
            access_token = AccessToken(token)
            
            # Получаем user_id из токена
            user_id = access_token.get('user_id')
            
            if not user_id:
                return None
            
            # Получаем пользователя из Register
            try:
                user = Register.objects.get(id=user_id)
            except Register.DoesNotExist:
                raise exceptions.AuthenticationFailed('Пользователь не найден')
            
            # Устанавливаем атрибут is_authenticated для совместимости
            if not hasattr(user, 'is_authenticated'):
                user.is_authenticated = True
            
            return (user, None)
            
        except (InvalidToken, TokenError) as e:
            return None
        except Exception as e:
            return None
