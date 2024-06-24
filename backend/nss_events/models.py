from django.db import models
from django.utils import timezone
from django.db.models.signals import pre_save
from django.dispatch import receiver
from nss_profile.models import Volunteer, College, User


class Events(models.Model):
    STATUS_OPEN = 'Open'
    STATUS_DELETED = 'Deleted'
    STATUS_COMPLETED = "Completed"

    STATUS_CHOICES = (
        (STATUS_OPEN, STATUS_OPEN),
        (STATUS_DELETED, STATUS_DELETED),
        (STATUS_COMPLETED, STATUS_COMPLETED)
    )

    class Meta:
        db_table = 'Events'

    name = models.CharField(max_length=100)
    college = models.ForeignKey(College, on_delete=models.CASCADE)
    description = models.TextField()
    instructions = models.TextField()
    start_date = models.DateField(default=timezone.now().strftime('%d-%m-%y'))
    start_time = models.TimeField(default=timezone.now().strftime('%H:%M:%S'))
    duration = models.TextField()
    location = models.CharField(max_length=250)
    status = models.CharField(choices=STATUS_CHOICES)
    credit_points = models.IntegerField(null=True)


class Attendance(models.Model):
    class Meta:
        db_table = 'Attendance'
        unique_together = (('volunteer', 'event'),)

    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE)
    event = models.ForeignKey(Events, on_delete=models.CASCADE)

class EventComments(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Events, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)