from django.contrib import admin
from .models import Booking, Event, Venue


@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'capacity', 'price_per_hour', 'is_active', 'created_at')
    search_fields = ('name', 'address')


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'date', 'start_time', 'end_time', 'organizer', 'venue', 'status')
    search_fields = ('title', 'description')
    list_filter = ('status', 'date')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'event', 'venue', 'status', 'created_at')
    list_filter = ('status',)
