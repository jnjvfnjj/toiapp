from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register_user'),
    path('register-super/', views.register_super_user, name='register_super_user'),
]
