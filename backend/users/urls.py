from django.urls import path
from .views import GoogleOAuthAPIView, ProfileAPIView, RegisterAPIView, SendCodeAPIView, VerifyCodeAPIView

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('google-auth/', GoogleOAuthAPIView.as_view(), name='google_auth'),
    path('profile/', ProfileAPIView.as_view(), name='profile'),
    path('send-code/', SendCodeAPIView.as_view(), name='send_code'),
    path('verify-code/', VerifyCodeAPIView.as_view(), name='verify_code'),
]
