from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import ListVolunteerAPIView, CreateVolunteerAPIView, DeleteVolunteerAPIView


urlpatterns = [
    path('login/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('volunteer/view', ListVolunteerAPIView.as_view()),
    path('volunteer/view/<int:pk>/', ListVolunteerAPIView.as_view()),
    path('volunteer/create/', CreateVolunteerAPIView.as_view()),
    path('volunteer/delete/<int:pk>/', DeleteVolunteerAPIView.as_view()),
]
