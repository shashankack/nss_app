from django.contrib import admin
from .models import User, VolunteerProfile, College, CollegeCourses

# Register your models here.

admin.site.register(User)
admin.site.register(VolunteerProfile)
admin.site.register(College)
admin.site.register(CollegeCourses)
