from django.urls import path
from .views import test_api, register_user, register_super_user

urlpatterns = [
    path('test/', test_api),
    path('register/', register_user),
    path('register-super/', register_super_user),
]
