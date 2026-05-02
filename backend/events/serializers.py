from rest_framework import serializers

from .models import Booking, Event, Venue
from .services import validate_capacity, validate_no_time_overlap


class VenueSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = Venue
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'owner')


class EventSerializer(serializers.ModelSerializer):
    organizer_email = serializers.CharField(source='organizer.email', read_only=True)
    venue_name = serializers.CharField(source='venue.name', read_only=True, allow_null=True)

    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'organizer')

    def validate(self, attrs):
        venue = attrs.get('venue') or getattr(self.instance, 'venue', None)
        date = attrs.get('date') or getattr(self.instance, 'date', None)
        start_time = attrs.get('start_time') or getattr(self.instance, 'start_time', None)
        end_time = attrs.get('end_time') or getattr(self.instance, 'end_time', None)
        if start_time and end_time and end_time <= start_time:
            raise serializers.ValidationError({'end_time': 'End time must be after start time.'})
        if venue and date and start_time and end_time:
            try:
                validate_no_time_overlap(venue, date, start_time, end_time, exclude_event_id=getattr(self.instance, 'id', None))
            except ValueError as exc:
                raise serializers.ValidationError({'non_field_errors': [str(exc)]})
        return attrs


class BookingSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_phone = serializers.CharField(source='user.phone', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    event_date = serializers.DateField(source='event.date', read_only=True)
    event_start_time = serializers.TimeField(source='event.start_time', read_only=True)
    event_guest_count = serializers.IntegerField(source='event.guest_count', read_only=True)
    venue_name = serializers.CharField(source='venue.name', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'user')

    def validate(self, attrs):
        event = attrs.get('event')
        venue = attrs.get('venue') or (event.venue if event else None)
        if event and venue and event.venue_id != venue.id:
            raise serializers.ValidationError({'venue': 'Booking venue must match event venue.'})
        if event and venue:
            try:
                validate_capacity(venue, getattr(event, 'guest_count', None))
            except ValueError as exc:
                raise serializers.ValidationError({'non_field_errors': [str(exc)]})
        return attrs
