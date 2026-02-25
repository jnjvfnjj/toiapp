from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'phone', 'password', 'role', 'date_joined')
        read_only_fields = ('id', 'date_joined')

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
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

    def validate_phone(self, value):
        return PhoneRequestSerializer().fields['phone'].run_validation(value)

    def validate_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError('Code must contain only digits')
        return value
