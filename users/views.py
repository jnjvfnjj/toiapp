import random
import uuid
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.conf import settings
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import PhoneVerification
from .serializers import (
    PhoneRequestSerializer,
    RegisterSerializer,
    UserSerializer,
    VerifyCodeSerializer,
)

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Возвращает более понятные ошибки и явно ожидает email + password.
    """

    def validate(self, attrs):
        if 'email' not in attrs or not attrs.get('email'):
            raise serializers.ValidationError({'email': ['This field is required.']})
        if 'password' not in attrs or not attrs.get('password'):
            raise serializers.ValidationError({'password': ['This field is required.']})
        return super().validate(attrs)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def get(self, request, *args, **kwargs):
        return Response(
            {
                'message': 'Use POST to obtain JWT tokens.',
                'required_fields': ['email', 'password'],
                'example_request': {
                    'email': 'user@example.com',
                    'password': 'your_password',
                },
                'example_curl': (
                    'curl -X POST http://127.0.0.1:8000/api/token/ '
                    '-H "Content-Type: application/json" '
                    '-d "{\\"email\\":\\"user@example.com\\",\\"password\\":\\"your_password\\"}"'
                ),
                'swagger': '/swagger/',
            },
            status=status.HTTP_200_OK,
        )


class RegisterAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class ProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)


class SendCodeAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PhoneRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone']
        code = ''.join(str(random.randint(0, 9)) for _ in range(6))
        PhoneVerification.objects.create(phone=phone, code=code)
        payload = {'message': 'Code sent'}
        if settings.DEBUG:
            payload['code'] = code
        return Response(payload, status=status.HTTP_200_OK)


class VerifyCodeAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone']
        code = serializer.validated_data['code']

        time_threshold = timezone.now() - timedelta(minutes=10)
        verification = (
            PhoneVerification.objects.filter(
                phone=phone,
                code=code,
                is_verified=False,
                created_at__gte=time_threshold,
            )
            .order_by('-created_at')
            .first()
        )
        if not verification:
            return Response(
                {'error': 'Invalid or expired code'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        verification.is_verified = True
        verification.save(update_fields=['is_verified'])

        user = User.objects.filter(phone=phone).first()
        is_new_user = False
        if not user:
            is_new_user = True
            email = f'{phone.replace("+", "").replace(" ", "")}@toiapp.local'
            user = User.objects.create_user(
                email=email,
                username=f'user_{uuid.uuid4().hex[:8]}',
                phone=phone,
                role='organizer',
                password=uuid.uuid4().hex,
            )

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'message': 'Login successful',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
                'is_new_user': is_new_user,
            },
            status=status.HTTP_200_OK,
        )
