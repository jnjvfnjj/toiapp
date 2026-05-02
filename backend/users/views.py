import random
import uuid
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
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
    _username_for_email,
)

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Возвращает более понятные ошибки и явно ожидает email + password.
    """

    role = serializers.ChoiceField(
        choices=[User.ROLE_ORGANIZER, User.ROLE_OWNER],
        required=False,
        help_text='Организатор или владелец при входе',
    )

    def validate(self, attrs):
        email = (attrs.get('email') or '').strip().lower()
        password = attrs.get('password') or ''
        role = attrs.get('role')
        if not email:
            raise serializers.ValidationError({'email': ['This field is required.']})
        if not password:
            raise serializers.ValidationError({'password': ['This field is required.']})

        user = User.objects.filter(email=email).first()
        if not user:
            raise serializers.ValidationError({'email': ['Аккаунт с таким email не найден']})
        if not user.is_active:
            raise serializers.ValidationError({'email': ['Аккаунт отключён']})

        if role:
            if role not in {User.ROLE_ORGANIZER, User.ROLE_OWNER}:
                raise serializers.ValidationError({'role': ['Неправильный тип пользователя']})
            if user.role != role:
                user.role = role
                user.save(update_fields=['role'])

        # Use Django authentication to validate password.
        authed = authenticate(**{User.USERNAME_FIELD: email, 'password': password})
        if not authed:
            raise serializers.ValidationError({'password': ['Неверный пароль']})

        # Delegate token creation to SimpleJWT.
        return super().validate({'email': email, 'password': password})


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


class GoogleOAuthSerializer(serializers.Serializer):
    email = serializers.EmailField()
    name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    role = serializers.ChoiceField(
        choices=[User.ROLE_ORGANIZER, User.ROLE_OWNER],
        required=True,
        help_text='organizer или owner',
    )

    def validate_email(self, value: str) -> str:
        return (value or '').strip().lower()


class GoogleOAuthAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = GoogleOAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        name = serializer.validated_data.get('name') or ''
        role = serializer.validated_data['role']

        user = User.objects.filter(email=email).first()
        if not user:
            user = User(
                email=email,
                username=_username_for_email(email),
                role=role,
            )
            user.set_unusable_password()
            user.save()
        elif user.role != role:
            user.role = role
            user.save(update_fields=['role'])

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
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
        desired_role = serializer.validated_data.get('role') or 'organizer'

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
                role=desired_role,
                password=uuid.uuid4().hex,
            )
        else:
            # If user exists but role differs, keep current role (don't silently change).
            pass

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
