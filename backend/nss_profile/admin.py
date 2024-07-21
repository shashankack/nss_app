from django.contrib import admin
from .models import User, Volunteer, College, CollegeCourses

# Register your models here.

admin.site.register(User)
admin.site.register(Volunteer)
admin.site.register(College)
admin.site.register(CollegeCourses)