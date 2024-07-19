from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import *

urlpatterns = [
    path('login/', TokenObtainPairView.as_view()),
    path('password-reset/', ResetPasswordAPIView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('loggedinuser/', LoggedInUserAPIView.as_view()),

    path('volunteers/', VolunteerAPIView.as_view()),

    path('admin/volunteers/', ManageVolunteerAPIView.as_view()), #POST, GET
    path('admin/volunteers/upload/', UploadVolunteersAPIView.as_view()), #PUT
    path('admin/volunteer/<int:volunteer_id>/', ManageVolunteerAPIView.as_view()),

    path('college/', CollegeAPIView.as_view()),
    path('college/<int:college_id>/', CollegeAPIView.as_view()),
    
    path('admin/college-courses/', CoursesAPIView.as_view()),

    path("college-admin/", CollegeAdminAPIView.as_view()),

]