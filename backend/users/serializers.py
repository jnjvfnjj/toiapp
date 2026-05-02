import hashlib

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import IntegrityError
from rest_framework import serializers

User = get_user_model()


def _username_for_email(email: str) -> str:
    """
    USERNAME_FIELD is email, but Django still stores `username` (unique, max 150).
    Use email when it fits; otherwise a stable short id so registration never fails.
    """
    email = (email or '').strip().lower()
    if len(email) <= 150:
        return email
    digest = hashlib.sha256(email.encode('utf-8')).hexdigest()[:32]
    return f'u_{digest}'[:150]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(
        choices=[User.ROLE_ORGANIZER, User.ROLE_OWNER],
        required=True,
        help_text='organizer или owner',
    )

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'phone', 'password', 'role', 'date_joined')
        read_only_fields = ('id', 'date_joined')

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as exc:
            # Одно понятное сообщение вместо списка на английском
            raise serializers.ValidationError(
                'Пароль слишком простой. Используйте не менее 8 символов, буквы и цифры, избегайте очевидных слов.'
            ) from exc
        return value

    def validate_email(self, value: str) -> str:
        email = (value or '').strip().lower()
        if not email:
            raise serializers.ValidationError('Укажите email')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError('Этот email уже зарегистрирован')
        return email

    def validate(self, attrs):
        # Игнорируем подделку username с клиента — всегда согласуем с email.
        email = attrs.get('email')
        if email:
            attrs['username'] = _username_for_email(email)
        phone = attrs.get('phone')
        if phone is not None and str(phone).strip() == '':
            attrs['phone'] = ''
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        try:
            user.save()
        except IntegrityError:
            raise serializers.ValidationError({'email': ['Этот email уже зарегистрирован']})
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'phone', 'role', 'is_active', 'date_joined')
        read_only_fields = ('id', 'date_joined', 'is_active')


class PhoneRequestSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)

    def validate_phone(self, value):
        cleaned = value.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
        if not cleaned.startswith('+'):
            if cleaned.startswith('996'):
                cleaned = '+' + cleaned
            else:
                cleaned = '+996' + cleaned
        return cleaned


class VerifyCodeSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)
    code = serializers.CharField(min_length=6, max_length=6)
    role = serializers.ChoiceField(choices=('organizer', 'owner'), required=False)

    def validate_phone(self, value):
        return PhoneRequestSerializer().fields['phone'].run_validation(value)

    def validate_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError('Code must contain only digits')
        return value
