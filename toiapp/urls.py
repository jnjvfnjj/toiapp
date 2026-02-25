from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    SendCodeView, VerifyCodeView, test_api,
    VenueViewSet, EventViewSet, BookingViewSet
)

router = DefaultRouter()
router.register(r'venues', VenueViewSet, basename='venue')
router.register(r'events', EventViewSet, basename='event')
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('test/', test_api, name='test_api'),
    path('send-code/', SendCodeView.as_view(), name='send_code'),
    path('verify-code/', VerifyCodeView.as_view(), name='verify_code'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]

