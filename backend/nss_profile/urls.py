from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import VolunteerAPIView, UserAPIView, CollegeAPIView, CollegeAdminAPIView, CoursesAPIView, LoggedInUserAPIView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('loggedinuser/', LoggedInUserAPIView.as_view()),

    path('volunteer/', VolunteerAPIView.as_view()),
    path('volunteer/<int:volunteer_id>/', VolunteerAPIView.as_view()),

    path('admin/volunteer/', VolunteerAPIView.as_view()),
    path('admin/volunteer/<int:volunteer_id>/', VolunteerAPIView.as_view()),

    path('user/', UserAPIView.as_view()),
    path('user/<int:user_id>/', UserAPIView.as_view()),

    path('college/', CollegeAPIView.as_view()),
    path('college/<int:college_id>/', CollegeAPIView.as_view()),

    path("college-admin/", CollegeAdminAPIView.as_view()),

    path('college/<int:college_id>/courses/', CoursesAPIView.as_view()),
]