from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import VolunteerAPIView
from .views import UserAPIView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),

    path('volunteer/view/', VolunteerAPIView.as_view()),
    path('volunteer/view/<int:pk>/', VolunteerAPIView.as_view()),
    path('volunteer/create/', VolunteerAPIView.as_view()),
    path('volunteer/delete/<int:pk>/', VolunteerAPIView.as_view()),
    path('volunteer/update/<int:pk>/', VolunteerAPIView.as_view()),

    path('user/view/', UserAPIView.as_view()),
    path('user/view/<int:pk>/', UserAPIView.as_view()),
    path('user/create/', UserAPIView.as_view()),
    path('user/delete/<int:pk>/', UserAPIView.as_view()),
    path('user/update/<int:pk>/', UserAPIView.as_view()),

]
