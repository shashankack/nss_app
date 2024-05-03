from django.db import models
from django.utils import timezone
from django.db.models.signals import pre_save
from django.dispatch import receiver
from nss_profile.models import VolunteerProfile


STATUS_CHOICES = (
    ('upcoming', 'Upcoming'),
    ('ongoing', 'Ongoing'),
    ('completed', 'Completed'),
    ('cancelled', 'Cancelled'),
    ('postponed', 'Postponed'),
)

class Events(models.Model):
    class Meta:
        db_table = 'Events'

    name = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField()
    start_time = models.TimeField()
    location = models.CharField(max_length=250)
    status = models.CharField(choices=STATUS_CHOICES)
    postponed_date = models.DateField(auto_now=False, auto_now_add=False, blank=True, null=True)
    postponed_time = models.TimeField(auto_now=False, auto_now_add=False, blank=True, null=True)
    is_cancelled = models.BooleanField(default=False)
    credit_points = models.IntegerField(null=True)

class Attendance(models.Model):
    class Meta:
        db_table = 'Attendance'
        unique_together = ('volunteer', 'event')

    volunteer = models.ForeignKey(VolunteerProfile, on_delete=models.CASCADE)
    event = models.ForeignKey(Events, on_delete=models.CASCADE)
    attended = models.BooleanField(default=True)
    
