from django.contrib import admin
from .models import Events, Attendance, EventComments

admin.site.register(Events)
admin.site.register(Attendance)
admin.site.register(EventComments)