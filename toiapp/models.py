from django.db import models

# Create your models here.
class Register(models.Model):
    username = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.BigIntegerField(max_length=20)
    password = models.CharField(max_length=128)

class Super_user(models.Model):
    name = models.CharField(max_length=150)
    lastname = models.CharField(max_length=150)
    email = models.EmailField()
    user_phone = models.BigIntegerField(max_length=20)
    build_phone = models.BigIntegerField(max_length=20)
    address = models.CharField(max_length=255)
    password = models.CharField(max_length=128)
    confirm_password = models.CharField(max_length=128)