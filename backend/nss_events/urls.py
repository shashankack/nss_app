from django.urls import path
from .views import EventAPIView, AttendanceAPIView, EventsAttendedAPIView, EventAttendedVolunteersAPIView, EventCommentsAPIView, LeaderboardAPIView, ServiceHoursAPIView

urlpatterns = [
    path('event/', EventAPIView.as_view()), #POST: Used to view upcoming events
    path('event/<int:event_id>/', EventAPIView.as_view()), #GET, UPDATE, DELETE: Used by the leader to manage events
    path('event/<int:event_id>/event-forum/', EventCommentsAPIView.as_view()),

    path('leaderboard/', LeaderboardAPIView.as_view()),
    path('service-hours/', ServiceHoursAPIView.as_view()),

    path('volunteer/events-attended/', EventsAttendedAPIView.as_view()),
    path('event/<int:event_id>/mark-attendance/', AttendanceAPIView.as_view()),  #POST, GET, DELETE: Used to assign attendance
    path('event/<int:event_id>/delete-attendance/', AttendanceAPIView.as_view()),  #POST, GET, DELETE: Used to assign attendance
    path('event/<int:event_id>/attended-volunteers/', EventAttendedVolunteersAPIView.as_view()),
]
