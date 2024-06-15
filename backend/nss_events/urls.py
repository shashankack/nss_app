from django.urls import path
from .views import EventAPIView, AttendanceAPIView, EventsAttendedAPIView

urlpatterns = [
    path('event/', EventAPIView.as_view()), #POST: Used to view upcoming events
    path('event/<int:event_id>/', EventAPIView.as_view()), #GET, UPDATE, DELETE: Used by the leader to manage events
    path('event/<int:event_id>/attendance/', AttendanceAPIView.as_view()),  #POST, GET, DELETE: Used to assign attendance
    path('volunteer/eventsAttended/', EventsAttendedAPIView.as_view())
]
