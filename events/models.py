from django.conf import settings
from django.db import models


class Venue(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=255)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='owned_venues',
        null=True,
        blank=True,
    )
    capacity = models.PositiveIntegerField()
    description = models.TextField(blank=True)
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    phone = models.CharField(max_length=20, blank=True, default='')
    whatsapp = models.CharField(max_length=20, blank=True, default='')
    amenities = models.JSONField(default=list, blank=True)
    photos = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Event(models.Model):
    STATUS_DRAFT = 'draft'
    STATUS_PUBLISHED = 'published'
    STATUS_CHOICES = (
        (STATUS_DRAFT, 'Draft'),
        (STATUS_PUBLISHED, 'Published'),
    )

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='events')
    venue = models.ForeignKey(Venue, on_delete=models.SET_NULL, related_name='events', null=True, blank=True)
    guest_count = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-start_time']

    def __str__(self):
        return self.title


class Booking(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_APPROVED = 'approved'
    STATUS_CANCELLED = 'cancelled'
    STATUS_REJECTED = 'rejected'
    STATUS_CHOICES = (
        (STATUS_PENDING, 'Pending'),
        (STATUS_APPROVED, 'Approved'),
        (STATUS_CANCELLED, 'Cancelled'),
        (STATUS_REJECTED, 'Rejected'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='bookings')
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='bookings')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.email} -> {self.venue.name}'
