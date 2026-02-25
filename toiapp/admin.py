from django.contrib import admin
from .models import Register, PhoneVerification, Venue, Event, Booking


@admin.register(Register)
class RegisterAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'phone', 'role', 'created_at')
    search_fields = ('username', 'email', 'phone')
    list_filter = ('role', 'created_at')


@admin.register(PhoneVerification)
class PhoneVerificationAdmin(admin.ModelAdmin):
    list_display = ('phone', 'code', 'is_verified', 'created_at')
    search_fields = ('phone', 'code')
    list_filter = ('is_verified', 'created_at')
    readonly_fields = ('created_at',)


@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'address', 'capacity', 'price_per_hour', 'is_active', 'created_at')
    search_fields = ('name', 'address', 'owner__username')
    list_filter = ('is_active', 'created_at')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'organizer', 'venue', 'date', 'status', 'guest_count', 'created_at')
    search_fields = ('title', 'organizer__username', 'venue__name')
    list_filter = ('status', 'date', 'created_at')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('event', 'venue', 'start_time', 'end_time', 'total_price', 'status', 'created_at')
    search_fields = ('event__title', 'venue__name')
    list_filter = ('status', 'created_at')
    readonly_fields = ('created_at', 'updated_at')