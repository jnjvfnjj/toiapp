"""
Кастомные JWT токены для работы с моделью Register
"""
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken


class RegisterRefreshToken(RefreshToken):
    """
    Кастомный RefreshToken для модели Register
    """
    
    @classmethod
    def for_user(cls, user):
        """
        Создает refresh токен для пользователя Register
        Access токен будет автоматически содержать те же данные
        """
        token = cls()
        # Сохраняем user_id в токене (это будет доступно и в access токене)
        token['user_id'] = user.id
        token['username'] = user.username
        token['role'] = user.role
        return token


class RegisterAccessToken(AccessToken):
    """
    Кастомный AccessToken для модели Register
    Используется для аутентификации запросов
    """
    
    @classmethod
    def for_user(cls, user):
        """
        Создает access токен для пользователя Register
        """
        token = cls()
        token['user_id'] = user.id
        token['username'] = user.username
        token['role'] = user.role
        return token
