from django.db import models
from django.contrib.auth.models import AbstractUser

GENDER_CHOICES = [
    ('M', 'Male'),
    ('F', 'Female'),
    ('O', 'Others'),
]

BLOOD_GROUP_CHOICES = [
    ('A+', 'A+'),
    ('A-', 'A-'),
    ('B+', 'B+'),
    ('B-', 'B-'),
    ('AB+', 'AB+'),
    ('AB-', 'AB-'),
    ('O+', 'O+'),
    ('O-', 'O-'),
]

STATUS_CHOICE = [
    ('0', 'Inactive'),
    ('1', 'Active'),
]

ROLE_CHOICES = [
    ('Leader', 'Leader'),
    ('Volunteer', 'Volunteer'),
]

class User(AbstractUser):

    class Meta:
        db_table = 'User'

    email = models.EmailField(unique=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'blood_group', 'gender']



class College(models.Model):
    class Meta:
        db_table = 'College'
        
    college_name = models.CharField(max_length=120, null=False)
    city = models.CharField(max_length=30, null=False)

class CollegeCourses(models.Model):
    college = models.ForeignKey(College, on_delete=models.CASCADE) #Doubt
    course = models.CharField(max_length=50)
    specialization = models.CharField(max_length=50, null=True)
    year = models.IntegerField(max_length=1)
    status = models.CharField(max_length=1, choices=STATUS_CHOICE)


#Details in this table will change every year
class VolunteerProfile(models.Model):

    class Meta:
        db_table = 'VolunteerProfile'

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(CollegeCourses, on_delete=models.CASCADE) #Doubt
    volunteering_year = models.CharField(max_length=9)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Volunteer')
