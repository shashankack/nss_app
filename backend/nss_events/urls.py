from django.urls import path
from .views import EventAPIView, AttendanceAPIView

urlpatterns = [
    path('event/', EventAPIView.as_view()), #POST, GET
    path('event/<int:pk>/', EventAPIView.as_view()), #GET, UPDATE, DELETE
    path('event/<int:event_id>/attendance/', AttendanceAPIView.as_view()),  #POST, GET, DELETE
]
