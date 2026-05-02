from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_ADMIN = 'admin'
    ROLE_USER = 'user'
    ROLE_ORGANIZER = 'organizer'
    ROLE_OWNER = 'owner'
    ROLE_CHOICES = (
        (ROLE_ADMIN, 'Admin'),
        (ROLE_USER, 'User'),
        (ROLE_ORGANIZER, 'Organizer'),
        (ROLE_OWNER, 'Owner'),
    )

    username = models.CharField(max_length=150, blank=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_USER)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self) -> str:
        return self.email


class PhoneVerification(models.Model):
    phone = models.CharField(max_length=20)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'{self.phone} - {self.code}'
