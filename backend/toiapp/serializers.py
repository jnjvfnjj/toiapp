from rest_framework import serializers
from .models import Register, Venue, Event, Booking


class RegisterSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Register"""
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = Register
        fields = ('id', 'username', 'email', 'phone', 'password', 'role', 'created_at')
        read_only_fields = ('id', 'created_at')
        extra_kwargs = {
            'password': {'write_only': True},
        }
    
    def create(self, validated_data):
        from django.contrib.auth.hashers import make_password
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class VerifyCodeSerializer(serializers.Serializer):
    """Сериализатор для верификации кода"""
    phone = serializers.CharField(required=True, max_length=20)
    code = serializers.CharField(required=True, max_length=6, min_length=6)
    
    def validate_phone(self, value):
        # Нормализуем номер телефона
        cleaned = value.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
        if not cleaned.startswith('+'):
            if cleaned.startswith('996'):
                cleaned = '+' + cleaned
            else:
                cleaned = '+996' + cleaned
        return cleaned
    
    def validate_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Код должен содержать только цифры")
        return value


class VenueSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Venue"""
    owner_name = serializers.CharField(source='owner.username', read_only=True)
    owner_email = serializers.CharField(source='owner.email', read_only=True)
    
    class Meta:
        model = Venue
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'owner')


class EventSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Event"""
    organizer_name = serializers.CharField(source='organizer.username', read_only=True)
    organizer_email = serializers.CharField(source='organizer.email', read_only=True)
    venue_name = serializers.CharField(source='venue.name', read_only=True, allow_null=True)
    
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'organizer')


class BookingSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Booking"""
    event_title = serializers.CharField(source='event.title', read_only=True)
    venue_name = serializers.CharField(source='venue.name', read_only=True)
    organizer_name = serializers.CharField(source='event.organizer.username', read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
    
    def validate(self, attrs):
        """Валидация данных бронирования"""
        start_time = attrs.get('start_time')
        end_time = attrs.get('end_time')
        
        if start_time and end_time:
            if end_time <= start_time:
                raise serializers.ValidationError({
                    "end_time": "Время окончания должно быть позже времени начала"
                })
        
        return attrs
