from rest_framework import permissions, viewsets

from .models import Booking, Event, Venue
from .permissions import BookingPermission, OnlyAdminCanManageVenue, OnlyOrganizerCanModifyEvent
from .serializers import BookingSerializer, EventSerializer, VenueSerializer


class VenueViewSet(viewsets.ModelViewSet):
    queryset = Venue.objects.filter(is_active=True)
    serializer_class = VenueSerializer
    permission_classes = [OnlyAdminCanManageVenue]
    filterset_fields = ('capacity', 'is_active')
    search_fields = ('name', 'address', 'description')
    ordering_fields = ('created_at', 'price_per_hour', 'capacity')


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.select_related('organizer', 'venue')
    serializer_class = EventSerializer
    permission_classes = [OnlyOrganizerCanModifyEvent]
    filterset_fields = ('date', 'status', 'venue')
    search_fields = ('title', 'description')
    ordering_fields = ('date', 'start_time', 'created_at')

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return self.queryset
        return self.queryset.filter(organizer=user)

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.select_related('user', 'event', 'venue')
    serializer_class = BookingSerializer
    permission_classes = [BookingPermission]
    filterset_fields = ('status', 'venue', 'event')
    ordering_fields = ('created_at',)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return self.queryset
        return self.queryset.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
