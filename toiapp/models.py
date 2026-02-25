from django.db import models


class Register(models.Model):
    ROLE_CHOICES = [
        ('organizer', 'Организатор'),
        ('owner', 'Владелец помещения'),
    ]

    username = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    password = models.CharField(max_length=128)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='organizer')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username


class PhoneVerification(models.Model):
    phone = models.CharField(max_length=20)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.phone} - {self.code}"


class Venue(models.Model):
    """Модель помещения для мероприятий"""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    address = models.CharField(max_length=255)
    owner = models.ForeignKey(Register, on_delete=models.CASCADE, related_name='venues')
    capacity = models.PositiveIntegerField()
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    amenities = models.JSONField(default=list, blank=True)
    photos = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Event(models.Model):
    """Модель мероприятия"""
    STATUS_CHOICES = [
        ('draft', 'Черновик'),
        ('planned', 'Запланировано'),
        ('in_progress', 'В процессе'),
        ('completed', 'Завершено'),
        ('cancelled', 'Отменено'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    organizer = models.ForeignKey(Register, on_delete=models.CASCADE, related_name='events')
    venue = models.ForeignKey(Venue, on_delete=models.SET_NULL, null=True, blank=True, related_name='events')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    guest_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-start_time']

    def __str__(self):
        return self.title


class Booking(models.Model):
    """Модель бронирования помещения"""
    STATUS_CHOICES = [
        ('pending', 'Ожидает подтверждения'),
        ('confirmed', 'Подтверждено'),
        ('cancelled', 'Отменено'),
        ('completed', 'Завершено'),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='bookings')
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='bookings')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_time']

    def __str__(self):
        return f"{self.event.title} - {self.venue.name}"