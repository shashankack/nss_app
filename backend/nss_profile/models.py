from django.db import models
from django.contrib.auth.models import AbstractUser


class Address(models.Model):
    
    class Meta:
        db_table = 'address'
    
    
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)


class User(AbstractUser):

    class Meta:
        db_table = 'user'


class UserProfile(models.Model):
    pass