from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import ListVolunteerAPIView, CreateVolunteerAPIView, DeleteVolunteerAPIView, UpdateVolunteerAPIView
from .views import ListUserAPIView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('volunteer/view/', ListVolunteerAPIView.as_view()),
    path('volunteer/view/<int:pk>/', ListVolunteerAPIView.as_view()),
    path('volunteer/create/', CreateVolunteerAPIView.as_view()),
    path('volunteer/delete/<int:pk>/', DeleteVolunteerAPIView.as_view()),
    path('volunteer/delete/<int:pk>/', UpdateVolunteerAPIView.as_view()),

    path('user/view/', ListUserAPIView.as_view()),
    path('user/view/<int:pk>/', ListUserAPIView.as_view()),

]
