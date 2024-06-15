from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
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

    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Others'),
    ]

    class Meta:
        db_table = 'User'

    email = models.EmailField(unique=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    blood_group = models.CharField(choices=BLOOD_GROUP_CHOICES)
    first_name = models.CharField(max_length=50, blank=False)
    last_name = models.CharField(max_length=50, blank=False)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'blood_group', 'gender']


class College(models.Model):
    class Meta:
        db_table = 'College'
        
    college_name = models.CharField(max_length=120, null=False)
    city = models.CharField(max_length=30, null=False)
    college_code = models.CharField(max_length=20, null=False, unique=True)

class CollegeCourses(models.Model):
    STATUS_CHOICE = [
        (0, 'Inactive'),
        (1, 'Active'),
    ]

    college = models.ForeignKey(College, on_delete=models.CASCADE)
    course_name = models.CharField(max_length=50)
    specialization = models.CharField(max_length=50, null=True)
    year = models.IntegerField()
    status = models.IntegerField(choices=STATUS_CHOICE)

class NSSYear(models.Model):
    class Meta:
        db_table = 'NSSYear'

    start_date = models.DateField()
    end_date = models.DateField()
    label = models.CharField(max_length=9)

#Details in this table will change every year
class VolunteerProfile(models.Model):
    LEADER = 'Leader'
    VOLUNTEER = 'Volunteer'

    ROLE_CHOICES = [
        (LEADER, 'Leader'),
        (VOLUNTEER, 'Volunteer'),
    ]

    class Meta:
        db_table = 'VolunteerProfile'

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(CollegeCourses, on_delete=models.CASCADE)
    volunteering_year = models.ForeignKey(NSSYear, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Volunteer')


class CollegeAdmin(models.Model):

    class Meta:
        db_table = 'CollegeAdmin'
     
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    college  = models.ForeignKey(College, on_delete=models.CASCADE)


 