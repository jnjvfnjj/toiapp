from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import PhoneVerification, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role data', {'fields': ('role', 'phone')}),
    )
    list_display = ('id', 'email', 'username', 'role', 'is_active', 'is_staff')
    list_filter = ('role', 'is_active', 'is_staff')
    search_fields = ('email', 'username', 'phone')
    ordering = ('id',)


@admin.register(PhoneVerification)
class PhoneVerificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'phone', 'code', 'is_verified', 'created_at')
    search_fields = ('phone',)
    list_filter = ('is_verified',)
