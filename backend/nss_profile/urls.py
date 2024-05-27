from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import VolunteerAPIView, UserAPIView, LoggedInUserAPIView

urlpatterns = [
    
    
    path('login/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),

    
    path('loggedInUserProfile/', LoggedInUserAPIView.as_view()), #GET, POST
    path('volunteer/<int:pk>/', VolunteerAPIView.as_view()), #GET, POST, UPDATE, DELETE

    path('user/', UserAPIView.as_view()), ##GET, POST
    path('user/<int:pk>/', UserAPIView.as_view()), #GET, POST, UPDATE, DELETE
]
