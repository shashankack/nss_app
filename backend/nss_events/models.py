from django.db import models
from django.utils import timezone
from nss_profile.models import Volunteer, College, User
from nss_profile.models import NSSYear


class Events(models.Model):
    STATUS_OPEN = 'Open'
    STATUS_ONGOING = 'In Progress'
    STATUS_DELETED = 'Deleted'
    STATUS_COMPLETED = "Completed"

    STATUS_CHOICES = (
        (STATUS_OPEN, STATUS_OPEN),
        (STATUS_ONGOING, STATUS_ONGOING),
        (STATUS_DELETED, STATUS_DELETED),
        (STATUS_COMPLETED, STATUS_COMPLETED)
    )

    class Meta:
        db_table = 'Events'

    name = models.CharField(max_length=100)
    volunteering_year = models.ForeignKey(NSSYear, on_delete=models.CASCADE)
    college = models.ForeignKey(College, on_delete=models.CASCADE)
    description = models.TextField()
    instructions = models.TextField()
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    duration = models.TextField()
    location = models.CharField(max_length=250)
    status = models.CharField(choices=STATUS_CHOICES, default=STATUS_OPEN)
    credit_points = models.IntegerField(null=True)


class Attendance(models.Model):
    class Meta:
        db_table = 'Attendance'
        unique_together = (('volunteer', 'event'),)

    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE)
    event = models.ForeignKey(Events, on_delete=models.CASCADE)

class EventComments(models.Model):
    class Meta:
        db_table = 'EventComments'

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Events, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)