from twilio.rest import Client
from django.conf import settings
import random
import logging

logger = logging.getLogger(__name__)

def generate_code():
    """Генерирует 6-значный код подтверждения"""
    return str(random.randint(100000, 999999))

def send_sms(phone, code):
    """
    Отправляет SMS с кодом подтверждения через Twilio
    
    Args:
        phone: Номер телефона получателя
        code: Код подтверждения
        
    Returns:
        str: SID сообщения или None в случае ошибки
        
    Raises:
        Exception: Если Twilio не настроен или произошла ошибка отправки
    """
    try:
        # Проверяем наличие настроек Twilio
        account_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', None)
        auth_token = getattr(settings, 'TWILIO_AUTH_TOKEN', None)
        phone_number = getattr(settings, 'TWILIO_PHONE_NUMBER', None)
        
        if not all([account_sid, auth_token, phone_number]):
            logger.warning("Twilio settings not configured. SMS will not be sent.")
            return None
        
        client = Client(account_sid, auth_token)
        
        message = client.messages.create(
            body=f"Ваш код подтверждения: {code}",
            from_=phone_number,
            to=phone
        )
        
        logger.info(f"SMS sent successfully to {phone}. SID: {message.sid}")
        return message.sid
        
    except Exception as e:
        logger.error(f"Failed to send SMS to {phone}: {str(e)}")
        raise
