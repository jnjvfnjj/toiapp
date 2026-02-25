from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from .tokens import RegisterRefreshToken
from rest_framework.decorators import api_view
from django.shortcuts import render
from django.conf import settings
import uuid

from .models import Register, PhoneVerification, Venue, Event, Booking
from .serializers import (
    VerifyCodeSerializer, RegisterSerializer,
    VenueSerializer, EventSerializer, BookingSerializer
)


from rest_framework.decorators import api_view

@api_view(['GET'])
def test_api(request):
    """Тестовый endpoint для проверки работы Django"""
    return Response({"message": "Django + React работают!"}, status=status.HTTP_200_OK)


class SendCodeView(APIView):
    """
    Отправка SMS-кода на телефон (для разработки генерируется код без реальной SMS).
    """
    permission_classes = []  # Публичный endpoint

    def post(self, request):
        phone = (request.data.get("phone") or "").strip().replace(" ", "").replace("-", "").replace("(", "").replace(")", "")
        if not phone.startswith("+"):
            if phone.startswith("996"):
                phone = "+" + phone
            else:
                phone = "+996" + phone
        if len(phone) < 10:
            return Response(
                {"error": "Некорректный номер телефона"},
                status=status.HTTP_400_BAD_REQUEST
            )
        import random
        code = "".join(str(random.randint(0, 9)) for _ in range(6))
        PhoneVerification.objects.create(phone=phone, code=code)
        # В режиме разработки возвращаем код (для тестов). В продакшене убрать.
        if settings.DEBUG:
            return Response({"message": "Код отправлен", "code": code}, status=status.HTTP_200_OK)
        return Response({"message": "Код отправлен"}, status=status.HTTP_200_OK)


class VerifyCodeView(APIView):
    """
    Верификация SMS-кода.
    Если пользователь существует — вход.
    Если нет — регистрация.
    """
    permission_classes = []  # Публичный endpoint

    def post(self, request):
        serializer = VerifyCodeSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        phone = serializer.validated_data["phone"]
        code = serializer.validated_data["code"]

        # Проверяем срок действия (10 минут)
        time_threshold = timezone.now() - timedelta(minutes=10)

        verification = (
            PhoneVerification.objects.filter(
                phone=phone,
                code=code,
                is_verified=False,
                created_at__gte=time_threshold
            )
            .order_by("-created_at")
            .first()
        )

        if not verification:
            return Response(
                {
                    "error": "Неверный код или код истёк",
                    "message": "Запросите новый код."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Помечаем код как использованный
        verification.is_verified = True
        verification.save(update_fields=["is_verified"])

        # Проверяем есть ли пользователь
        user = Register.objects.filter(phone=phone).first()
        created = False

        if not user:
            created = True
            user = Register.objects.create(
                phone=phone,
                username=f"user_{phone.replace('+', '').replace(' ', '')}",
                email=f"{phone.replace('+', '').replace(' ', '')}@toiapp.local",
                password=make_password(str(uuid.uuid4())),
                role='organizer'  # По умолчанию организатор
            )

        # Создаем JWT токены
        refresh = RegisterRefreshToken.for_user(user)

        user_data = RegisterSerializer(user).data
        user_data.pop("password", None)

        return Response(
            {
                "message": (
                    "Регистрация выполнена успешно"
                    if created
                    else "Вход выполнен успешно"
                ),
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": user_data,
                "is_new_user": created
            },
            status=status.HTTP_200_OK
        )


def index(request):
    """Отдает React приложение через Django template"""
    try:
        return render(request, 'build/index.html')
    except Exception as e:
        # Fallback если файл не найден
        # Логируем ошибку для отладки (только в DEBUG режиме)
        if settings.DEBUG:
            import logging
            logger = logging.getLogger(__name__)
            logger.warning(f"Не удалось загрузить build/index.html: {e}")
        return render(request, 'index_fallback.html')



class VenueViewSet(viewsets.ModelViewSet):
    """ViewSet для управления помещениями"""
    queryset = Venue.objects.filter(is_active=True)
    serializer_class = VenueSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        """Фильтрация помещений"""
        queryset = Venue.objects.filter(is_active=True)
        # Владельцы видят только свои помещения
        user = getattr(self.request, 'user', None)
        if user and hasattr(user, 'role') and user.role == 'owner':
            queryset = queryset.filter(owner=user)
        return queryset
    
    def perform_create(self, serializer):
        """Только владельцы могут создавать помещения"""
        user = getattr(self.request, 'user', None)
        if not user:
            raise PermissionDenied("Требуется аутентификация")
        if not hasattr(user, 'role'):
            raise PermissionDenied("Неверный тип пользователя")
        if user.role != 'owner':
            raise PermissionDenied("Только владельцы могут создавать помещения")
        serializer.save(owner=user)


class EventViewSet(viewsets.ModelViewSet):
    """ViewSet для управления мероприятиями"""
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Организаторы видят только свои события"""
        user = getattr(self.request, 'user', None)
        if user and hasattr(user, 'role'):
            if user.role == 'organizer':
                return Event.objects.filter(organizer=user)
            # Владельцы видят события, связанные с их помещениями
            elif user.role == 'owner':
                return Event.objects.filter(venue__owner=user)
        return Event.objects.all()
    
    def perform_create(self, serializer):
        """Автоматически связываем с текущим пользователем"""
        user = getattr(self.request, 'user', None)
        if not user:
            raise PermissionDenied("Требуется аутентификация")
        if not hasattr(user, 'role'):
            raise PermissionDenied("Неверный тип пользователя")
        serializer.save(organizer=user)


class BookingViewSet(viewsets.ModelViewSet):
    """ViewSet для управления бронированиями"""
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Фильтрация бронирований по роли"""
        user = getattr(self.request, 'user', None)
        if user and hasattr(user, 'role'):
            if user.role == 'organizer':
                # Организаторы видят бронирования своих событий
                return Booking.objects.filter(event__organizer=user)
            elif user.role == 'owner':
                # Владельцы видят бронирования своих помещений
                return Booking.objects.filter(venue__owner=user)
        return Booking.objects.all()
    
    def perform_create(self, serializer):
        """Создание бронирования с автоматическим расчетом цены и проверкой пересечений"""
        user = getattr(self.request, 'user', None)
        if not user:
            raise PermissionDenied("Требуется аутентификация")
        if not hasattr(user, 'role'):
            raise PermissionDenied("Неверный тип пользователя")
        
        event = serializer.validated_data['event']
        venue = serializer.validated_data['venue']
        start_time = serializer.validated_data['start_time']
        end_time = serializer.validated_data['end_time']
        
        # Проверяем, что событие принадлежит текущему пользователю
        if event.organizer != user:
            raise PermissionDenied("Вы можете бронировать только для своих событий")
        
        # Проверяем пересечение с существующими бронированиями
        overlapping_bookings = Booking.objects.filter(
            venue=venue,
            status__in=['pending', 'confirmed'],
            start_time__lt=end_time,
            end_time__gt=start_time
        ).exclude(id=getattr(serializer.instance, 'id', None))
        
        if overlapping_bookings.exists():
            raise PermissionDenied(
                "Это помещение уже забронировано на указанное время"
            )
        
        # Рассчитываем цену
        duration_hours = (end_time - start_time).total_seconds() / 3600
        total_price = venue.price_per_hour * duration_hours
        
        serializer.save(total_price=total_price)