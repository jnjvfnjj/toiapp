from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BookingViewSet, EventViewSet, VenueViewSet

router = DefaultRouter()
router.register(r'venues', VenueViewSet, basename='venue')
router.register(r'events', EventViewSet, basename='event')
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
]
